$(document).ready(function () {

    $("#CODDIV").change(function (e) {

        if ($("#CODDIV").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterRepresentantesPorCia",
                contentType: "application/json",
                data: JSON.stringify({ cia: $("#CODDIV").val() }),
                success: function (data) {

                    $("#REPR_REP").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("---");
                    $("#REPR_REP").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#REPR_REP").append(option);
                    });

                    $("#REPR_REP").removeAttr("disabled");

                },
                error: function (data) {
                    alert("Não foi possível obter as equipes.");
                }
            });

        }
        else {
            $("#REPR_REP").empty();
            $("#REPR_REP").attr("disabled", "disabled");
        }

    });

    $("#btnMapa").on("click", function () {

        window.open('/RelacaoAlfaRepresentantePDV/GetGMaps?CODDIV=' + $("#CODDIV").val() + '&EQZ=' + $("#REPR_REP").val(), '_blank', 'left=100,top=100,width=1000,height=600,toolbar=0,resizable=1');

    });

    $("#btnPesquisar").on("click", function () {

        if ($("#CODDIV").val() != "" && $("#REPR_REP").val() != "") {

            $("#exportarLinkDiv").html("");

            $(".loading-save").show();

            var model = {

                CODDIV: $("#CODDIV").val(),
                EQZ: $("#REPR_REP").val(),
                CEP: $("#CEP").val(),
                ENDERECO: $("#ENDERECO").val(),
                CIDADE: $("#CIDADE").val(),
                BAIRRO: $("#BAIRRO").val(),
                UF: $("#UF").val(),
                RAZAOSOCIAL: $("#RAZAOSOCIAL").val(),
                CNPJ: $("#CNPJ").val(),
                BRICK: $("#BRICK").val(),
                LOTR_CODIGO: $("#LOTR_CODIGO").val()
            };

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "RelacaoAlfaRepresentantePDV/List",
                async: true,
                data: JSON.stringify(model),
                success: function (response) {

                    if (response.success == false) {
                        alert(response.data);
                    }
                    else {

                        //Tabela
                        $("#consulta").html(response);
                        $("#consulta").show();
                        $("#btnVoltar").show();

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

                        $("#btnMapa").show();
                        $("#btnExportar").show();
                    }

                    $(".loading-save").hide();
                },
                error: function (response) {
                    $(".loading-save").hide();
                }
            });
        }
        else {
            alert("Companhia e Setor precisam ser preenchidos.");
        }

    });

    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        $(".loading-save").show();

        var model = {

            CODDIV: $("#CODDIV").val(),
            EQZ: $("#REPR_REP").val()

        };

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "RelacaoAlfaRepresentantePDV/ExportarExcel",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='RelacaoAlfaRepresentantePDV.xls' class=''><img src='Content/botao-salvar-download-vertical.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                $(".loading-save").hide();
            }
        });

    });

});

function GetDetalhesEstabelecimento(estabidEquipe) {

    var modalButtons = {};

    modalButtons["Voltar"] = function () {
        $("#detalhesEstabelecimentoDialog").dialog("destroy");

    };

    var model = {

        CODDIV: $("#CODDIV").val(),
        EQZ: $("#REPR_REP").val(),
        ESTAB_ID: estabidEquipe.split('|')[0],
        EQUI_EQUIPE: estabidEquipe.split('|')[1]

    };

    xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "RelacaoAlfaRepresentantePDV/GetDetalhesEstabelecimento",
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
                //buttons: modalButtons
            });

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "RelacaoAlfaRepresentantePDV/GetVisitacaoEstabelecimento",
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
                url: "RelacaoAlfaRepresentantePDV/GetSellOutVisitacaoEstabelecimento",
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
                url: "RelacaoAlfaRepresentantePDV/GetMarketShareVisitacaoEstabelecimento",
                async: false,
                data: JSON.stringify(model),
                success: function (responseMarketShare) {

                    $("#marketshare").html(responseMarketShare);
                },
                error: function (responseMarketShare) {
                    alert(responseMarketShare);
                }
            })

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