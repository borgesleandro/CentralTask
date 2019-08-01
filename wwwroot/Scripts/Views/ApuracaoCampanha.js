$(document).ready(function () {
    var currentAjaxRequest = null;
    var timeout = null;

    $("#CAMPANHA").live("keyup", function () {
        var table = $(".campanhas").dataTable();
        var text = $(this).val();

        if (timeout != null) clearTimeout(timeout);

        timeout = setTimeout(function () {
            if (currentAjaxRequest != null) currentAjaxRequest.abort();

            currentAjaxRequest = $.post(controller + "GetCampanhas", { text: text }, function (data) {
                table.fnClearTable();
                if (data != null && data.length > 0) {
                    $(data).each(function () {
                        table.fnAddData([
                                "<input type='hidden' value='" + this.id + "' name='CAMPANHA_ID' class='id' />" +
                                    "<a  class='campanhaLink'>" + this.descricao + "</a>",
                                this.vigencia,
                                this.desconto,
                                this.brinde,
                                this.prazo
                            ]);
                    });
                }
            });


        }, 500);


    });

    $(".campanhaLink").live("click", function () {
        var tr = $(this).parents("tr:first");
        var id = $(".id", tr).val();

        window.location.href = controller + "Edit/" + id;
    });

    $(".editarApuracao").live("click", function () {

        var tr = $(this).parents("tr:first");
        EditMode(true, tr);


    });

    $(".confirmarApuracao").live("click", function () {
        var tr = $(this).parents("tr:first");

        var brinde = $("#FLG_BRINDE", tr).length > 0 ? $("#FLG_BRINDE", tr).hasClass("ic-accept") : null;
        var prazo = $("#FLG_PRAZO", tr).length > 0 ? $("#FLG_PRAZO", tr).hasClass("ic-accept") : null;
        var desconto = $("#FLG_DESC_PED", tr).length > 0 ? $("#FLG_DESC_PED", tr).hasClass("ic-accept") : null;
        var campanhaID = $("#CAMPANHA_ID").val();
        var pedidoID = $("#PEDIDO_ID", tr).val();


        $.post(controller + "ConfirmaApuracao", { brinde: brinde, prazo: prazo, desconto: desconto, campanhaID: campanhaID, pedidoID: pedidoID }, function (data) {
            if (data.ok) {

                $(".situacaoPedido", tr).text(data.baixa ? "Apurado" : "Não Apurado");

                ApplyNewDefaultValues(tr);

            } else {
                ReturnDefaultValues(tr);
            }
        });

        EditMode(false, tr);
    });

    $(".cancelarApuracao").live("click", function () {
        var tr = $(this).parents("tr:first");
        ReturnDefaultValues(tr);
        EditMode(false, tr);
    });

    $(".working").live("click", function () {
        if ($(this).hasClass("ic-accept")) {
            $(this).removeClass("ic-accept").addClass("ic-error");
        } else {
            $(this).removeClass("ic-error").addClass("ic-accept");
        }
    });


});

var ApplyNewDefaultValues = function (row) {
    $(".working", row).each(function () {
        if ($(this).hasClass("ic-accept")) {
            $(this).attr("data-initialValue", "True");
        }
        else {
            $(this).attr("data-initialValue", "False");
        }
    });

};

var ReturnDefaultValues = function (row) {
    $(".working", row).each(function () {
        if ($(this).attr("data-initialValue") == "True") {
            $(this).removeClass("ic-error").addClass("ic-accept");
        }
        else {
            $(this).removeClass("ic-accept").addClass("ic-error");
        }
    });

};

var EditMode = function (isEditMode, row) {
    var className = "working";

    if (isEditMode) {
        $(".apurar", row).addClass(className).removeClass("apurar");
        $(".apurar").hide();
        $(".editarApuracao").hide();
        $(".confirmarApuracao", row).show();
        $(".cancelarApuracao", row).show();
    } else {
        $(".apurar").show();
        $("." + className, row).addClass("apurar").removeClass(className);
        $(".editarApuracao").show();
        $(".confirmarApuracao", row).hide();
        $(".cancelarApuracao", row).hide();

    }

};
   