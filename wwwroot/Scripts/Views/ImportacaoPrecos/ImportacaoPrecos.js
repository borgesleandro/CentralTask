$(document).ready(function () {
    


    $("#fileUpload").on("change", function (sender) {
        var file = $("#fileUpload").val();
        if (file != "" && file != undefined) {
            var re = /(?:\.([^.]+))?$/;
            if (re.exec(file)[1].toUpperCase() != "CSV") {
                alert("Somente são permitidos arquivos CSV.");
            }
            else {
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

        //$("#btnImportar").attr("disabled", "disabled");
        
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
                        }


                        $(".loading-save").hide();
                        $("#buttonsBar").hide();
                        //$("#fileUpload").hide();



                        //$(".blockade").show();
                        $("#btnContinuar").show();
                        $("#btnContinuar").on("click", function () {

                            ImportarDados();

                        });
                        
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

        //$(".loading-save").hide();

        $("form").submit();
    });





});




function ImportarDados() {

    $("form").attr("action", "ImportacaoPrecos/ImportarDados");

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
}



