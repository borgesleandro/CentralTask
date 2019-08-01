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

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#EQUI_EQUIPE").append(option);
                    });

                },
                error: function (data) {
                    alert("Não foi possível obter as equipes.");
                }
            });

        }
        else {
            $("#EQUI_EQUIPE").empty();
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

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#REGIONAL").append(option);
                    });

                },
                error: function (data) {
                    alert("Não foi possível obter as regionais.");
                }
            });

        }
        else {
            $("#REGIONAL").empty();
        }

    });

    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        if ($("#CODDIV").val() == "") {
            alert("Companhia deve ser preenchida.");
            return;
        }

        $(".loading-save").show();

        var cia = $("#CODDIV").val();
        var equi_equipe = $("#EQUI_EQUIPE").val();
        var cnpj = $("#CNPJ").val();
        var razaosocial = $("#RAZAO_SOCIAL").val();
        var nomefantasia = $("#NOME_FANTASIA").val();
        var regional = $("#REGIONAL").val();
        var gerdistrital = $("#GER_DISTRITAL").val();
        var eqz = $("#EQZ").val();
        var codfreq = $("#CODFREQ").val();
        var endereco = $("#ENDERECO").val();
        var cidade = $("#CIDADE").val();
        var uf = $("#UF").val();
        var cep = $("#CEP").val();
        var lotrcodigo = $("#LOTR_CODIGO").val();
        var codtipoestab = $("#COD_TIPOESTAB").val();
        var qtdlojas = $("#QTD_LOJAS").val();

        var model = {
            CODDIV: cia,
            EQUI_EQUIPE: equi_equipe,
            CNPJ: cnpj,
            RAZAO_SOCIAL: razaosocial,
            NOME_FANTASIA: nomefantasia,
            REGIONAL: regional,
            GER_DISTRITAL: gerdistrital,
            EQZ: eqz,
            CODFREQ: codfreq,
            ENDERECO: endereco,
            CIDADE: cidade,
            UF: uf,
            CEP: cep,
            LOTR_CODIGO: lotrcodigo,
            COD_TIPOESTAB: codtipoestab,
            QTD_LOJAS: qtdlojas
        }

        DesativarCampos();
        $("#btnNovaConsulta").show();
        $("#btnExportar").hide();

        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "DadosPDV/ExportarExcel",
            async: true,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='DadosPDV.xls' class=''><img src='Content/botao-salvar-download-vertical.png'/></a>") }, 1000);

                $(".loading-save").hide();
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                $(".loading-save").hide();
            }
        });

    });

    $("#btnNovaConsulta").on("click", function () {
        AtivarCampos();
        $("#exportarLinkDiv").html("");
        $("#btnNovaConsulta").hide();
        $("#btnExportar").show();
    });

});

function DesativarCampos() {
    $("#CODDIV").attr("disabled","disabled");
    $("#EQUI_EQUIPE").attr("disabled","disabled");
    $("#CNPJ").attr("disabled","disabled");
    $("#RAZAO_SOCIAL").attr("disabled","disabled");
    $("#NOME_FANTASIA").attr("disabled","disabled");
    $("#REGIONAL").attr("disabled","disabled");
    $("#GER_DISTRITAL").attr("disabled","disabled");
    $("#EQZ").attr("disabled","disabled");
    $("#CODFREQ").attr("disabled","disabled");
    $("#ENDERECO").attr("disabled","disabled");
    $("#CIDADE").attr("disabled","disabled");
    $("#UF").attr("disabled","disabled");
    $("#CEP").attr("disabled","disabled");
    $("#LOTR_CODIGO").attr("disabled","disabled");
    $("#COD_TIPOESTAB").attr("disabled","disabled");
    $("#QTD_LOJAS").attr("disabled","disabled");
};

function AtivarCampos() {
    $("#CODDIV").removeAttr("disabled");
    $("#EQUI_EQUIPE").removeAttr("disabled");
    $("#CNPJ").removeAttr("disabled");
    $("#RAZAO_SOCIAL").removeAttr("disabled");
    $("#NOME_FANTASIA").removeAttr("disabled");
    $("#REGIONAL").removeAttr("disabled");
    $("#GER_DISTRITAL").removeAttr("disabled");
    $("#EQZ").removeAttr("disabled");
    $("#CODFREQ").removeAttr("disabled");
    $("#ENDERECO").removeAttr("disabled");
    $("#CIDADE").removeAttr("disabled");
    $("#UF").removeAttr("disabled");
    $("#CEP").removeAttr("disabled");
    $("#LOTR_CODIGO").removeAttr("disabled");
    $("#COD_TIPOESTAB").removeAttr("disabled");
    $("#QTD_LOJAS").removeAttr("disabled");
};