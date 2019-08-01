$(document).ready(function () {

    $("#EQZORIGEM.mws-textinput").mask("999999");
    $("#EQZDESTINO.mws-textinput").mask("999999");

    $("#EQZORIGEM").on("click", function () { $("#EQZORIGEM").focus(); });
    $("#EQZDESTINO").on("click", function () { $("#EQZDESTINO").focus(); });


    $("#btnValidar").on("click", function () {

        if ($("#EQZORIGEM").val() == "" || $("#EQZDESTINO").val() == "") {
            alert("Favor informar setores de origem e destino válidos.");
            return;
        };

        if ($("#EQZORIGEM").val() == $("#EQZDESTINO").val()) {
            alert("Setor de origem deve ser diferente do setor de destino");
            return;
        };

        $(".loading-save").show();

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "Rezoneamento/Validar",
            async: true,
            data: JSON.stringify({ eqzorigem: $("#EQZORIGEM").val(), eqzdestino: $("#EQZDESTINO").val() }),
            success: function (response) {
                if (response == "") {
                    alert("Setor de origem ou de destino não encontrado.");
                    $(".loading-save").hide();
                }
                else {
                    $("#rezoneamento").html(response);
                    $(".loading-save").hide();
                    $(".blockade").show();
                    $("#btnTransferir").removeAttr("disabled");
                    $("#btnVoltar").removeAttr("disabled");
                }
            },
            error: function (response) {
                alert(response);
                $(".loading-save").hide();
            }
        });

    });

    $("#btnTransferir").on("click", function () {

        $(".loading-save").show();

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "Rezoneamento/Transferir",
            async: false,
            data: JSON.stringify({ eqzorigem: $("#EQZORIGEM").val(), eqzdestino: $("#EQZDESTINO").val() }),
            success: function (response) {

                $("#EQZORIGEM").val("");
                $("#EQZDESTINO").val("");
                $(".loading-save").hide();
                if (confirm("Transferência realizada com sucesso."))
                { location.reload(); }
            },
            error: function (response) {
                alert(response);
                $(".loading-save").hide();
            }
        });
    })

    $("#btnVoltar").on("click", function () {

        $(".loading-save").hide();
        $(".blockade").hide();
        $(".representante").hide();
        $("#btnTransferir").attr("disabled", "disabled");
        $("#btnVoltar").attr("disabled", "disabled");
    }
)
});