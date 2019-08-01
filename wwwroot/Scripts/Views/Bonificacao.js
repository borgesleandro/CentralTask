$(document).ready(function () {

    $("#CNPJ_DIST").on("change", function () {

        var selectedValue = $(this).val();
        var action = $(this).attr('action');
        if (selectedValue != "" && selectedValue > 0) {
            window.location.href = action + "/" + selectedValue;
        }
    });

    /*
    $("#edit-bonificacao").click(function () {

        var selectedValue = $("#CNPJ_DIST").val();
        if (selectedValue != "" && selectedValue > 0) {
            window.location.href = '@Url.Action("Edit","Bonificacao")' + "/" + selectedValue;
        }
    });
    */

});