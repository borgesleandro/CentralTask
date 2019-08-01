$(document).ready(function() {
    $(".tableFamilia").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "aoColumns": [
            { "mDataProp": "FAMILIA_ID" },
            { "mDataProp": "DESCRICAO" },
            { "mDataProp": "DIVISAO" },
            { "mDataProp": "STATUS" },
            { "mDataProp": "STATUS_PAI" },
            {
                "mDataProp": "ACAO",
                "bSearchable": false,
                "bSortable": false,
                "fnRender": function(oObj) 
                {
                    var linkEdicao = '<a href="'+ controller + 'Edit/' + oObj.aData.FAMILIA_ID +'" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';
                    var result = '<ul class="icons_16 clearfix2">';

                    if ($("#hiddenEditPermission").val() == "true") {
                        result += "<li>" + linkEdicao + "</li>";
                    }

                    result += "</ul>";

                    return result;
                }
            }
        ],
        "oLanguage":
            {
                sZeroRecords: "Não foram encontrados resultados",
                sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                sInfoFiltered: "(Total de _MAX_ registros)"
            },
        "sPaginationType": "full_numbers",
    });

});