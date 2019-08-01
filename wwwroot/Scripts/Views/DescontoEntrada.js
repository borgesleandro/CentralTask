$(document).ready(function () {
    $("select").multiselect().multiselectfilter();
    $("#EQUI_EQUIPE").multiselect("disable");
    $("#CODPROD").multiselect("disable");
    $("#CODDIV").multiselect("destroy");
    $("#CODDIV").chosen();

    $('#Desconto').maskMoney({ showSymbol: false, decimal: ",", thousands: "", allowZero: true });

    $("#CODDIV").change(function () {
        if ($('#CODDIV').val() != "") {
            $.ajax({
                type: "POST",
                url: controller + "ObterEquipesPorCia",
                contentType: 'application/json',
                data: JSON.stringify({ cia: $('#CODDIV').val() }),
                success: function (data) {
                    $("#EQUI_EQUIPE").multiselect("enable");
                    $("#EQUI_EQUIPE").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#EQUI_EQUIPE").append(option);
                    });

                    $("#EQUI_EQUIPE").multiselect("refresh");
                }
            });
        }
        else {
            $("#EQUI_EQUIPE").multiselect("uncheckAll");
            $("#EQUI_EQUIPE").multiselect("disable");
        }
    });

    $("#PK_CODLINHA").change(function () {
        if ($('#PK_CODLINHA').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "ObterProdutosPorLinha",
                contentType: 'application/json',
                data: JSON.stringify({ linhas: $('#PK_CODLINHA').val() }),
                success: function (data) {
                    $("#CODPROD").multiselect("enable");
                    $("#CODPROD").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CODPROD").append(option);
                    });

                    $("#CODPROD").multiselect("refresh");
                }
            });
        }
        else {
            $("#CODPROD").multiselect("uncheckAll");
            $("#CODPROD").multiselect("disable");
        }
    });

    $(document).on("click", ".btn-salvar", function () {
        if ($("form").valid()) {
            var cia = $("#CODDIV").val();
            var equipes = $("#EQUI_EQUIPE").val();
            var distribuidores = $("#CNPJ_OL").val();
            var ufs = $("#CODEST").val();
            var produtos = $("#CODPROD").val();
            var linhasDeProduto = $("#PK_CODLINHA").val();
            var desconto = parseFloat($("#Desconto").val().replace(",", "."));
            var erros = [];

            if (!cia ||
                !equipes ||
                !distribuidores ||
                !ufs ||
                !produtos) {
                erros.push("Preencha todos os filtros!");

            }
            if (desconto > 100 || desconto < 0 || isNaN(desconto)) {
                erros.push("O desconto deve ser um número entre 0 e 100");
            }

            if (erros.length > 0) {
                alert(erros.join('<br/>'));
                return;
            }

            $.ajax({
                type: "POST",
                url: controller + "Salvar",
                contentType: 'application/json',
                data: JSON.stringify({
                    Cia: cia,
                    Equipes: equipes,
                    Distribuidores: distribuidores,
                    Ufs: ufs,
                    Produtos: produtos,
                    LinhasDeProduto: linhasDeProduto,
                    Desconto: String(desconto)
                }),
                success: function (response) {
                    if (response.ok) {
                        alert("Dados salvos com sucesso!");
                        $("#btnPesquisar").click();
                    } else {
                        alert("Ocorreu um erro ao tentar salvar os dados: " + response.message);
                    }
                }
            });
        }
    });

    $("#btnPesquisar").on("click", function () {
        $("#exportarLinkDiv").html("");

        $.get(controller + "List", null, function (response) {

            var cia = $("#CODDIV").val();
            var equipes = $("#EQUI_EQUIPE").val();
            var distribuidores = $("#CNPJ_OL").val();
            var ufs = $("#CODEST").val();
            var produtos = $("#CODPROD").val();
            var linhasDeProduto = $("#PK_CODLINHA").val();
            var desconto = $("#Desconto").val();

            $("#consulta").html(response);
            $("#descontos").dataTable({
                "sPaginationType": "full_numbers",
                "bAutoWidth": false,
                "bProcessing": true,
                "bServerSide": true,
                "bSort": true,
                "sAjaxSource": controller + "SetDataTable",
                "fnServerData": function (sSource, aoData, fnCallback) {
                    aoData.push(
                        { "name": "Cia", "value": cia },
                        { "name": "Equipes", "value": equipes },
                        { "name": "Distribuidores", "value": distribuidores },
                        { "name": "Ufs", "value": ufs },
                        { "name": "Produtos", "value": produtos },
                        { "name": "LinhasDeProduto", "value": linhasDeProduto },
                        { "name": "Desconto", "value": desconto });
                    $.post(sSource, aoData, function (json) {
                        fnCallback(json);
                    });
                },
                "aoColumns": [
                  { "mDataProp": "Cia", "sWidth": "14%" },
                  { "mDataProp": "Equipe", "sWidth": "13%" },
                  { "mDataProp": "Distribuidor", "sWidth": "25%" },
                  { "mDataProp": "Uf", "sWidth": "4%" },
                  //{ "mDataProp": "Produto", "sWidth": "30%" },
                  { "mDataProp": "Codigo", "sWidth": "5%" },
                  { "mDataProp": "Descricao", "sWidth": "25%" },
                  { "mDataProp": "Ean13", "sWidth": "5%" },
                  { "mDataProp": "Desconto", "sWidth": "4%" }
                ]
            });
        });
    });

    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        if ($("#CODDIV").val() == "") {
            alert("É necessário selecionar a Companhia.");
            return;
        }

        $(".loading-save").show();

        var coddiv = $("#CODDIV").val();
        var equi_equipe = $("#EQUI_EQUIPE").val();
        var distribuidores = $("#CNPJ_OL").val();
        var uf = $("#CODEST").val();
        var produtos = $("#CODPROD").val();

        var codigo = $("#CODEST").val();
        var descricao = $("#CODEST").val();
        var ean = $("#CODEST").val();

        var pk_codlinha = $("#PK_CODLINHA").val();
        var desconto = $("#Desconto").val();

        var model = { Cia: coddiv, Equipes: equi_equipe, Distribuidores: distribuidores, Ufs: uf, LinhasDeProduto: pk_codlinha, Produtos: produtos, Desconto: desconto }

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "DescontoEntrada/ExportarExcel",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='DescontoEntrada.xls' class=''><img src='Content/botao-salvar-download.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                $(".loading-save").hide();
            }
        });

    });
});
