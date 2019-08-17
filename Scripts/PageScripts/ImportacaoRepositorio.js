

var tabelaArquivos; // DataTable -- "D"

var pagina = {};
$(function ()
{
    $('#progressMaster').show();
    tabelaArquivos = definirTabelaArquivos();

    carregarTabela();
    
    $("#fileUpload").on("change", function (){
        var arquivo = $('#fileUpload')[0];
        if (arquivo.files.length > 0) {
            $('#txtNomeArquivo').val(arquivo.files[0].name);
        }
    });
    
    $("#btnUpload").on("click", function (){
        validarOTamanhoArquivo()
            .then(relizarUpload,exibirErro)
            .then(atualizarALista);
    });

    function validarOTamanhoArquivo()
    {
        var dfd = $.Deferred();
        var arquivo = $('#fileUpload')[0];
        if (arquivo.files.length > 0 && (arquivo.files[0].size / 1024 / 1024) > limiteUp) {
            dfd.reject("O arquivo ultrapassa o limite de " + limiteUp + "MB.");
        }
        else if (arquivo.files.length === 0) {
            dfd.reject("Selecione um arquivo.");
        }
        else {
            dfd.resolve();
        }
        return dfd.promise();
    }

    function relizarUpload()
    {
        $('#progressMaster').show();
        var formData = new FormData();
        formData.append('ARQUIVO', $('#fileUpload')[0].files[0]);
        formData.append('NOME_ARQUIVO', $('#txtNomeArquivo').val());
        return $.ajax({
            type: "POST",
            url: URL_UPLOAD,
            data: formData,
            xhr: function ()
            {  // Custom XMLHttpRequest
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) { // Check if upload property exists
                    //update progressbar percent complete
                    $('#progressMaster .progress').show();
                    $('#progressMaster .progress-bar').width(0 + '%');
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener(
                        'progress',
                        function (e) {
                            if (e.lengthComputable) {
                                var percentage = Math.floor((e.loaded / e.total) * 100);
                                //update progressbar percent complete
                                $('.progress-bar').width(percentage + '%');
                            }
                        },
                        false);
                }
                return myXhr;
            },
            timeout: 999999,
            success: function ()
            {
                $('.progress').hide();
                $('.progress-bar').width(0 + '%');
                $('#progressMaster').hide();
            },
            processData: false,
            contentType: false,
            error: function ()
            {
                $('#progressMaster').hide();
                $('.progress').hide();
                $('.progress-bar').width(0 + '%');
                bootbox.alert({ title: 'Erro', message: "Falha ao processar requisição!", });
            }
        });
    }
    
    function exibirErro(erro){
        bootbox.alert(erro);
        $('#progressMaster').hide();
    }

    function atualizarALista()
    {
        carregarTabela();
    }

});

(function ()
{

    pagina.Excluir = function (arquivo)
    {
        bootbox.confirm(
            "Confirma a exclusão do arquivo <strong>" + arquivo + "</strong>?",
            function (result)
            {
                if (result)
                {
                    PageMethods.Excluir(arquivo, carregarTabela);
                }
            }
        );
    }

    pagina.Processar = function (arquivo)
    {
        $('#progressMaster').show();
        PageMethods.Validar(
            arquivo,
            function (resp)
            {
                $('#progressMaster').hide();
                var buttons = {
                    cancel: {

                    },
                    confirm: {
                        label:'Aplicar'
                    }
                };
                var alerta = 
                    '<div class="alert alert-success" role="alert"><em class="glyphicon glyphicon-ok-circle"></em> Pacote em conformidade.</div>';
                    
                

                if(!resp.podeImportar){
                    alerta = '<div class="alert alert-danger" role="alert"><em class="glyphicon glyphicon-ban-circle"></em> Inconsistências críticas no pacote, importação não será realizada.</div>';
                    buttons.confirm.className = 'btn btn-primary disabled';
                }
                var msg = "<ul>\n";
                msg += "<li>Quantidade de documentos no arquivo zip: " + resp.totalDocuments + "</li>\n";

                if (resp.Messages.length > 0 && resp.podeImportar)
                {
                    alerta = '<div class="alert alert-warning" role="alert"><em class="glyphicon glyphicon-warning-sign"></em> Existem inconsistências não impeditivas.</div>';
                }

                for (var key in resp.Messages)
                {
                    msg += "<li>" + resp.Messages[key].Mensagem + "</li>\n";
                }

                msg += "</ul>\n";
                msg += "<hr/>\n";
                msg = msg + $('<div>').append($('#tipoImportacaoTemplate').clone().prop('id', 'tipoImportacao').show()).html();

                bootbox.confirm(
                    {
                        title: "Validação",
                        message: alerta + msg,
                        buttons: buttons,
                        callback: function (confirmed)
                        {
                            if (resp.podeImportar && confirmed)
                            {
                                $('#msgSelecioneTipoDeImportacao').hide();
                                $('#tipoImportacao .form-group').removeClass('has-error');
                                $('#tipoImportacao .msgTipoRequerido').hide();
                                if (!$('#tipoImportacao select').val()) {
                                    $('#tipoImportacao select').focus();
                                    $('#tipoImportacao .form-group').addClass('has-error');
                                    $('#tipoImportacao .msgTipoRequerido').show();
                                    return false;
                                }
                                else if ("new" === $('#tipoImportacao select').val())
                                {
                                    bootbox.confirm(
                                        'ATENÇÃO!!!!!!!!!!!!!!!!!!!!!!<hr/>\
                                            O tipo de importação selecionado foi "Nova carga".<br/>\
                                            Todos os documentos criados anteriormente serão apagados do sistema!!!<br/>\
                                            Deseja continuar?',
                                        function (resultado)
                                        {
                                            if (resultado)
                                            {
                                                pagina.ExecutarImportacao(arquivo, "new" );
                                            }
                                        }
                                    );
                                }
                                else
                                {
                                    pagina.ExecutarImportacao(arquivo, $('#tipoImportacao select').val());
                                    
                                }

                            }
                        }
                    }
                );
            }
        );
    };


    pagina.ExecutarImportacao = function(arquivo, tipoImportacao)
    {
        $('#progressMaster').show();
        PageMethods.ExecutarImportacao(
            arquivo,
            tipoImportacao,
            function () // sucesso
            {
                bootbox.alert('Importacão realizada com sucesso.');
                carregarTabela();
            },
            function (err) // falha
            {
                $('#progressMaster').hide();
                bootbox.alert('Ocorreu um erro desconhecido.');
            }  
        );
    }

})();

function carregarTabela()
{
    PageMethods.ListaArquivo(
            function (r)
            {
                //tabelaArquivos.data(r).draw();
                tabelaArquivos.clear();
                tabelaArquivos.rows.add(r).draw();
                $('#progressMaster').hide();
            },
            function ()
            {
                bootbox.alert("Ocorreu um erro ao tentar mudar o arquivo.");
                $('#pregressMaster').hide();
            }
        );
}

function definirTabelaArquivos()
{
    return $("#tabelaArquivos").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bProcessing": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": true,
        "bstateSave": true,
        "bDestroy": true,
        "columns": [
            {
                "width": "5%",
                "autoWidth": false,
                "targets": [0],
                "data": null,
                "title": "Opção",
                "className": "dt-center",
                "render": function (data, type, full, meta)
                {
                    var html = "";
                    html = "<a href='javascript:void(0)' onclick='pagina.Processar(\"" + data.Nome + "\");'><i class='glyphicon glyphicon-refresh' data-toggle='tooltip' data-placement='right' title='Processar'></i></a>&nbsp;&nbsp;";
                    html += "<a href='javascript:void(0)' onclick='pagina.Excluir(\"" + data.Nome + "\");'><i class='glyphicon glyphicon-trash' data-toggle='tooltip' data-placement='right' title='Excluir'></i></a>&nbsp;&nbsp;";
                    return html;
                }
            },
            {
                "width": "40%",
                "autoWidth": false,
                "targets": [1],
                "data": "Nome",
                "title": "Nome Arquivo"
            },
            {
                "width": "20%",
                "autoWidth": false,
                "targets": [2],
                "data": "Data",
                "title": "Data Criação"
            },
            {
                "width": "15%",
                "autoWidth": false,
                "targets": [3],
                "data": "Tamanho",
                "title": "Tamanho (bytes)"
            }
        ],

    });
}