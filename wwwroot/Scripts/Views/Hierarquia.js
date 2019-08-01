var otable;

var otableHierarquia = null;
$(document).ready(function () {
    var currentAjaxRequest = null;

    $("#CANAL_ID").live("change", function () {
        var canalID = $(this).val();
        if (canalID != "") {
            if (currentAjaxRequest != null) currentAjaxRequest.abort();

            currentAjaxRequest = $.post(controller + "getDetailModal", { canalID: canalID }, function (data) {
                $(".detailheHierarquia").html("").append(data);
                $(".salvarHierarquia").show();

                otableHierarquia.fnDestroy();

                otableHierarquia = $(".hierarquias").dataTable({
                    "bAutoWidth": false,
                    "bPaginate": false,
                    "bSort": false,
                    "bDestroy": true,
                    aoColumnDefs: [
                        { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
                    "fnInitComplete": function () {
                        this.fnAdjustColumnSizing(true);
                    },
                    "fnDrawCallback": function (oSettings) {
                        this.fnAdjustColumnSizing(false);
                        
                    },
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados",
                        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        sInfoFiltered: "(Total de _MAX_ registros)"
                    },
                    "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                        //coloca a classe reorder na primeira coluna
                        $('td:eq(0)', nRow).addClass("reorder");
                        $('td:eq(1)', nRow).addClass("desccargos");

                        return nRow;
                    }
                });


                otable.fnDestroy();

                //alert('2222');
                otable = $(".tablecargos").dataTable({
                    "bDestroy": true,
                    //aaSorting: [[$(".data-sort-asc:first").index(), "asc"]],
                    //sPaginationType: "full_numbers",
                    "bPaginate": false,
                    aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
                    { "bVisible": false, "aTargets": ["dataTable-hidden"] },
                    { "sClass": "reorder", "aTargets": ["data-order"] }],
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados"
                        //,
                        //sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        //sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        //sInfoFiltered: "(Total de _MAX_ registros)"
                    }
                });




                $(".dataTables_filter", $(".no-filter").parents(".dataTables_wrapper")).hide();
                $(".dataTables_length", $(".no-length").parents(".dataTables_wrapper")).hide();

            }, "html");
        }
        else {
            $(".detailheHierarquia").html("");
            $(".salvarHierarquia").hide();
        }

    });




    //##########################################
    //          SALVAR HIERARQUIA
    //##########################################
    $(".salvarHierarquia").live("click", function () {
        var canalID = $("#CANAL_ID").val();
        var hierarquias = [];
        //$(".items .linhahierarquia tr").each(function () {
        $($(".hierarquias").dataTable().fnGetNodes()).each(function () {
            var tr = $(this);
            var hierarquia = {};

            hierarquia.Hierarquia_ID = $("input[name='Hierarquia_ID']", tr).val();
            //hierarquia.Ordem = $("input[name='Ordem']", tr).val();
            hierarquia.Ordem = $(".reorder", tr).text();
            //hierarquia.CargoID = $("input[name='CargoID']", tr).val();
            hierarquia.CargosIDOrdem = $("input[name='hdcargosID']", tr).val();
            hierarquia.AlcadaAprovacao = $("input[name='AlcadaAprovacao']", tr).val();
            hierarquia.AdministradorSistema = $("input[name='AdministradorSistema']", tr).val();
            hierarquia.AprovadorCCGerencial = $("input[name='AprovadorCCGerencial']", tr).val();
            hierarquia.AprovadorDeCampanha = $("input[name='AprovadorDeCampanha']", tr).val();
            hierarquia.AprovadorDeDescontoAdicional = $("input[name='AprovadorDeDescontoAdicional']", tr).val();

            hierarquias.push(hierarquia);
        });

        var sendData = {};
        sendData.hierarquias = hierarquias;
        sendData.canalID = canalID



        $.post(controller + "SalvaHierarquias", $.toDictionary(sendData), function (data) {
            if (data.ok) {

                if (data.message != '') {

                    var dadosmodal = "<form class='modalAux'><div class='mws-form-row' style='margin-top:10px;margin-left:10px; margin-bottom:10px;'> <label>" + data.message + "</label></div></form>";

                    $(dadosmodal).dialog({
                        title: 'Alerta',
                        resizable: false,
                        modal: true,
                        width: 350,
                        height: 310,
                        position: ['center', 'center'],
                        buttons: {
                            "Ok": function () {
                                $(this).dialog("close");
                            }
                        },
                        close: function () {
                            window.location.href = controller + "Index/" + canalID;
                            return false;
                        }
                    });

                }
                else {
                    window.location.href = controller + "Index/" + canalID;
                }
                //window.location.href = controller + "Index/" + canalID;
            }
            else {
                alert("Ocorreu um erro ao salvar as informações: " + data.message);
            }
        }, "json");


    });






    //##########################################
    //       BOTÃO DE ADICIONAR CARGO/HIERARQUIA
    //##########################################
    $(".addCargo").live("click", function () {

        if ($("#CARGO_ID").val() != "") {

            //$("#tabela tr").length
            var newOrdem = $(".hierarquias").dataTable().fnGetNodes().length; //$('.items .linhahierarquia tr').length;
            var cargoID = $("#CARGO_ID").find(":selected").val();
            var cargoDescription = $("#CARGO_ID").find(":selected").text();
            $("#CARGO_ID").find(":selected").remove();
            $("#CARGO_ID").val("");

        
            if ($("#NIVEL_ID").val() != "") {
                var achou = false;
                $($(".hierarquias").dataTable().fnGetNodes()).each(function () {

                    var tr = $(this);
                    var ordem = $(".reorder", tr).text(); // pega a ordem na coluna

                    if (ordem.trim() == $("#NIVEL_ID").val().trim()) {
                        var cargossplit = $('#hdcargosID', tr).val();

                        var ordemcargonovo = 1;

                        if (cargossplit.trim() != "") {
                            var linhascargos = cargossplit.split('#╗╗#');
                            ordemcargonovo = linhascargos.length + 1;
                            var cargosid = $("#hdcargosID", tr).val();
                        }

                        if (cargosid != '')
                            cargosid += "#╗╗#";

                        cargosid += ordemcargonovo + "-╗╗-" + cargoID + " -╗╗-" + cargoDescription;

                        $("#hdcargosID", tr).val(cargosid);

                        var desccargos = $("#hdcargosDescription", tr).val();
                        if (desccargos != '') {
                            desccargos += "<br>";

                            $(".editarOrdemCargos", tr).show();
                        }

                        desccargos += cargoDescription;

                        $("#hdcargosDescription", tr).val(desccargos);

                        $(".spanDescCargo", tr).html(desccargos);
                        //$(this).find('.reorder').html(count);

                        achou = true;
                    }
                    if (achou == true) {
                        return false;
                    }


                });

            }
            else {
                newOrdem += 1;

                
                //ordem cargo -╗╗- cargo ID -╗╗- descrição
                //$("#hdcargosDescription", row).val(descCargos);
                //$("#hdcargosID", row).val(IdCargos);

                var idcargos = "1-╗╗-" + cargoID + "-╗╗-" + cargoDescription;

                
                $(".hierarquias").dataTable().fnAddData([
                    newOrdem,
                    "<a class='editarOrdemCargos mws-ic-16 ic-order li_icon' title='Reordenar cargos' style='float:right; display:none' ></a>" +
                    "<input type='hidden' id='Hierarquia_ID' name='Hierarquia_ID' value='0' />" +
                    "<input type='hidden' id='hdcargosID' name='hdcargosID' value='" + idcargos + "' />" +
                    "<input type='hidden' id='hdcargosDescription' name='hdcargosDescription' value='" + cargoDescription + "' /> " +
                    "<input type='hidden' id='hdPossuiAlcadaPadrao' name='hdPossuiAlcadaPadrao' value='N' />" +
                    "<input type='hidden' id='hdPossuiAlcadaDesc' name='hdPossuiAlcadaDesc' value='N' />" +
                    "<span class='spanDescCargo' style='float:left;'>" + cargoDescription + "</span>",
                    RenderCustomCell("AlcadaAprovacao"),
                    RenderCustomCell("AdministradorSistema"),
                    RenderCustomCell("AprovadorCCGerencial"),
                    RenderCustomCell("AprovadorDeCampanha"),
                    RenderCustomCell("AprovadorDeDescontoAdicional"),
                    RenderButtons()
                ]);
                
                otableHierarquia.sort([[1, 'asc']]);

                //ADICIONA o novo NIVEL AO "COMBO""
                $("#NIVEL_ID").append("<option value='" + newOrdem + "'> " + newOrdem + "</option>");

            }

        }


    });


    $(".editarOrdemCargos").live("click", function () {
        var tr = $(this).parents("tr:first");
        //EditMode(true, tr);
        abrirModalCargos(tr);

    });




    //##########################################
    //      REMOVER HIERARQUIA DO GRID
    //##########################################
    $(".removerHierarquia").live("click", function () {

        var tr = $(this).parents("tr:first");


        //#14571 - Verificar se for coluna Alçada de aprovação (e for exclusão) e possuir Alçada Desconto ou Padrão, não deixar alterar
        var bPossuiAlcadaPadrao = $("input[name='hdPossuiAlcadaPadrao']", tr).val()
        var bPossuiAlcadaDesconto = $("input[name='hdPossuiAlcadaDesc']", tr).val()

        if (bPossuiAlcadaPadrao != "S" && bPossuiAlcadaDesconto != "S") {

            var linhascargos = $('#hdcargosID', tr).val().split('#╗╗#');
            for (i = 0; i < linhascargos.length; i++) {
                if (linhascargos[i].trim() != '') {
                    var dadoscargo = linhascargos[i].split('-╗╗-');
                    $("#CARGO_ID").append("<option value='" + dadoscargo[1] + "'> " + dadoscargo[2] + "</option>");
                }
            }


            $(".hierarquias").dataTable().fnDeleteRow(tr[0]);


            //CHAMA A FUNÇÃO PARA RENUMERAR A HIERARQUIA após a exclusão de uma linha
            renumber_table('.hierarquias tbody');

            //tem que recarregar o combo NIVEL
            $("#NIVEL_ID option[value != '']").remove();
            $($(".hierarquias").dataTable().fnGetNodes()).each(function () {
                var tr = $(this);
                var ordem = $(".reorder", tr).text();
                $("#NIVEL_ID").append("<option value='" + ordem + "'> " + ordem + "</option>");

            });

        } else {
            alert("Cargo da hierarquia não pode ser excluído pois possui valor de alçada.");
        }

    });




    $(".confirmarHierarquia").live("click", function () {
        var tr = $(this).parents("tr:first");

        //#14571 - Verificar se for coluna Alçada de aprovação (e for exclusão) e possuir Alçada Desconto ou Padrão, não deixar alterar
        var bAlcadaAprovacao = "False";

        //Pega somente a primeira coluna de Alçada de aprovação
        $(".working:first", tr).each(function () {
            if ($(this).hasClass("ic-accept")) {
                bAlcadaAprovacao = "True";
            }
        });

        var bPossuiAlcadaPadrao = $("input[name='hdPossuiAlcadaPadrao']", tr).val()
        var bPossuiAlcadaDesconto = $("input[name='hdPossuiAlcadaDesc']", tr).val()

        if (bAlcadaAprovacao != "False") {

            ApplyNewDefaultValues(tr);
            EditMode(false, tr);
        } else {

            if (bPossuiAlcadaPadrao != "S" && bPossuiAlcadaDesconto != "S") {
                ApplyNewDefaultValues(tr);
                EditMode(false, tr);
            } else {
                alert("Cargo da hierarquia não pode ser excluído pois possui valor de alçada.");
            }
        }

        

    });

    $(".cancelarHierarquia").live("click", function () {
        var tr = $(this).parents("tr:first");
        ReturnDefaultValues(tr);
        EditMode(false, tr);
    });

    $(".working").live("click", function () {
        if ($(this).hasClass("ic-accept")) {
            $(this).removeClass("ic-accept").addClass("ic-delete");
        } else {
            $(this).removeClass("ic-delete").addClass("ic-accept");
        }
    });

    $(".editarHierarquia").live("click", function () {

        var tr = $(this).parents("tr:first");
        EditMode(true, tr);


    });



    $(window).resize(function () {
        //para ajustar o cabeçalho no Firefox do DATATABLE
        setTimeout(function () {
            $(".detailheHierarquia").width($("#hierarquiaForm").width());
            //otableHierarquia.fnAdjustColumnSizing(true);
            $(".hierarquias").dataTable().fnAdjustColumnSizing(true);
        }, 1);
    });


});





var RenderButtons = function () {
    return "<a class='editarHierarquia mws-ic-16 ic-edit li_icon' title='Editar Hierarquia' />" +
        "<a class='removerHierarquia mws-ic-16 ic-cross li_icon' title='Remover Hierarquia' />" +
        "<a style='display: none;' class='confirmarHierarquia mws-ic-16 ic-accept li_icon' " +
        "title='Confirmar' /><a style='display: none;' class='cancelarHierarquia mws-ic-16 ic-delete li_icon'" +
        "title='Cancelar'/>";
}

var RenderCustomCell = function (name) {
    return "<input name='" + name + "' type='hidden' value='False' class='hiddenValue' />" +
        " <a id='" + name + "' data-initialValue='False' class='editar mws-ic-16 ic-delete li_icon' />";


};

var ApplyNewDefaultValues = function (row) {
    $(".working", row).each(function () {
        var td = $(this).parents("td:first");
        var value = "False";
        if ($(this).hasClass("ic-accept")) {
            value = "True";
        }
        $(this).attr("data-initialValue", value);
        $(".hiddenValue", td).val(value);
    });

};



//27/11/2018 OS #13746
//RETIRA A VALIDAÇÃO
////############################
////OS 13509  NÃO PODE SER DE ALÇADA E CC CORRENTE AO MESMO TEMPO
////AprovadorCCGerencial
////AlcadaAprovacao
////############################
//function ValidaValoresLinha(row) {
//    var sMsg = "";

//    if ($("#AprovadorCCGerencial", row).hasClass("ic-accept")) {
//        //o CARFGO NÃO PODE PERTENCER AO MESMO TEMPO "Alçada de Aprovação" e a "Aprovador de CC gerencial"
//        if ( $("#AlcadaAprovacao", row).hasClass("ic-accept")) {
//            sMsg='O cargo não pode pertencer a "Alçada de Aprovação" e a "Aprovador de CC gerencial" ao mesmo tempo.</br>';
//        }

//            //VERIFICA SE JÁ POSSUI OUTRA LINHA COM A INDICAÇÃO DE AprovadorCCGerencial CASO ESTEJA MARCADO 'S'
//            $($(".hierarquias").dataTable().fnGetNodes()).each(function () {
//                var tr = $(this);
//                var ordemtr = $(".reorder", tr).text(); // pega a ordem na coluna

//                var ordemROWSEL = $(".reorder", row).text(); // pega a ordem na coluna
//                if (ordemtr != ordemROWSEL) {
//                    //verifica se a linha que esta varrendo esta com a marcação de AprovadorCCGerencial
//                    if ($("#AprovadorCCGerencial", tr).hasClass("ic-accept")) {
//                        sMsg +='Existe outro cargo com a indicação de "Aprovador de CC gerencial".';
//                        return;
//                    }
//                }
//            });
//    }

//    if (sMsg!= "") {
//        alert(sMsg);
//        return false;
//    }
//    return true; // senão encontrou duplicidade
//};





var ReturnDefaultValues = function (row) {
    $(".working", row).each(function () {
        if ($(this).attr("data-initialValue") == "True") {
            $(this).removeClass("ic-delete").addClass("ic-accept");
        }
        else {
            $(this).removeClass("ic-accept").addClass("ic-delete");
        }
    });

};


var EditMode = function (isEditMode, row) {
    var className = "working";

    if (isEditMode) {
        $(".editar", row).addClass(className).removeClass("editar");
        $(".editar").hide();
        $(".editarHierarquia").hide();
        $(".removerHierarquia").hide();
        $(".salvarHierarquia").hide();
        $(".confirmarHierarquia", row).show();
        $(".cancelarHierarquia", row).show();
    } else {
        $(".editar").show();
        $("." + className, row).addClass("editar").removeClass(className);
        $(".editarHierarquia").show();
        $(".removerHierarquia").show();
        $(".salvarHierarquia").show();
        $(".confirmarHierarquia", row).hide();
        $(".cancelarHierarquia", row).hide();

    }

};