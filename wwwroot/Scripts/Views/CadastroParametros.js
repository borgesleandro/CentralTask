$(document).ready(function() {
    $("select").multiselect().multiselectfilter();


    $("#btnPesquisar").on("click", function () {
        $("#exportarLinkDiv").html("");

        $.get(controller + "List", null, function (response) {

            var produto = $("#PRODUTO").val();
            var classiffiscal = $("#CLASSFISCAL").val();
            var uforigem = $("#UFORIGEM").val();
            var indicadortipocalc = $("#INDICADORTIPOCALCULO").val();
            var ufdestino = $("#UFDESTINO").val();
       

            $("#consulta").html(response);
            $("#Parametros").dataTable({
                "sPaginationType": "full_numbers",
                "bAutoWidth": false,
                "bProcessing": true,
                "bServerSide": true,
                "bSort": true,
                "sAjaxSource": controller + "SetDataTable",
                "fnServerData": function (sSource, aoData, fnCallback) {
                    aoData.push( // FILTROS
                        { "name": "Produto", "value": produto },
                        { "name": "UfOrigem", "value": uforigem },
                        { "name": "UfDestino", "value": ufdestino },
                        { "name": "ClassifFiscal", "value": classiffiscal },
                        { "name": "IndicadorTipoCalculo", "value": indicadortipocalc });
                    $.post(sSource, aoData, function (json) {
                        fnCallback(json);
                    });
                },
                //colunas do minha view de parametros PARA SEREM EXIBIDOS
                "aoColumns": [
                  { "mDataProp": "Produto", "sWidth": "14%" },
                  { "mDataProp": "UfOrigem", "sWidth": "13%" },
                  { "mDataProp": "UfDestino", "sWidth": "25%" },
                  { "mDataProp": "DescClassifFiscal", "sWidth": "4%" },
                  { "mDataProp": "DescIndicadorTipoCalculo", "sWidth": "5%" },
                  { "mDataProp": "BaseCalculoPropria", "sWidth": "5%" },
                  { "mDataProp": "IvaRetudores", "sWidth": "5%" },
                  { "mDataProp": "PercRepasse", "sWidth": "5%" },
                  { "mDataProp": "Pmc", "sWidth": "5%" },
                  { "mDataProp": "PmcReduzido", "sWidth": "5%" },
                  { "mDataProp": "Isento", "sWidth": "5%" } 


                  
        
    



                ]
            });
        });
    });

});