var multiselect_distribuicao = null;

$(document).ready(function () {

    $("#CNPJ_OL").on("change", function () {

        var selectedValue = $(this).val();
        if (selectedValue != "" && selectedValue > 0) {
            window.location.href = controller + "ListDivisions/" + selectedValue;
        }
    });

    multiselect_distribuicao = $.rmMultiselect('.multiselect_distribuicao', { labelActive: 'Divisões Disponíveis', labelDeactive: 'Divisões Selecionadas' });

});