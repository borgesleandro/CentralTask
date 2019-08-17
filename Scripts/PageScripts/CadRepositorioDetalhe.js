



var tableAgente;
var tableMidia;

var capaSelecionada;



function OpenDialogForCrop(fileUpload) {
    GetImageFromInputFile(fileUpload).then(
        function (imgData) {
            OpenBootboxWithCroppedCanvas(imgData).then(
                function (dataUrl) {
                    capaSelecionada =
                        dataURItoBlob(
                            dataUrl
                        );

                    $('#imgCapa').attr('src', dataUrl);
                    $('#msgCapa').text(
                        'Capa selecionada pelo usuário'
                    ).fadeOut(500).fadeIn(500).fadeOut(500)
                        .fadeIn(500).fadeOut(500).fadeIn(500);


                }
            );
        },
        function (erro) {

        }
    );
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

}

function OpenBootboxWithCroppedCanvas(data) {
    var $image;
    var dfd = $.Deferred();
    //var cropper;
    var dialog = bootbox.dialog({
        title: 'Ajuste a imagem',
        message: "<img id='imgCanvas'    src='" + data + "'/>",
        size: 'large',
        buttons: {
            cancel: {
                label: "Cancelar",
                className: 'btn-danger',
                callback: function () {
                    dfd.reject();
                }
            },
            ok: {
                label: "Confirmar",
                className: 'btn-info',
                callback: function () {
                    window.cpCanvas = $image.cropper('getCroppedCanvas');
                    dfd.resolve(
                        $image.cropper('getCroppedCanvas').toDataURL('image/png')
                    );
                }
            }
        }
    });

    dialog.init(

        function () {
            setTimeout(function () {
                $image = $('#imgCanvas');

                $image.cropper({
                    aspectRatio: 4 / 3.0,
                    crop: function (event) {
                    },
                    ready: function () {

                        $image.cropper('setCropBoxData', { width: 400, height: 300 });

                    }

                });
            }, 250);

        }
    );

    return dfd.promise();

}

function GetImageFromInputFile(fileUpload) {
    var dfd = $.Deferred();

    //   var tgt = evt.target || window.event.srcElement,
    var files = fileUpload.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            //document.getElementById('imgCropCanvas').src =;
            dfd.resolve(fr.result);
        }
        fr.readAsDataURL(files[0]);
    }
    else {
        dfd.reject("Não suportado");
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }

    return dfd.promise();
}






function SetTipo(fUP) {
    var nomeArquivo = fUP.files[0].name;
    var parts = nomeArquivo.split('.');
    var extensao = parts[parts.length - 1].toLocaleLowerCase();

    var ddlTipo = $('#ddlTipo');

    switch (extensao) {
        case 'jpg':
        case 'jpeg':
            ddlTipo.val(7);
            break;
        case 'png':
            ddlTipo.val(8);
            break;
        case 'doc':
        case 'docx':
            ddlTipo.val(2);
            break;
        case 'xls':
        case 'xlsx':
            ddlTipo.val(3);
            break;
        case 'mp4':
            ddlTipo.val(5);
            break;
        case 'pdf':
            ddlTipo.val(1);
            break;
        case 'ppt':
        case 'pptx':
            ddlTipo.val(4);
            break;
        case 'zip':
        case 'htm':
        case 'html':
            ddlTipo.val(6);
            break;
        default:
            ddlTipo.val("");
            break;
    }
    ddlTipo.trigger('change');
}



$(document).ready(function () {

    $('#fileUpload').on("change", function () {
        var arquivo = $('#fileUpload')[0];
        if (arquivo.files.length > 0) {
            $('#txtNomeArquivo').val(arquivo.files[0].name);
            $("#hdfMidia").val("");

            var radios = $('.flEnviarCorpoEmail');

            $('#ddlEnvio, #ddlPublico').prop('disabled',false);

            if( /zip$/i.test( arquivo.files[0].name) )
            {
                radios.prop('checked', false)
                    .prop('disabled', true);

                radios.get(1).checked = true;

                $('#ddlEnvio, #ddlPublico').val(0);
                $('#ddlEnvio, #ddlPublico').prop('disabled',true);
                
            }
        }
    });

    var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
    if (isMobile != null) {
        $("#UserAgent").val("Mobile");
        CarregaDados();
        $("#divrolagem").attr("style", "overflow:auto;-webkit-overflow-scrolling: auto;height:400px")

    } else {
        $("#UserAgent").val("Web");
        CarregaDados();
    }






    $.datetimepicker.setLocale('pt-BR');
    ConfiguraCalendarios();

    var todasExtensoes = '.doc, .docx, .mp4, .xls, .xlsx, .ppt, .pptx, .htm, .html, .pdf, .jpg, .jpeg, .png, .zip';
    $('#fileUpload').attr('accept', todasExtensoes);
    $('#ddlTipo').on('change',
        function () {
            var jMe = $(this);
            var dado = $('#ddlTipo option:selected').text().trim();
            var extensoes = todasExtensoes;
            var capa = $("#imgCapa");
            var capaSrc = capaPadraoSrc;
            var radios = $('.flEnviarCorpoEmail');
            radios.prop('checked', false)
                .prop('disabled', true);
            switch (dado) {
                case 'DOC':
                    extensoes = ".doc, .docx";
                    capaSrc = capaWord;
                    break;
                case 'XLS':
                    extensoes = ".xls, .xlsx";
                    capaSrc = capaExcel;
                    break;
                case 'PPT':
                    extensoes = ".ppt, .pptx";
                    capaSrc = capaPowerPoint;
                    break;
                case 'MP4':
                    extensoes = ".mp4";
                    capaSrc = capaMP4;
                    break;
                case 'HTML':
                    extensoes = ".htm, .html, .zip";
                    capaSrc = capaHTML;
                    radios
                        .prop('disabled', false)
                        .filter('[value=False]')
                        .prop('checked', true);
                    break;
                case 'PDF':
                    extensoes = ".pdf";
                    capaSrc = capaPDF;
                    break;
                case 'JPG':
                    extensoes = ".jpg, .jpeg";
                    capaSrc = capaImagens;
                    break;
                case 'PNG':
                    extensoes = ".png";
                    capaSrc = capaImagens;
                    break;

            }

            if (!capaSelecionada) {
                capa.attr('src', capaSrc);
                $('#msgCapa').text(
                    'Capa escolhida automaticamente com base na extensão do arquivo. Clique na capa se quiser personalizar a imagem.'
                ).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500).fadeOut(500).fadeIn(500);

            }
            $('#fileUpload')
                .attr('accept', extensoes)
                .prop('accept', extensoes);
        }
    );
    $('#ddlVigencia').change(
        function () {
            $("#txtDataIni").val("");
            $("#txtDataFim").val("");
            var m = $("#txtDataIni, #txtDataFim");
            if ($(this).val() == "1") {
                m.removeAttr('disabled');
            }
            else {
                m.attr('disabled', 'disabled');
            }
        }
    );

    $('#ddlEnvio').change(
        function () {
            var m = $("#ddlPublico");
            if ($(this).val() == "1") {
                m.removeAttr('disabled');
            }
            else {
                m.attr('disabled', 'disabled');
                $("#ddlPublico").val("0");
            }
        }
    );
});

function limitaTextarea(textBox, tam) {
    quantidade = tam;
    total = textBox.value.length;
    if (total > quantidade) {
        document.getElementById(textBox.id).value = textBox.value.substr(0, quantidade);
    }
}
function checkTextAreaMaxLength(textBox, e, length) {
    var mLen = textBox["MaxLength"];
    if (null == mLen)
        mLen = length;

    var maxLength = parseInt(mLen);
    if (!checkSpecialKeys(e)) {
        if (textBox.value.length > maxLength - 1) {
            if (window.event)//IE
                e.returnValue = false;
            else//Firefox
                e.preventDefault();
        }
    }
}
function checkSpecialKeys(e) {
    if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
        return false;
    else
        return true;
}

function AbrirModal(pNomeClass) {
    $('.' + pNomeClass).click();
}
function FecharModal(pNomeButton) {
    $("#" + pNomeButton).click();
}

function RetornaPrincipal(msg) {
    if (msg != "") alert(msg);
    $(location).attr('href', 'CadRepositorio.aspx');
}

function CarregaDoc(pId) {
    //agentes
    $('#progressMaster').show();
    return $.ajax({
        type: "POST",
        url: "CadRepositorioDetalhe.aspx/CarregarListaDoc",
        data: JSON.stringify({ iddoc: pId }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            data.d.lista.forEach(function (item, index) {
                $('#txtDescricaoDoc').val(item["DS_DOCUMENTO"]);
                $('#ddlTipo').val(item["ID_TIPO_DOCUMENTO"]);



                $('#ddlTAG').val(item["DS_TAG"]);
                $('#txtTermoPesq').val(item["DS_TERMO_PESQUISA"]);
                $('#ddlProduto').val(item["ID_PRODUTO"]);

                $('#ddlEnvio').val(item["FL_ENVIAR_DOCUMENTO"]);

                if ($('#ddlEnvio').val() == "0") {
                    $('#ddlPublico').attr("disabled", "disabled").val("0");
                } else {
                    $('#ddlPublico')
                        .removeAttr("disabled")
                        .val(item["FL_PUBLICO"]);
                }
                $('#txtNomeArquivo').val(item["ARQUIVO"]);


                $('#ddlVigencia').val(item["FL_COM_VIGENCIA"]);
                if ($('#ddlVigencia').val() == "0") {
                    $('#txtDataIni').attr('disabled', 'disabled');
                    $('#txtDataFim').attr('disabled', 'disabled');
                    $('#txtDataIni').val("");
                    $('#txtDataFim').val("");
                } else {
                    $('#txtDataIni').remove('disabled');
                    $('#txtDataFim').remove('disabled');
                    $('#txtDataIni').val(item["DT_INICIO"]);
                    $('#txtDataFim').val(item["DT_FIM"]);
                }



                $('#ddlTipo').attr('disabled', 'disabled');

                if (item["FLG_POSSUI_CAPA"] === "0") {
                    // vai pegar a capa automágicamente baseado no tipo
                    $('#ddlTipo').trigger('change');
                }
                else {

                    $('#imgCapa').attr('src', item["CAPA"])
                    $('#msgCapa').text(
                        'Capa selecionada pelo usuário'
                    );

                }


                $('#divFUPArquivo').hide();
                $('#divFUPMidia').hide();
                $('#divLBLArquivo').show();
            });
            CarregaDocAgente(pId);

            //$('#progressMaster').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#progressMaster').hide();
            alert(JSON.parse(xhr.responseText).Message);
        },
        //complete:function(){ $('#progressMaster').hide();}
    });

}


function CarregaDocAgente(doc) {

    //agentes
    $.ajax({
        type: "POST",
        url: "CadRepositorioDetalhe.aspx/CarregarListaAgente",
        data: JSON.stringify({ pDoc: doc }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //ADD OS AGENTES
            //tableAgente.rows().remove();
            $.each(data.d.lista, function (i, item) {
                var parse = JSON.stringify(item);
                var retorno = $.parseJSON(parse);
                tableAgente.row.add(retorno);
            });
            tableAgente.draw();

            $('#progressMaster').hide();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#progressMaster').hide();
            alert(JSON.parse(xhr.responseText).Message);
        }
    });

}


function CarregaDados() {
    var doc = "";
    $("#hDoc").val(pId);
    doc = pId;

    if (doc != "0") {
        CarregaDoc(doc);
    } else {
        $("#txtDescricaoDoc").val("");
        $("#ddlTipo").val("");
        $("#ddlTAG").val("");
        $("#txtTermoPesq").val("");
        $("#ddlProduto").val("");
        $("#ddlVigencia").val("0");
        $('#txtDataIni').attr('disabled', 'disabled');
        $('#txtDataFim').attr('disabled', 'disabled');
        $('#txtDataIni').val("");
        $('#txtDataFim').val("");


        $(".midia").on('click', function (event) {

            AbrirModal("AbreModalCopiarMidia");
        });
    }

    LayoutTabelaAgente(doc);
    LayoutTabelaMidia();
}

function LayoutTabelaAgente(doc) {

    tableAgente = $("#tbResultAgente").DataTable({
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
        "columnDefs": [
            {
                "width": "5%",
                "autoWidth": false,
                "targets": [0],
                "data": null,
                "title": "Opção",
                "className": "dt-center",
                "render": function (data, type, full, meta) {
                    var html = "";
                    html = "<a href='javascript:void(0);' onclick=\"ExcluiagenteSelecionado('" + data.ID_AGENTE + "');\"><i class='fa fa-trash' data-toggle='tooltip' data-placement='right' title='Editar'></i></a>&nbsp;&nbsp;";
                    return html;
                }
            },
            {
                "width": "5%",
                "autoWidth": false,
                "targets": [1],
                "data": "ID_AGENTE",
                "title": "Código",
                "className": "dt-center"
            },
            {
                "width": "80%",
                "autoWidth": false,
                "targets": [2],
                "data": "NM_AGENTE",
                "title": "Nome",
                "className": "dt-left"
            },
            {
                "width": "10%",
                "autoWidth": false,
                "targets": [3],
                "data": "DS_EMAIL",
                "title": "Email",
                "className": "dt-left",
                "visible": false
            },
            {
                "width": "0%",
                "autoWidth": false,
                "targets": [4],
                "data": "SEQUENCIAL",
                "visible": false
            }
        ]
    });
}



function LayoutTabelaMidia() {

    tableMidia = $("#tbCopiaMidia").DataTable({
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
        "columnDefs": [
            {
                "autoWidth": false,
                "targets": [0],
                "data": null,
                "title": "Arquivo",
                "className": "dt-left",
                "render": function (data, type, full, meta) {
                    var html = "";
                    html = "<a id='imgArquivoOrigional'>" + data.ARQUIVO_ORIGINAL + "</a>&nbsp;&nbsp;";
                    return html;
                }
            },
            {
                "autoWidth": false,
                "targets": [1],
                "data": "DESCRICAO",
                "title": "Descrição",
                "className": "dt-left"
            },
            {
                "width": "10%",
                "autoWidth": false,
                "targets": [2],
                "data": "TIPO_MIDIA",
                "title": "Tipo Mídia",
                "className": "dt-left",
            }
        ],
        "ajax": {
            "type": "POST",
            "url": "CadRepositorioDetalhe.aspx/carregarMidia",
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json) {
                var parse = JSON.stringify(json.d);
                var retorno = $.parseJSON(parse);
                return retorno;
            }
        },
    });


    $('#tbCopiaMidia tbody').on('click', '#imgArquivoOrigional', function () {
        var data = tableMidia.row($(this).parents('tr')).data();
        $("#hdfMidia").val(data.ID_MIDIA);
        $('#txtNomeArquivo').val(data.ARQUIVO_ORIGINAL);

        var $el = $('#fileUpload');
        $el.wrap('<form>').closest('form').get(0).reset();
        $el.unwrap();


        $("#btnFecharCopiaMidia").click();

        if (data.COD_TIPO_MIDIA == 1) 
        {
            $('#ddlTipo').val(5);
        } 
        else if (data.COD_TIPO_MIDIA == 2) 
        {
            $('#ddlTipo').val(1);
        }
        else if (data.COD_TIPO_MIDIA == 3) 
        {
            $('#ddlTipo').val(6).trigger('change');

            $('.flEnviarCorpoEmail').prop('disabled',true).get(1).checked = true;
            
        }

        return false;
    });
}




function retornaagentesselecionados() {
    var listaag = [];
    tableAgente.rows().every(function () {
        var d = this.data();
        listaag.push({ ID_AGENTE: d.ID_AGENTE, NM_AGENTE: d.NM_AGENTE, DS_EMAIL: d.DS_EMAIL, SEQUENCIAL: d.SEQUENCIAL })
    });
    return listaag;
}

function ExcluiagenteSelecionado(pIdagente) {
    tableAgente.rows().every(function () {
        var d = this.data();
        var linhacorrente = this;
        if (d != null) {
            if (d.ID_AGENTE == pIdagente) {
                linhacorrente.remove().draw();
            }
        }
    });
}

function DataEmBranco(strData) {
    strData = strData.replace(/_/g, "", );
    strData = strData.replace("/", "");
    strData = strData.replace("/", "");
    strData = strData.replace(/:/g, "");
    return strData.trim();
}

function ValidaDoc() {

    var listaagentes = retornaagentesselecionados();

    var msg = "";
    if ($('#txtDescricaoDoc').val() == "") {
        msg = "Selecione uma descrição para o repositório.\n";
    };
    if ($('#ddlTipo').val() == "") {
        msg += "Selecione um tipo de repositório.\n";
    };



    if ($('#ddlVigencia').val() == "1") {

        if (DataEmBranco($("#txtDataIni").val()) == '') {
            alert("Informe a data de início");
            $("#txtDataIni").focus();
            return false;
        }

        if (DataEmBranco($("#txtDataFim").val()) == '') {
            alert("Informe a data de término");
            $("#txtDataFim").focus();
            return false;
        }
        var data1 = $("#txtDataIni").val().trim().split("/");
        var data2 = $("#txtDataFim").val().trim().split("/");
        if ((Date.parse(data1[2].substring(0, 4) + "-" + data1[1] + "-" + data1[0] + data1[2].substring(4))) > (Date.parse(data2[2].substring(0, 4) + "-" + data2[1] + "-" + data2[0] + data2[2].substring(4)))) {
            alert('Data de termino da vigência menor que data inicial');
            $("#txtDataFim").focus();
            return false;
        }
    };

    var arquivo = $('#fileUpload')[0];
    var idMidia = $('#hdfMidia').val();

    if (pId == 0) {
        if (arquivo.files.length == 0 && idMidia == "") {
            msg += "Selecione um arquivo com até " + limiteUp + "MB.\n";
        }
        else {
            if (arquivo.files.length > 0) {
                if ((arquivo.files[0].size / 1024 / 1024) > limiteUp) {
                    msg += "O arquivo ultrapassa o limite de " + limiteUp + "MB.\n";
                }
                else {
                    var parts = arquivo.files[0].name.split(".");
                    var extensao = parts[parts.length-1];

                    var extensaoAux = extensao.toUpperCase();

                    if (extensaoAux == "DOCX" || extensaoAux == "XLSX" || extensaoAux == "PPTX") 
                    {
                        extensaoAux = extensaoAux.substr(0, 3);
                    }

                    if (extensaoAux == "HTM" || extensaoAux == "ZIP")
                    {
                        extensaoAux = "(HTML|ZIP|HTM)$";
                    }
                    if (extensaoAux == "JPEG")
                    {
                        extensaoAux = "JPG";
                    }
                    //debugger;

                    if(!new RegExp(extensaoAux,"ig").test($("#ddlTipo option:selected").text())){
                        msg += "Arquivo incompatível com o tipo de repositorio selecionado.\n";
                    };
                };
            } else {
                var parts = $('#txtNomeArquivo').val().split(".");
                var extensao = parts[parts.length-1];
                var extensaoAux = extensao.toUpperCase();

                if (extensaoAux == "DOCX" || extensaoAux == "XLSX" || extensaoAux == "PPTX")
                {
                    extensaoAux = extensaoAux.substr(0, 3);
                }
                if (extensaoAux == "HTM" || extensaoAux == "ZIP")
                {
                    extensaoAux = "(HTML|ZIP|HTM)$";
                }
                if (extensaoAux == "JPEG")
                {
                    extensaoAux = "JPG";
                }
                //if (extensaoAux.toUpperCase() != $("#ddlTipo option:selected").text()) {
                if(!new RegExp(extensaoAux,"ig").test($("#ddlTipo option:selected").text())){
                    msg += "Arquivo incompatível com o tipo de repositorio selecionado.\n";
                };
            }
        }
    }
    if (listaagentes.length == 0) {
        msg += "Associe pelo menos um agente.\n";
    }
    if (msg != "") {
        alert(msg);
        return false;
    };

    var formData = new FormData();
    formData.append('ID_DOCUMENTO', pId == null ? 0 : pId);
    formData.append('TAG', $('#ddlTAG').val());
    formData.append('DESCRICAO', $('#txtDescricaoDoc').val());
    formData.append('PRODUTO', $('#ddlProduto').val() == null ? "" : $('#ddlProduto').val());
    formData.append('DS_TERMO_PESQUISA', $('#txtTermoPesq').val());

    formData.append(
        'FL_CORPO_EMAIL',
        $('.flEnviarCorpoEmail:checked').val() === "True" ? 1 : 0
    );


    formData.append('TIPO', $('#ddlTipo').val());
    if (arquivo.files.length != 0) {
        formData.append('ARQUIVO', arquivo.files[0]);
    }
    else if (idMidia != "") {
        formData.append('ARQUIVO', $('#txtNomeArquivo').val());
    }
    else {
        formData.append('ARQUIVO', "");
    }

    if (capaSelecionada) {
        formData.append('CAPA', capaSelecionada);
    }
    formData.append('ID_MIDIA', $('#hdfMidia').val());
    formData.append('VIGENCIA', $('#ddlVigencia').val());
    formData.append('DTINI', $('#txtDataIni').val());
    formData.append('DTFIM', $('#txtDataFim').val());
    formData.append('AGENTES', JSON.stringify(listaagentes));

    formData.append('ENVIA', $('#ddlEnvio').val());
    formData.append('PUBLICO', $('#ddlPublico').val());

    $('#progressMaster,.progress-bar').show();


    $.ajax({
        type: "POST",
        url: "UploadFileDoc.aspx",
        data: formData,
        xhr: function () {  // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) { // Check if upload property exists
                //update progressbar percent complete
                $('.progress').show();
                $('.progress-bar').width(0 + '%');
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
            }
            return myXhr;
        },
        timeout: 999999,
        success: function () {

            $('.progress').hide();
            $('.progress-bar').width(0 + '%');

            var msg = pId == 0 ? "Inclusão realizada com sucesso." : "Alteração realizada com sucesso.";
            RetornaPrincipal(msg);

            $('#progressMaster').hide();
        },
        processData: false,
        contentType: false,
        error: function () {
            $('#progressMaster').hide();
            $('.progress').hide();
            $('.progress-bar').width(0 + '%');
            bootbox.alert({ title: 'Erro', message: "Falha ao processar requisição!", });
        }
    });
}

function progressHandlingFunction(e) {
    if (e.lengthComputable) {
        var percentage = Math.floor((e.loaded / e.total) * 100);
        //update progressbar percent complete
        $('.progress-bar').width(percentage + '%');
    }
}

function AddAgente() {

    var lstRET = [];
    tableAgente.rows().every(function (rowIdx, tableLoop, rowLoop) {
        lstRET.push(this.data().SEQUENCIAL);
    })
    $(jUctlAgentes_AgentesSelecionadosID).val(JSON.stringify(lstRET))
    uctlAgentes.AbrirModalPesquisaAgente();

}


function SalvarAgenteDoc(data) {

    var lista = [];

    data.forEach(function (item) {
        lista.push({ ID_AGENTE: item.SETOR, NM_AGENTE: item.NOME, DS_EMAIL: item.EMAIL, SEQUENCIAL: item.SEQUENCIAL });
    });

    //ADD OS AGENTES      
    $.each(lista, function (i, item) {
        var parse = JSON.stringify(item);
        var retorno = $.parseJSON(parse);
        tableAgente.row.add(retorno);
    });
    tableAgente.draw();


    LayoutTabelaAgente();
}



function ConfiguraCalendarios() {
    $("#txtDataIni").val("");
    $("#txtDataIni").datetimepicker('destroy');
    jQuery('#txtDataIni').datetimepicker({
        timepicker: false,
        mask: true,
        format: 'd/m/Y',
        formatDate: 'd/m/Y',
        onShow: function (ct) {
            this.setOptions({
                maxDate: jQuery('#txtDataFim').val() ? jQuery('#txtDataFim').val() : false
            })
        },
    });

    $("#txtDataFim").val("");
    $("#txtDataFim").datetimepicker('destroy');
    jQuery('#txtDataFim').datetimepicker({
        timepicker: false,
        mask: true,
        format: 'd/m/Y',
        formatDate: 'd/m/Y',
        onShow: function (ct) {
            this.setOptions({
                minDate: jQuery('#txtDataIni').val() ? jQuery('#txtDataIni').val() : false
            })
        },
    });
}

