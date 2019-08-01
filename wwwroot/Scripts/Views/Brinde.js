$(document).ready(function () {
    $("#VALOR.mws-textinput").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });

    $("select[name='BRINDECATEG_ID']").on("change", function () {
        //Apagar items antigos do dropdown de SubCategoria
        var dropdownCateg = $(this);
        var dropdownSubCateg = $("#BRINDESUBCAT_ID");


        $("option", dropdownSubCateg).each(function () {
            if ($(this).val() != "") $(this).remove();
        });

        //Carregar items novos
        var selectedValue = dropdownCateg.val();
        if (selectedValue != "" && selectedValue > 0) {

            $.ajax({
                url: '@Url.Action("SubCategFill", "Brinde")',
                type: "post",
                dataType: "json",
                data: { brindecateg_id: selectedValue },
                success: function (data) {
                    $(data.trd_brindesubcat).each(function () {
                        var text = $(this).prop("Text");
                        var value = $(this).prop("Value");
                        dropdownSubCateg.append("<option value='" + value + "'> " + text + "</option>");
                    });
                }
            });
        }
        else {
        }

    });

});