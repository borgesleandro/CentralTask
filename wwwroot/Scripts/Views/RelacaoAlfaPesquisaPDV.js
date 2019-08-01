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
                    option.text("Todas");
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

    $("#EQUI_EQUIPE").change(function (e) {

        if ($("#EQUI_EQUIPE").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterReginaisPorEquipe",
                contentType: "application/json",
                data: JSON.stringify({ equipe: $("#EQUI_EQUIPE").val() }),
                success: function (data) {

                    $("#REGIONAL").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Todas");
                    $("#REGIONAL").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#REGIONAL").append(option);
                    });

                    $("#REGIONAL").removeAttr("disabled");

                },
                error: function (data) {
                    alert("Não foi possível obter as regionais.");
                }
            });

        }
        else {
            $("#REGIONAL").empty();
            $("#REGIONAL").attr("disabled", "disabled");
        }

    });

    $("#btnPesquisar").on("click", function () {

        if ($("#CODCLIENTE").val() != "" || $("#CNPJ").val() != "" || $("#RAZAOSOCIAL").val() != "") {

            $(".loading-save").show();

            var model = {

                CODDIV: $("#CODDIV").val(),
                EQUI_EQUIPE: $("#EQUI_EQUIPE").val(),
                REGIONAL: $("#REGIONAL").val(),
                ESTAB_ID: $("#CODCLIENTE").val(),
                CNPJ: $("#CNPJ").val(),
                RAZAOSOCIAL: $("#RAZAOSOCIAL").val()

            };


            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "RelacaoAlfaPesquisaPDV/List",
                async: true,
                data: JSON.stringify(model),
                success: function (response) {

                    if (response.success == false) {
                        alert(response.data);
                    }
                    else {

                        $("#consulta").html(response);
                        $("#consulta").show();

                        $("#estabelecimentos").dataTable({
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
        }
        else {
            alert("Ao menos um dos campos Cód. Cliente, CNPJ ou Razão Social, deve ser preenchido.");
        }

    });

});

function GetDetalhesEstabelecimento(estabidEquipe) {

    var modalButtons = {};

    modalButtons["Voltar"] = function () {
        $("#detalhesEstabelecimentoDialog").dialog("destroy");
    };

    var model = {

        CODDIV: $("#CODDIV").val(),
        EQUI_EQUIPE: $("#EQUI_EQUIPE").val(),
        REGIONAL: $("#REGIONAL").val(),
        ESTAB_ID: estabidEquipe.split('|')[0],
        EQUI_EQUIPE: estabidEquipe.split('|')[1]

    };

    xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "RelacaoAlfaPesquisaPDV/GetDetalhesEstabelecimento",
        async: false,
        data: JSON.stringify(model),
        success: function (response) {

            $(response).dialog({
                title: "Fichário do Estabelecimento",
                resizable: false,
                height: 600,
                width: 1080,
                modal: true,
                draggable: false
            });

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "RelacaoAlfaPesquisaPDV/GetVisitacaoEstabelecimento",
                async: false,
                data: JSON.stringify(model),
                success: function (responseVisitacao) {

                    $("#visitacao").html(responseVisitacao);
                },
                error: function (responseVisitacao) {
                    alert(responseVisitacao);
                }
            })

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "RelacaoAlfaPesquisaPDV/GetSellOutVisitacaoEstabelecimento",
                async: false,
                data: JSON.stringify(model),
                success: function (responseSellOut) {

                    $("#sellout").html(responseSellOut);
                },
                error: function (responseSellOut) {
                    alert(responseSellOut);
                }
            })

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "RelacaoAlfaPesquisaPDV/GetMarketShareVisitacaoEstabelecimento",
                async: false,
                data: JSON.stringify(model),
                success: function (responseMarketShare) {

                    $("#marketshare").html(responseMarketShare);
                },
                error: function (responseMarketShare) {
                    alert(responseMarketShare);
                }
            })

        },
        error: function (response) {
            alert(response);
        }
    });
};

function GetDadosMaterial(estabidEquipeData) {

    var modalButtons = {};

    modalButtons["Voltar"] = function () {
        $("#dadosMaterialDialog").dialog("destroy");
    };

    var model = {

        CODDIV: $("#CODDIV").val(),
        EQZ: $("#REPR_REP").val(),
        ESTAB_ID: estabidEquipeData.split('|')[0],
        EQUI_EQUIPE: estabidEquipeData.split('|')[1],
        VISI_DATAVIS: estabidEquipeData.split('|')[2]

    };

    xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "RelacaoAlfaRepresentantePDV/GetDadosMaterial",
        async: false,
        data: JSON.stringify(model),
        success: function (response) {

            if (response != "") {
                $(response).dialog({
                    resizable: false,
                    height: 300,
                    width: 390,
                    modal: true,
                    draggable: false,
                    buttons: modalButtons
                });
            }
            else {
                alert("Não há dados para exibição.");
            }

        },
        error: function (response) {
            alert(response);
        }
    })

}