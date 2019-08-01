$(document).ready(function () {
    var form = $(".mws-form");
    $("#Desconto").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });



    $(".salvar").live("click", function () {
        if (form.valid() && $(".chzn-select").val() != null) {
            form.submit();
        } else {
            if ($(".chzn-select").val() == null) {
                $(".divisaoError").removeClass("field-validation-valid").addClass("field-validation-error").text("Este campo é obrigatório");
            }
        }


    });

//    $(".datepicker").live("change", function () {
//        var count = 0;
//        $(".datepicker").each(function () {
//            if ($(this).val() != "")
//                count++;
//        });

//        $(".descontoError").removeClass("field-validation-error").html('');
//        if (count == $(".datepicker").length) {
//            $(".descontoValor").removeAttr("disabled").removeClass("input-validation-error");
//            $.post(controller + "GetValorMaximo", { dataInicial: $(".datepicker:first").val(), dataFinal: $(".datepicker:last").val() }, function (data) {
//                if (data != null & data > 0) {
//                    $(".descontoValor").attr("valor-maximo", data).addClass("valorMaximo");

//                    $.validator.addMethod('valorMaximo', function (value, element) {
//                        var descontoValue = parseFloat($(element).val().replace(",", "."));
//                        var descontoMaxValue = parseFloat($(element).attr("valor-maximo"));
//                        return descontoMaxValue >= descontoValue;
//                    }, "O valor máximo de desconto permitido é de " +  $(".descontoValor").attr("valor-maximo") + ", de acordo com a política regente.");

//                }
//            });
//        } else {
//            $(".descontoValor").attr("disabled", "disabled").removeClass("valorMaximo").val("");
//            
//        }

//    });



});

