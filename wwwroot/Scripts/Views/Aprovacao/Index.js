$(document).ready(function () {
    var currentAjaxRequest = null;
    var currentAjaxRequest2 = null;
    var tr = null;



    //DETALHE DO PEDIDO
    $(document).on("click",".AlterarEmailCliente" , function () {

        //para ficar a frente da janela de detalhes do pedido
        $('.ui-widget-overlay').css('z-index', 999);
        
        var buttonsModal2 = [];

        //apaga a janela modal
        $(".modalemailcliente").dialog("destroy").remove();
        
        //cria o botão cancelar
        buttonsModal2.push({
            text: "Salvar",
            "class": "mws-button blue",
            click: function () {
                if (Salvaremailcliente("aaaa") == true) {
                    $('.ui-widget-overlay').css('z-index', 102);
                    //////chama o fechar da própria janela DIALOGmodal3
                    $('.DIALOemailcliente .ui-dialog-titlebar-close').click();
                }
            }
        });
        
        
        //cria o botão cancelar
        buttonsModal2.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                $('.ui-widget-overlay').css('z-index', 102);
                //////chama o fechar da própria janela DIALOGmodal3
                $('.DIALOemailcliente .ui-dialog-titlebar-close').click();
            }
        });
        
        var data2 = '<div  class="modalemailcliente" style="margin-left:10px;margin-right:10px;"><label>Novo email</label><textarea class="mws-textinput mws-form-item grid_8 NOVOEMAILCLIENTE" style="margin-left:0px;" cols= "20" id= "NOVOEMAILCLIENTE" maxlength= "200" name= "NOVOEMAILCLIENTE" rows= "3"></textarea ><div>';
            
        $(data2).dialog({
            resizable: false,
            draggable: true,
            dialogClass: "DIALOemailcliente", //classe para identificar a janela que esta sendo aberta
            title: "Alterar email cliente",
            width: "420px",
            modal: true,
            buttons: buttonsModal2,
            open: function () {
                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOemailcliente').css('z-index', 106);
                
                $('.NOVOEMAILCLIENTE').val($('.EMAILCLIENTE').val());
            },
            close: function () {
                $('.ui-widget-overlay').css('z-index', 102);
            }
        });





    });


    //##################################
    //DETALHE DO PEDIDO
    //##################################  pedidoorigemsaldonegativo
    $(".pedidoorigemsaldonegativo").live("click", function () {

        $(".loading-save").show();
        
        var numeropedidooriginal = $("#numeropedidoorigem").val();

        if (currentAjaxRequest2 != null) currentAjaxRequest2.abort();

        currentAjaxRequest2 = $.post(controller + "getDetailModal2", { pedidooriginal: numeropedidooriginal }, function (data2) {
            var buttonsModal2 = [];

            //apaga a janela modal
            $(".modal2").dialog("destroy").remove();

            //cria o botão cancelar
            buttonsModal2.push({
                text: "Fechar",
                "class": "mws-button gray",
                click: function () {
                    $(this).dialog("destroy").remove();
                }
            });

            $(".loading-save").hide();
            $(data2).dialog({
                resizable: false,
                draggable: false,
                title: "Pedido original" , // "Número do pedido: " + numeropedidooriginal,
                width: "820px",
                modal: true,
                buttons: buttonsModal2,
                open: function () {

                    //para a janela ficar a frente da outra
                    $('.ui-dialog').css('z-index', 103);
                    $('.ui-widget-overlay').css('z-index', 102);

                    $(".modal2 .mws-datatable-fn").dataTable({
                        aSorting: [2, "asc"],
                        sPaginationType: "full_numbers",
                        aoColumnDefs: [{ "bSearchable": true, "bSortable": true, "aTargets": ["dataTable-commands"] },
                                       { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
                        oLanguage:
                        {
                            sZeroRecords: "Não foram encontrados resultados",
                            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                            sInfoFiltered: "(Total de _MAX_ registros)"
                        },
                        aoColumns: [
                              { "mDataProp": "prod", "sWidth": "12%" },
                              { "mDataProp": "descprod", "sWidth": "42%" },
                              { "mDataProp": "qtd ped", "sWidth": "8%" },
                              { "mDataProp": "qtd fat", "sWidth": "8%" },
                              { "mDataProp": "ccSol", "sWidth": "15%" },
                              { "mDataProp": "ccFat", "sWidth": "15%" },
                            ]
                    });

                    $(".modal2 .dataTables_wrapper .dataTables_filter").hide();
                    $(".modal2 .dataTables_wrapper .dataTables_length").hide();
                }
            });
        });
    });

    //DETALHE DO PEDIDO
    $(".aprovacaoRow").live("click", function () {
        $(".loading-save").show();
        tr = $(this).parents("tr:first");
        var itemID = $("#itemID", tr).val();
        var tipoAprovacao = $("#tipoItemID", tr).val();
        var eqz = $("#itemEqz", tr).val();
        var referencia = $("#referencia", tr).val();
        var numeropedido = $(".numeropedido", tr).html();
        var UsuDeveriaAprovar = $("#UsuDeveriaAprovar", tr).val();

        var flgAPROVACAO_CC_GER = $("#FLG_APROVACAO_CC_GER", tr).val(); 

        
        if (currentAjaxRequest != null) currentAjaxRequest.abort();

        currentAjaxRequest = $.post(controller + "getDetailModal", { id: itemID, tipoItem: tipoAprovacao, eqz: eqz, FLG_APROVACAO_CC_GER: flgAPROVACAO_CC_GER }, function (data) {
            var buttonsModal = [];

            $(".modal").dialog("destroy").remove();

            buttonsModal.push({
                text: tipoAprovacao == 2 ? "Aderir" : "Aprovar",
                click: function () {
                    sMsg = ""

                    //DIA 20/06/2018 -- OS 12646
                    ////Se preencher justificativa na aprovação, só avisar que o texto será ignorado
                    //if ($("#JUSTIFICATIVA").val() != "" && $("#JUSTIFICATIVA").val() != "null" && $("#JUSTIFICATIVA").val() != null) {
                    //    //alert("Atenção!<br /> A justificativa deve ser informada apenas em caso de reprovação do pedido.O texto digitado será ignorado.");
                    //    sMsg = "A justificativa deve ser informada apenas em caso de reprovação do pedido.O texto digitado será ignorado.<br /><br />";
                    //}


                    ////VALIDA EMAIL DO CLIENTE CASO ALTERADO
                    var emailCliente = "";
                    //if ($('#ALTEROUEMAILCLIENTE', ".modal").val() == "S") {
                    //    var erro = ValidaEmail($("#EMAILCLIENTE").val().trim());
                    //    if (erro != "") {
                    //        alert(erro);
                    //        return false;
                    //    }
                    //    emailCliente = $('#EMAILCLIENTE', ".modal").val();
                    //}


                    sMsg += "Deseja aprovar este pedido?"
                    alert(sMsg, "Confirmação de Aprovação", null, function () {
                        var id = $("#ID", ".modal").val();
                        var tipo = $("#TIPO", ".modal").val();
                        var eqzModal = $("#EQZMODAL", ".modal").val();
                        var justificativa = $('#JUSTIFICATIVA', ".modal").val();


                        if (currentAjaxRequest != null) currentAjaxRequest.abort();

                        currentAjaxRequest = $.post(controller + "approveItem", { idItem: id, tipoItem: tipo, Justificativa: justificativa, emailCliente: emailCliente,  eqz: eqzModal, UsuDeveriaAprovar: UsuDeveriaAprovar }, function (result) {
                            if (result) {
                                alert(result);
                                $(".modal").dialog("destroy").remove();
                                $(".dataTable").dataTable().fnDeleteRow(tr[0]);
                            }
                        });
                    });
                }
            });

            buttonsModal.push({
                text: tipoAprovacao == 2 ? "Não Aderir" : "Reprovar",
                "class": "mws-button red",
                click: function () {

                    //obrigar o preenchimento da justificativa com mais de 5 caracteres em caso de reprovação
                    var ssmsg = ""
                    if ($("#JUSTIFICATIVA").val().trim() == "" || $("#JUSTIFICATIVA").val() == "null" || $("#JUSTIFICATIVA").val() == null)
                    {
                        alert("Atenção!<br />A justificativa para a reprovação é obrigatória.");
                        return false;
                    }
                    else
                    {
                        if ($('#JUSTIFICATIVA').val().trim().length < 5)
                        {
                            alert("Atenção!<br />Não são aceitas justificativas com menos de 5 caracteres.");
                            return false;
                        }
                    }

                    alert("Deseja reprovar este pedido?" + ssmsg, "Confirmação de reprovação", null, function () {
                        var id = $("#ID", ".modal").val();
                        var tipo = $("#TIPO", ".modal").val();
                        var eqzModal = $("#EQZMODAL", ".modal").val();
                        var justificativa = $('#JUSTIFICATIVA', ".modal").val();

                        if (currentAjaxRequest != null) currentAjaxRequest.abort();

                        currentAjaxRequest = $.post(controller + "approveItem", { idItem: id, tipoItem: tipo, Justificativa: justificativa,  eqz: eqzModal, UsuDeveriaAprovar: UsuDeveriaAprovar, approve: false }, function (result) {
                            if (result) {
                                alert(result);
                                $(".modal").dialog("destroy").remove();
                                $(".dataTable").dataTable().fnDeleteRow(tr[0]);
                            }
                        });
                    });
                }
            });

            buttonsModal.push({
                text: "Cancelar",
                "class": "mws-button gray",
                click: function () {
                    $(this).dialog("destroy").remove();
                }
            });
            
            $(".loading-save").hide();
            $(data).dialog({
                resizable: true,
                draggable: true,
                title: "Número do pedido: " + numeropedido,
                width: "1295px",
                modal: true,
                buttons: buttonsModal,
                open: function () {

                    //STARTA O TOOLTIP DO MODAL
                    if ($.fn.tipsy) {
                        var gravity = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
                        for (var i in gravity)
                            $(".mws-tooltip-" + gravity[i]).tipsy({ gravity: gravity[i] });
                        //$('.DIALOGdetmodal input[title], select[title], textarea[title]').tipsy({ trigger: 'focus', gravity: 'w' });
                    }

                    //para a janela ficar a frente da outra
                    $('.ui-dialog').css('z-index', 103);
                    $('.ui-widget-overlay').css('z-index', 102);

                    $(".modal .produtostable").dataTable({
                        aaSorting: [[1, "asc"]],
                        //aaSorting: [[$(".data-sort-asc:first").length > 0 ? $(".data-sort-asc:first").index() : 0, "asc"]],
                        bSort: true,
                        sPaginationType: "full_numbers",
                        aoColumnDefs: [{ "bSearchable": true, "bSortable": true, "aTargets": ["dataTable-commands"] },
                                       { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
                        oLanguage:
                        {
                            sZeroRecords: "Não foram encontrados resultados",
                            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                            sInfoFiltered: "(Total de _MAX_ registros)"
                        }
                    });

                    $(".modal  .tableSemRodape").dataTable({
                        bSort: false,
                        bFilter: false,
                        sPaginationType: "full_numbers",
                        aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
                                       { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
                        oLanguage:
                        {
                            sZeroRecords: "Não foram encontrados resultados",
                            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                            sInfoFiltered: "(Total de _MAX_ registros)"
                        }
                    });

                    $("#id_aprovadores").dataTable({
                        "bPaginate": false,
                        "bFilter": false,
                        "bAutoWidth": true,
                        "bProcessing": false,
                        "bServerSide": false,
                        "bSort": false,
                        "bLanguage": false,
                        "bInfo": false
                    });

                    $(".modal .semRodape .dataTables_info").hide();
                    $(".modal .semRodape .dataTables_paginate").hide();
                    $('.ui-dialog-buttonpane').find('button:contains("Reprovar")').addClass('cancelButtonClass');
                }
            });
        }, "html");
    });

    $(".detalhes").on("click", function () {
        
    });
});






function Salvaremailcliente() {
    
    if ($("#NOVOEMAILCLIENTE").val() == "") {
        alert("Informe o novo email do cliente");
        return false;
    }
    var erro = ValidaEmail($("#NOVOEMAILCLIENTE").val().trim());
    if (erro != "") {
        alert(erro);
        return false;
    }

    var id = $("#ID", ".modal").val();
    
    alert("Confirma a alteração do email do cliente?", "Alterar email cliente", $('.ui-widget-overlay').css('z-index', 105)
        , function () {
            
            var auxAjaxRequest = $.post(controller + "ALTERAREMAILCLIENTE", { itemID: id, novoemail: $("#NOVOEMAILCLIENTE").val()  }, function (result) {
                if (result.ok) {
                    alert("O email do cliente foi alterado com sucesso");

                    $("#EMAILCLIENTE").val($("#NOVOEMAILCLIENTE").val());
                    $('.DIALOemailcliente .ui-dialog-titlebar-close').click();
                }
                else {
                    alert("Ocorreu um erro ao tentar alterar email do cliente" + response.message);
                }
            });
        });
}




function getDetailsModal(itemId, tipoId, eqz) {
    currentAjaxRequest = $.post(controller + "getDetailModal", { id: itemId, tipoItem: tipoId, eqz: eqz }, function (data) {
        var buttonsModal = [];

        $(".modal").dialog("destroy").remove();

        buttonsModal.push({
            text: "Cancelar",
            "class": "mws-button gray",
            click: function () {
                $(this).dialog("destroy").remove();
            }
        });

        $(".loading-save").hide();
        $(data).dialog({
            resizable: false,
            draggable: false,
            title: "Referência: " + itemId,
            width: "760px",
            modal: true,
            buttons: buttonsModal,
            open: function () {
                $(".modal .mws-datatable-fn").dataTable({
                    aSorting: [0, "asc"],
                    sPaginationType: "full_numbers",
                    aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
                                   { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados",
                        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        sInfoFiltered: "(Total de _MAX_ registros)"
                    }
                });
                $(".modal .dataTables_wrapper .dataTables_filter").hide();
                $(".modal .dataTables_wrapper .dataTables_length").hide();
                $('.ui-dialog-buttonpane').find('button:contains("Reprovar")').addClass('cancelButtonClass');
            }
        });
    }, "html");
}


function ValidaEmail(desc_email) {

    if (desc_email.length > 0) {
        if (desc_email.length > 255) {
            //alert('E-mail excede o tamanho máximo de 255 caracteres');
            //return false;
            return "E-mail excede o tamanho máximo de 255 caracteres";
        }
        else {
            //var emails = desc_email.split(/;/);
            var emails = desc_email.split(";");
            var pattern = new RegExp(/^[+a-za-z0-9._-]+@[a-za-z0-9.-]+\.[a-za-z]{2,4}$/i);
            for (var i = 0; i < emails.length; i++) {
                if (emails[i].trim() != "") {
                    if (pattern.test(emails[i].trim()) == false) {
                        //alert('e-mail ' + emails[i].trim() + ' inválido.');
                        //return false;
                        return "Email inválido";
                    }
                }
            }
        }
    }
    return "";
}
