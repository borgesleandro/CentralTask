$(document).ready(function () {

    $("#Bandeiras").chosen();

    $("#Bandeiras").change(function () {
        var container = $("#bandeirascnpj");
        var selectedValue = $("#Bandeiras").val();

        $(".rm-column.deactive.ui-sortable").empty();

        container.html("");

        if (selectedValue != "") {
            $.post(controller + "GetCNPJs", { bandeiraId: selectedValue }, function (response) {
                container.html(response);
            }, "html");
        }
    });

    $(document).on("click", ".btn-salvar", function () {

        ////Habilita imagem de LOAD
        $(".loading-save").show();

        var items = $(".rm-column.active .rm-column-item");
        var data = {
            bandeiraCNPJs: [],
            bandeiraId: $("#Bandeiras").val()
        };

        $.each(items, function (i, item) {
            data.bandeiraCNPJs.push($(item).attr("data-value"));
        });

        $.ajax({
            url: controller + "Salvar",
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST',
            success: function (response) {
                if (response.ok) {
                    var strSucesso = "Registros salvos com sucesso.";
                    //if (response.inseridos)
                    //    strSucesso += "\n" + response.inseridos + " CNPJs associados."
                    //if (response.removidos)
                    //    strSucesso += "\n" + response.removidos + " CNPJs desassociados."
                    alert(strSucesso);
                    $(".loading-save").hide();
                } else {
                    alert(response.erros.join("<br />"));
                    $(".loading-save").hide();
                }
            }
        });
    });

});