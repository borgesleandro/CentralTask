$(document).ready(function () {

    

    $(document).on("change", "#DESCRICAO", function () {
        $(".atualizarButton").hide();
        if ($("#DESCRICAO").val() != "") {

            $.post(controller + "GetParametrizacaoCobranca", { descricao: $("#DESCRICAO").val() }, function (data) {
                $(".parametrizacaoContainer").html(data);
            }, "html");

            $(".atualizarButton").show();
        }


    });


    $(document).on("click", ".atualizarButton", function () {
        $.post(controller + "Atualizar", $(".parametrizacaoForm").serialize(), function (data) {
            if (data == "") {
                alert("Registro atualizado com sucesso");
            }
            else {
                alert(data);
            }

        }, "json");
    });


});
