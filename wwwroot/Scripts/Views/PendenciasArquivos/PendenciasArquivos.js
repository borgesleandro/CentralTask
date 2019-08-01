var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})()


$(document).ready(function () {

    $("select[multiple]").multiselect().multiselectfilter();
    $("select:not([multiple])").chosen();

    $("#tmRetornoAntesDe").mask("99:99");
    $("#tmEspelhoAntesDe").mask("99:99");

    var today = new Date();
    today.setHours(today.getHours() - 2);
    $("#tmRetornoAntesDe").val(zeroPad(today.getHours(), 2) + ":" + zeroPad(today.getMinutes(), 2));
    $("#tmEspelhoAntesDe").val("17:00");

    $("#ID_GRUPO_OL").on("change", function (evt) {

        if ($('#ID_GRUPO_OL').val() != null) {

            $.ajax({
                type: "POST",
                url: controller + "GetDistribuidores",
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ grupoId: $('#ID_GRUPO_OL').val() }),
                success: function (data) {

                    $("#CNPJ_DIST").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Todos");
                    $("#CNPJ_DIST").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CNPJ_DIST").append(option);
                    });
                    $("#CNPJ_DIST").trigger("liszt:updated");
                },
                error: function (data) {
                    alert("Houve um erro ao obter a lista de distribuidores.");
                }
            });
        }
        else {
            //$("#CNPJ_DIST").multiselect("uncheckAll");
            //$("#CNPJ_DIST").multiselect("disable");
        }
    });

    $("#btnPesquisar").on("click", function () {

        $(".loading-save").show();


        $("#exportarLinkDiv").html("");

        if (!$("#chkRetornoAntesDe").attr("checked") && !$("#chkEspelhoAntesDe").attr("checked")) {
            alert("Você precisa marcar pelo menos um tipo (RETORNO ou ESPELHO) para exibição!");
            $(".loading-save").hide();
            return;
        }


        //valida campo hora
        var matchhora = new RegExp(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/gi);
        var campo = $("#chkRetornoAntesDe").attr("checked") ? $("#tmRetornoAntesDe").val() : $("#tmEspelhoAntesDe").val()
        if (!campo.match(matchhora)) {
            alert('Hora inválida');
            $(".loading-save").hide();
            return;
        }
        ///fim

        
        

        

        var listaEquipes = [];

        $.each($("#EQUI_EQUIPE :selected"), function (i, selected) {
            listaEquipes.push($(selected).val());
        })

        var outrosDistribuidores = [];
        $("#CNPJ_DIST option").each(function () {
            if ($(this).val() != "")
                outrosDistribuidores.push("'" + $(this).val() + "'");
        })


        


        var model = {

            chkRetorno:$("#chkRetornoAntesDe").attr("checked") ? true :false,
            chkEspelho:$("#chkEspelhoAntesDe").attr("checked") ? true :false,
            DataRetornoAntesDe: $("#chkRetornoAntesDe").attr("checked") ? $("#dtRetornoAntesDe").val() : null,
            HoraRetornoAntesDe: $("#chkRetornoAntesDe").attr("checked") ? $("#tmRetornoAntesDe").val() : null,
            DataEspelhoAntesDe: $("#chkEspelhoAntesDe").attr("checked") ? $("#dtEspelhoAntesDe").val() : null,
            HoraEspelhoAntesDe: $("#chkEspelhoAntesDe").attr("checked") ? $("#tmEspelhoAntesDe").val() : null,
            DistribuidorSelecionado: ("'" + $("#CNPJ_DIST").val() + "'"),
            Grupo: $("#ID_GRUPO_OL").val() == "" ? null : $("#ID_GRUPO_OL").val(),
            OutrosDistribuidores: outrosDistribuidores,
            ListaEquipes: listaEquipes
          
        };

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "PendenciasArquivos/Pesquisar",
            async: true,
            data: JSON.stringify(model),
            success: function (response) {

                if (response.success == false) {
                    $(".loading-save").hide();
                    alert(response.data);
                    
                }
                else {


                    //Tabela
                    $("#consulta").html(response);

                    $("#pendencias").dataTable({
                        "sPaginationType": "full_numbers",
                        "bAutoWidth": true,
                        "bProcessing": true,
                        "bServerSide": false,
                        "bSort": false,
                        "sScrollX": "100%",
                        "oLanguage": {
                            "sZeroRecords": "Nenhum dado encontrado."
                        }
                        ,"fnInitComplete":  function () {
                            $(".loading-save").hide();
                        }
                        //, "fnDrawCallback": function (oSettings) {
                        //    oSettings.aoColumns[0].nTh.style.minWidth = "90px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);                         
                        //    //oSettings.aoColumns[0].minWidth = "90px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);                         
                        //}
                    });
                    var csvContent = "data:text/csv;charset=utf-8,\uFEFF";
                }
            },
            error: function (response) {
                alert('Erro ao realizar pesquisa ' + response);
                $(".loading-save").hide();
            }
        });

    });

    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        if (!$("#chkRetornoAntesDe").attr("checked") && !$("#chkEspelhoAntesDe").attr("checked")) {
            alert("Você precisa marcar pelo menos um tipo (RETORNO ou ESPELHO) para exibição!");
            return;
        }




        $(".loading-save").show();

        var listaEquipes = [];

        $.each($("#EQUI_EQUIPE :selected"), function (i, selected) {
            listaEquipes.push($(selected).val());
        })

        var outrosDistribuidores = [];
        $("#CNPJ_DIST option").each(function () {
            if ($(this).val() != "")
                outrosDistribuidores.push("'" + $(this).val() + "'");
        })




        var model = {


            //CARLOS 03/06/2015 POIS NÃO TRAZIA OS DADOS
            chkRetorno: $("#chkRetornoAntesDe").attr("checked") ? true : false,
            chkEspelho: $("#chkEspelhoAntesDe").attr("checked") ? true : false,
            Grupo: $("#ID_GRUPO_OL").val() == "" ? null : $("#ID_GRUPO_OL").val(),

            DataRetornoAntesDe: $("#chkRetornoAntesDe").attr("checked") ? $("#dtRetornoAntesDe").val() : null,
            HoraRetornoAntesDe: $("#chkRetornoAntesDe").attr("checked") ? $("#tmRetornoAntesDe").val() : null,
            DataEspelhoAntesDe: $("#chkEspelhoAntesDe").attr("checked") ? $("#dtEspelhoAntesDe").val() : null,
            HoraEspelhoAntesDe: $("#chkEspelhoAntesDe").attr("checked") ? $("#tmEspelhoAntesDe").val() : null,
            DistribuidorSelecionado: ("'" + $("#CNPJ_DIST").val() + "'"),
            OutrosDistribuidores: outrosDistribuidores,
            ListaEquipes: listaEquipes,
            Exportar: true

        };

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "PendenciasArquivos/Pesquisar",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff",response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='PendenciasArquivos.xls' class=''><img src='Content/botao-salvar-download.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });
    });
})




function GetCriticasEDI(numeropedido) {
    //var modalButtons = [];
    //modalButtons.push(
    ////CRIA BOTÃO FECHAR
    //{
    //    text: "Fechar",
    //    "class": "mws-button gray",
    //    click: function () {
    //        //$(".loading-save").show();
    //        //CopiarPedido(numeropedido);
    //        $('.modalcriticas .ui-dialog-titlebar-close').click();
    //    }
    //}
    //)
     
    //xhr = $.ajax({
    //    type: 'POST',
    //    contentType: 'application/json',
    //    //url: "PendenciasArquivos/GetCriticasEDI",
    //    url: controllerPedidoConsultaGetCriticas , 
    //    async: false,
    //    data: JSON.stringify({ seqpedido: seqpedido }),
    //    success: function (response) {
    //        $(response).dialog({
    //            dialogClass: "modalcriticas", 
    //            resizable: false,
    //            height: 600,
    //            width: 770,
    //            modal: true,
    //            title: "Críticas de retorno e espelho",
    //            draggable: true,
    //            buttons: modalButtons
    //            ,open: function () {
                    
    //                //07/04/2015
    //                $('.modalcriticas').css('top', 150);
    //                //07/04/2015
    //                ////seta o top da página
    //                //$('body').scrollTop(0);
    //            }
    //        });
    //    },
    //    error: function (response) {
    //        alert(response);
    //    }
    //})
     
    

    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();

    currentAjaxRequest3 = $.post(controllerPedidoConsultaGetCriticas, {
        numeropedido: numeropedido
    }, function (data3) {
        var buttonsModal3 = [];

        ////apaga a janela modal
        $(".modal3").dialog("destroy").remove();


        //cria o botão cancelar
        buttonsModal3.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                $('.ui-widget-overlay').css('z-index', 102);
                
                //chama o fechar da própria janela DIALOGmodal3
                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();

            }
        });


        $(".loading-save").hide();
        $(data3).dialog({
            dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
            resizable: false,
            draggable: true,
            title: "Críticas de retorno e espelho",
            width: "1220px",
            modal: true,
            buttons: buttonsModal3,
            open: function () {
                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOGmodal3').css('z-index', 106);
 
                $(".modal3 .mws-table").dataTable({
                    aSorting: [1, "asc"],
                    sPaginationType: "full_numbers",
                    "bPaginate": true,
                    "bAutoWidth": true,
                    "bProcessing": true,
                    "bServerSide": false,
                    "bSort": false,
                    "sScrollX": "100%",
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados",
                        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        sInfoFiltered: "(Total de _MAX_ registros)"
                    }

                });





            },
            close: function () {
                $('.ui-widget-overlay').css('z-index', 102);
            }

        });

    });


};

function MotivoNaoAtendimento(cnpjoperlog , cnpjoperlog2 ,  data , datapedido , numero , setor , CNPJfarmacia , status , origem , coddiv) {

    //'@pendencia.CNPJ_OL', '@pendencia.CNPJ_OL2', '@string.Format("{2}/{1}/{0}", pendencia.PEDIDO.ToString().Substring(0, 4), pendencia.PEDIDO.ToString().Substring(4, 2), pendencia.PEDIDO.ToString().Substring(6, 2))',
    //'@pendencia.PEDIDO', '@pendencia.SEQPEDIDO', '@pendencia.SETOR', '@pendencia.FARMACIA', '@pendencia.STATUS_PEDIDO', '@pendencia.ORIGEM', '@pendencia.CODDIV'

    ////VERIFICA SE JÁ ESTA CANCELADO
    //if ($("#HDSTATUS").val() != "7") {
    //    ssmsg = "Pedido não pode ser reenviado.";
    //    alert(ssmsg);
    //    return;
    //}


    
    $(".loading-save").show();


    var modalButtons = [];
    modalButtons.push(
    {
        text: "   OK   ",
        "class": "mws-button blue",
        click: function () {
            if ($("#CBOMOTIVO").val() == "") {
                alert('Selecione o motivo do não atendimento!');
            }
            else {

                //MotivoNaoAtendimento(int numeropedido, int datapedido, string cnpjfarmacia, string status, string cnpj_ol2, string strCodDiv, string origem, string motivo)
                xhr = $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: controller + "RegistrarMotivoNaoAtendimento",
                    async: false,
                    data: JSON.stringify({ numeropedido: numero, datapedido: datapedido, cnpjfarmacia: CNPJfarmacia, status: status, cnpj_ol1: cnpjoperlog, cnpj_ol2: cnpjoperlog2, strCodDiv: coddiv, origem: origem, motivo: $("#CBOMOTIVO").val() }),
                    success: function (response) {
                        if (response.ok) {
                            $(".loading-save").hide();

                            alert("Motivo registrado com sucesso");

                            //chama o click do botão para recarregar a lista
                            $('#btnPesquisar').click();

                            //fecha a tela de detalhe de pedido
                            $('.modalmotivos .ui-dialog-titlebar-close').click();

                        } else {
                            $(".loading-save").hide();
                            alert("Ocorreu um erro ao tentar registrar o Motivo : " + response.message);
                        }
                    },
                    error: function (response) {
                        alert(response);
                        $(".loading-save").hide();                        
                    }
                })
            }
        }
    }
    )

    modalButtons.push(
    //CRIA BOTÃO Fechar
    {
        text: "Fechar",
        "class": "mws-button gray",
        click: function () {
            $('.modalmotivos .ui-dialog-titlebar-close').click();
        }
    }
    )

    


    
    //apaga a janela antes de abrir para evitar problema no cboMotivo CHOSEN na segunda vez que ela é aberta
    $('.modalmotivos').find("form").remove();
    $('.modalmotivos').dialog('destroy');

     
    xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: controller + "MotivoNaoAtendimento",
        async: false,
        data: JSON.stringify({ cnpjoperlog: cnpjoperlog, data: data, numero: numero, setor: setor, farmacia: CNPJfarmacia }),
        success: function (response) {
            $(response).dialog({
                dialogClass: "modalmotivos",
                resizable: false,
                height: 600,
                width: 970,
                modal: true,
                title: "Motivos de não atendimento",
                draggable: true,
                buttons: modalButtons
                , open: function () {

                    $("#CBOMOTIVO").trigger("chosen:updated");
                    
                    $("#CBOMOTIVO").chosen();
                    $('.modalmotivos').css('top', 150);

                    $(".loading-save").hide();
                }
            });
        },
        error: function (response) {
            $(".loading-save").hide();
            alert(response);
        }
    })





};


//REENVIAR DO PEDIDO
function ReenviarPedido(numeropedido) {

    var modalButtons = [];
    modalButtons.push(
        //CRIA BOTÃO REENVIAR PEDIDO
        {
            text: "Sim",
            "class": "mws-button green",
            click: function () {

                $(".loading-save").show();
                
                //
                $.ajax({
                    type: "POST",
                    url: controllerPedidoConsultaREENVIARPEDIDO,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        numeropedido: numeropedido
                    }),
                    success: function (response) {
                        if (response.ok) {
                            $(".loading-save").hide();
                            
                            alert("O pedido " + numeropedido + " foi reenviado com sucesso");

                            //chama o click do botão para recarregar a lista
                            $('#btnPesquisar').click();

                            //fecha a tela de detalhe de pedido
                            $('.DIALOGmodal .ui-dialog-titlebar-close').click();
                        } else {
                            $(".loading-save").hide();
                            alert("Ocorreu um erro ao tentar reenviar o pedido: " + response.message);
                        }
                    }
                    , error: function () {
                        $(".loading-save").hide();
                        alert('Erro ao reenviar');
                    }
                });
            }
        }
    );
     
    modalButtons.push(
           {
               text: "Não",
               "class": "mws-button red",
               click: function () {
                   //chama o fechar da própria janela modal2
                   $('.DIALOGmodal .ui-dialog-titlebar-close').click();
               }
           }
       );

     

    //solicita confirmação 
    $("#dialog-confirm").html('<br>Confirma o reenvio do pedido para faturamento?');
    $("#dialog-confirm").css('text-align', 'center');
    $("#dialog-confirm").dialog({
        dialogClass: "DIALOGmodal",
        resizable: false,
        modal: true,
        draggable: true,
        width: 350,
        height: 210,
        position: ['center', 'center'],
        buttons: modalButtons,
        open: function () {
            $('.DIALOGmodal').css('top', 150);
        },
        close: function () {
            $(".loading-save").hide();
            return false;
        }
    });

    
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}
