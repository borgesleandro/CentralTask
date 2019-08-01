$(document).ready(function () {

    $("#TIPO_CARGA").change(function (e) {

        if ($("#TIPO_CARGA").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterOperacoesPorTipoDeCarga",
                contentType: "application/json",
                data: JSON.stringify({ tipoCarga: $("#TIPO_CARGA").val() }),
                success: function (data) {

                    $("#TIPO_OPERACAO").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#TIPO_OPERACAO").append(option);
                    });

                    $("#TIPO_OPERACAO").removeAttr("disabled");

                },
                error: function (data) {
                    alert("Não foi possível obter a lista de operaçoes.");
                }
            });

        }
        else {
            $("#TIPO_OPERACAO").empty();
            $("#TIPO_OPERACAO").attr("disabled", "disabled");
        }

    });

    $("#TIPO_OPERACAO").on("change", function (e) {

        if ($("#TIPO_OPERACAO").val() != "") {

            $("#btnLayout").removeAttr("disabled");
            $("#listagem").html("");

            var model = {
                TIPO_OPERACAO: $("#TIPO_OPERACAO").val(),
                TIPO_CARGA: $("#TIPO_CARGA").val()
            };

            $.ajax({
                type: "POST",
                url: controller + "ListArquivosDisponiveis",
                contentType: "application/json",
                data: JSON.stringify(model),
                success: function (data) {

                    $("#listagem").html(data);

                },
                error: function (data) {

                    alert(data);

                }
            });

        }
        else {

        }

    });

    $("#fileUpload").on("change", function (sender) {
        var file = $("#fileUpload").val();
        if (file != "" && file != undefined) {
            var re = /(?:\.([^.]+))?$/;
            if (re.exec(file)[1].toUpperCase() != "CSV") {
                alert("Somente são permitidos arquivos CSV.");
            }
            else {
                $("#btnImportar").removeAttr('disabled');
                $("#nomeArquivo").val($("#fileUpload").val());
            }
        }
        else {
            $("#btnImportar").attr('disabled', 'disabled');
        }
    });

    $("#btnLayout").on("click", function (e) {

        var model = {
            TIPO_OPERACAO: $("#TIPO_OPERACAO").val(),
            TIPO_CARGA: $("#TIPO_CARGA").val()
        };

        $.ajax({
            type: "POST",
            url: controller + "ObterLayoutPorOperacaoCarga",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                $("#downloadTargetDiv").html("<a id='anchorLayout' href='" + downloadUrl + "' download='LayoutPadrao.csv' class=''><img src='Content/botao-salvar-download-vertical.png'/></a>");

                $("#anchorLayout").get(0).click();

            },
            error: function (response) {

                alert("Não foi possível obter o arquivo de layout.");

            }
        });

    });

    $("#btnImportar").on("click", function (e) {

        $("form").ajaxForm({

            beforeSend: function () {
                $("button").attr("disabled", true);
                $("#nomeArquivo").val($("#fileUpload").val());
            },

            complete: function (xhr) {
                var result = JSON.parse(xhr.responseText)
                if (result.success) {
                    alert("Arquivo salvo com sucesso.");
                    $("#TIPO_OPERACAO").trigger("change");
                }
                else {
                    alert(result.message);
                }
            }

        });

        $("form").submit();

    });

    $("#btnExecutarCarga").on("click", function (e) {

        $("#btnExecutarCarga").attr("disabled","disabled");

        var model = {
            TIPO_OPERACAO: $("#TIPO_OPERACAO").val(),
            TIPO_CARGA: $("#TIPO_CARGA").val(),
            SOMENTE_SEM_ERROS: ($("#chkExecutarSomenteSemErros").attr("checked") == "checked" ? true : false)
        };

        $.ajax({
            type: "POST",
            url: controller + "ExecutarCarga",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {

                if (data.success == true) {

                    alert("Carga executada com sucesso.");

                }
                else {
                    alert("Problemas ao executar a carga. Por favor tente novamente mais tarde.");
                }

            },
            error: function (data) {

                alert("Houve um erro ao realizar a pré-carga do arquivo.")

            }
        });
    });

    $("#btnVoltar").on("click", function (e) {

        $("#TIPO_OPERACAO").trigger("change");
        $("#btnVoltar").hide();
        $("#btnExecutarCarga").hide();
        $("#TIPO_CARGA").removeAttr("disabled");
        $("#TIPO_OPERACAO").removeAttr("disabled");
        $("#divFile").show();
        $("#btnImportar").show();

    });

    $("#btnDownloadErros").on("click", function (e) {

        var model = {
            TIPO_OPERACAO: $("#TIPO_OPERACAO").val(),
            TIPO_CARGA: $("#TIPO_CARGA").val()
        };

        $.ajax({
            type: "POST",
            url: controller + "ExportarExcelErros",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (response, status, request) {


                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                $("#downloadTargetDiv").html("<a id='anchorLayout' href='" + downloadUrl + "' download='Erros.csv' class=''><img src='Content/botao-salvar-download-vertical.png'/></a>");

                $("#anchorLayout").get(0).click();

            },
            error: function (response) {

                alert("Não foi possível obter o arquivo de erros.");

            }
        });

    });

    $("#chkExecutarSomenteSemErros").on("change", function (e) {

        if (this.checked)
            $("#btnExecutarCarga").removeAttr("disabled");
        else
            $("#btnExecutarCarga").attr("disabled", "disabled");

    });

});

function PreCarregarArquivo(PATH) {

    var model = {
        TIPO_OPERACAO: $("#TIPO_OPERACAO").val(),
        TIPO_CARGA: $("#TIPO_CARGA").val(),
        PATH: PATH
    };

    $("#PATH").val(PATH);
    $("#TIPO_CARGA").attr("disabled", "disabled");
    $("#TIPO_OPERACAO").attr("disabled", "disabled");
    $("#divFile").hide();
    $("#btnImportar").hide();
    $("#btnLayout").hide();
    $("#btnHistorico").hide();
    $("#btnVoltar").show();

    $.ajax({
        type: "POST",
        url: controller + "PreCarregarArquivo",
        contentType: "application/json",
        data: JSON.stringify(model),
        success: function (data) {

            if (data.success == false) {

                alert(data.message);
                $("#TIPO_CARGA").removeAttr("disabled");
                $("#TIPO_OPERACAO").removeAttr("disabled");
                $("#divFile").show();
                $("#btnImportar").show();

            }
            else {

                $("#listagem").html("");
                $("#listagem").html(data);
                
                $("#btnExecutarCarga").show();
                $("#divSomenteSemErros").show();

                if ($("#hiddenPermiteCarga").val() == "true")
                    $("#btnExecutarCarga").removeAttr("disabled");

            }

        },
        error: function (data) {

            alert("Houve um erro ao realizar a pré-carga do arquivo.")

        }
    });

}

function ExcluirArquivo(PATH) {

    $.ajax({
        type: "POST",
        url: controller + "ExcluirArquivo",
        contentType: "application/json",
        data: JSON.stringify({ PATH: PATH }),
        success: function (data) {

            alert("Arquivo excluído com sucesso.")
            $("#TIPO_OPERACAO").trigger("change");

        },
        error: function (data) {

            alert("Houve um erro ao excluir o arquivo.")

        }
    });

}