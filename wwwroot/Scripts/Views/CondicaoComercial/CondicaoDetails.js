$(document).ready(function () {

    var administrativo = false;

    $(canaisAdministrativos).each(function () {
        if (this == $("#canal-id").val()) administrativo = true;
    });

    if (administrativo) {
        $(".distribuidor").show();
    } else {
        $(".distribuidor").hide();
    }

    //Verifica como montar o grid de acordo com o tipo de condição 
    if ($("#DescontoporFaixa").val().toString().toUpperCase() == "TRUE") {

        var table = $(".produtosTableDetailsFaixa").DataTable({
            "bServerSide": true,
            "sAjaxSource": controller + "AjaxDataTableProdutoDetailsFaixa",
            "bAutoWidth": false,
            "bProcessing": true,            
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "condicaoID", "value": $("#CondicaoID").val() });

            },
            "aoColumns": [
                {
                    "targets":[0],
                    "mDataProp": "CODPROD",
                    "bSortable": true,
                    "sWidth": "15%"
                },
                {
                    "targets": [1],
                    "mDataProp": "PRODUTO",
                    "bSortable": true,
                    "sWidth": "40%"                    
                },
                {
                    "targets": [2],
                    "mDataProp": "QTD_INI",
                    "bSortable": true,
                    "sWidth": "15%"
                },
                {
                    "targets": [3],
                    "mDataProp": "QTD_FIM",
                    "bSortable": true,
                    "sWidth": "15%"
                },
                {
                    "targets": [4],
                    "mDataProp": "DESCONTO",
                    "bSortable": true,
                    "sWidth": "15%"
                }

            ],
            
            "oLanguage":
            {
                sZeroRecords: "Não foram encontrados resultados",
                sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                sInfoFiltered: "(Total de _MAX_ registros)",
                sProcessing: "<div class='dataTable-loading' />"
            },
            "sPaginationType": "full_numbers",
            rowsGroup: [
                0, 1
            ],
            "createdRow": function (row, data, index) {
                $('td', row).eq(0).addClass('highlight');
                $('td', row).eq(1).addClass('highlight');               
            }
        });

        table.draw(false);
        
        

    } else {

        $(".produtosTableDetails").dataTable({
            "bServerSide": true,
            "sAjaxSource": controller + "AjaxDataTableProdutoDetails",
            "bProcessing": true,
            "fnServerParams": function (aoData) {
                aoData.push({ "name": "condicaoID", "value": $("#CondicaoID").val() });

            },
            "aoColumns": [
                {
                    "mDataProp": "CODPROD",
                    "bSortable": true
                },
                {
                    "mDataProp": "PRODUTO",
                    "bSortable": true
                },
                {
                    "mDataProp": "DESCONTO",
                    "bSortable": true
                },
                {
                    "mDataProp": "DESCONTO_MAX",
                    "bSortable": true
                }

            ],
            "oLanguage":
            {
                sZeroRecords: "Não foram encontrados resultados",
                sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                sInfoFiltered: "(Total de _MAX_ registros)",
                sProcessing: "<div class='dataTable-loading' />"
            },
            "sPaginationType": "full_numbers",
        });

    }

    $(".cnpjTableDetails").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableCNPJDetails",
        "bProcessing": true,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "condicaoID", "value": $("#CondicaoID").val() });

        },
        "aoColumns": [
                        {
                            "mDataProp": "CNPJ"
                        },
                        {
                            "mDataProp": "RAZAOSOCIAL"
                        }

        ],
        "oLanguage":
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)",
            sProcessing: "<div class='dataTable-loading' />"
        },
        "sPaginationType": "full_numbers"
    });


});

