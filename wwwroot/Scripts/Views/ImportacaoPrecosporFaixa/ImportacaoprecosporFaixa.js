$(document).ready(function () {

    $("#fileUploadPrecos").on("change", function (sender) {
        var ok = true;

        var fileFaixas = $("#fileUploadFaixas").val();

        var filePrecos = $("#fileUploadPrecos").val();

        if (filePrecos != "" && filePrecos != undefined) {
            var re = /(?:\.([^.]+))?$/;
            if (re.exec(filePrecos)[1].toUpperCase() != "CSV") {
                alert("Somente são permitidos arquivos CSV.");
            }
            else {
                $("#resumo").hide();
                $("#botoes").hide();
                $("#buttonsBar").show();
                if (fileFaixas != "" && fileFaixas != undefined) {
                    $("#btnImportar").removeAttr('disabled');
                }
                $("#nomeArquivoPrecos").val($("#fileUploadPrecos").val());
            }
        }
        else {
            $("#btnImportar").attr('disabled', 'disabled');
        }
    });


    $("#fileUploadFaixas").on("change", function (sender) {
        var ok = true;

        var filePrecos = $("#fileUploadPrecos").val();

        var fileFaixas = $("#fileUploadFaixas").val();
        if (fileFaixas != "" && fileFaixas != undefined) {
            var re = /(?:\.([^.]+))?$/;
            if (re.exec(fileFaixas)[1].toUpperCase() != "CSV") {
                alert("Somente são permitidos arquivos CSV.");
            }
            else {
                $("#resumo").hide();
                $("#botoes").hide();
                $("#buttonsBar").show();
                if (filePrecos != "" && filePrecos != undefined) {
                    $("#btnImportar").removeAttr('disabled');
                }
                $("#nomeArquivoFaixas").val($("#fileUploadFaixas").val());
            }
        }
        else {
            $("#btnImportar").attr('disabled', 'disabled');
        }
    });
    
    $("#btnImportar").on("click", function () {

        $(".loading-save").show();

        $("form").ajaxForm({
            beforeSend: function () {
                $("#nomeArquivoPrecos").val($("#fileUploadPrecos").val());
                $("#nomeArquivoFaixas").val($("#fileUploadFaixas").val());
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

                                        $("#dados").dataTable({
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
                                    }
                                    $(".loading-save").hide();
                                },
                                error: function (response) {

                                    $(".loading-save").hide();
                                }
                            });

                            //MOTRSRA GRID PRODUTO/QUANTIDADE/FAIXA
                            $.ajax({
                                type: 'POST',
                                contentType: 'application/json',
                                url: controller + "ListarRegistrosProdFaixa",
                                async: false,
                                success: function (response) {
                                    if (response.success == false) {
                                        alert(response.data);
                                    }
                                    else {
                                        //Tabela
                                        $("#resumoProdFaixa").html(response);
                                        $("#dadosProdFaixa").dataTable({
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
                                        $("#resumoProdFaixa").show();
                                    }
                                    $(".loading-save").hide();
                                },
                                error: function (response) {
                                    $(".loading-save").hide();
                                }
                            });

                        }

                        $(".loading-save").hide();
                        $("#buttonsBar").hide();
                    }
                    else {
                        $(".loading-save").hide();
                        alert(result.message);
                    }
                }
                catch (err) {
                    $(".loading-save").hide();
                    alert(err);
                }
            }
        });
        $("form").submit();
    });
});

function ReiniciarProcesso() {
    location.reload();
}



