var tableLayout;
var fileUploadData = null;
var FuncaoFechar = null;
function LayoutTabela() {
    tableLayout = $("#tabApresentacaoCenario").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": true,
        "bstateSave": true,
        "bDestroy": true,
        "oLanguage":
        {
            "sZeroRecords": "Não foram encontrados resultados",
            "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
            "sInfoFiltered": "(Total de _MAX_ registros)",
            "sSearch": "Pesquisar",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "oPaginate": {
                "sFirst": "«",
                "sLast": "»",
                "sNext": "›",
                "sPrevious": "‹"
            }
        },
        "columnDefs": [
            {
                "width": "10%",
                "autoWidth": false,
                "targets": [0],
                "data": null,
                "title": "Opção",
                "className": "dt-center",
                "render": function (data, type, full, meta) {
                    var html = "";
                    html += "<a href='#' id='imgEditar'><i class='fa fa-pencil' data-toggle='tooltip' data-placement='right' title='Editar'></i></a>&nbsp;&nbsp;";
                    html += "<a href='#' id='imgExcluir'><i class='fa fa-trash' data-toggle='tooltip' data-placement='right' title='Excluir'></i></a>&nbsp;&nbsp;";
                    html += "<a href='#' id='imgDownloadsTemplate'><i class='fa fa-download' data-toggle='tooltip' data-placement='right' title='Baixar template genéric'></i></a>&nbsp;&nbsp;";
                    html += "<a href='#' class='imgVisualizarVa'><i class='fa fa-list-alt' data-toggle='tooltip' data-placement='right' title='Visualizar VA'></i></a>&nbsp;&nbsp;";
                    html += "<a href='#' id='imgBaixarBriefing'><i class='fa fa-cloud-download' data-toggle='tooltip' data-placement='right' title='Baixar Briefing'></i></a>&nbsp;&nbsp;";
                    html += "<a href='#' id='imgCopiar'><i class='fa fa-files-o' data-toggle='tooltip' data-placement='right' title='Copiar'></i></a>&nbsp;&nbsp;";
                    return html;
                }
            },
            {
                "autoWidth": false,
                "targets": [1],
                "data": "DS_APRESENTACAO",
                "title": "Apresentação"
            },
            {
                "width": "20%",
                "autoWidth": false,
                "targets": [2],
                "data": "HASH_APRESENTACAO",
                "title": "HASH"
            },
            {
                "width": "5%",
                "autoWidth": false,
                "targets": [3],
                "data": "FL_ATIVO",
                "title": "Ativo"
            },
            {
                "width": "5%",
                "autoWidth": false,
                "targets": [4],
                "data": "FL_POSSUI_APROVACAO",
                "title": "Aprovação"
            },
            {
                "width": "5%",
                "autoWidth": false,
                "targets": [5],
                "data": "ID_VERSAO",
                "title": "Versão"
            },
            {
                "width": "1%",
                "autoWidth": false,
                "targets": [6],
                "data": "DS_STATUS",
                "title": "Status"
            },
            {
                "width": "10%",
                "autoWidth": false,
                "targets": [7],
                "data": "NM_USUARIO",
                "title": "Aprovador"
            },
            {
                "width": "5%",
                "autoWidth": false,
                "targets": [8],
                "data": "NM_CLIENTE",
                "title": "Cliente"
            },
            {
                "width": "15%",
                "autoWidth": false,
                "targets": [9],
                "data": "SIGLA_APRESENTACAO",
                "title": "Sigla VA"
            }
        ],
        "ajax": {
            "type": "POST",
            "url": "CadApresentacao.aspx/CarregarLista",
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json) {
                var parse = JSON.stringify(json.d.lista);
                var retorno = $.parseJSON(parse);
                return retorno;
            }
        },
    });

    $('#tabApresentacaoCenario tbody').on('click', '#imgEditar', function () {
        var data = tableLayout.row($(this).parents('tr')).data();

        abrirModelWizard(data.ID_APRESENTACAO_CENARO, 'N');
        return false;
    });

    $('#tabApresentacaoCenario tbody').on('click', '#imgExcluir', function (e) {
        e.preventDefault();
        var data = tableLayout.row($(this).parents('tr')).data();

        excluirApresentacao(data.ID_APRESENTACAO_CENARO);
        return false;
    });

    $('#tabApresentacaoCenario tbody').on('click', '#imgDownloadsTemplate', function () {
        var data = tableLayout.row($(this).parents('tr')).data();

        $(location).attr('href', 'ApresentacaoTemplate.aspx?ID_APRESENTACAO_CENARIO=' + data.ID_APRESENTACAO_CENARO);
        return false;
    });


    $('#tabApresentacaoCenario tbody').on('click', '.imgVisualizarVa', function () {
        var data = tableLayout.row($(this).parents('tr')).data();


        if (data.ID_VERSAO == 0) {
            bootbox.alert({
                title: 'Atenção',
                message: "Visualização indisponível pois não existe nenhuma versão para essa apresentação",
            });
            return;
        }
        document.location.href = "CadApresentacao_VisualizarVA.aspx?id=" + data.ID_APRESENTACAO_CENARO;

        //jQuery.ajax({
        //    type: 'POST',
        //    url: "CadApresentacao_VisualizarVA.aspx?id=" + data.ID_APRESENTACAO_CENARO,
        //    success: function (data) {
        //        bootbox.dialog({
        //            message: data,
        //            title: "Custom title",
        //            buttons: {
        //                success: {
        //                    label: "Success!",
        //                    className: "btn-success",
        //                },
        //            }
        //        });
        //    }
        //});




        //alert(data.ID_APRESENTACAO_CENARO)
        return false;
    });

    $('#tabApresentacaoCenario tbody').on('click', '#imgBaixarBriefing', function () {
        var data = tableLayout.row($(this).parents('tr')).data();


        downloadsBriefing(data.ID_APRESENTACAO_CENARO);
        return false;
    });

    $('#tabApresentacaoCenario tbody').on('click', '#imgCopiar', function () {
        var data = tableLayout.row($(this).parents('tr')).data();

        abrirModelWizard(data.ID_APRESENTACAO_CENARO, 'S');
        return false;
    });
}

function excluirApresentacao(id){
    bootbox.confirm({
        title: 'Atenção',
        message: "Confirma a exclusão deste registro?",
        buttons: {
            confirm: {
                className: 'btn-primary btn-success'
            },
            cancel: {
                className: 'btn-danger',
                label: 'Cancelar'
            }
        },
        callback: function (result) {
            if (result){
                abrirProgress();
                $.ajax({
                    type: "POST",
                    url: "CadApresentacao.aspx/ExcluirApresentacaoCenario",
                    data: JSON.stringify({ id: id }),
                    timeout: 999999,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        tableLayout.rows().remove();
                        $.each(data.d, function (i, item) {
                            var parse = JSON.stringify(item);
                            var retorno = $.parseJSON(parse);

                            tableLayout.row.add(retorno);
                        });
                        tableLayout.draw();
                        fecharProgress();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        bootbox.alert({
                            title: 'Erro',
                            message: JSON.parse(xhr.responseText).Message,
                        });
                        fecharProgress();
                    }
                });
            }
        }
    });
}


function downloadsBriefing(id){
    abrirProgress();
    $.ajax({
        type: "POST",
        url: "CadApresentacao.aspx/downloadsBriefing",
        data: JSON.stringify({ id: id }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
                if (data.d=="S"){
                    $(location).attr('href', 'ApresentacaoBriefing.aspx?ID_APRESENTACAO_CENARIO=' + id);
                }else {
                    bootbox.alert({
                        title: 'Erro',
                        message: "Arquivo não encontrado.",
                    });
                }
                fecharProgress();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert({
                title: 'Erro',
                message: JSON.parse(xhr.responseText).Message,
            });
            fecharProgress();
        }
    });
}




function abrirModelWizard(ID_APRESENTACAO_CENARO, COPIA) {
    abrirProgress();
    fileUploadData = null;
    FuncaoFechar = null;
    $("#divCadastro").load("CadApresentacaoDetalhe.aspx?ID_APRESENTACAO_CENARO=" + ID_APRESENTACAO_CENARO + "&COPIA=" + COPIA + " #divWizard", function (responseTxt, statusTxt, xhr) {
        iniciarWizard();
        AbrirModal("AbreModalApresentacao");

        $("#txtComentario").attr('maxlength', '50');
        $("#lbFiltroUsuarioUpload").attr('size', '10');
        $("#lbUsuarioUpload").attr('size', '10');
        $("#lbFiltroUsuarioAprovacao").attr('size', '10');
        $("#lbUsuarioAprovacao").attr('size', '10');
        $("#lbFiltroUsuarioLiberacao").attr('size', '10');
        $("#lbUsuarioLiberacao").attr('size', '10');

        $('#ddlGrupoUsuarioUpload').on('change', function() {
            carregarUsuarioPerfil(1, this.value);
        })

        $('#ddlGrupoUsuarioAprovacao').on('change', function() {
            carregarUsuarioPerfil(2, this.value);
        })

        $('#ddlGrupoUsuarioLiberacao').on('change', function() {
            carregarUsuarioPerfil(3, this.value);
        })

        botoesUpload();
        botoesAprovacao();
        botoesLiberacao();
        fecharProgress();
        habilitaDesabilitaAprovacao();
        

        $("#txtApresentacao").on('focusout', function () {
            $("#txtSiglaApresentacao").val($("#txtApresentacao").val());
        });

        $('#ddlPossuiAprovacao').change(function () {
            habilitaDesabilitaAprovacao();
        });

        $("#btnFileBriefing").click(function () {
            $("#file-briefing").click();
            return false;
        });

        $('#file-briefing').fileupload({
            url: 'UploadBriefing.aspx?upload=start',
            add: function(e, data) {
                var files = data.files || data.fileInput.context.files;
                if (!OBriefingEValido(files))
                {
                    $("#lblCaminhoBriefing").text("");
                    fileUploadData = "";
                    return false;
                }
                fileUploadData = data;
                $("#lblCaminhoBriefing").text(files[0].name);
                if ($("#hdfID_APRESENTACAO_CENARO").val() != "0")
                {
                    fileUploadData = "";
                    $('#progressbar').show();
                    data.submit();
                }
            },
            progress: function(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progressbar div').css('width', progress + '%');
            },
            success: function(response, status) {
                if (status == "success") {
                    if (FuncaoFechar)
                    {
                        FuncaoFechar();
                        FuncaoFechar = null;
                    }
                    if ($("#hdfID_APRESENTACAO_CENARO").val() != "0")
                    {
                        AtualizarPathArquivoBriefing($("#hdfID_APRESENTACAO_CENARO").val(), response);
                    } else {

                    }
                }
                else {
                    bootbox.alert({title: 'Erro', message: response});
                }
                $('#progressbar').hide();
                $('#progressbar div').css('width', '0%');
                console.log('success', response);
            },
            error: function(error) {
                alert(error);
                $('#progressbar').hide();
                $('#progressbar div').css('width', '0%');
                console.log('error', error);
            }
        });
    });
}


function OBriefingEValido(files)
{
    var erro = "";
    //SD_LimpaErroDeValidacao();
    var eValido = true;
    //var files = $('#file-briefing').get(0).files;
    var limiteDeUpload = $("#hdfPATH_TAMANHO").val();
    //debugger;
    if (files && files.length <= 0) {
        erro += "Selecione um arquivo com até " + limiteDeUpload + "MB<br>";
        //SD_AdicionaErroDeValidacao('Selecione um arquivo com até ' + limiteDeUpload + 'MB');
        temArquivo = eValido = false;
    }
    else if (files && files.length > 0) {
        var extensoesAceitas = $('#file-briefing').attr("accept");
        if (extensoesAceitas.indexOf(files[0].name.split("").reverse().join("").split('.')[0].split("").reverse().join("").toLowerCase()) < 0) {
            //SD_AdicionaErroDeValidacao("As extensões aceitas são: " + extensoesAceitas);
            erro += "As extensões aceitas são: " + extensoesAceitas;
            eValido = false;
        }
        if (!isNaN(limiteDeUpload)) {
            var limiteDeUploadEmBytes = limiteDeUpload;
            if (limiteDeUploadEmBytes < (files[0].size / 1024 / 1024)) {
                erro += "O arquivo ultrapassa o limite de " + limiteDeUpload + "MB";
                //SD_AdicionaErroDeValidacao('O arquivo ultrapassa o limite de ' + limiteDeUpload + 'MB');
                eValido = false;
            }
        }
    }

    if (eValido==false){
        bootbox.alert({title: 'Erro', message: erro});
    }
    return eValido;
}


function AtualizarPathArquivoBriefing(idApresentacaoCenario, pathArquivoBriefing) {
    abrirProgress();
    $.ajax({
        type: "POST",
        url: "CadApresentacaoDetalhe.aspx/AtualizarNomeArquivoBriefing",
        data: JSON.stringify({ ID_APRESENTACAO_CENARO:idApresentacaoCenario, PATH_ARQUIVO_BRIEFING:pathArquivoBriefing }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            fecharProgress();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert({
                title: 'Erro',
                message: JSON.parse(xhr.responseText).Message,
            });
            fecharProgress();
        }
    });
}

function habilitaDesabilitaAprovacao() {
    var possuiAprovacao = $('#ddlPossuiAprovacao option:selected').val();
    if (possuiAprovacao=="S") {
        $('#ddlGrupoUsuarioAprovacao').removeAttr("disabled");
    }
    else {
        $('#ddlGrupoUsuarioAprovacao').val(0);
        $('#ddlGrupoUsuarioAprovacao').attr("disabled", "disabled");
        $('#lbFiltroUsuarioAprovacao').empty();
        $('#lbUsuarioAprovacao').empty();
    }
}

function carregarUsuarioPerfil(ID_CLIENTE_USUARIO_APRESENTACAO_TIPO, COD_PERFIL){
    if (COD_PERFIL==""){
        var listFiltro;
        var listInclusao;
        if (ID_CLIENTE_USUARIO_APRESENTACAO_TIPO==1){
            listFiltro = $('#lbFiltroUsuarioUpload');
            listInclusao = $('#lbUsuarioUpload');
        }else if (ID_CLIENTE_USUARIO_APRESENTACAO_TIPO==2){
            listFiltro = $('#lbFiltroUsuarioAprovacao');
            listInclusao = $('#lbUsuarioAprovacao');
        }else if (ID_CLIENTE_USUARIO_APRESENTACAO_TIPO==3){
            listFiltro = $('#lbFiltroUsuarioLiberacao');
            listInclusao = $('#lbUsuarioLiberacao');
        }
        listFiltro.empty();
        return false;
    }
    abrirProgress();
    $.ajax({
        type: "POST",
        url: "CadApresentacaoDetalhe.aspx/carregarUsuarioPerfil",
        data: JSON.stringify({ COD_PERFIL:COD_PERFIL }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var listFiltro;
            var listInclusao;
            if (ID_CLIENTE_USUARIO_APRESENTACAO_TIPO==1){
                listFiltro = $('#lbFiltroUsuarioUpload');
                listInclusao = $('#lbUsuarioUpload');
            }else if (ID_CLIENTE_USUARIO_APRESENTACAO_TIPO==2){
                listFiltro = $('#lbFiltroUsuarioAprovacao');
                listInclusao = $('#lbUsuarioAprovacao');
            }else if (ID_CLIENTE_USUARIO_APRESENTACAO_TIPO==3){
                listFiltro = $('#lbFiltroUsuarioLiberacao');
                listInclusao = $('#lbUsuarioLiberacao');
            }
            listFiltro.empty();

            var items = "";
            $.each(data.d, function (i, item) {
                if (listInclusao.find("option[value='" + item.SEQUENCIAL + "']").length == 0) {
                    items += "<option value='" + item.SEQUENCIAL + "'>" + item.NOME + "</option>";
                }                
            });
            listFiltro.html(items);
            fecharProgress();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert({
                title: 'Erro',
                message: JSON.parse(xhr.responseText).Message,
            });
            fecharProgress();
        }
    });
}


function botoesUpload(){
    $('#incluirUsuarioUpload').click(function (e) {
        incluirUsuario(e, "lbFiltroUsuarioUpload", "lbUsuarioUpload");
    });

    $('#incluirTodosUsuaripUpload').click(function (e) {
        incluirTodosUsuario(e, 'lbFiltroUsuarioUpload', 'lbUsuarioUpload');
    });
    $('#RetirarUsuarioUpload').click(function (e) {
        removerUsuario(e, 'lbFiltroUsuarioUpload', 'lbUsuarioUpload');
    });
    $('#RetirarTodosUsuarioUpload').click(function (e) {
        removerTodosUsuario(e, 'lbFiltroUsuarioUpload', 'lbUsuarioUpload');
    });
}

function botoesAprovacao(){
    $('#incluirUsuarioAprovacao').click(function (e) {
        incluirUsuario(e, "lbFiltroUsuarioAprovacao", "lbUsuarioAprovacao");
    });

    $('#incluirTodosUsuarioAprovacao').click(function (e) {
        incluirTodosUsuario(e, 'lbFiltroUsuarioAprovacao', 'lbUsuarioAprovacao');
    });
    $('#RetirarUsuarioAprovacao').click(function (e) {
        removerUsuario(e, 'lbFiltroUsuarioAprovacao', 'lbUsuarioAprovacao');
    });
    $('#RetirarTodosUsuarioAprovacao').click(function (e) {
        removerTodosUsuario(e, 'lbFiltroUsuarioAprovacao', 'lbUsuarioAprovacao');
    });

    $('#btnUp').click(function (e) {
        e.preventDefault();
        $("#lbUsuarioAprovacao option:selected").each(function () {
            var newPos = $("#lbUsuarioAprovacao option").index(this) - 1;
            if (newPos > -1) {
                $("#lbUsuarioAprovacao option").eq(newPos).before("<option value='" + $(this).val() + "' selected='selected'>" + $(this).text() + "</option>");
                $(this).remove();
            }
        });
    });

    $('#btnDown').click(function (e) {
        e.preventDefault();
        var countOptions = $("#lbUsuarioAprovacao option").size();
        $("#lbUsuarioAprovacao option:selected").each(function () {
            var newPos = $("#lbUsuarioAprovacao option").index(this) + 1;
            if (newPos < countOptions) {
                $("#lbUsuarioAprovacao option").eq(newPos).after("<option value='" + $(this).val() + "' selected='selected'>" + $(this).text() + "</option>");
                $(this).remove();
            }
        });
    });
}


function botoesLiberacao(){
    $('#incluirUsuarioLiberacao').click(function (e) {
        incluirUsuario(e, "lbFiltroUsuarioLiberacao", "lbUsuarioLiberacao");
    });

    $('#incluirTodosUsuarioLiberacao').click(function (e) {
        incluirTodosUsuario(e, 'lbFiltroUsuarioLiberacao', 'lbUsuarioLiberacao');
    });
    $('#RetirarUsuarioLiberacao').click(function (e) {
        removerUsuario(e, 'lbFiltroUsuarioLiberacao', 'lbUsuarioLiberacao');

    });
    $('#RetirarTodosUsuarioLiberacao').click(function (e) {
        removerTodosUsuario(e, 'lbFiltroUsuarioLiberacao', 'lbUsuarioLiberacao');
    });
}

function incluirUsuario(e, listaFiltro, listaUsuario){
    var selectedOpts = $('#' + listaFiltro + ' option:selected');
    if (selectedOpts.length == 0) {
        bootbox.alert({title: 'Erro', message: "Selecione pelo menos um usuário."});
        e.preventDefault();
    }

    $('#' + listaUsuario).append($(selectedOpts).clone());
    $(selectedOpts).remove();
    e.preventDefault();
}


function incluirTodosUsuario(e, listaFiltro, listaUsuario){
    var selectedOpts = $('#' + listaFiltro + ' > option');
    if (selectedOpts.length == 0) {
        bootbox.alert({title: 'Erro', message: "Selecione pelo menos um usuário."});
        e.preventDefault();
    }

    $('#' + listaUsuario).append($(selectedOpts).clone());
    $(selectedOpts).remove();
    e.preventDefault();
}


function removerUsuario(e, listaFiltro, listaUsuario){
    var selectedOpts = $('#' + listaUsuario + ' option:selected');
    if (selectedOpts.length == 0) {
        bootbox.alert({title: 'Erro', message: "Selecione pelo menos um usuário."});
        e.preventDefault();
    }

    $('#' + listaFiltro).append($(selectedOpts).clone());
    $(selectedOpts).remove();
    e.preventDefault();
}


function removerTodosUsuario(e, listaFiltro, listaUsuario){
    var selectedOpts = $('#' + listaUsuario + ' > option');
    if (selectedOpts.length == 0) {
        bootbox.alert({title: 'Erro', message: "Selecione pelo menos um usuário."});
        e.preventDefault();
    }

    $('#' + listaFiltro).append($(selectedOpts).clone());
    $(selectedOpts).remove();
    e.preventDefault();
}


function iniciarWizard(){
    $('#wizard').smartWizard({
        // Properties
        selected: 0,  // Selected Step, 0 = first step
        keyNavigation: false, // Enable/Disable key navigation(left and right keys are used if enabled)
        enableAllSteps: false,  // Enable/Disable all steps on first load
        transitionEffect: 'fade', // Effect on navigation, none/fade/slide/slideleft
        contentURL: null, // specifying content url enables ajax content loading
        contentCache: true, // cache step contents, if false content is fetched always from ajax url
        cycleSteps: false, // cycle step navigation
        enableFinishButton: false, // makes finish button enabled always
        errorSteps: [],    // array of step numbers to highlighting as error steps
        labelNext: 'Próximo', // label for Next button
        labelPrevious: 'Anterior', // label for Previous button
        labelFinish: 'Salvar',  // label for Finish button
        onLeaveStep: leaveAStepCallback, // triggers when leaving a step
        onShowStep: null,  // triggers when showing a step
        onFinish: SalvaApresentacao  // triggers when Finish button is clicked
    });

    $('.actionBar').append("<div id='progressbar' style='display: none;float: right;width: 300px;margin-top: 6px;'><div class='progress-label'>Iniciando...</div></div>");
    $('.actionBar').append("<button id='cancelApresentacao' class='btn btn-danger' data-dismiss='modal' type='button' style='width:100px'>Cancelar</button>");

    $('ul.anchor li a').css({ width: "161px" });

    $('.buttonFinish').addClass("btn btn-success");
    $('.buttonNext').addClass("btn btn-primary");
    $('.buttonPrevious').addClass("btn btn-danger");
}

function leaveAStepCallback(from, to) {
    var fromStepIdx = from.attr('rel');
    var toStepIdx = to.attr('rel');

    if (toStepIdx > fromStepIdx) {
        return validateSteps(fromStepIdx);
    }
    return true;
}

function validateSteps(step) {
    var isStepValid = true;

    // validate step 1
    if (step == 1) {
        if (validateStep1() == false) {
            isStepValid = false;
        }
    }

    // validate step3
    if (step == 3) {
        if (validateStep3() == false) {
            isStepValid = false;
        }
    }

    // validate step4
    if (step == 4) {
        if (validateStep4() == false) {
            isStepValid = false;
        }
    }

    // validate step5
    if (step == 5) {
        if (validateStep5() == false) {
            isStepValid = false;
        }
    }
    return isStepValid;
}

function validateStep1() {
    var isValid = true;
    
    // Valida produto
    var produto = $("#ddlProduto > option:selected").attr("value");
    if (produto == 0) {
        isValid = false;
        bootbox.alert({title: 'Erro', message: 'Selecionar o produto'});
        $("#ddlProduto").focus();
        return isValid;
    }

    // Valida descrição da apresentação
    var apresentacao = $('#txtApresentacao').val();
    if (apresentacao.length <= 0) {
        isValid = false;
        bootbox.alert({title: 'Erro', message: 'Informar a descrição da apresentação'});
        $("#txtApresentacao").focus();
        return isValid;
    }

    // Valida SIGLA da apresentação
    var siglaapresentacao = $('#txtSiglaApresentacao').val();
    if (siglaapresentacao.length <= 0) {
        isValid = false;
        bootbox.alert({title: 'Erro', message: 'Informar a sigla da apresentação'});
        $("#txtSiglaApresentacao").focus();
        return isValid;
    }

    // Valida tipo do equipamento
    var tipoequipamento = $("#ddlTipoEquipamento > option:selected").attr("value");
    if (tipoequipamento == 0) {
        isValid = false;
        bootbox.alert({title: 'Erro', message: 'Selecionar o tipo do equipamento'});
        $("#ddlTipoEquipamento").focus();
        return isValid;
    }
    return isValid;
}

function validateStep3() {
    var isValid = true;

    
    // Valida produto
    var usu_up = $("#lbUsuarioUpload > option");
    if (usu_up.length == 0) {
        isValid = false;
        //alert('Selecionar o usuário para upload');
        bootbox.alert({title: 'Erro', message: 'Selecionar o usuário para upload'});
        $("#lbUsuarioUpload").focus();
        return isValid;
    }

    return isValid;
}

function validateStep4() {
    var isValid = true;

    var chk = $("#ddlPossuiAprovacao > option:selected").attr("value");
    if (chk == "S") {
        // Valida produto
        var qtdusu = $("#lbUsuarioAprovacao > option").length;
        if (qtdusu == 0) {
            isValid = false;
            bootbox.alert({title: 'Erro', message: 'Selecionar pelo menos um usuário para aprovação'});
            $("#lbUsuarioAprovacao").focus();
            return isValid;
        }
    }

    return isValid;
}

function validateStep5() {
    var isValid = true;

    // Valida produto
    var qtdusu = $("#lbUsuarioLiberacao > option").length;
    if (qtdusu == 0) {
        isValid = false;
        bootbox.alert({title: 'Erro', message: 'Selecionar pelo menos um usuário para publicação'});
        $("#lbUsuarioLiberacao").focus();
        return isValid;
    }

    return isValid;
}

function validateAllSteps() {
    // validate step 1
    if (validateStep1() == false) {
        return false;
    }

    // validate step3
    if (validateStep3() == false) {
        return false;
    }

    // validate step4
    if (validateStep4() == false) {
        return false;
    }

    // validate step5
    if (validateStep5() == false) {
        return false;
    }
    return true;
}

function SalvaApresentacao() {    
    //Realiza validacao no step corrente
    if (validateAllSteps() == false) {
        return false;
    }
    salvarApresentacaoBanco();
    return false;
}

function salvarApresentacaoBanco(){
    var ID_PRODUTO = $("#ddlProduto").val();
    var DS_APRESENTACAO = $("#txtApresentacao").val();
    var FL_ATIVO = $("#ddlAtivo").val();
    var FL_POSSUI_APROVACAO = $("#ddlPossuiAprovacao").val();
    var CD_ZYNC = $("#txtCodigoSync").val();
    var SIGLA_APRESENTACAO = $("#txtSiglaApresentacao").val();
    var ID_TIPO_EQUIPAMENTO = $("#ddlTipoEquipamento").val();
    var DS_COMENTARIO = $("#txtComentario").val();
    var FL_TREINAMENTO = $("#ddlTreinamento").val();

    var USUARIO_UPLOAD = $('#lbUsuarioUpload option').map(function() { return $(this).val(); }).get();
    var USUARIO_APROVACAO = $('#lbUsuarioAprovacao option').map(function() { return $(this).val(); }).get();
    var USUARIO_LIBERACAO = $('#lbUsuarioLiberacao option').map(function() { return $(this).val(); }).get();

    abrirProgress();
    function Encerra(data) {
        tableLayout.rows().remove();
        $.each(data.d.dadosGrid, function (i, item) {
            tableLayout.row.add(item);
        });
        tableLayout.draw();

        FechaModal("cancelApresentacao");
        fecharProgress();
    }
    $.ajax({
        type: "POST",
        url: "CadApresentacaoDetalhe.aspx/salvarApresentacao",
        data: JSON.stringify({ 
            ID_APRESENTACAO_CENARIO: $("#hdfID_APRESENTACAO_CENARO").val()
            , ID_PRODUTO:ID_PRODUTO
            , DS_APRESENTACAO:DS_APRESENTACAO
            , FL_ATIVO:FL_ATIVO
            , FL_POSSUI_APROVACAO:FL_POSSUI_APROVACAO
            , CD_ZYNC:CD_ZYNC
            , SIGLA_APRESENTACAO:SIGLA_APRESENTACAO
            , ID_TIPO_EQUIPAMENTO:ID_TIPO_EQUIPAMENTO
            , DS_COMENTARIO:DS_COMENTARIO
            , FL_TREINAMENTO:FL_TREINAMENTO
            , USUARIO_UPLOAD:USUARIO_UPLOAD
            , USUARIO_APROVACAO:USUARIO_APROVACAO
            , USUARIO_LIBERACAO:USUARIO_LIBERACAO
        }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#hdfID_APRESENTACAO_CENARO").val(data.d.ID_APRESENTACAO_CENARIO);
            $("#hdfHASH_APRESENTACAO").val(data.d.hash);
            if (fileUploadData) {
                fileUploadData.submit();
                FuncaoFechar = function () {
                    Encerra(data);
                };
            }
            else
            {
                Encerra(data);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            bootbox.alert({
                title: 'Erro',
                message: JSON.parse(xhr.responseText).Message,
            });
            fecharProgress();
        }
    });

}