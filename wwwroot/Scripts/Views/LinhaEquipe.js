$(document).ready(function () {
    $("#Equipes").change(function () {

        var selectedCODDIV = $('#Divisoes').val();
        var selectedEquipe = $('#Equipes').val();
        var linhas_container = $("#linhas");
        linhas_container.html("");
        if (selectedCODDIV != "" && selectedEquipe != "") {

            $.post(controller + "Getlinhas", { divisao: selectedCODDIV , equipe: selectedEquipe  }, function (data) {
                linhas_container.html(data);
            }, "html");
        }
    });

    $("#Divisoes").change(function () {

        $("#Linhas").empty();
        $("#Equipes").html("");

        if ($("#Divisoes").val() != "") {
            $.ajax({
                type: "POST",
                url: controller + "ObterEquipes",
                contentType: 'application/json',
                data: JSON.stringify({ coddiv: $('#Divisoes').val() }),
                success: function (data) {

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Selecione uma opção");

                    $("#Equipes").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#Equipes").append(option);
                    });

                }
            });
        }

    });

    $(document).on("click", ".btn-salvar", function () {

        var items = $(".rm-column.active .rm-column-item");
        var data = {
            linhas: [],
            divisao: $("#Divisoes").val(),
            equipe: $("#Equipes").val()
        };

        $.each(items, function (i, item) {
            var obj = {};
            obj.PKFK_CODLINHA = $(item).attr("data-value");
            data.linhas.push(obj);
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