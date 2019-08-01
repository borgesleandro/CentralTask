var multiselect_produtoid = null;

$(document).ready(function () {

    $("#ID_GRUPO_OL").chosen();

    $("#ID_GRUPO_OL").on("change", function () {

        var selectedValue = $(this).val();
        if (selectedValue != "" && selectedValue > 0) {
            //window.location.href = @Url.Action("Edit", "GrupoOLCNPJ") + "/" + selectedValue;
            window.location.href = controller + "Edit/" + selectedValue;
        }
    });

    multiselect_produtoid = $.rmMultiselect('.multiselect_distribuidorid', { labelActive: 'Distribuidores Disponíveis', labelDeactive: 'Distribuidores Selecionados' });

});