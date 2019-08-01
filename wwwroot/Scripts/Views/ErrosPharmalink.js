$(document).ready(function () {
    var currentAjaxRequest = null;
    var containerErrosPharmalink = $(".containerErrosPharmalink").text;

    $(".Export").css({ visibility: 'hidden' });

    $(document).on("click", ".Filtro", function () {
        $(".loading-save").show();
        if (containerErrosPharmalink != "") {
            $(".Export").css({
                visibility: 'visible'
            });
        }

        if (currentAjaxRequest != null) currentAjaxRequest.abort();
        var sendData = {};
        sendData.errosImp = $("#Erros").val();
        sendData.dtPedidoInicial = $("#dataPedidoInicial").val();
        sendData.dtPedidoFinal = $("#dataPedidoFinal").val();
        sendData.dtImportacaoInicial = $("#dataImportacaoInicial").val();
        sendData.dtImportacaoFinal = $("#dataImportacaoFinal").val();
        $(document).on("change", sendData, function () {
            $(".Export").css({
                visibility: 'hidden'
            });

            $(".ErrosPharmalink").dataTable().fnClearTable();
        });

        currentAjaxRequest = $.post(controller + "Filtro", sendData, function (data) {
            $(".containerErrosPharmalink").text("");
            $(".containerErrosPharmalink").append(data);
            $(".mws-datatable-fn").dataTable({
                aaSorting: [[$(".data-sort-asc:first").length > 0 ? $(".data-sort-asc:first").index() : 0, "asc"]],
                sPaginationType: "full_numbers",
                aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
                     { "bVisible": false, "aTargets": ["dataTable-hidden"]}],
                oLanguage:
                 {
                     sZeroRecords: "Não foram encontrados resultados",
                     sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                     sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                     sInfoFiltered: "(Total de _MAX_ registros)"
                 }
            });
             $(".loading-save").hide();
        });
    });
});


 