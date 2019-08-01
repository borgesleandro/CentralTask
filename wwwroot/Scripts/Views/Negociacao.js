$(document).ready(function () {
    var brindeForm = $(".brindes-form", ".mws-form");
    
    $.validator.addMethod('requiredCheck', function (value, element) {
        return $("input:checked", ".checks").length > 0;
    }, "Selecione pelo menos 1 Tipo de Negociação");

    $("#CNPJ_DIST").on("change", function () {
        var selectedValue = $(this).val();
        if (selectedValue != "" && selectedValue > 0) {
            window.location.href = "/Negociacao/Edit/" + selectedValue;
        }
        else {
            window.location.href = "/Negociacao/Edit";
        }
    });
    $("#chkBrindes").on("change", function () {
        var selectedValue = $(this).is(':checked');
        if (selectedValue == true) {
            brindeForm.show();
        }
        else {
            closeBrindeDiv(brindeForm);
        }

    });


    $(".mws-form").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") error.insertAfter($("input:last", ".checks"));
            else error.insertAfter(element);
        }
    });


});

var closeBrindeDiv = function (brindeForm) {
    brindeForm.hide();
};
