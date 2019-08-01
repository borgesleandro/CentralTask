$(document).ready(function () {

    $("select[multiple]").multiselect().multiselectfilter();
    $("select:not([multiple])").chosen();

    $("#fileUpload").on("change", function (sender) {
        var file = $("#fileUpload").val();
        if (file != "" && file != undefined) {
            var re = /(?:\.([^.]+))?$/;
            if (re.exec(file)[1].toUpperCase() != "CSV") {
                alert("Somente são permitidos arquivos CSV.");
            }
            else {
                $(".blockade").hide();
                $("#resumo").hide();
                $("#botoes").hide();
                $("#buttonsBar").show();
                $("#btnImportar").removeAttr('disabled');
                $("#nomeArquivo").val($("#fileUpload").val());
            }
        }
        else {
            $("#btnImportar").attr('disabled', 'disabled');
        }
    });

    $("#btnImportar").on("click", function () {

        $(".loading-save").show();

        $("#btnImportar").attr("disabled", "disabled");


        
        if ($("#CONDCOM_ID").val() == "") {
            alert("É necessário selecionar a Condição comercial.");
            $("#btnImportar").removeAttr('disabled');
            $(".loading-save").hide();
            return;
        }

        var dataIni = $("#txtDataInicio").val().split("/")[2] + $("#txtDataInicio").val().split("/")[1] + $("#txtDataInicio").val().split("/")[0];
        var dataFim = $("#txtDataTermino").val().split("/")[2] + $("#txtDataTermino").val().split("/")[1] + $("#txtDataTermino").val().split("/")[0];
        var dateNow = new Date();
        var dataHoje = dateNow.getFullYear().toString() + ("0" + (dateNow.getMonth() + 1)).slice(-2) + ("0" + dateNow.getDate()).slice(-2);

        if (dataFim < dataIni) {
            alert("Data final menor que data inicial!");
            $("#btnImportar").removeAttr('disabled');
            $(".loading-save").hide();
            return;
        }

        if (dataFim < dataHoje) {
            var x = confirm("A data final definida para a condição comercial já está expirada. Deseja continuar a importação mesmo assim?");
            if (!x) {
                $("#btnImportar").removeAttr('disabled');
                $(".loading-save").hide();
                return;
            }
        }

        $("form").ajaxForm({
            beforeSend: function () {

                $("#nomeArquivo").val($("#fileUpload").val());
            },
            complete: function (xhr) {
                var result;
                try {
                    result = JSON.parse(xhr.responseText);
                    if (result.success) {

                        alert(result.message);

                        if (result.validacao == false) {
                            $(".loading-save").hide();
                            $("#botoes").hide();
                            //$(".blockade").show();
                        }
                        else {
                            $("#botoes").show();
                        }

                        //só mostra o grid se der algum erro
                        if (result.exibirgrid == true) {
                            $.ajax({
                                type: 'POST',
                                contentType: 'application/json',
                                url: controller + "ListarRegistros",
                                async: false,
                                success: function (response) {
                                if (response.success == false) {
                                    alert(response.data);
                                }
                                else {

                                    //Tabela
                                    $("#resumo").html(response);

                                    $("#erros").dataTable({
                                        "sPaginationType": "full_numbers",
                                        "bAutoWidth": true,
                                        "bProcessing": true,
                                        "bServerSide": false,
                                        "bSort": false,
                                        "oLanguage": {
                                            "sZeroRecords": "Nenhum dado encontrado."
                                        }
                                    });

                                    var csvContent = "data:text/csv;charset=utf-8,\uFEFF";

                                    $("#buttonsBar").hide();
                                    $("#resumo").show();
                                    $("#btnReset").show();
                                    $("#btnReset").on("click", function () {
                                        ReiniciarProcesso();
                                    });
                                }
                                $(".loading-save").hide();
                                },
                                error: function (response) {
                                    $(".loading-save").hide();
                                }
                            });
                        } 
                        $("#buttonsBar").hide();
                        $(".blockade").show();
                        $(".loading-save").hide();
                        //$(".tipsy").hide();
                    }
                    else {
                        alert(result.message);
                        //$("#btnImportar").removeAttr('disabled');
                        $(".loading-save").hide();
                    }
                }
                catch (err) {
                    alert(err);
                    $("#btnImportar").removeAttr('disabled');
                    $(".loading-save").hide();
                }
            }
        });

        $("form").submit();
    });


    $("#CONDCOM_ID").on("change", function (evt) {

        if ($('#CONDCOM_ID').val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "GetDatasCondCom",
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ condcomId: $('#CONDCOM_ID').val() }),
                success: function (result) {

                    if (result.success) {
                        $("#txtDataInicio").val(result.dataInicio);
                        $("#txtDataTermino").val(result.dataTermino);
                        $("#txtDataInicio").removeAttr("disabled");
                        $("#txtDataTermino").removeAttr("disabled");
                    }
                    else {
                        alert("Houve um erro ao obter as datas da condição comercial selecionada.");
                    }

                },
                error: function (result) {
                    alert("Houve um erro ao obter as datas da condição comercial selecionada.");
                }
            });
        }
        else {
            $("#txtDataInicio").val("");
            $("#txtDataTermino").val("");
            $("#txtDataInicio").attr("disabled", "disabled");
            $("#txtDataTermino").attr("disabled", "disabled");
        }
    });

});

function ImportarDados() {

    $("form").attr("action", "ImportacaoDescontoPorQtd/ImportarDados");

    $("form").ajaxForm({
        beforeSend: function () {
            $("button").attr("disabled", true);
        },
        complete: function (result) {

            if (result) {
                alert("Importação de dados realizada com sucesso.");
            }
            else {
                alert("Houve um erro ao finalizar a importação dos dados. Por favor contate o administrador do sitema.");
            }

            $("#btnContinuar").hide();
            $("#btnReset").show();
            $("#btnReset").on("click", function () {
                ReiniciarProcesso();
            });
        }
    });

    $("form").submit();
}

function ReiniciarProcesso() {
    location.reload();
    //$.ajax({
    //    type: 'POST',
    //    contentType: 'application/json',
    //    url: "AtualizacaoDesconto/ReiniciarProcesso",
    //    async: false,
    //    success: function (response) {

    //        if (response) {
    //            location.reload();
    //        }
    //        else {
    //            alert("Houve um erro ao reiniciar o processo de atualização de descontos. Por favor contate o administrador do sitema.");
    //        }

    //    },
    //    error: function (response) {
    //        alert("Houve um erro ao reiniciar o processo de atualização de descontos. Por favor, contacte o administrador do sistema.");
    //    }

    //});
}



