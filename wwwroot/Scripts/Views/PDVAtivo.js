$(document).ready(function () {
    $(".tablePDVAtivos").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableLoad",
        'bLengthChange': false,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "active", "value": $("#chkAtivo").is(":checked") });
            aoData.push({ "name": "firstLogin", "value": $("#chkPrimeiroLogin").is(":checked") });
            aoData.push({ "name": "inactive", "value": $("#chkInativo").is(":checked") });
        },
        "aoColumns": [
            { "mDataProp": "NOME" },
            { "mDataProp": "CNPJ" },
            { "mDataProp": "UF" },
            { "mDataProp": "EMAIL" },
            { "mDataProp": "REPRESENTANTE" },
            {
                "mDataProp": "STATUS",
                "bSearchable": false
                
            }
        ],
        "oLanguage":
            {
                sZeroRecords: "Não foram encontrados resultados",
                sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                sInfoFiltered: "(Total de _MAX_ registros)"
            },
        "sPaginationType": "full_numbers"
    });

    $(document).on("click", ".check_filtro", function() {
        $(".tablePDVAtivos").dataTable().fnDraw(true);
    });
});

