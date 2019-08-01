$(document).ready(function () {
    

    $("select[name='MODULOSIST_ID']").on("change", function () {
        //Apagar items antigos do dropdown de SubCategoria
        var dropdownModulo = $(this);
        var dropdownGrupo = $("#GRUPOSIST_ID");


        $("option", dropdownGrupo).each(function () {
            if ($(this).val() != "") $(this).remove();
        });

        //Carregar items novos
        var selectedValue = dropdownModulo.val();
        if (selectedValue != "" && selectedValue > 0) {

            $.ajax({
                url: controller + "GrupoFill",
                type: "post",
                dataType: "json",
                data: { modulo_id: selectedValue },
                success: function (data) {
                    $(data).each(function () {
                        var text = $(this).prop("Text");
                        var value = $(this).prop("Value");
                        dropdownGrupo.append("<option value='" + value + "'> " + text + "</option>");
                    });
                }
            });
        }
        else {
        }

    });

});