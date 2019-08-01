$(document).ready(function () {

    $("#CODDIV").change(function (e) {

        if ($("#CODDIV").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterEquipesPorCia",
                contentType: "application/json",
                data: JSON.stringify({ cia: $("#CODDIV").val() }),
                success: function (data) {

                    $("#EQUI_EQUIPE").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("---");
                    $("#EQUI_EQUIPE").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#EQUI_EQUIPE").append(option);
                    });

                    $("#EQUI_EQUIPE").removeAttr("disabled");

                },
                error: function (data) {
                    alert("Não foi possível obter as equipes.");
                }
            });

        }
        else {
            $("#EQUI_EQUIPE").empty();
            $("#EQUI_EQUIPE").attr("disabled", "disabled");
        }

    });

    $("#btnPesquisar").on("click", function () {

        $(".loading-save").show();

        if ($("#CODDIV").val() == "" || $("#EQUI_EQUIPE").val() == "") {
            alert("Companhia e Equipe devem ser preenchidos.");
            $(".loading-save").hide();
        }

        var model = {

            CODDIV: $("#CODDIV").val(),
            EQUIPE: $("#EQUI_EQUIPE").val(),
            EQZGD: $("#REGD_GD").val(),
            EQZ: $("#EQZ").val(),
            REPR_NOME: $("#REPR_NOME").val(),
            DIAS_ULT_COMUNIC: $("#DIAS").val(),
            VERSAO: $("#VERSAO").val(),

        };

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "ControleComunicacao/Pesquisar",
            async: true,
            data: JSON.stringify(model),
            success: function (response) {

                if (response.success == false) {
                    alert(response.data);
                }
                else {

                    //Tabela
                    $("#controlecomunicacao").html(response);

                    $("#representantes").dataTable({
                        "bPaginate": false,
                        "bAutoWidth": true,
                        "bProcessing": true,
                        "bServerSide": false,
                        "bSort": false,
                        "oLanguage":
                        {
                            "sZeroRecords": "Não foram encontrados resultados",
                            "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                            "sInfoFiltered": "(Total de _MAX_ registros)"
                        }
                    });

                }

                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });

    });



});