$(document).ready(function () {
    var currentAjaxRequest = null;

    $('body').click(function () {
        $(".condicoesSelect").html("").hide();
    });
    $("#resultado").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableRelatorioCondicaoPadrao",
        "bStateSave": false,
        "bProcessing": true,
        "fnServerParams": function (aoData) {
            
            aoData.push({ "name": "cnpj", "value": $("#CNPJRelatorio").val() });

        },
        "aoColumns": [
                        {
                            "mDataProp": "PRODUTO_DESCRICAO",
                            "bSearchable": true,
                            "bSortable": true
                        },
                        {
                            "mDataProp": "PRODUTO_CODIGO",
                            "bSearchable": false,
                            "bSortable": true
                        },
                        {
                            "mDataProp": "CONDICAO_DESCRICAO",
                            "bSearchable": false,
                            "bSortable": true,
                            "fnRender": function (oObj) {
                                return oObj.aData.CONDICAO_DESCRICAO != null ? oObj.aData.CONDICAO_DESCRICAO : "Sem condição comercial padrão definida";

                            }
                        }



        ],
        "fnDrawCallback": function () {
            if ($("#CNPJRelatorio").val() == "") {
                $("#resultado").hide();
            }
            else {
                $("#resultado").show();
            }

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
    $(document).on("change", "#CNPJRelatorio", function() {
        $("#resultado").dataTable().fnDraw(false);
    });


    //Alterar cnpj da farmácia
    $(document).on("change", "#CNPJ", function () {
        var botaoSalvar = $(".btn-salvar");
        if (currentAjaxRequest != null) currentAjaxRequest.abort();
        var selectedValue = $(this).val();
        if (selectedValue != null) {
            $(".loading-cnpj").show();
            currentAjaxRequest = $.post(controller + "GetAplicarCondicaoDefaultView", $.toDictionary({ cnpj: selectedValue }), function (data) {
                $(".aplicarForm").html(data);
                if ($(".no-results-found").length == 0 && data != "") {
                    if ($("#CONDICAO_FILTRO option").length == 0) {
                        $("#checkAllAplicarTodos").attr("disabled", "disabled");
                        botaoSalvar.attr("disabled", "disabled");
                        botaoSalvar.addClass("gray").removeClass("blue");
                    }
                    else {
                        botaoSalvar.removeAttr("disabled");
                        botaoSalvar.addClass("blue").removeClass("gray");
                    }
                    $(".mws-datatable-fn").dataTable({
                        aaSorting: [[$(".data-sort-asc:first").length > 0 ? $(".data-sort-asc:first").index() : 0, "asc"]],
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
                }
                else {
                    botaoSalvar.attr("disabled", "disabled");
                    botaoSalvar.addClass("gray").removeClass("blue");
                }
                $(".loading-cnpj").hide();
            }, "html");
        }
        else {
            $(".aplicarForm").html("");
            botaoSalvar.attr("disabled", "disabled");
            botaoSalvar.addClass("gray").removeClass("blue");
        }

    });


    //Salvar configuracao
    $(document).on("click", ".btn-salvar", function() {
        $(".loading-save").show();
        
        var sendData = {};
        sendData.cnpj = $("#CNPJ").val();
        var produtos = new Array();

        $(".check:checked", $(".produtosAplicar").dataTable().fnGetNodes()).each(function () {
            var obj = {};
            obj.PRODUTO_ID =  $(this).val();
            obj.CONDICAO_ID = $("#CONDICAO_FILTRO").val();
            obj.STATUS = !$(".btn-ativar", $(this)).hasClass("green");

            produtos.push(obj);
        });

        sendData.produtos = produtos;
        if (currentAjaxRequest != null) currentAjaxRequest.abort();
        currentAjaxRequest = $.post(controller + "SalvarCondicaoPadrao", $.toDictionary(sendData), function(data) {
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            if (data.ok) {
                $(".errorMessage").removeClass("success").addClass("success").html("Condições padrões cadastradas com sucesso!").show();
            }
            else {
                $(".errorMessage").removeClass("error").addClass("error").html(data.errorMessage).show();
            }
            $(".loading-save").hide();
        });
        
    });

    //Habilita aplicar todos
    $(document).on("click", ".checkAplicarTodos", function () {
        if ($(this).is(":checked")) {
            $(".divAplicarTodos :input").removeAttr("disabled");
            $(".divAplicarTodos :button").addClass("blue").addClass("btnAplicarTodos").removeClass("gray");
            $(".checkAll").removeAttr("disabled");
            $(".check", $(".produtosAplicar").dataTable().fnGetNodes()).removeAttr("disabled");

        }
        else {
            $(".divAplicarTodos :input").attr("disabled", "disabled");
            $(".divAplicarTodos :button").addClass("gray").removeClass("blue").removeClass("btnAplicarTodos");
            $(".checkAll").attr("disabled", "disabled");
            $(".checkAll").attr("checked", false);
            $(".check", $(".produtosAplicar").dataTable().fnGetNodes()).attr("disabled", "disabled");
            $(".check", $(".produtosAplicar").dataTable().fnGetNodes()).attr("checked", false);
        }
        $(this).removeAttr("disabled");
    });


    //Trocar Condicao Comercial Padrão para o produto
    $(document).on("click", ".changeCondicao", function () {
        var tr = $(this).parents("tr:first");
        var td = $(".condicaoPadrao", tr);
        var produtoID = $(".produtoID", tr).val();
        var itemsArea = $(".condicoesSelect", td);

        if (currentAjaxRequest != null) currentAjaxRequest.abort();
        currentAjaxRequest = $.post(controller + "GetProdutoCondicoes", { produtoID: produtoID, cnpj: $("#CNPJ").val() }, function (data) {

            if (data.length > 0) {
                var itemIndex = 0;
                $(data).each(function () {
                    itemIndex++;
                    var item = "<a class='condicaoItem' data-descricao='" + this.DESCRICAO + "' data-produto-id='" + produtoID + "' data-id='" + this.CONDICAOID + "' >" + this.DESCRICAO + "</a>";
                    if (itemIndex < data.length) {
                        item += "<br> <hr / >";
                    }
                    itemsArea.append(item);
                });



            }
            else {
                itemsArea.append("Não foi encontrada nenhuma condição para este produto");
            }
            itemsArea.show();
        }, "json");





    });

    //
    $(document).on("click", ".checkAll", function () {
        $(".check", $(".produtosAplicar").dataTable().fnGetNodes()).attr("checked", $(this).is(":checked"));
    });

    //Botao Aplicar Todos
    $(document).on("click", ".btnAplicarTodos", function () {
        var condicaoID = $("#CONDICAO_FILTRO").val();

        var rowsChecked = $(".check:checked", $(".produtosAplicar").dataTable().fnGetNodes()).parent().parent();
        if (rowsChecked.length > 0) {


            var produtosID = new Array();

            $(rowsChecked).each(function () {
                produtosID.push($(this).find(".check").val());

            });

            if (currentAjaxRequest != null) currentAjaxRequest.abort();
            currentAjaxRequest = $.post(controller + "AplicarCondicaoTodos", $.toDictionary({ produtosAplicarID: produtosID, condicaoID: condicaoID }), function (data) {
                $(data).each(function () {
                    var produtoID = this.PRODUTO_ID;
                    var descricao = this.DESCRICAO;
                    $(rowsChecked).each(function () {
                        if ($(".produtoID", $(this)).val() == produtoID) {
                            $(".condicaoID", $(this)).val(condicaoID);
                            var botaoStatus = $(".btn-ativar", $(this));
                            var linkCondicao = $(".changeCondicao", $(this));
                            botaoStatus.addClass("red").removeClass("green");
                            botaoStatus.val("Desativar");
                            linkCondicao.html(linkCondicao.html().replace(" (Não Visível)", ""));;
                            botaoStatus.show();
                            $(".condicaoStatus", $(this)).val(true);
                            $(".removerCondicao", $(this)).show();
                            $(".changeCondicao", $(this)).html(descricao);
                            return false;
                        }
                    });

                });
                $(".condicoesSelect").html("").hide();



            }, "json");


        }
        else {
            alert("escolha um produto para aplicar");
        }


    });

    //Remove Condicao Padrao
    $(document).on("click", ".removerCondicao", function () {
        var tr = $(this).parents("tr:first");
        var produtoID = $(".produtoID", tr).val();
        LimpaCondicao(produtoID);
    });

    //Status da condição
    $(document).on("click", ".btn-ativar", function () {
        var tr = $(this).parents("tr:first");
        var produtoID = $(".produtoID", tr).val();

        TrocarStatusCondicao(produtoID, $(this).hasClass("green"));
    });

    //Escolher a condição
    $(document).on("click", ".condicaoItem", function () {
        var condicaoDescricao = $(this).attr("data-descricao");
        var produtoID = $(this).attr("data-produto-id");
        var tr = $(".produtoID[value=" + produtoID + "]").parents("tr:first");
        $(".condicaoID", tr).val($(this).attr("data-id"));
        TrocarStatusCondicao(produtoID, true);
        $(".btn-ativar", tr).show();
        $(".removerCondicao", tr).show();
        $(".changeCondicao", tr).html(condicaoDescricao);
        $(".condicoesSelect").html("").hide();
    });

});

var TrocarStatusCondicao = function (produtoID, status) {
    var tr = $(".produtoID[value=" + produtoID + "]", $(".produtosAplicar").dataTable().fnGetNodes()).parents("tr:first");

    var botaoStatus = $(".btn-ativar", tr);
    var linkCondicao = $(".changeCondicao", tr);
    var statusHidden = $(".condicaoStatus", tr);

    if (status) {
        botaoStatus.addClass("red").removeClass("green");
        botaoStatus.val("Desativar");
        linkCondicao.html(linkCondicao.html().replace(" (Não Visível)", ""));

    } else {
        botaoStatus.addClass("green").removeClass("red");
        botaoStatus.val("Ativar");
        linkCondicao.html(linkCondicao.html() + " (Não Visível)");
    }
    statusHidden.val(status);

};

var LimpaCondicao = function (produtoID) {
    var tr = $(".produtoID[value=" + produtoID + "]", $(".produtosAplicar").dataTable().fnGetNodes()).parents("tr:first");

    var condicaoHidden = $(".condicaoID", tr);
    var linkCondicao = $(".changeCondicao", tr);
    var botaoStatus = $(".btn-ativar", tr);
    var botaoRemover = $(".removerCondicao", tr);

    condicaoHidden.val(0);

    TrocarStatusCondicao(produtoID, false);
    botaoStatus.hide();

    linkCondicao.html("Selecione uma Condição");

    botaoRemover.hide();


}