var multiselect_produtoid = null;

$(document).ready(function () {

    $("#GRUPO_ID").on("change", function () {

        var selectedValue = $(this).val();
        if (selectedValue != "" && selectedValue > 0) {
            //window.location.href = '@Url.Action("Edit", "GrupoProduto")' + "/" + selectedValue;
            window.location.href = controller + "Edit/" + selectedValue;
        }
    });

    multiselect_produtoid = $.rmMultiselect('.multiselect_produtoid', { labelActive: 'Produtos Disponíveis', labelDeactive: 'Produtos Selecionados' });

});