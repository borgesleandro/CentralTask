$(document).ready(function () {

    $(document).on("change", ".mws-form input:not(.Filtro), .mws-form select", function () {
        $(".Export").hide();
        $(".containerErrosPharmalinkConsolidado").html("");
    });

    var currentAjaxRequest = null;

    $(document).on("click", ".Filtro", function () {

        var dataIniStrArray = $("#dataInicial").val().split('/');
        var dataIniStr = dataIniStrArray[2] + dataIniStrArray[1] + dataIniStrArray[0];

        var dataFinStrArray = $("#dataFinal").val().split('/');
        var dataFinStr = dataFinStrArray[2] + dataFinStrArray[1] + dataFinStrArray[0];

        //var dataAtuStrArray = new Date(); //.val().split('/');
        //var dataAtuStr = dataAtuStrArray[2] + dataAtuStrArray[1] + dataAtuStrArray[0];

        var today = new Date();
        var dataAtuStr = today.toISOString().slice(0, 10).replace(/-/g, "");

        if (dataFinStr < dataIniStr) {
            alert("A data final deve ser maior do que a data inicial.");
            return;
        }

        if (dataFinStr > dataAtuStr) {
            alert("A data final não pode ser maior que a data atual.");
            return;
        }

        //$(".Export").show();
        $(".loading-save").show();
        if (currentAjaxRequest != null) currentAjaxRequest.abort();
        var sendData = {};
        sendData.erroImp = $("#Erros").val();
        sendData.dataInicial = $("#dataInicial").val();
        sendData.dataFinal = $("#dataFinal").val();
        sendData.tipoData = $("#tipoData:checked").val();


        currentAjaxRequest = $.post(controller + "Filtro", sendData, function (data) {


            $(".containerErrosPharmalinkConsolidado").text("");
            $(".containerErrosPharmalinkConsolidado").append(data);

            $(".loading-save").hide();

        }).fail(function () {
            $(".loading-save").hide();
            $(".Export").hide();
            $(".containerErrosPharmalinkConsolidado").text("");
            alert("Ocorreu um erro ao carregar o relatório");
        });
    });

    

    $("#dataInicial").on("change", function () {

        GetErros();

    });

    $("#dataFinal").on("change", function () {

        GetErros();

    });

});

function GetErros() {

    var model = {

        tipoData: $("#tipoData").val(),
        dataInicial: $("#dataInicial").val(),
        dataFinal: $("#dataFinal").val()

    };

    $("#Erros").empty();
    $("#Erros").attr("disabled","disabled");

    $.ajax({
        type: "POST",
        url: controller + "GetErros",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {

            var option = $('<option></option>');
            option.text("Todos");
            $("#Erros").append(option);

            $.each(data, function () {
                var option = $('<option></option>');
                option.text(this);
                $("#Erros").append(option);
            });

            $("#Erros").removeAttr("disabled");

        },
        error: function (data) {
            alert("Não foi possível obter os erros.");
        }
    });

};



