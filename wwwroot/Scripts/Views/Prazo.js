"@using SalesFarmaAdministrator"

$(document).ready(function () {
    if ($(".spinner").val() == "") {
        $(".spinner").val('0');
    }

    $("#QTD_PARCELAS").spinner({ min: 0, places: 0, step: 1 });
    $('#modal-add-prazo-ite #prazo-ite-dias').spinner({ min: 0, places: 0, step: 5 });

    $('#grid-parcelas-items').sortable({
        update: function (event, ui) {
            updateGridParcelas();
        }
    });

    $('#FLG_PRAZO_CLI').change(function () {
        if ($(this).val() == 0) {
            $('#panel-add-parcela').show();
            return true;
        }
        $('#panel-add-parcela').hide();
    });

    $('#btn-save-prazo').click(savePrazo);

    $("#btn-add-item-parcela").click(function () {
        var form_item = $(this).attr("form-item");
        $(form_item).dialog({
            autoOpen: true,
            title: "Adicionar Item de Prazo",
            modal: true,
            width: "auto",
            resizable: false,
            buttons: [{
                text: "Cancelar",
                "class": "mws-button gray",
                click: function () {
                    $(this).dialog("close");
                }
            }]
        })
            .parent()
            .find('.ui-dialog-buttonset')
            .prepend($('<a class="mws-button blue">Incluir</a>').click(addPrazoIte));
    });

    $('.remove-prazo-item').live('click', function () {
        var data_seq = $(this).attr('data-seq');
        var grid = $(this).closest("table");
        var form_item = $("#modal-del-prazo-ite");
        $(form_item).dialog({
            autoOpen: true,
            title: "Excluir item de prazo",
            modal: true,
            width: "auto",
            resizable: false,
            buttons: [{
                text: "Cancelar",
                "class": "mws-button gray",
                click: function () {
                    $(this).dialog("close");
                }
            }]
        })
            .parent()
            .find('.ui-dialog-buttonset')
            .prepend($('<a class="mws-button red">' + '@Resources.LabelRemove' + '</a>').click(function () {
                grid.find('tr[data-seq=' + data_seq + ']').remove();
                updateGridParcelas();
                $('#modal-del-prazo-ite').dialog("close");
            }));

    });

    $('#FLG_PRAZO_CLI').change();
});

var addPrazoIte = function () {
    if ($("#QTD_PARCELAS").val() > $('#grid-parcelas-items tr').length) {
        var valueDias = $('#modal-add-prazo-ite #prazo-ite-dias').val();
        $('#grid-parcelas-items').append('<tr data-seq=""><td><span></span></td><td><input type="hidden" name="PRAZO_ITEMS" value="'+ valueDias +'"/>' + valueDias + '</td><td><li data-seq="" class="mws-ic-16 ic-cross li_icon li_only_icon remove-prazo-item"></li></td></tr>');
        $('#modal-add-prazo-ite #prazo-ite-dias').spinner("value", 0);
        updateGridParcelas();
        $('#modal-add-prazo-ite').dialog("close");
        return;
    }
    alert("Numero de parcelas ultrapassadas.");
};

var updateGridParcelas = function () {
    var items = $('#grid-parcelas-items').find('tr');
    $.each(items, function (index, item) {
        $(item).find('span').html(index + 1);
        $(item).attr('data-seq', index + 1);
        $(item).find('.remove-prazo-item').attr('data-seq', index + 1);
    });
}

var savePrazo = function () {
    if (($("#QTD_PARCELAS").val() == $('#grid-parcelas-items tr').length) || $('#FLG_PRAZO_CLI').val() == '1') {
        $("#form-prazo").submit();
        return true;
    }
    alert("Parcelas não correspondentes");
    return false;
};