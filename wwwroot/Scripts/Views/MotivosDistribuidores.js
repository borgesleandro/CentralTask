$(document).ready(function () {
    $("#OperadoresLogisticos").chosen();

    $("#btn-incluir").click(function() {
        window.location = controller + "Create?cnpjDistribuidor=" + $("#OperadoresLogisticos").val();
    });

    $(document).on("click", ".excluir-motivo", function () {
        var button = $(this);

        alert("Deseja excluir o registro selecionado?", "Exclusão de motivo", null, function() {
            $.post(controller + "Excluir", { id: button.attr("data-id") }, function (response) {
                if (response.ok) {
                    var row = button.closest("tr").get(0);
                    var table = $(".mws-datatable-fn").dataTable();

                    table.fnDeleteRow(table.fnGetPosition(row));
                } else {
                    alert("Ocorreu um erro ao tentar remover o regsitro: " + response.error);
                }
            }, "json").fail(function () {
                alert("Ocorreu um erro ao tentar remover o regsitro");
            });
        });
    });

    $("#duplicar-motivos").click(function () {
        if ($('#OperadoresLogisticos').val() != "") {
            $.get(controller + "Duplicar", null, function (response) {

                var cnpjDestino;
                var cnpjOrigem;

                //$(document).on("change", , function () {
                //    cnpjDestino = $(this).val();
                //});

                $(document).on("change", "#OperadoresLogisticosDuplicar", function () {
                    cnpjOrigem = $(this).val();
                });

                alert(response, "Copiar motivos de outro OL", null, null, null, {
                    height: 300,
                    callBack: function () {

                        var cnpjDestino = $("#OperadoresLogisticos").val();

                        $.post(controller + "ValidarDuplicacao", { cnpjDestino: cnpjDestino }, function (responseValidacao) {
                            alert(responseValidacao.message, "Cópia de Problemas de OL", null, function () {

                                //var cnpjOrigem = $("#OperadoresLogisticosDuplicar").val();

                                $.post(controller + "Duplicar", { cnpjDestino: cnpjDestino, cnpjOrigem: cnpjOrigem }, function (duplicarResponse)
                                {
                                    if (duplicarResponse.ok) {
                                        $.post(controller + "List", { cnpj: cnpjDestino }, function (result) {
                                            $("#motivos").html(result);
                                            $(".mws-datatable-fn").dataTable({
                                                "sPaginationType": "full_numbers"
                                            });
                                        });
                                    } else {
                                        alert("Ocorreu um erro ao tentar duplicar os motivos: " + duplicarResponse.message);
                                    }
                                }, "json");
                            }, null, null);
                        });
                    }
                });
            });
        } else {
            alert("Selecione um operador logístico.");
        }
    });

    $(document).on("change", "#OperadoresLogisticos", function () {
        if ($(".OperadoresLogisticos").val() != "") {
            $.post(controller + "List", { cnpj: $("#OperadoresLogisticos").val() }, function (response) {
                $("#motivos").html(response);
                $(".mws-datatable-fn").dataTable({
                    "sPaginationType": "full_numbers"
                });
            });
        }
    });

    if ($("#OperadoresLogisticos").val()) {
        $.post(controller + "List", { cnpj: $("#OperadoresLogisticos").val() }, function (response) {
            $("#motivos").html(response);
            $(".mws-datatable-fn").dataTable({
                "sPaginationType": "full_numbers"
            });
        });
    }
});