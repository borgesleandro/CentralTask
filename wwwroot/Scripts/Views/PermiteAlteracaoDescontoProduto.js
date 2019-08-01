$(document).ready(function () {
    $("#Linhas").change(function () {

        carregaprodutos();
        
    });

    $("#Divisoes").change(function () {

        $("#Linhas").empty();
        $("#produtos").html("");

        if ($("#Divisoes").val() != "") {
            $.ajax({
                type: "POST",
                url: controller + "ObterLinhas",
                contentType: 'application/json',
                data: JSON.stringify({ coddiv: $('#Divisoes').val() }),
                success: function (data) {
                    
                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Selecione uma opção");
                    $("#FARMACIA").append(option);

                    $("#Linhas").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#Linhas").append(option);
                    });

                }
            });
        }

    });



     




    $(document).on("click", ".btn-salvar", function () {

        var items = $(".rm-column.active .rm-column-item");
        var data = {
            PodeAltDescontoProd: [],
            divisao: $("#Divisoes").val(),
            linha: $("#Linhas").val()
        };

        $.each(items, function (i, item) {
            var obj = {};
            obj.SEQPROD = parseInt($(item).attr("data-value"));
            //obj.TIPO_ESTOQUE = parseInt($(item).find("select").val());
            obj.COD_PROD = parseInt($(item).text().split(" ")[0])

            data.PodeAltDescontoProd.push(obj);

        });


        $(".loading-save").show();

        $.ajax({
            url: controller + "Salvar",
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST',
            success: function (response) {
                if (response.ok) {
                    $(".loading-save").hide();
                    alert("Registros salvos com sucesso");
                } else {
                    $(".loading-save").hide();
                    alert(response.erros.join("<br />"));
                }
            }
        });

 
    });
});


function carregaprodutos()
{

    $(".loading-save").show();


    var produtosContainer = $("#produtos");
    var selectedValue = $("#Linhas").val();
    var divisao = $("#Divisoes").val();

    produtosContainer.html("");

    if (selectedValue != "" && divisao != "") {
        $.post(controller + "GetProdutos", { linha: selectedValue, divisao: divisao }, function (response) {
            produtosContainer.html(response);

            $(".loading-save").hide();
                
        }, "html");
    }
}