$(document).ready(function () {

    //tela de inclusão e de alteração
    //$('#txtQuantidade').mask("?99999", { placeholder: "" });

    //$("#GD_N_ESTAB_CNPJ").mask("99.999.999/9999-99"); //, { placeholder: "" }
    //$("#GD_N_ESTAB_LOCAL_DDD").mask("?99"); //, { placeholder: "" }
    //$("#GD_N_ESTAB_LOCAL_TELEF1").mask("?999999999"); //, { placeholder: "" }
    //$("#GD_N_ESTAB_LOCAL_RAMAL1").mask("?9999"); //, { placeholder: "" }
    //$("#GD_N_ESTAB_LOCAL_FAX").mask("?999999999"); //, { placeholder: "" }

    ////$("#GD_N_ESTAB_LOCAL_NUMERO").mask("?999999"); //, { placeholder: "" }
    //$("#GD_N_ESTAB_LOCAL_CEP").mask("99999-999"); //, { placeholder: "" }


    //$('#CNPJ').mask("99.999.999/9999-99"); //, { placeholder: "" }

    mascaracampos();




    $("select[multiple]").multiselect().multiselectfilter();
    $("select:not([multiple])").chosen();

    //$('#Farmacia').maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
    //$('#CNPJ').mask("99.999.999/9999-99");


    //FUNÇÃO USADA NA TELA CREATE E EDIT
    defineCliqueBuscaCEP();
     






    $("#CODDIV").change(function (e) {

        if ($("#CODDIV").val() != "") {

            $("#CAGD_GD").empty();
            $("#CAGD_GD").attr("disabled", "disabled");
            $("#CAGD_GD").trigger("liszt:updated");


            $.ajax({
                type: "POST",
                url: controller + "ObterEquipesPorCia",
                contentType: "application/json",
                data: JSON.stringify({ cia: $("#CODDIV").val() }),
                success: function (data) {

                    $("#EQUI_EQUIPE").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Selecione uma opção");
                    $("#EQUI_EQUIPE").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#EQUI_EQUIPE").append(option);
                    });

                    $("#EQUI_EQUIPE").removeAttr("disabled");
                    $("#EQUI_EQUIPE").trigger("liszt:updated");
                },
                error: function (data) {
                    alert("Houve um erro ao obter a lista de equipes.");
                }
            });

           

        }
        else {
            $("#EQUI_EQUIPE").empty();

            var option = $('<option></option>');
            option.attr('value', "");
            option.text("Selecione uma opção");
            $("#EQUI_EQUIPE").append(option);


            $("#EQUI_EQUIPE").attr("disabled", "disabled");
            $("#EQUI_EQUIPE").trigger("liszt:updated");

           
        }


    });



    $("#EQUI_EQUIPE").change(function (e) {

        if ($("#EQUI_EQUIPE").val() != "") {
            $.ajax({
                type: "POST",
                url: controller + "ObterGDsPorCia",
                contentType: "application/json",
                data: JSON.stringify({ cia: $("#CODDIV").val(), equipe: $("#EQUI_EQUIPE").val() }),
                success: function (data) {

                    $("#CAGD_GD").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.codigo + " - " + this.descricao);

                        $("#CAGD_GD").append(option);
                    });

                    $("#CAGD_GD").removeAttr("disabled");
                    $("#CAGD_GD").multiselect('refresh');
                    $("#CAGD_GD").trigger("liszt:updated");
                }
            });
        }
        else {
            $("#CAGD_GD").empty();
            $("#CAGD_GD").attr("disabled", "disabled");
            $("#CAGD_GD").trigger("liszt:updated");
        }

    });


    $("#EQZ").change(function () {

        var reps = $("#EQZ").val();
        //se tiver selecionado mais de um bloqueia o MAPA
        if (reps.length > 1) {
            $("#btnMapa").css('visibility', 'hidden');
        }
        else {
            $("#btnMapa").css('visibility', 'visible');
        }

    });


    $("#CAGD_GD").change(function () {

        if ($('#CAGD_GD').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "ObterREPsPorGDs",
                contentType: 'application/json',
                data: JSON.stringify({ cia: $("#CODDIV").val(), equipe: $("#EQUI_EQUIPE").val() , GDs: $('#CAGD_GD').val() }),
                success: function (data) {

                    $("#EQZ").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.codigo + " - " + this.descricao);

                        $("#EQZ").append(option);
                    });

                    $("#EQZ").removeAttr("disabled");
                    $("#EQZ").multiselect("refresh");
                }
            });
        }
        else {
            $("#EQZ").empty();
            $("#EQZ").attr("disabled", "disabled");
            $("#EQZ").trigger("liszt:updated");
        }
    });

    


    $("#btnMapa").on("click", function () {
        //CGAMA A FUN~ÇÃO DA CONTROLER QUE ABRIRÁ A PARIAL _GMAPS QUE IRÁ RECEBER OS PARAMETROS
        window.open(controller + 'GetGMaps?CODDIV=' + $("#CODDIV").val() + '&EQZ=' + $("#EQZ").val(), '_blank', 'left=100,top=100,width=1000,height=600,toolbar=0,resizable=1');
    });



    $("#btnPesquisar").on("click", function () {

        $(".loading-save").show();

        if ($("#CODDIV").val() == "") {
            alert("Você precisa escolher a divisão.");
            $(".loading-save").hide();
            return;
        }

        if ($("#EQUI_EQUIPE").val() == "") {
            alert("Você precisa escolher uma equipe.");
            $(".loading-save").hide();
            return;
        }

        $("#exportarLinkDiv").html("");

        $.get(controller + "List", null, function (response) {

            var cia = $("#CODDIV").val();
            var equi_equipe = $("#EQUI_EQUIPE").val();
            var cnpj = $("#CNPJ").val().replace(/[^\w\s]/gi, '');
            var razaosocial = $("#RAZAO_SOCIAL").val();
            var cagd = $("#CAGD_GD").val();
            var eqz = $("#EQZ").val();

            


            $("#consulta").html(response);
            $("#farmacias").dataTable({
                "sPaginationType": "full_numbers",
                "bAutoWidth": false,
                "bProcessing": true,
                "bServerSide": true,
                "bSort": true,
                "oLanguage":
                {
                    "sZeroRecords": "Não foram encontrados resultados",
                    "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                    "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                    "sInfoFiltered": "(Total de _MAX_ registros)"
                },
                "sAjaxSource": controller + "SetDataTable",
                "fnServerData": function (sSource, aoData, fnCallback) {
                    aoData.push(
                        { "name": "Cia", "value": cia },
                        { "name": "EQUI_EQUIPE", "value": equi_equipe },
                        { "name": "CNPJ", "value": cnpj },
                        { "name": "RAZAO_SOCIAL", "value": razaosocial },
                        { "name": "CAGD_GD", "value": cagd },
                        { "name": "EQZ", "value": eqz });
                    $.post(sSource, aoData, function (json) {
                        $(".loading-save").hide();
                        fnCallback(json);
                    });
                },
                "aoColumns": [
                  //{ "mDataProp": "CNPJ", "sWidth": "10%" },
                  {
                      "mDataProp": "CNPJ",
                      "sWidth": "10%",
                      "fnRender": function (oObj) {
                          var result = '<a href="#" onclick="GetDetalhesEstabelecimento(\'' + oObj.aData.ESTAB_ID + '|' + oObj.aData.EQUIEQUIPE + '\')">' + oObj.aData.CNPJ + '</a>';
                          return result;
                      }
                  },
                  { "mDataProp": "RAZAOSOCIAL", "sWidth": "35%" },
                  { "mDataProp": "CIDADE", "sWidth": "15%" },
                  { "mDataProp": "UF", "sWidth": "5%" },
                  { "mDataProp": "EQZ", "sWidth": "5%" },
                  { "mDataProp": "EQUIPE", "sWidth": "10%" },
                  {
                      "mDataProp": "ACAO",
                      "bSearchable": false,
                      "bSortable": false,
                      "fnRender": function (oObj) {
                          //var linkImagem = '<a data-id="' + oObj.aData.CNPJ + '" class="mws-ic-16 ic-image-2 li_icon imagemProduto" title="Visualizar Imagem"></a>';
                          //var linkEdicao = '<a href="' + controller + 'Edit/' + oObj.aData.ESTAB_ID + '" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';
                          var linkEdicao = '<a href="#" onclick="GetTelaEdit(' + oObj.aData.ESTAB_ID + ')" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';

                          var linkTransf = '<a href="#" onclick="GetTelaTransferirFarmacia(' + oObj.aData.ESTAB_ID + ')" class="mws-ic-16 ic-application-double li_icon" title="Transferir" title="Transferir"></a>';


                          //var linkDetalhe = '<a href="' + controller + 'Details/' + oObj.aData.SEQPROD + '" class="mws-ic-16 ic-page-white-text li_icon" title="Detalhes"></a>';
                          var result = '<ul class="icons_16 clearfix2">';

                          $.ajax({
                              type: "POST",
                              url: controller + "ObterPermissaoEdit",
                              contentType: "application/json",
                              data: JSON.stringify({ cia: $("#CODDIV").val(), equipe: $("#EQUI_EQUIPE").val() }),
                              async: false,
                              success: function (data) {

                                  if (data == "S") {
                                      result += "<li>" + linkEdicao + "</li>";
                                      result += "<li>" + linkTransf + "</li>";
                                      result += "</ul>";
                                  }
                                  else {
                                      result += "</ul>";
                                  }
                              }
                          });
                          $(".loading-save").hide();
                          return result;

                          //if (oObj.aData.IMAGEM.length > 0) {
                          //    result += "<li>" + linkImagem + "</li>";
                          //}

                      }
                  }
                ]
            });
        });
    });



    //$("#btnExportar").on("click", function () {

    //    $("#exportarLinkDiv").html("");

    //    $(".loading-save").show();

    //    var model = {

    //        CODDIV: $("#CODDIV").val(),
    //        EQZ: $("#REPR_REP").val()

    //    };

    //    xhr = $.ajax({
    //        type: 'POST',
    //        contentType: 'application/json',
    //        url: "RelacaoAlfaRepresentantePDV/ExportarExcel",
    //        async: false,
    //        data: JSON.stringify(model),
    //        success: function (response, status, request) {

    //            var type = request.getResponseHeader('Content-Type');
    //            var blob = new Blob(["\ufeff", response], { type: type });
    //            var downloadUrl = URL.createObjectURL(blob);

    //            setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='RelacaoAlfaRepresentantePDV.xls' class=''><img src='Content/botao-salvar-download-vertical.png'/></a>") }, 2000);

    //            $(".loading-save").hide();
    //        },
    //        error: function (response) {
    //            alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
    //            $(".loading-save").hide();
    //        }
    //    });

    //});
});
//FIM READY


function mascaracampos() {
    $("#GD_N_ESTAB_CNPJ").mask("?99.999.999/9999-99"); //, { placeholder: "" }
    $("#GD_N_ESTAB_LOCAL_DDD").mask("?99"); //, { placeholder: "" }
    $("#GD_N_ESTAB_LOCAL_TELEF1").mask("?999999999"); //, { placeholder: "" }
    $("#GD_N_ESTAB_LOCAL_RAMAL1").mask("?9999"); //, { placeholder: "" }
    $("#GD_N_ESTAB_LOCAL_FAX").mask("?999999999"); //, { placeholder: "" }
    $("#GD_N_ESTAB_LOCAL_CEP").mask("?99999-999"); //, { placeholder: "" }
    $('#CNPJ').mask("?99.999.999/9999-99"); //, { placeholder: "" }
}

function defineCliqueBuscaCEP() {
    //FUNÇÃO USADA NA TELA CREATE E EDIT
    $("#btnBuscarPorCEP").on("click", function () {
        $("#loading-save").show();
        $.ajax({
            type: "POST",
            url: controller + "ObterEnderecoPorCEP",
            contentType: 'application/json',
            data: JSON.stringify({ CEP: $('#GD_N_ESTAB_LOCAL_CEP').val().replace(/[^\w\s]/gi, '') }),
            async: true,
            success: function (data) {

                if (data != null) {
                    $("#GD_N_ESTAB_LOCAL_LOGRAD").val(data.ENDERECO);
                    $("#GD_N_ESTAB_LOCAL_BAIRRO").val(data.BAIRRO);
                    $("#GD_N_ESTAB_LOCAL_CIDADE").val(data.CIDADE);

                    $("#GD_N_ESTAB_LOCAL_UF").val(data.UF);
                    $("#GD_N_ESTAB_LOCAL_UF").trigger("liszt:updated");

                    $("#loading-save").hide();
                }
                else {
                    alert("Houve um erro ao obter o endereço referente ao CEP digitado.");
                    $("#loading-save").hide();
                }
            }
        });
    });
}


function GetDetalhesEstabelecimento(estabidEquipe) {

    var modalButtons = {};

    modalButtons["Voltar"] = function () {
        $("#detalhesEstabelecimentoDialog").dialog("destroy");

    };

    var model = {

        CODDIV: $("#CODDIV").val(),
        EQZ: $("#REPR_REP").val(),
        ESTAB_ID: estabidEquipe.split('|')[0],
        EQUI_EQUIPE: estabidEquipe.split('|')[1]

    };

    xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "Farmacia/GetDetalhesEstabelecimento",
        async: false,
        data: JSON.stringify(model),
        success: function (response) {

            $(response).dialog({
                //position: "right-100 top+40",
                resizable: false,
                draggable: true,
                title: "Fichário do Estabelecimento",
                height: 600,
                width: 1080,
                modal: true
                //open: function () {
                //        //para a janela ficar a frente da outra
                //        $('.ui-dialog').css('z-index', 103);
                //        $('.ui-widget-overlay').css('z-index', 102);
                //    }
            });

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "Farmacia/GetVisitacaoEstabelecimento",
                async: false,
                data: JSON.stringify(model),
                success: function (responseVisitacao) {

                    $("#visitacao").html(responseVisitacao);
                },
                error: function (responseVisitacao) {
                    alert('erro responseVisitacao ');
                    //alert(responseVisitacao);
                }
            })

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "Farmacia/GetSellOutVisitacaoEstabelecimento",
                async: false,
                data: JSON.stringify(model),
                success: function (responseSellOut) {

                    $("#sellout").html(responseSellOut);
                },
                error: function (responseSellOut) {
                    //alert(responseSellOut);
                    alert('22');
                }
            })

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "Farmacia/GetMarketShareVisitacaoEstabelecimento",
                async: false,
                data: JSON.stringify(model),
                success: function (responseMarketShare) {

                    $("#marketshare").html(responseMarketShare);
                },
                error: function (responseMarketShare) {
                    //alert(responseMarketShare);
                    alert('33');
                }
            })

        }
    });
};

function GetDadosMaterial(estabidEquipeData) {

    var modalButtons = {};

    modalButtons["Voltar"] = function () {
        $("#dadosMaterialDialog").dialog("destroy");
    };

    var model = {

        CODDIV: $("#CODDIV").val(),
        EQZ: $("#REPR_REP").val(),
        ESTAB_ID: estabidEquipeData.split('|')[0],
        EQUI_EQUIPE: estabidEquipeData.split('|')[1],
        VISI_DATAVIS: estabidEquipeData.split('|')[2]

    };

    xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "Farmacia/GetDadosMaterial",
        async: false,
        data: JSON.stringify(model),
        success: function (response) {

            if (response != "") {
                $(response).dialog({
                    resizable: false,
                    height: 300,
                    width: 390,
                    modal: true,
                    //draggable: false,
                    draggable: true,
                    buttons: modalButtons
                    //open: function () {
                    //    //para a janela ficar a frente da outra
                    //    $('.ui-dialog').css('z-index', 103);
                    //    $('.ui-widget-overlay').css('z-index', 102);
                    //}
                });
            }
            else {
                alert("Não há dados para exibição.");
            }

        },
        error: function (response) {
            alert(response);
        }
    })

}







//#####################################
//CARREGAR TELA DE EDITAR
//#####################################  
function GetTelaEdit(ESTABID) { 

    
    //apaga a janela antes de abrir para evitar problema no cboMotivo CHOSEN na segunda vez que ela é aberta
    $('.DIALOGmodalEdit').find("form").remove();
    $('.DIALOGmodalEdit').dialog('destroy');

    
    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();



    $.ajax({
        type: "POST",
        url: controller + "TelaEdit",
        contentType: "application/json",
        data: JSON.stringify({ id: ESTABID }),
        success: function (data) {

            var buttonsModalEdit = [];

            $(".modalEditar").dialog("close").dialog("destroy").remove();

            //cria o botão transferir
            buttonsModalEdit.push(
                //BOTAO TRANSFERIR
                {
                    text: "Salvar",
                    "class": "mws-button blue",
                    click: function () {
                        //alert('transferir');

                        if ($("#GD_N_ESTAB_INSCRICAO").val().trim() != "") {

                            $.ajax({
                                type: "POST",
                                url: controller + "ValidarINSCRICAO",
                                contentType: 'application/json',
                                data: JSON.stringify({ CNPJ: $('#GD_N_ESTAB_CNPJ').val().replace(/[^\w\s]/gi, ''), INSCRICAO: $("#GD_N_ESTAB_INSCRICAO").val() }),
                                async: true,
                                success: function (data) {

                                    //indica que pode cadastrar
                                    if (data == false) {
                                        alert("Já existe outro estabelecimento cadastrado com a Inscrição digitada!");
                                        return false;
                                    }
                                    else {
                                        EditarFarmacia(ESTABID);
                                    }

                                }
                            });
                        }
                        else {
                            EditarFarmacia(ESTABID);
                        }


                        
                    }
                }
                ,
                //BOTAO FECHAR
                {
                    text: "Fechar",
                    "class": "mws-button gray",
                    click: function () {
                        $(".loading-save").hide();
                        //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                        $('.ui-widget-overlay').css('z-index', 102);

                        //chama o fechar da própria janela DIALOGmodal3
                        $('.DIALOGmodalEdit .ui-dialog-titlebar-close').click();
                        $(".modalEditar").dialog("close").dialog("destroy").remove();

                    }
                }
            );


            $(".loading-save").hide();
            $(data).dialog({
                dialogClass: "DIALOGmodalEdit", //classe para identificar a janela que esta sendo aberta
                resizable: true,
                draggable: true,
                title: "Editar cliente",
                width: 1120,
                height: 800,
                modal: true,
                buttons: buttonsModalEdit,
                open: function () {

                    //para a janela ficar a frente da outra
                    $('.ui-widget-overlay').css('z-index', 105);

                    $('.DIALOGmodalEdit').css('z-index', 106);
                    $('.DIALOGmodalEdit').css('top', 0);

                    //seta o top da página
                    $('body').scrollTop(0);


                    $("#GD_N_ESTAB_LOCAL_UF").chosen();
                    //$('#GD_N_ESTAB_LOCAL_UF_chzn').css('z-index', 9999);
                    //$('#GD_N_ESTAB_LOCAL_UF').css('z-index', 9998);
                    //$('.chznselect').css('z-index', 9999999);
                    mascaracampos();
                    defineCliqueBuscaCEP();

                    validacaocamposEdit();
                    




                },
                close: function () {
                    $('.modalEditar').dialog("close").dialog("destroy").remove();
                    $('.ui-widget-overlay').css('z-index', 102);
                }

            });


        },
        error: function (data) {
            $(".loading-save").hide();
            alert("Houve um erro ao obter dados do cliente.");
        }
    });
};


function validacaocamposEdit() {
   

    //VALIDA OS CAMPOS
    if ($("#GD_N_ESTAB_RAZAOSOCIAL").val().trim() == "") {
        $(".validaRAZAOSOCIAL").slideDown("fast");
        sbValidacao = false;
    }
    if ($("#GD_N_ESTAB_NOMEFANTASIA").val().trim() == "") {
        $(".validaNOMEFANTASIA").slideDown("fast");
        sbValidacao = false;
    }


    $("#GD_N_ESTAB_LOCAL_DDD").change(function (e) {
        if ($("#GD_N_ESTAB_LOCAL_DDD").val().trim() == "") {
            $(".validaDDD").slideDown("fast");
        }
        else {
            $(".validaDDD").hide();
        }
    });
    $("#GD_N_ESTAB_LOCAL_TELEF1").change(function (e) {
        if ($("#GD_N_ESTAB_LOCAL_TELEF1").val().trim() == "") {
            $(".validaTELEFONE").slideDown("fast");
        }
        else {
            $(".validaTELEFONE").hide();
        }
    });
    $("#GD_N_ESTAB_LOCAL_LOGRAD").change(function (e) {
        if ($("#GD_N_ESTAB_LOCAL_LOGRAD").val().trim() == "") {
            $(".validaENDERECO").slideDown("fast");
        }
        else {
            $(".validaENDERECO").hide();
        }
    });
    $("#GD_N_ESTAB_LOCAL_NUMERO").change(function (e) {
        if ($("#GD_N_ESTAB_LOCAL_NUMERO").val().trim() == "") {
            $(".validaNUMERO").slideDown("fast");
        }
        else {
            $(".validaNUMERO").hide();
        }
    });
    $("#GD_N_ESTAB_LOCAL_BAIRRO").change(function (e) {
        if ($("#GD_N_ESTAB_LOCAL_BAIRRO").val().trim() == "") {
            $(".validaBAIRRO").slideDown("fast");
        }
        else {
            $(".validaBAIRRO").hide();
        }
    });
    $("#GD_N_ESTAB_LOCAL_CIDADE").change(function (e) {
        if ($("#GD_N_ESTAB_LOCAL_CIDADE").val().trim() == "") {
            $(".validaCIDADE").slideDown("fast");
        }
        else {
            $(".validaCIDADE").hide();
        }
    });
    $("#GD_N_ESTAB_LOCAL_UF").change(function (e) {
        if ($("#GD_N_ESTAB_LOCAL_UF").val().trim() == "") {
            $(".validaUF").slideDown("fast");
        }
        else {
            $(".validaUF").hide();
        }
    });

}

//EDITAR FARMACIA
function EditarFarmacia(ESTABID) {

    var sbValidacao = true;

  

    $(".validaRAZAOSOCIAL").hide();
    $(".validaNOMEFANTASIA").hide();

    
    //VALIDA OS CAMPOS
    if ($("#GD_N_ESTAB_RAZAOSOCIAL").val().trim() == "") {
        $(".validaRAZAOSOCIAL").slideDown("fast");
        sbValidacao = false;
    }
    if ($("#GD_N_ESTAB_NOMEFANTASIA").val().trim() == "") {
        $(".validaNOMEFANTASIA").slideDown("fast");
        sbValidacao = false;
    }

    
    if ($("#GD_N_ESTAB_LOCAL_DDD").val().trim() == "") {
        $(".validaDDD").slideDown("fast");
        sbValidacao = false;
    }
    if ($("#GD_N_ESTAB_LOCAL_TELEF1").val().trim() == "") {
        $(".validaTELEFONE").slideDown("fast");
        sbValidacao = false;
    }
    if ($("#GD_N_ESTAB_LOCAL_LOGRAD").val().trim() == "") {
        $(".validaENDERECO").slideDown("fast");
        sbValidacao = false;
    }
    if ($("#GD_N_ESTAB_LOCAL_NUMERO").val().trim() == "") {
        $(".validaNUMERO").slideDown("fast");
        sbValidacao = false;
    } 
    if ($("#GD_N_ESTAB_LOCAL_BAIRRO").val().trim() == "") {
        $(".validaBAIRRO").slideDown("fast");
        sbValidacao = false;
    }
    if ($("#GD_N_ESTAB_LOCAL_CIDADE").val().trim() == "") {
        $(".validaCIDADE").slideDown("fast");
        sbValidacao = false;
    }
    if ($("#GD_N_ESTAB_LOCAL_UF").val().trim() == "") {
        $(".validaUF").slideDown("fast");
        sbValidacao = false;
    }



    if (sbValidacao != true) {
        return;
    }
    


     
    //$("#loading-save").show();


    //alert($("#GD_N_ESTAB_LOCAL_UF").val());

     
    //data: JSON.stringify({
    //    ESTABID: ESTABID,
    //    EQZNOVO: vareqznovo
    //}),

    $(".loading-save").show();

    alert("Confirma a edição do cliente?", "Editar cliente", null , function () {


        //public int ESTAB_ID { get; set; }
        //public string RAZAOSOCIAL { get; set; } //GD_N_ESTAB. RAZAOSOCIAL
        //public string INSCRICAO { get; set; } //GD_N_ESTAB.INSCRICAO Inscrição Estadual
        //public string NOMEFANTASIA { get; set; } //GD_N_ESTAB Nome Fantasia
        //public string HOMEPAGE { get; set; } //GD_N_ESTAB     Site
        //public string DDD { get; set; } //GD_N_ESTAB_LOCAL.DDD  
        //public string TELEF1 { get; set; } //GD_N_ESTAB_LOCAL.TELEF1  Telefone
        //public string RAMAL1 { get; set; } //GD_N_ESTAB_LOCAL.RAMAL1   Ramal
        //public string FAX { get; set; } //GD_N_ESTAB_LOCAL.FAX  FAX
        //public string EMAIL { get; set; } //GD_N_ESTAB.EMAIL
        //public string CEP { get; set; } // GD_N_ESTAB_LOCAL.CEP 
        //public string ENDERECO { get; set; } //GD_N_ESTAB_LOCAL.LOGRAD 
        //public string NUMERO { get; set; } //GD_N_ESTAB_LOCAL.NUMERO Número
        //public string COMPL { get; set; } //GD_N_ESTAB_LOCAL.COMPL Complemento
        //public string BAIRRO { get; set; } //GD_N_ESTAB_LOCAL.bairro
        //public string CIDADE { get; set; } //GD_N_ESTAB_LOCAL.CIDADE
        //public string UF { get; set; } //GD_N_ESTAB_LOCAL.UF
        var sendData = {};

        sendData.ESTAB_ID = $("#GD_N_ESTAB_ESTAB_ID").val();
        sendData.LOCAL_ID = $("#GD_N_ESTAB_LOCAL_LOCAL_ID").val();
        sendData.RAZAOSOCIAL = $("#GD_N_ESTAB_RAZAOSOCIAL").val();
        sendData.INSCRICAO = $("#GD_N_ESTAB_INSCRICAO").val();
        sendData.NOMEFANTASIA = $("#GD_N_ESTAB_NOMEFANTASIA").val();
        sendData.HOMEPAGE = $("#GD_N_ESTAB_HOMEPAGE").val();
        
        sendData.DDD = $("#GD_N_ESTAB_LOCAL_DDD").val();
        sendData.TELEF1 = $("#GD_N_ESTAB_LOCAL_TELEF1").val();
        sendData.RAMAL1 = $("#GD_N_ESTAB_LOCAL_RAMAL1").val();
        sendData.FAX = $("#GD_N_ESTAB_LOCAL_FAX").val();
        sendData.EMAIL = $("#GD_N_ESTAB_EMAIL").val();
        sendData.CEP = $("#GD_N_ESTAB_LOCAL_CEP").val();
        sendData.LOGRAD = $("#GD_N_ESTAB_LOCAL_LOGRAD").val();
        sendData.NUMERO = $("#GD_N_ESTAB_LOCAL_NUMERO").val();
        sendData.COMPL = $("#GD_N_ESTAB_LOCAL_COMPL").val();
        sendData.BAIRRO = $("#GD_N_ESTAB_LOCAL_BAIRRO").val();
        sendData.CIDADE = $("#GD_N_ESTAB_LOCAL_CIDADE").val();
        sendData.UF = $("#GD_N_ESTAB_LOCAL_UF").val();
        

        $.ajax({
            type: "POST",
            url: controller + "Edit",
            contentType: 'application/json',
            data: JSON.stringify(sendData),
            traditional: true,
            success: function (response) {
                if (response.ok) {
                    //alert("O pedido " + numeropedido + " foi cancelado com sucesso");

                    alert("Dados salvos com sucesso");

                    //chama o click do botão para recarregar a lista
                    $('#btnPesquisar').click();

                    //fecha a janela
                    $('.modalEditar').dialog("close").dialog("destroy").remove();

                    $(".loading-save").hide();
                } else {
                    $(".loading-save").hide();
                    alert("Ocorreu um erro ao tentar salvar os dados do cliente: " + response.message);
                }
            }
        });




    }, function () { $(".loading-save").hide(); });


}


//#####################################
//  EDIT
//#####################################  



//#####################################
//CARREGAR TELA DE TRANSFERIR FARMACIA
//#####################################  
function GetTelaTransferirFarmacia(ESTABID) { //GetTelaCancelarPedido

    
    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();



    $.ajax({
        type: "POST",
        url: controller + "CarregaDadosTelaTransferirFarmacia",
        contentType: "application/json",
        data: JSON.stringify({ estabid: ESTABID }),
        success: function (data) {

            var buttonsModal3 = [];

            $(".modaltransferir").dialog("close").dialog("destroy").remove();

            //cria o botão transferir
            buttonsModal3.push(
                //BOTAO TRANSFERIR
                {
                    text: "OK",
                    "class": "mws-button blue",
                    click: function () {
                        //alert('transferir');
                        TransferirFarmacia(ESTABID);
                    }
                }
                ,
                //BOTAO FECHAR
                {
                    text: "Fechar",
                    "class": "mws-button gray",
                    click: function () {
                        //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                        $('.ui-widget-overlay').css('z-index', 102);

                        //chama o fechar da própria janela DIALOGmodal3
                        $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();
                        $(".modaltransferir").dialog("close").dialog("destroy").remove();

                    }
                }
            );


            $(".loading-save").hide();
            $(data).dialog({
                dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
                resizable: false,
                draggable: true,
                title: "Transferência de cliente",
                width: 820,
                height: 600,
                modal: true,
                buttons: buttonsModal3,
                open: function () {

                    //para a janela ficar a frente da outra
                    $('.ui-widget-overlay').css('z-index', 105);

                    $('.DIALOGmodal3').css('z-index', 106);
                    $('.DIALOGmodal3').css('top', 150);

                    //seta o top da página
                    $('body').scrollTop(0);


                    $("#NOVOEQZ").chosen();


                },
                close: function () {
                    $('.modaltransferir').dialog("close").dialog("destroy").remove();
                    $('.ui-widget-overlay').css('z-index', 102);
                }

            });

            
        },
        error: function (data) {
            $(".loading-save").hide();
            alert("Houve um erro ao obter dados do cliente.");
        }
    });






    //currentAjaxRequest3 = $.post("Farmacia/CarregaDadosTelaTransferirFarmacia", {
    //    estabid: estabid
    //}, function (data3) {
    //    var buttonsModal3 = [];

    //    $(".modaltransferir").dialog("close").dialog("destroy").remove();
        
    //    //cria o botão transferir
    //    buttonsModal3.push(
    //        //BOTAO TRANSFERIR
    //        {
    //            text: "OK",
    //            "class": "mws-button blue",
    //            click: function () {
    //                alert ('transferir');
    //                //TransferirFarmacia(numeropedido);
    //            }
    //        }
    //        ,
    //        //BOTAO FECHAR
    //        {
    //            text: "Fechar",
    //            "class": "mws-button gray",
    //            click: function () {
    //                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
    //                $('.ui-widget-overlay').css('z-index', 102);

    //                //chama o fechar da própria janela DIALOGmodal3
    //                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();
    //                $(".modaltransferir").dialog("close").dialog("destroy").remove();

    //            }
    //        }
    //    );

        


    //    $(".loading-save").hide();
    //    $(data3).dialog({
    //        dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
    //        resizable: false,
    //        draggable: true,
    //        title: "Transferência de Farmacia",
    //        width: "820px",
    //        modal: true,
    //        buttons: buttonsModal3,
    //        open: function () {
    //            //para a janela ficar a frente da outra
    //            $('.ui-widget-overlay').css('z-index', 105);

    //            $('.DIALOGmodal3').css('z-index', 106);
    //            $('.DIALOGmodal3').css('top', 150);

    //            //seta o top da página
    //            $('body').scrollTop(0);

    //        },
    //        close: function () {
    //            $('.modaltransferir').dialog("close").dialog("destroy").remove();
    //            $('.ui-widget-overlay').css('z-index', 102);
    //        }

    //    });

    //});


};
//




//TRANSFERENCIA
function TransferirFarmacia(ESTABID) {


    //###############################################
    //          VERIFICAÇÃO DE JUSTIFICATIVA
    //###############################################
    var ssmsg = "";
    //if ($('#CBOREPRESENTANTES').val() != "") {
    if ($("#NOVOEQZ").val() == "" || $("#NOVOEQZ").val() == "null" || $("#NOVOEQZ").val() == null) {
        ssmsg = "É necessário selecionar o novo Eqz.";
        alert(ssmsg);
        return;
    }

    var vareqznovo = $("#NOVOEQZ").val();
    //var varCNPJ = $("#hiddenCNPJ").val();
    //var vareqzantigo = $("#hiddenEQZANTIGO").val();
    //var varCIA = $("#hiddenCIA").val();
    //var varEQUIPE = $("#hiddenEQUIPE").val();

    alert("Confirma a transferência do cliente?", "Transferência de cliente", null, function () {

        $.ajax({
            type: "POST",
            url: controller + "Transferir",
            contentType: 'application/json',
            data: JSON.stringify({
                ESTABID: ESTABID,
                EQZNOVO: vareqznovo
            }),

            success: function (response) {
                if (response.ok) {
                    //alert("O pedido " + numeropedido + " foi cancelado com sucesso");

                    alert("Farmacia transferida com sucesso");

                    //chama o click do botão para recarregar a lista
                    $('#btnPesquisar').click();

                    //fecha a janela
                    $('.modaltransferir').dialog("close").dialog("destroy").remove();


                } else {
                    if (response.erro) {
                        alert("Ocorreu um erro ao tentar transferir o cliente: " + response.message);
                    }
                    else {
                        alert(response.message); //apenas aviso
                    }
                }
            }
        });




    });


}












