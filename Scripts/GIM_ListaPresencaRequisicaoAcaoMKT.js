function LayoutTabela() {
    tableResult = $("#tbResult").DataTable({
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
                "autoWidth": false,
                "targets": [0],
                "data": null,
                "title": "",
                "className": "dt-center",
                "render": function (data, type, full, meta) {
                    var checked = false;
                    tableResult.rows().eq(0).each(function (index) {
                        var row = tableResult.row(index);
                        var dataTela = row.data();

                        if (full.PARTICIPA == "Sim") {
                            checked = true;
                        }
                    });

                    var html = "";
                    html += "<input type='checkbox' id='chkPresenca' ";
                    if (checked) {
                        html += " checked ";
                    }
                    html += ">&nbsp;";
                    return html;
                }
            },
            {
                "autoWidth": false,
                "targets": [1],
                "data": null,
                "title": "",
                "className": "dt-center",
                "render": function (data, type, full, meta) {
                    var html = "";
                    html += " <td style='text-align:center'><a href=\"#\" title='Adicionar Acompanhante' onclick=\"javascript:CarregaAcompanhante('" + data.ID_PUBLICO + "','" + data.CRM + "','"+ data.NOME +"');AbrirModal('AbreModalPublicoAlvoAcompanhante');\">" + (data.QTD_ACOMP == "0" ? "<i class='fa fa-users ' data-toggle='tooltip' data-placement='right' title='Adicionar acompanhantes'></i>" : "<i class='fa fa-users' style='color:red'  data-toggle='tooltip' data-placement='right' title='Adicionar acompanhantes'></i>") + "</a></td>";

                    return html;
                }


            },

            {
                "autoWidth": false,
                "targets": [2],
                "data": "CRM",
                "className": "dt-left",
                "title": "Código"
            },
            {
                "autoWidth": false,
                "targets": [3],
                "data": "NOME",
                "className": "dt-left",
                "title": "Nome"
            },
            {
                "autoWidth": false,
                "targets": [4],
                "data": "DESC_ESPEC",
                "className": "dt-left",
                "title": "Especialidade"
            },
            {
                "autoWidth": false,
                "targets": [5],
                "data": "PAINEL",
                "className": "dt-left",
                "title": "Painel"
            },
            {
                "autoWidth": false,
                "targets": [6],
                "data": "FLG_DENTRO_PUBLICO",
                "className": "dt-left",
                "title": "Dentro do público"
            }

        ]
    });
}

var tablePesquisaReq;
function LayoutTabelaPesReq() {
    //var COD = '';
    //var DESC = $("#txtPesqReq").val();
    //var categ = $("#ddlCateg").val();
    //var cont = 0;

    var cont = 0;
    tablePesquisaReq = $("#tablePesquisaReq").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bDestroy": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": false,
        "bstateSave": true,

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
                "autoWidth": false,
                "orderable": false,
                "targets": cont++,
                "data": null,
                "title": "Número",
                "className": "dt-left",
                "render": function (data, type, full, meta) {
                    var html;

                    html = "<a href='#' onclick='javascript:CarregaReq(\"" + data.CODIGO + "\",\"" + data.DESCRICAO + "\",\"" + data.DESC_STATUS + "\",\"" + data.CATEGORIA + "\",\"" + data.STATUS + "\");FecharPopupReq();\'>" + data.CODIGO + "</a>&nbsp;&nbsp;";

                    return html;
                }
            },
            {
                "autoWidth": false,
                "targets": cont++,
                "data": "CATEGORIA",
                "title": "Categoria",
                "orderable": false
            },
            {
                "autoWidth": false,
                "targets": cont++,
                "data": "DESCRICAO",
                "title": "Evento",
                "orderable": false
            },
            {
                "autoWidth": false,
                "targets": cont++,
                "data": "GD",
                "title": "GD",
                "orderable": false
            },
            {
                "autoWidth": false,
                "targets": cont++,
                "data": "RESPONSAVEL",
                "title": "Responsável",
                "orderable": false
            },
            {
                "autoWidth": false,
                "targets": cont++,
                "data": "DATA",
                "title": "Data Prevista",
                "orderable": false
            }
        ]


    });
}



function LayoutTabelaPesquisaReq() {

    var COD = '';
    var DESC = $("#txtPesqReq").val();
    var categ = $("#ddlCateg").val();



    $('#progress').css('display', 'block');

    $.ajax(
        {
            type: "POST",
            url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/PesquisarReq",
            data: JSON.stringify({ pCod: COD, pDesc: DESC, pCateg: categ }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                tablePesquisaReq.clear();

                $.each(data.d, function (i, item) {
                    tablePesquisaReq.row.add(item);
                });
                tablePesquisaReq.draw();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.parse(xhr.responseText).Message);
                $("#tablePesquisaReq").empty();
                LayoutTabelaPesReq();

            }
        });
    $('#progress').css('display', 'none');




}




function LayoutTabelaPesquisaCRM() {
    var CRM = $("#txtPesqCodigo").val();
    var UF = $("#ddlUFCRM").val();
    var Nome = $("#txtPesqNome").val();
    var categoria = '';
    var tipoConsulta = 1;

    if ((CRM != "") || (UF != "") || (Nome != "")) {
        tipoConsulta = 2;
    }


    $('#progress').css('display', 'block');

    $.ajax(
        {
            type: "POST",
            url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/PesquisarCRM",
            data: JSON.stringify({ pCRM: CRM, pUF: UF, pNome: Nome, pTipoPublico: $("#hPainelProf").val(), pTipoConsulta: tipoConsulta, pCategoria: categoria, pGD: $("#hGD").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                tablePesquisaCRM.clear();
                $.each(data.d, function (i, item) {
                    tablePesquisaCRM.row.add(item);

                });
                tablePesquisaCRM.draw();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.parse(xhr.responseText).Message);
            }
        });
    $('#progress').css('display', 'none');



}


var tablePesquisaCRM;
function LayoutTabelaCRM() {

    tablePesquisaCRM = $("#tablePesquisaCRM").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bDestroy": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": false,
        "bstateSave": true,

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
                "width": "15%",
                "autoWidth": false,
                "orderable": false,
                "targets": [0],
                "data": null,
                "title": "Código",
                "className": "dt-left",
                "render": function (data, type, full, meta) {
                    var html;
                    html = "<a href=\"#\" onclick=\"javascript:CarregaPublicoProf('" + data.UF_CFM + "','" + data.CRM_CFM + "','" + data.NOME_CFM + "','" + data.PAINEL + "','" + data.ESPEC + "');FecharModal('btnFecharPopupCRM');\">" + data.CRM_CFM + "</a>&nbsp;&nbsp;";

                    return html;
                }

            },

            {

                "width": "10%",
                "autoWidth": false,
                "targets": [1],
                "data": "UF_CFM",
                "title": "UF",
                "orderable": false
            },
            {
                "width": "30%",
                "autoWidth": false,
                "targets": [2],
                "data": "NOME_CFM",
                "title": "Nome",
                "orderable": false
            },
             {
                "width": "15%",
                "autoWidth": false,
                "targets": [3],
                "data": "CIA",
                "title": "Cia",
                "orderable": false
            },
             {
                 "width": "15%",
                 "autoWidth": false,
                 "targets": [4],
                 "data": "EQUIPE",
                 "title": "Equipe",
                 "orderable": false
             }
            ,
             {
                 "width": "15%",
                 "autoWidth": false,
                 "targets": [5],
                 "data": "CLASSIFICACAO",
                 "title": "Classificação",
                 "orderable": false
             }
        ]
    });
}

function LayoutTabelaPublicoAcomp() {

    var tableResultPublicoAcomp = $("#tblResultPublicoAcomp").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bDestroy": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": false,
        "bLengthChange": false,
        "bstateSave": true,
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
        }
    });




}



//----------------------------------------------------------------------------------------------------------------------------
//                                      Relatorio Imprimir
//----------------------------------------------------------------------------------------------------------------------------

function imprimir() {
    var idReq = $("#hIdReq").val();
    window.open("../relatorio/GIM_RelPreviewListaPresenca.aspx?CODREQUISICAO=" + idReq, "_blank");
}

//----------------------------------------------------------------------------------------------------------------------------
//                                      Carregar Pagina
//----------------------------------------------------------------------------------------------------------------------------

function carregaDadosPresenca() {
    chamaProgress();
    //$('#progress').css('display', 'block');
    $("#hIdReq").val($("#txtCodigoRequisicao").val());
    $("#hNumReq").val($("#txtCodigoRequisicao").val());
    $("#hNumReq").val();
    $("#hIdReq").val();
    var codReq = $("#txtCodigoRequisicao").val();
    $.ajax(
        {
            type: "POST",
            url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/CarregarListaPresenca",
            data: JSON.stringify({ codReq: codReq }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                tableResult.clear();
                $.each(data.d, function (i, item) {
                    tableResult.row.add(item);
                    $("#hPainelProf").val(item.TIPO_PAINEL_PROF);
                    $("#hGD").val(item.GD);
                    
                });
                tableResult.draw();
            }
        });
    //$('#progress').css('display', 'none');
    //aqui
    //$.cookie('DownloadAmostras');
}

//----------------------------------------------------------------------------------------------------------------------------
//                                      PopUp de Requisição
//----------------------------------------------------------------------------------------------------------------------------
function abrirPopReq() {

    AbrirModal('AbreModalPopReq');
    LimpaPopReq();
    CarregarCategoriaReq();

    return false;
}

//Pega as informações do PopUp de Requisição e joga para a tela principal -------------------------------------------
function CarregaReq(CODIGO, DESCRICAO, DESC_STATUS, DESC_ACAO, STATUS) {
    $("#txtCodigoRequisicao").val(CODIGO);
    $("#txtNomeRequisicao").val(DESCRICAO);
    $("#hIdReq").val(CODIGO);
    $("#txtCategReq").val(DESC_ACAO);
    $("#txtStatusReq").val(DESC_STATUS);


    if (STATUS == 7) {
        $("#btnIncluirParticipante").prop("disabled", "disabled");
        $("#btnSalvarPresenca").prop("disabled", "disabled");
    }
    else {
        $("#btnIncluirParticipante").removeAttr("disabled");
        $("#btnSalvarPresenca").removeAttr("disabled");
    }


    carregaDadosPresenca();

    return false;
}



function getCategoria() {

    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/getCategoria",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var combo = $("#ddlCategoriaProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });
        }

    });

}

function getEspecialidade() {
    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/getEspecialidade",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var combo = $("#ddlEspecialidadeProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });
        }

    });

}

function getUF() {
    var combo;
    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/getUF",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            combo = $("#ddlUFProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });


            combo = $("#ddlUFCRM");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });


            combo = $("#ddlEstadoProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });

        }

    });

}

function CarregaTipoPublico() {
    var combo = $("#ddlTipoPublico");
    combo.empty();
    //combo.append("<option value=''></option>");

    if ($("#hPainelProf").val() == "1") {
        combo.append("<option value='1'   Selected='True'>Apenas cliente</option>");
    } else if ($("#hPainelProf").val() == "2") {
        combo.append("<option value='2'   Selected='True'>Cliente e outros</option>");
    } else if ($("#hPainelProf").val() == "3") {
        combo.append("<option value='3'  Selected='True' >Não aceita painel</option>");
    }
}






function abrirPopPublicoAlvo() {

    $("#divConteudoPublicoAlvo").html("");

    $("#divConteudoPublicoAlvo").load("GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx" + " #popupPublico", function () {
        getEspecialidade();
        CarregaTipoPublico();
        AbrePublico();
        getCategoria();
        getUF();
        $("divMsgPublico").css('display', 'none');
        //AbrirModal('AbreModalPublicoAlvo');
        return false;
    });

}


function AbrePublico() {
    AbrirModal('AbreModalPublicoAlvo');
    //$("#ddlTipoPublico").val("P");
    CarregaTipoPublico();
    $("#PublicoProfissional").attr("style", "display:block");
    $("#hOperacaoPublico").val("INC");
    $("#ddlCategoriaProf").val("");
    $("#ddlUFProf").val("");
    $("#txtCRMProf").val("");
    $("#txtNomeProf").val("");
    $("#btnPesqCRM").removeAttr("disabled");
    $("#hIDPublico").val("");
    //  CarregaPublico();

}

function NovoPublico() {
    //$("#ddlTipoPublico").val("");
    CarregaTipoPublico();
    $("#ddlParticipouEvento").val('S');
    $("#ddlUFProf").val("");
    $("#txtCRMProf").val("");
    $("#txtNomeProf").val("");
    $("#ddlEspecialidadeProf").val("");
    $("#btnSalvarPublico").removeAttr("disabled");
    $("#divMsgPublico").css('display', 'none');
    return false;
}

function AbrirModal(pNomeClass) {
    $('.' + pNomeClass).click();
}


function AbrePesquisaCRM() {



    if ($("#ddlCategoriaProf").val() == "") {
        alert('Informe a categoria do profissional.');
        $("#ddlCategoriaProf").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    $("#txtPesqCodigo").val("");
    $("#ddlUFCRM").val("");
    $("#txtPesqNome").val("");

    //AbrirModal('AbreModalPopCrm')

    abrirPopCrm();
}


function abrirPopCrm() {
    $("#divConteudoCrm").html("");

    $("#divConteudoCrm").load("GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx" + " #popProf", function () {
        getUF();
        AbrirModal('AbreModalPopCrm');
        LayoutTabelaCRM();
        return false;
    });
}

function CarregaPublicoProf(UF_CRM, CRM, NOME, PAINEL, ESPEC) {

    $("#ddlUFProf").val(UF_CRM);
    $("#txtCRMProf").val(CRM);
    $("#txtNomeProf").val(NOME);
    carregaEspecialidadeProf(UF_CRM, CRM);
    //$("#ddlEspecialidadeProf").val(ESPEC);
    //$("#hPainelCadastro").val(PAINEL);
    var numreq = $("#hNumReq").val();

    verificaSePublicoExiste(numreq, UF_CRM, CRM);

}


function verificaSePublicoExiste(nunreq, UF_CRM, CRM) {

    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/VerificaPublico",
        data: JSON.stringify({ pReq: nunreq, pUf: UF_CRM, pCRM: CRM }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //aqui
            $.each(data.d, function (i, item) {

                if (item.QTD > 0) {
                    $("#divMsgPublico").css('display', 'block');
                    $("#btnSalvarPublico").prop("disabled", "disabled");
                }
                else {

                    $("#divMsgPublico").css('display', 'none');
                    $("#btnSalvarPublico").removeAttr("disabled");
                }
            });

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });

}




function FecharModal(pNomeButton) {
    $("#" + pNomeButton).click();
}

function FechaPopCrm() {

    $('#mPopCrm').modal('toggle');

    return false;
}


function ValidarPublico() {

    if ($("#ddlCategoriaProf").val() == "") {
        alert('Informe a categoria');
        $("#ddlCategoriaProf").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    if ($("#ddlUFProf").val() == "") {
        alert('Informe a UF do profissional.');
        $("#ddlUFProf").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    if ($("#txtCRMProf").val() == "") {
        alert('Informe o código do profissional.');
        $("#txtCRMProf").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    if ($("#txtNomeProf").val() == "") {
        alert('Informe o nome do profissional.');
        $("#txtNomeProf").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    if ($("#ddlEspecialidadeProf").val() == "") {
        alert('Informe a especialidade.');
        $("#ddlEspecialidadeProf").focus();
        $('#progress').css('display', 'none');
        return false;
    }





    SalvaPublicoProf();

}


function DadosPublicoProf(pNum_req, pOperacao, pCRMProf, pUFProf, pNomeProf, pEspecialidadeProf, pID, pParticipou, pPainelcadastro, pClassificacao) {


    this.ID = pID;
    this.OPERACAO = pOperacao;
    this.ID_NUM_REQ = pNum_req;
    this.CODIGO = pCRMProf;
    this.UF = pUFProf;
    this.NOME = pNomeProf;
    this.COD_ESPEC = pEspecialidadeProf;
    this.FLG_PART_EVENTO = pParticipou;
    this.PAINEL = pPainelcadastro;
    this.classificacao = pClassificacao;

}


function SalvaPublicoProf() {

    var num_req = $("#hNumReq").val();
    var CRMProf = $("#txtCRMProf").val();
    var UFProf = $("#ddlUFProf").val();
    var NomeProf = $("#txtNomeProf").val();
    var EspecialidadeProf = $("#ddlEspecialidadeProf").val();
    var operacao = $("#hOperacaoPublico").val();
    var participou = $("#ddlParticipouEvento").val();
    var IDPublico = $("#hIDPublico").val();
    var painelcadastro = $("#hPainelCadastro").val();
    var classificacao = $("#hClassificacao").val();

    var PublicoProf = [];
    const dadospublico = new DadosPublicoProf(num_req, operacao,
        CRMProf, UFProf, NomeProf,
        EspecialidadeProf, IDPublico, participou, painelcadastro, classificacao)
    PublicoProf.push(dadospublico);

    //var matricula = '<%=System.Web.HttpContext.Current.Session["matricula"].ToString() %>';
    var matricula = $("#hUsuario").val();
    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/SalvarPublicoProf",
        data: JSON.stringify({ pLista: PublicoProf, sMatricula: matricula, pGD: $("#hGD").val() }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            carregaDadosPresenca();
            NovoPublico();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });


    $('#progress').css('display', 'none');

}

function FecharPopupReq() {

    $('#mPopReq').modal('toggle');

    return false;
}


function validaSelecionouReq(Operacao) {

    if (($("#txtCodigoRequisicao").val() == "") || (tableResult.rows().data().length == 0)) {
        alert("Selecione um evento e carregue na tela.");
        return;

    } else {

        if (Operacao == 'S') {
            salvarPresenca();
        }
        if (Operacao == 'P') {
            abrirPopPublicoAlvo();
        }
        if (Operacao == 'I') {
            imprimir();
        }
    }

}

function carregaReqTab() {
    $("#txtNomeRequisicao").val('');
    $("#txtCategReq").val('');
    $("#txtStatusReq").val('');

    var divConsultar = $("#tbResult");
    divConsultar.empty();
    LayoutTabela();

    var cod = $("#txtCodigoRequisicao").val();

    if (cod != "") {
        $.ajax({
            type: "POST",
            url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/PesquisarReq",
            data: JSON.stringify({ pCod: cod, pDesc: '', pCateg: '' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                $.each(data.d, function (i, item) {
                    CarregaReq(item.CODIGO, item.DESCRICAO, item.DESC_STATUS, item.CATEGORIA, item.STATUS);

                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.parse(xhr.responseText).Message);
            }
        });
    }
}

//-------- salva a presença na tela principal
function salvarPresenca() {
    var idReq = $("#hIdReq").val();
    var idParticipante = "";
    $('#tbResult > tbody  > tr').each(function () {
        if ($(this).find('input[type^="checkbox"]').prop("checked")) {
            var data = tableResult.row($(this)).data();
            if (idParticipante != "") {
                idParticipante += ",";
            }
            idParticipante += data.ID;
        }
    });


    if (tableResult.rows().data().length === 0) {
        alert('Selecione um evento com participantes cadastrados.');
        return;
    }

    //$('#tbResult').dataTable().rows().count();
    var matricula = $("#hUsuario").val();

    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/salvarPresenca",
        data: JSON.stringify({ idParticipante: idParticipante, idReq: idReq, sMatricula: matricula }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert("Operação realizada com sucesso.");
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }

    });

    return false;
}

function CarregaAcompanhante(sID_PUBLICO, CRM , NOME) {
    $("#txtNomeAcomp").val('');
    $("#lblAcomp").text("Acompanhante público alvo - " + CRM + " - " + NOME );
    $("#hIdPublicoAcomp").val(sID_PUBLICO);
    $("#hCRM").val(CRM);
    $("#hNomeCrm").val(NOME);

    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/CarregaPublicoAcompanhante",
        data: JSON.stringify({
            pNumReq: $("#hNumReq").val(), ID_PUBLICO: sID_PUBLICO
        }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $("#DivResultPublicoAcomp").empty();

            var html = "";



            html += "<table id='tblResultPublicoAcomp' class='table table-striped table-bordered table-hover table-condensed rpt' border='0' >";
            html += "<thead> ";
            html += "    <tr> ";
            html += "        <th></th> ";
            html += "        <th>Nome</th> ";
            html += "    </tr> ";

            html += "</thead> ";

            html += "<TBODY>";

            $.each(data.d.ACOMPANHANTES, function (i, item) {

                html += "<tr >";
                html += " <td style='text-align:center'><a href=\"#\" onclick=\"javascript:ExcluirAcompanhante('" + item.ID_PUBLICO_ACOMP + "')\"><i class='fa fa-trash' data-toggle='tooltip' data-placement='right' title='Excluir acompanhante'></i></a>&nbsp;&nbsp;</td>";
                html += " <td style='text-align:left'>" + item.DESCRICAO + "</td>";

                html += "</tr>";

            });
            html += "</TBODY>";
            html += "</table>";




            $("#DivResultPublicoAcomp").html(html);
            LayoutTabelaPublicoAcomp();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
            $('#progress').css('display', 'none');
        }
    });
    $('#progress').css('display', 'none');


}

function AdicionarAcompanhante() {

    if ($("#txtNomeAcomp").val() == "") {

        alert("Informe o nome do acompanhante.");
        return false;
    }

    var numreq = $("#hNumReq").val();

    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/VerificaAcomp",
        data: JSON.stringify({ pReq: numreq, pNome: $("#txtNomeAcomp").val(), pCRM: $("#hCRM").val() }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $.each(data.d, function (i, item) {

                if (item.QTD > 0) {
                    alert("Já existe este acompanhante cadastrado.");
                    return;
                }


                else {

                    $.ajax({
                        type: "POST",
                        url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/AdicionarAcompanhante",
                        data: JSON.stringify({ ID_PUBLICO: $("#hIdPublicoAcomp").val(), pNumReq: $("#hNumReq").val(), pNome: $("#txtNomeAcomp").val() }),
                        timeout: 999999,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (data) {
                            CarregaAcompanhante($("#hIdPublicoAcomp").val(), $("#hCRM").val(), $("#hNomeCrm").val() );
                            // CarregaRequisicao($("#hNumReq").val());
                            $("#txtNomeAcomp").val("");
                            // $("#btnFechaModalAcomp").click();
                            // FechaPopAcomp();


                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            alert(JSON.parse(xhr.responseText).Message);
                            $('#progress').css('display', 'none');
                        }
                    });

                }

            });

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });

    $('#progress').css('display', 'none');

}

function ExcluirAcompanhante(sID_PUBLICO_ACOMP) {


    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/ExcluirAcompanhante",
        data: JSON.stringify({ ID_PUBLICO_ACOMP: sID_PUBLICO_ACOMP, ID_PUBLICO: $("#hIdPublicoAcomp").val(), pNumReq: $("#hNumReq").val() }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            CarregaAcompanhante($("#hIdPublicoAcomp").val(), $("#hCRM").val(), $("#hNomeCrm").val() );
            $("#txtNomeAcomp").val("");

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
            $('#progress').css('display', 'none');
        }
    });
    $('#progress').css('display', 'none');

}

function CarregarCategoriaReq() {

    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT.aspx/carregarCategoria",
        data: JSON.stringify({}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            var combo = $("#ddlCateg");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {

                combo.append("<option value='" + item.codigo + "'>" + item.codigo + "-" + item.descricao + "</option>")

            });
        }
    });
}

function LimpaPopReq() {
    $("#txtPesqReq").val('');
    $("#ddlCateg").val('');
    $("#tablePesquisaReq").empty();
    LayoutTabelaPesReq();
    return false;
}

function CarregaCRM() {

    var numreq = $("#hNumReq").val();

    if ($("#txtCRMProf").val() != "" && $("#ddlUFProf").val() != "") {

        $.ajax({
            type: "POST",
            url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/PesquisarCRM",
            data: JSON.stringify({ pCRM: $("#txtCRMProf").val(), pUF: $("#ddlUFProf").val(), pNome: "", pTipoPublico: $("#hPainelProf").val(), pTipoConsulta: 2, pCategoria: 'M', pGD: $("#hGD").val()  }),

            timeout: 999999,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {


                $.each(data.d, function (i, item) {
                    $("#ddlUFProf").val(item.UF_CFM);
                    $("#txtCRMProf").val(item.CRM_CFM);
                    $("#txtNomeProf").val(item.NOME_CFM);
                    //$("#ddlEspecialidadeProf").val(item.ESPEC);
                    carregaEspecialidadeProf(item.UF_CFM, item.CRM_CFM);

                    verificaSePublicoExiste(numreq, $("#ddlUFProf").val(), $("#txtCRMProf").val());
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.parse(xhr.responseText).Message);
                if ($("#hPainelProf").val() == "1") $("#txtNomeProf").attr("disabled", "disabled");
            }
        });



    }

}

function carregaEspecialidadeProf(UF_CFM, CRM_CFM) {

    var numreq = $("#hNumReq").val();

    if ($("#txtCRMProf").val() != "" && $("#ddlUFProf").val() != "") {

        $.ajax({
            type: "POST",
            url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/PesquisarEspecialidadeCRM",
            data: JSON.stringify({ pCRM: $("#txtCRMProf").val(), pUF: $("#ddlUFProf").val(), pNome: "", pTipoPublico: $("#hPainelProf").val(), pTipoConsulta: 2, pCategoria: 'M' }),

            timeout: 999999,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $.each(data.d, function (i, item) {
                    //aqui
                    $("#ddlEspecialidadeProf").val(item.ESPEC);
                    $("#hPainelCadastro").val(item.PAINEL);

                    $("#hClassificacao").val(item.COD_TARGETING);

                });


                if ($("#hClassificacao").val() == "0") {
                    carregaClassificacaoDefault();
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.parse(xhr.responseText).Message);
                if ($("#hPainelProf").val() == "1") $("#txtNomeProf").attr("disabled", "disabled");
            }
        });



    }

}


function carregaClassificacaoDefault() {

    $.ajax({
        type: "POST",
        url: "GIM_ListaPresencaRequisicaoAcaoMKT_Publico.aspx/PesquisarClassificacaoDefault",
        data: JSON.stringify({}),

        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            $.each(data.d, function (i, item) {
                $("#hClassificacao").val(item.COD_TARGETING);
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);

        }
    });
}


function FechaPopAcomp() {
    carregaDadosPresenca();
    $('#PublicoAlvoAcompanhate').modal('toggle');

    return false;

}



function chamaProgress() {
    // $("#loading-save").show();
    $("#progress").show();

    var interval =
        setInterval(function () {
            if ($.cookie('DownloadAmostras')) {
                setTimeout(function () {
                    desabilitaLoading();
                }, 20);
                $.removeCookie('DownloadAmostras', { path: '/' });
                clearInterval(interval);
            }
            //   desabilitaLoading();
        }, 10);
}

function desabilitaLoading() {
    //$("#loading-save").hide();
    $("#progress").hide();
}



