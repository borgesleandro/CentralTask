$(document).ready(function () {

    $("select").multiselect().multiselectfilter();
    $("#CODPROD").multiselect("disable");
    
    $('#PercImposto').maskMoney({ showSymbol: false, decimal: ",", thousands: "" });


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



    //FUNÇÃO DE SALVAR
    $(document).on("click", ".btn-salvar", function () {
        //if ($("form").valid()) {
            
            var ufsOrigem = $("#CODESTORIGEM").val();
            var ufsDestino = $("#CODESTDESTINO").val();
            var produtos = $("#CODPROD").val();
            var linhasDeProduto = $("#PK_CODLINHA").val();
            var percimposto = parseFloat($("#PercImposto").val().replace(",", "."));
            var erros = [];

            
            if (!ufsOrigem ||
                !ufsDestino ||
                !produtos) {
                erros.push("Preencha todos os filtros!");
            }
            if (percimposto  > 100 || percimposto < 0 || isNaN(percimposto)) {
                erros.push("O percentual deve ser um número entre 0 e 100");
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
                    UfsOrigem: ufsOrigem,
                    UfsDestino: ufsDestino,
                    Produtos: produtos,
                    LinhasDeProduto: linhasDeProduto,
                    PercImposto: String(percimposto)
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

        //}
    });



    $("#btnPesquisar").on("click", function () {
        
        $.get(controller + "List", null, function (response) {

            var ufsOrigem = $("#CODESTORIGEM").val();
            var ufsDestino = $("#CODESTDESTINO").val();
            var produtos = $("#CODPROD").val();
            var linhasDeProduto = $("#PK_CODLINHA").val();
            var percimposto = $("#PercImposto").val();

            $("#consulta").html(response);
            $("#impostos").dataTable({
                "sPaginationType": "full_numbers",
                "bAutoWidth": false,
                "bProcessing": true,
                "bServerSide": true,
                "bSort": true,
                "sAjaxSource": controller + "SetDataTable",
                "fnServerData": function (sSource, aoData, fnCallback) {
                    aoData.push(
                        { "name": "UfsOrigem", "value": ufsOrigem },
                        { "name": "UfsDestino", "value": ufsDestino },
                        { "name": "Produtos", "value": produtos },
                        { "name": "LinhasDeProduto", "value": linhasDeProduto },
                        { "name": "PercImposto", "value": percimposto });
                    $.post(sSource, aoData, function (json) {
                        fnCallback(json);
                    });
                },
                "aoColumns": [
                  { "mDataProp": "UfOrigem", "sWidth": "10%" },
                  { "mDataProp": "UfDestino", "sWidth": "10%" },
                  { "mDataProp": "Codigo", "sWidth": "10%" },
                  { "mDataProp": "Descricao", "sWidth": "66%" },
                  { "mDataProp": "PercImposto", "sWidth": "4%" }
                ]
            });
        });
    });


});
