$(document).ready(function () {
    

    
});

 




//##################################
//CARREGAR TELA DE CANCELAR PEDIDO
//##################################  
function GetTelaCancelarPedido(numeropedido) {

    //VERIFICA SE JÁ ESTA CANCELADO
    if ($("#HDSTATUS").val() == "6") {
        ssmsg = "Pedido já cancelado.";
        alert(ssmsg);
        $('.ui-widget-overlay').css('z-index', 102);
        return;
    }


    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();

    currentAjaxRequest3 = $.post(controllerGetTelaCANCELAPEDIDO, {
        numeropedido: numeropedido
    }, function (data3) {
        var buttonsModal3 = [];

        ////apaga a janela modal
        //$(".modal3").dialog("destroy").remove();

        $(".modalcancelar").dialog("close").dialog("destroy").remove();
        //$('.modalcancelar').dialog("close").dialog("destroy").remove();


        //cria o botão cancelar
        buttonsModal3.push(
            //BOTAO CANCELAR
            {
                text: "OK",
                "class": "mws-button blue",
                click: function () {
                    CancelarPedido(numeropedido);
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
                    //$(this).dialog("destroy").remove();

                    //$(data3).dialog.close();
                    //chama o fechar da própria janela DIALOGmodal3
                    $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();
                    $(".modalcancelar").dialog("close").dialog("destroy").remove();

                }
            }
        );


        $(".loading-save").hide();
        $(data3).dialog({
            dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
            resizable: false,
            draggable: true,
            title: "Críticas de retorno e espelho",
            width: "820px",
            modal: true,
            buttons: buttonsModal3,
            open: function () {
                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOGmodal3').css('z-index', 106);
                $('.DIALOGmodal3').css('top', 150);

                //seta o top da página
                $('body').scrollTop(0);


                ////#tbDetalhepesquisa
                //$(".modal3 .mws-table").dataTable({
                //    aSorting: [1, "asc"],
                //    sPaginationType: "full_numbers",
                //    "bPaginate": true,
                //    "bAutoWidth": true,
                //    "bProcessing": true,
                //    "bServerSide": false,
                //    "bSort": true,
                //    oLanguage:
                //    {
                //        sZeroRecords: "Não foram encontrados resultados",
                //        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                //        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                //        sInfoFiltered: "(Total de _MAX_ registros)"
                //    }
                //});

            },
            close: function () {
                $('.modalcancelar').dialog("close").dialog("destroy").remove();
                $('.ui-widget-overlay').css('z-index', 102);
            }

        });

    });


};
//LOG DO PEDIDO




//CANCELAMENTO
function CancelarPedido(numeropedido) {


    //###############################################
    //          VERIFICAÇÃO DE JUSTIFICATIVA
    //###############################################
    var ssmsg = "";
    if ($("#JUSTIFICATIVA").val() == "" || $("#JUSTIFICATIVA").val() == "null" || $("#JUSTIFICATIVA").val() == null) {
        ssmsg = "É necessário informar a justificativa.";
        alert(ssmsg);
        return;
    }

    var varJust = $("#JUSTIFICATIVA").val();
    
    if (varJust.length < 5) {
        
        ssmsg = "A justificativa de ter no mínimo 5 caracteres.";
        alert(ssmsg);
        return;
    }


    alert("Confirma o cancelamento do pedido?", "Cancelamento de pedido", null, function () {

        $.ajax({
            type: "POST",
            url: controllerCANCELAPEDIDO,
            contentType: 'application/json',
            data: JSON.stringify({
                numeropedido: numeropedido,
                justificativa: varJust
            }),
            success: function (response) {
                if (response.ok) {
                    //alert("Dados salvos com sucesso!");
                    alert("O pedido " + numeropedido + " foi cancelado com sucesso");

                    //chama o click do botão para recarregar a lista
                    $('#btnPesquisar').click();

                    //fecha a tela de detalhe de pedido
                    $('.modaldetalheped').dialog("close").dialog("destroy").remove();
                    //$('.DIALOGmodal3').dialog("destroy").remove();

                    //fecha a janela
                    //$('.DIALOGmodal3 .ui-dialog-titlebar-close').click();
                    $('.modalcancelar').dialog("close").dialog("destroy").remove();


                } else {
                    alert("Ocorreu um erro ao tentar cancelar o pedido: " + response.message);
                }
            }
        });




    });


}