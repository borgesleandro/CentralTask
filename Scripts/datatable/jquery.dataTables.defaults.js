(function (){
    // Colocar após a inclusão do jquery.dataTables.js
    $.fn.dataTableExt.oStdClasses = $.extend($.fn.dataTableExt.oStdClasses, {
        "sFilter": "dataTables_filter form-inline",
        "sFilterInput": "form-control",
        "sLengthSelect": "form-control"
    });

    $.fn.DataTable.defaults.oLanguage = $.extend($.fn.DataTable.defaults.oLanguage, {
        "sZeroRecords": "Não foram encontrados resultados",
        "sEmptyTable": "Não foram encontrados resultados",
        "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
        "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
        "sInfoFiltered": "(Total de _MAX_ registros)",
        "sSearch": "Pesquisar",
        "sLengthMenu": "Mostrar _MENU_ registros",
        "oPaginate": {
            "sFirst": "«",
            "sLast": "»",
            "sNext": "›",
            "sPrevious": "‹"
        }
    });
})();

