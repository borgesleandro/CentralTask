$(document).ready(function () {


   



    $("#VAL_DESC").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
    $(".quantidadeProduto ").maskMoney({ showSymbol: false, decimal: "", thousands: "" });
    $(".valorProduto, .percent, .desconto").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });

    //Esconder campos não funcionais em nenhum cliente:
    //Compra coletiva, requer avaliação do aprovador, conceder brinde
    $("#COMPRA_COLETIVA_APROVACAO").hide();
    $("#CONCEDER_BRINDES").hide();

    //Esconder campos não utilizados pela UQ:
    //Conceder prazo, Critério Brick, Período de apuração e valores por pedido
//    if (vPrazoPorItem == "N")
//    {
        $("#LBL_PERIODO_APURACAO").hide();
        $("#DADOS_PERIODO_APURACAO").hide();
        $("#CONCEDER_PRAZO").hide();
        $("#CAMPANHA_POR_PEDIDO").hide();
        $("#ACUMULADO_NA_VIGENCIA").hide();
        $("#VALOR_MINIMO_POR_PRODUTO").hide();
        $("#QTD_CRESC_POR_PRODUTO").hide();
        $("#VALOR_CRESC_POR_PRODUTO").hide();
        $("#REQUER_AVALIACAO").hide();
//    }

    $(document).on("click", ".finalizarCampanha", function () {

        $(".loading-save").show();
        var ul = $(this).parents("ul:first");
        $.post(controller + "FinalizaCampanha", { campanhaID: $(this).attr("data-campanha") }, function (data) {
            //$(".loading-save").hide();
            if (data == "") {
                //ul.after("<span>Sim</span>");
                //ul.remove();
                location.reload();
            } else {
                alert(data);
                $(".loading-save").hide();
            }

        });
    });


    //$(".produtosDetails").dataTable().fnDestroy();

    $(".produtosDetails").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableProdutosDetails",
        "bProcessing": true,
        "bRetrieve": true,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "campanhaID", "value": $("#CAMPANHA_ID").val() });

        },
        "aoColumns": [
                   {
                       "mDataProp": "CODPROD"
                   },
                   {
                       "mDataProp": "EAN13"
                   },
                        {
                            "mDataProp": "PRODUTO_NOME"
                        },
                        {
                            "mDataProp": "MIN_QTD",
                            "bSearchable": false,
                            "bSortable": false
                        },
                        {
                            "mDataProp": "MIN_VALOR",
                            "bSearchable": false,
                            "bSortable": false
                        },
                        {
                            "mDataProp": "PERC_QTD",
                            "bSearchable": false,
                            "bSortable": false
                        },
                        {
                            "mDataProp": "PERC_VALOR",
                            "bSearchable": false,
                            "bSortable": false
                        },
                        {
                            "mDataProp": "DESCONTO",
                            "bSearchable": false,
                            "bSortable": false
                        }
        ],

        "oLanguage":
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)",
            sProcessing: "<div class='dataTable-loading' />"
        },
        "sPaginationType": "full_numbers"
    });




    $(document).on("click", ".duplicar", function () {
        var tr = $(this).parents("tr:first");
        var campanhaID = $(this).attr("data-campanha");
        alert("Deseja realmente duplicar esta campanha? Será criada uma nova campanha copia desta.", "Duplicar Campanha Promocional", null,
            function () {
                $(".loading-save").show();
                $(".duplicarForm", tr).submit();
            }
        );
    });






    $(".produtos").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableProdutos",
        "bProcessing": true,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "FLG_TIPO_PEDIDO", "value": $('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked });

        },
        "aoColumns": [
                        {
                            "mDataProp": "CODPROD"
                        },
                        {

                            "mDataProp": "EAN13",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" name="EAN13_ROW" value="' + oObj.aData.EAN13 + '"/><label>' + oObj.aData.EAN13 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "PRODUTO_NOME",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="produtoID" name="produtoID" value="' + oObj.aData.PRODUTO_ID + '"/><label class="produtoNome">' + oObj.aData.PRODUTO_NOME + '</label>';
                            }
                        },
                        {
                            "mDataProp": "MIN_QTD",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var obj = "<input type='hidden'id='PRODUTO_MIN_QTD_ROW' name='PRODUTO_MIN_QTD_ROW'  value='" + oObj.aData.MIN_QTD + "'/>" +
                                    "<label class='valueLabel'  data-type='MIN_QTD' style='width: 100%; display: block; height: 26px;'>" + oObj.aData.MIN_QTD + "</label>";
                                return obj;
                            }
                        },
                        {
                            "mDataProp": "MIN_VALOR",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var obj = "<input type='hidden' id='PRODUTO_MIN_VALOR_ROW' name='PRODUTO_MIN_VALOR_ROW' value='" + oObj.aData.MIN_VALOR + "'/>" +
                                    "<label class='valueLabel' data-type='MIN_VALOR' style='width: 100%; display: block; height: 26px;'>" + oObj.aData.MIN_VALOR + "</label>";
                                return obj;

                            }
                        },
                        {
                            "mDataProp": "PERC_QTD",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var obj = !$('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked ?
                                    "<input type='hidden' id='PRODUTO_PERC_QTD_ROW' name='PRODUTO_PERC_QTD_ROW'  value='" + oObj.aData.PERC_QTD.replace("%", "") + "'/>" +
                                    "<label class='valueLabel' data-type='PERC_QTD' style='width: 100%; display: block; height: 26px;'>" + oObj.aData.PERC_QTD + "</label>" :
                                    " - ";
                                return obj;


                            }
                        },
                        {
                            "mDataProp": "PERC_VALOR",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var obj = !$('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked ?
                                    "<input type='hidden' id='PRODUTO_PERC_VALOR_ROW' name='PRODUTO_PERC_VALOR_ROW'  value='" + oObj.aData.PERC_VALOR.replace("%", "") + "'/>" +
                                    "<label class='valueLabel' data-type='PERC_VALOR' style='width: 100%; display: block; height: 26px;'>" + oObj.aData.PERC_VALOR + "</label>" :
                                    " - ";
                                return obj;

                            }
                        },
                        {
                            "mDataProp": "DESCONTO",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var obj = $("#.checkField:checked").length > 0 && $("#.checkField:checked").val() == "F" && !$('input:radio[name=FLG_TIPO_PEDIDO]')[1].checked ?
                                    "<input type='hidden' id='PRODUTO_DESCONTO_ROW' name='PRODUTO_DESCONTO_ROW'  value='" + oObj.aData.DESCONTO.replace("%", "") + "'/>" +
                                    "<label class='valueLabel' data-type='DESCONTO' style='width: 100%; display: block; height: 26px;'>" + oObj.aData.DESCONTO + "</label>" :
                                    " - ";
                                return obj;

                            }
                        },
                        {
                            "mDataProp": "PRODUTO_ID",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                return "<a class='mws-ic-16 ic-delete li_icon deleteProduto' />";
                            }
                        }

        ],
        "fnDrawCallback": function () {


        },
        "oLanguage":
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)",
            sProcessing: "<div class='dataTable-loading' />"
        },
        "sPaginationType": "full_numbers"
    });

    DisabledAllTableDiv();
    
    var dropdownDivisao = $("#DIVISAO");
    var dropdownFamilia = $("#FAMILIA");
    var dropdownGrupo = $("#GRUPO");



    dropdownDivisao.live("change", function () {

        $("option", dropdownFamilia).each(function () {
            if ($(this).val() != "") $(this).remove();
        });

        //Carregar items novos
        var selectedValue = dropdownDivisao.val();
        if (selectedValue != "" && selectedValue > 0) {

            $.ajax({
                url: controller + "DropFamiliaFill",
                type: "post",
                dataType: "json",
                data: { divisao_id: selectedValue },
                success: function (data) {
                    $(data).each(function () {
                        var text = $(this).prop("Text");
                        var value = $(this).prop("Value");
                        dropdownFamilia.append("<option value='" + value + "'> " + text + "</option>");
                    });
                }
            });

        }
        setParamAutoComplete();

    });
    dropdownFamilia.live("change", function () {
        setParamAutoComplete();
    });
    dropdownGrupo.live("change", function () {
        setParamAutoComplete();
    });

    
    if ($('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked) {
        $(".percent").attr("disabled", "disabled");
    }
    if ($('input:radio[name=FLG_TIPO_PEDIDO]')[1].checked) {
        $(".desconto").attr("disabled", "disabled");
    }

    if ($("#FLG_COMPRA_COLETIVA").is(":checked")) {
        $(".no-coletiva").attr("disabled", "disabled");
        $('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked = true;

        $($('input:radio[name=FLG_TIPO_PEDIDO]')[1]).attr("disabled", "disabled");
    }

    $(".questionModal").dialog({
        autoOpen: false,
        title: "Aviso",
        modal: true,
        width: "640",

    });
    
    $(document).on("click", ".valueLabel", function () {
        var cell = $(this).parents("td:first");
        var name = $(":hidden", cell).attr("name");
        var maxlength = "6";

        if (name == "PRODUTO_MIN_VALOR_ROW") {
            maxlength = "10";
        }

        cell.append("<input type='text' class='valueInput' data-type='" + $(this).attr("data-type") + "' value='" + $(this).text().replace("%", "").replace(".", "") + "' maxlength='" + maxlength + "' /> ");
        $(this).remove();

        var decimalSeparator = "";

        if (name != "PRODUTO_MIN_QTD_ROW") {
            decimalSeparator = ",";
        }


        $(".valueInput").maskMoney({ showSymbol: false, decimal: decimalSeparator, thousands: "" });
        $(".valueInput").focus();

    });


    $(document).live("keypress", "form input", function (event) {
        if (event.which == 13) {
            $(event.data).blur();
            event.preventDefault();
        }
    });

    $(document).on("focusout", ".valueInput", function () {
        var currentRow = $(this).parents("tr:first");
        var cell = $(this).parents("td:first");
        var newValue = parseFloat($(this).val().replace(",", ".")) > 0 ? $(this).val() : "";
        $(".valueLabel", cell).text(newValue);
        $(":hidden", cell).val(newValue);

        var sendData = {};
        sendData.produtoID = $(".produtoID", currentRow).val();
        sendData.produto_Nome = $(".produtoNome", currentRow).text();
        if ($(this).attr("data-type") == "MIN_QTD" || $(this).attr("data-type") == "MIN_VALOR" || $(this).attr("data-type") == "DESCONTO") {
            sendData.min_qtd = $("input[name='PRODUTO_MIN_QTD_ROW']", currentRow).val();
            sendData.min_valor = $("input[name='PRODUTO_MIN_VALOR_ROW']", currentRow).val();
        }

        if ($(this).attr("data-type") == "PERC_QTD" || $(this).attr("data-type") == "PERC_VALOR" || $(this).attr("data-type") == "DESCONTO") {
            sendData.perc_qtd = $("input[name='PRODUTO_PERC_QTD_ROW']", currentRow).val();
            sendData.perc_valor = $("input[name='PRODUTO_PERC_VALOR_ROW']", currentRow).val();
        }

        sendData.desconto = $("input[name='PRODUTO_DESCONTO_ROW']", currentRow).val();



        $.post(controller + "EditProduto", sendData, function (data) {
            $('.produtos').dataTable().fnDraw(false);
        });

    });

    

    $(".disableDiv").live("click", function () {
        DisabledAllTableDiv($(this));
        if ($(this).attr("id") == "chkProduto" && !$(this).is(":checked")) {
            $.post(controller + "ClearProdutos");
        }
    });

    $(document).on("click", ".descontoFixo", function () {

    });

    $(".checkField").live("click", function () {
        $(".acaoCampanhaError").hide();
        $('.produtos').dataTable().fnDraw(false);
        DisableParentElement($(this));
    });


    $(document).on("submit", ".mws-form", function () {

        $(".acaoCampanhaError").hide();
        var input = $(".porcentagemCresc");
        var chkProduto = $("#chkProduto").is(":checked");
        var chkPedido = $("#chkPedido").is(":checked");


        var errorsCount = 0;


        if ($(".checkField:checked").length == 0) {
            $(".acaoCampanhaError").show();
            errorsCount++;
        }

        $(".erroProdutoPedido").hide();
        if (!chkProduto && !chkPedido) {
            $(".erroProdutoPedido").text("Escolha um produto ou determine um valor para pedido.").show();
            errorsCount++;
        }
        else if (chkProduto && $(".produtoID").length == 0) {
            $(".erroProdutoPedido").text("Escolha um produto").show();
            errorsCount++;
        }


        if (errorsCount > 0) {
            return false;
        }

        var qtdInputNotEmpty = 0;
        var inputPeriodoApuracao = $("#PER_APURACAO_PERC");
        if (input.length > 0) {
            input.each(function () {
                if ($(this).val() != "") qtdInputNotEmpty++;
            });
            if (qtdInputNotEmpty > 0) {
                inputPeriodoApuracao.addClass("required");
            } else {
                inputPeriodoApuracao.removeClass("required");
                $(".field-validation-error", $(inputPeriodoApuracao.parents("li:first"))).hide();
            }

        } else {
            inputPeriodoApuracao.removeClass("required");
            $(".field-validation-error", $(inputPeriodoApuracao.parents("li:first"))).hide();
        }

        $("#Fixo").val($(".descontoFixo").is(":checked"));

    });


    $("#FLG_TIPO_PEDIDO").live("click", function () {

        alert("Deseja realmente alterar este tipo?<br /> Isso irá limpar as configurações dos produtos já escolhidos.", null, null, function () {
            var produtoDiv = $(".produtoDiv");
            var pedidoDiv = $(".pedidoDiv");
            var checkProduto = $("#chkProduto").is(":checked");
            var checkPedido = $("#chkPedido").is(":checked");

            $.post(controller + "ClearProdutos");
            $(".produtos").dataTable().fnClearTable();

            if ($('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked) {
                $(".percent", produtoDiv).attr("disabled", "disabled");
                $(".percent", pedidoDiv).attr("disabled", "disabled");
                if (checkProduto) {
                    $(".desconto", produtoDiv).removeAttr("disabled");
                }
            } else {
                $(".desconto", produtoDiv).attr("disabled", "disabled");
                if (checkProduto) {

                    $(".percent", produtoDiv).removeAttr("disabled");
                }
                if (checkPedido) {
                    $(".percent", pedidoDiv).removeAttr("disabled");
                }

            }
        }, function () {
            if ($('input:radio[name=FLG_TIPO_PEDIDO]')[1].checked) {
                $('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked = true;
            } else {
                $('input:radio[name=FLG_TIPO_PEDIDO]')[1].checked = true;
            }
        }, null);

    });

    $("#FLG_COMPRA_COLETIVA").live("click", function () {

        $('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked = true;
        if ($(this).is(":checked")) {

            $.post(controller + "ClearProdutos");
            $(".produtos").dataTable().fnClearTable();

            $($('input:radio[name=FLG_TIPO_PEDIDO]')[1]).attr("disabled", "disabled");


            $(".no-coletiva").attr("disabled", "disabled");
            $(".no-coletiva").val("");

        }
        else {
            $($('input:radio[name=FLG_TIPO_PEDIDO]')[1]).removeAttr("disabled");

            if ($("#chkProduto").is(":checked"))
                $(":text", ".produtoForm").removeAttr("disabled");

            if ($("#chkPedido").is(":checked"))
                $(":text", ".pedidoForm").removeAttr("disabled");
        }




    });

    $("#FLG_QUANTIDADE_FIXA").live("click", function () {

        if ($(this).is(":checked"))
            $(".lblQtdMin").html("Qtde. fixa");
        else
            $(".lblQtdMin").html("Qtde. mínima");

    });

    if ($("#FLG_QUANTIDADE_FIXA").is(":checked"))
        $(".lblQtdMin").html("Qtde. fixa");
    else
        $(".lblQtdMin").html("Qtde. mínima");

    $(document).on("keyup", ".produtoForm :input", function () {
        var produtoForm = $(".produtoForm");
        if ($(this).attr("name") == "PRODUTO_MIN_QTD" || $(this).attr("name") == "PRODUTO_MIN_VALOR") {
            $("#PRODUTO_PERC_QTD", produtoForm).val("");
            $("#PRODUTO_PERC_VALOR", produtoForm).val("");

        }
        if ($(this).attr("name") == "PRODUTO_PERC_QTD" || $(this).attr("name") == "PRODUTO_PERC_VALOR") {
            $("#PRODUTO_MIN_QTD", produtoForm).val("");
            $("#PRODUTO_MIN_VALOR", produtoForm).val("");
        }
    });

    $(document).on("click", ".deleteProduto", function () {
        var currentRow = $(this).parents("tr:first");
        //alert($(".produtoID", currentRow).val());
        $.post(controller + "DeleteProduto", { produtoID: $(".produtoID", currentRow).val() }, function (data) {
            $('.produtos').dataTable().fnDraw(false);
        });
    });

  
    $(document).on("click", ".incluirProduto", function () { InsertGridRow(); });




    

    var produtoSearchOnDemand = $.rmSearchOnDemand("#PRODUTO", { url: controller + "GetProduto", keyLimit: 2, textKeyAsParam: 'nome', height: 120, width: 576 });

    var setParamAutoComplete = function () {
      produtoSearchOnDemand.trigger("setParams", [{ divisaoID: dropdownDivisao.val(), familiaID: dropdownFamilia.val(), grupoID: dropdownGrupo.val() }]);
    };

});

var DisableParentElement = function (element) {
    var spanParent = element.parents(".mws-form-row:first");
    var div = $(".inputForm", spanParent);
    $("input:not(:checkbox,:hidden)", div).val("");
    $(".chzn-select").val('').trigger("liszt:updated");
    $(".display").hide();
    $(".visibility").css("visibility", "hidden");

    if (arguments.length == 1) {


        if ($(".field", div).length > 1) {
            element.is(":checked") ? div.css("visibility", "") : div.css("visibility", "hidden");

            $(".chzn-select").val('').trigger("liszt:updated");
        }
        else {
            element.is(":checked") ? div.show() : div.hide();

            $("input:not(:checkbox,:hidden)", div).val("");
        }

        if (element.is(":checked")) {
            $(".field", div).addClass("required");
        } else {
            $(".field", div).removeClass("required");
        }
    } else {
        $(".inputForm").hide();
    }
};

var InsertGridRow = function () {
    $(".produtoErro").slideUp("fast");


    var produtoId = $("input[name='PRODUTO']").val();

    var dropdownDivisao = $("#DIVISAO").val();
    var dropdownFamilia = $("#FAMILIA").val();
    var dropdownGrupo = $("#GRUPO").val();

    var qtdMin = $("#PRODUTO_MIN_QTD").val();
    var valorMin = $("#PRODUTO_MIN_VALOR").val();
    var qtdPerc = $("#PRODUTO_PERC_QTD").val();
    var valorPerc = $("#PRODUTO_PERC_VALOR").val();
    var desconto = $("#PRODUTO_DESCONTO").val();

    //if (produtoId != "" || dropdownDivisao != "" || dropdownGrupo != "" || dropdownFamilia != "") {

    varPorPedidoEmitido = $('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked;

    if (produtoId != "") {
        if (varPorPedidoEmitido == true && (qtdMin == "" || qtdMin == 0 || desconto == "" || desconto == 0))
        {
            $(".produtoErro").text("Quantidade e desconto devem ser informados.").slideDown("fast");
        }
        else 
        {
            var sendData = {};
            sendData.divisaoID = dropdownDivisao;
            sendData.grupoID = dropdownGrupo;
            sendData.familiaID = dropdownFamilia;
            sendData.PRODUTO_ID = produtoId;
            sendData.MIN_QTD = qtdMin;
            sendData.MIN_VALOR = valorMin;
            sendData.PERC_QTD = qtdPerc;
            sendData.PERC_VALOR = valorPerc;
            sendData.DESCONTO = desconto;

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: controller + "GetProdutos",
                async: false,
                data: JSON.stringify(sendData),
                traditional: true,
                success: function (data) {
                    if (data.errorMessage != null) {
                        ClearDropDownsProduto();
                        $(":text", $(".produtoDiv")).val("");
                        $("input[name='PRODUTO']", $(".produtoDiv")).val("");
                        $(".produtos").dataTable().fnDraw(false);
                    } else {
                        alert(data.errorMessage);
                    }
                }
            });

            //$.post(controller + "GetProdutos", sendData, function (data) {
            //    if (data.errorMessage != null) {
            //        ClearDropDownsProduto();
            //        $(":text", $(".produtoDiv")).val("");
            //        $("input[name='PRODUTO']", $(".produtoDiv")).val("");
            //        $(".produtos").dataTable().fnDraw(false);
            //    } else {
            //        alert(data.errorMessage);
            //    }

            //}).fail(function (data) {

            //    alert(data);

            //});
        }
    } else {
        $(".produtoErro").text("Selecione um produto.").slideDown("fast");
    }
};

var ClearDropDownsProduto = function () {
    $("#DIVISAO").val("");
    $("#DIVISAO").trigger("change");
    $("#GRUPO").val("");
};

var DisabledAllTableDiv = function (element) {
    ClearDropDownsProduto();
    if (arguments.length < 1) {
        element = $(".disableDiv");
    }

    $(element).each(function () {


        $(".produtoErro").slideUp("fast");


        var compraColetiva = $("input[name^='FLG_COMPRA_COLETIVA']").is(":checked");
        var pedidoEmitido = $('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked;

        var spanParent = $(this).parents("span:first");
        var spanTable = $(".spanTable", spanParent);
        var active = $(this).is(":checked");


        if (active) {
            if (compraColetiva) {
                $(":input:not(.no-coletiva)", spanTable).removeAttr("disabled");
            } else if (pedidoEmitido) {
                $(":input:not(.percent)", spanTable).removeAttr("disabled");
            } else {
                $(":input:not(.desconto)", spanTable).removeAttr("disabled");
            }

            $(":button", spanTable).show();
        } else {
            $(":text", spanTable).val("");
            $(":hidden:not(option)", spanTable).val("");
            $(":button", spanTable).hide();
            $(":input", spanTable).attr("disabled", "disabled");
            $("table", spanTable).each(function () { $(this).dataTable().fnClearTable(); });
        }
    });
};

