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
                $("#btnImportar").removeAttr('disabled');
                $("#nomeArquivo").val($("#fileUpload").val());
            }
        }
        else {
            $("#btnImportar").attr('disabled', 'disabled');
        }
    });

    $("#btnImportar").on("click", function () {

        $("#btnImportar").attr("disabled", "disabled");

        var dataIni = $("#txtDataInicio").val().split("/")[2] + $("#txtDataInicio").val().split("/")[1] + $("#txtDataInicio").val().split("/")[0];
        var dataFim = $("#txtDataTermino").val().split("/")[2] + $("#txtDataTermino").val().split("/")[1] + $("#txtDataTermino").val().split("/")[0];
        var dateNow = new Date();
        var dataHoje = dateNow.getFullYear().toString() + ("0" + (dateNow.getMonth() + 1)).slice(-2) + ("0" + dateNow.getDate()).slice(-2);

        if (dataFim < dataIni) {
            alert("Data final menor que data inicial!");
            return;
        }

        if (dataFim < dataHoje) {
            var x = confirm("A data final definida para a condição comercial já está expirada. Deseja continuar a importação mesmo assim?");
            if (!x)
                return;
        }

        if ($("#CODDIV").val() == "") {
            alert("É necessário selecionar a Companhia.");
            return;
        }

        if ($("#EQUI_EQUIPE").val() == "") {
            alert("É necessário selecionar a Equipe.");
            return;
        }

        if ($("#CNPJ_OL").val() == "" || $("#CNPJ_OL").val() == null) {
            alert("É necessário selecionar ao menos um Distribuidor.");
            return;
        }
        else {
            if ($("#CNPJ_OL option").length != $("#CNPJ_OL").val().length)
            {
                var x = confirm("Você não selecionou todos os distribuidores relacionados à condição comercial. Deseja continuar a importar sem todos os distribuidores estarem selecionados?");
                if (!x)
                    return;
            }
        }

        $("form").ajaxForm({
            beforeSend: function () {
                
                $("#nomeArquivo").val($("#fileUpload").val());
            },
            complete: function (xhr) {
                var result;
                try
                { result = JSON.parse(xhr.responseText);
                    if (result.success) {
                        alert(result.message);
                        if (result.validacao) {
                            $(".blockade").show();
                        }
                        else {
                            $.ajax({
                                type: 'POST',
                                contentType: 'application/json',
                                url: controller + "ListarErros",
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
                                    }

                                    $(".loading-save").hide();
                                },
                                error: function (response) {
                                    $(".loading-save").hide();
                                }
                            });

                            $("#aNovaCondCom").hide();
                            $("#buttonsBar").hide();
                            $("#fileUpload").hide();

                            $(".blockade").show();
                            $("#btnContinuar").show();
                            $("#btnContinuar").on("click", function () {

                                ImportarDados();

                            });
                        }
                    }
                    else {
                        alert(result.message);
                    }
                }
                catch (err)
                {
                    alert(err);
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

        if ($('#CONDCOM_ID').val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "GetDistribuidores",
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ condcomId: $('#CONDCOM_ID').val() }),
                success: function (data) {

                    $("#CNPJ_OL").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CNPJ_OL").append(option);
                    });

                    $("#CNPJ_OL").removeAttr("disabled");
                    $("#CNPJ_OL").multiselect('refresh');
                },
                error: function (data) {
                    alert("Houve um erro ao obter a lista de equipes.");
                }
            });
        }
        else {
            $("#CNPJ_OL").empty();
            $("#CNPJ_OL").attr("disabled", "disabled");
            $("#CNPJ_OL").trigger("liszt:updated");
        }

    });

    $("#CODDIV").on("change", function (evt) {

        if ($('#CODDIV').val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "GetEquipes",
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ coddiv: $('#CODDIV').val() }),
                success: function (data) {

                    $("#EQUI_EQUIPE").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#EQUI_EQUIPE").append(option);
                    });

                    $("#EQUI_EQUIPE").removeAttr("disabled");
                    $("#EQUI_EQUIPE").trigger("liszt:updated");
                },
                error: function (data) {
                    alert("Houve um erro ao obter a lista de equipes.");
                }
            });
        }
        else {
            $("#EQUI_EQUIPE").empty();
            $("#EQUI_EQUIPE").attr("disabled", "disabled");
            $("#EQUI_EQUIPE").trigger("liszt:updated");
        }

    });

});

function ImportarDados() {

    $("form").attr("action", "AtualizacaoDesconto/ImportarDados");

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



