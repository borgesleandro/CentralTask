$(document).ready(function () {
    $(".checkAll").on("click", function () { $(".check").attr("checked", $(this).is(":checked")); });

    $(".tableBandeira").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "aoColumns": [
                { "mDataProp": "BANDEIRA" },
                { "mDataProp": "DESCRICAO" },
                { "mDataProp": "ESTAB" },
                { "mDataProp": "STATUS" },
                {
                    "mDataProp": "ACAO",
                    "bSearchable": false,
                    "bSortable": false,
                    "fnRender": function (oObj) {
                        var linkEdicao = '<a href="' + controller + 'Edit/' + oObj.aData.BANDEIRA + '" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';
                        //var linkBandeiraPDV = '<a href="BandeiraCNPJ/Edit/?bandeiraId='+oObj.aData.BANDEIRA + '" class="mws-ic-16 ic-application-cascade li_icon" title="Visão Bandeira x PDV" title="Visão Bandeira x PDV"></a>';
                        var result = '<ul class="icons_16 clearfix2">';

                        if ($("#hiddenEditPermission").val() == 'True') {
                            result += "<li>" + linkEdicao + "</li>";
                            //result += "<li>" + linkBandeiraPDV + "</li>";
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
        "sPaginationType": "full_numbers"
    });

});

