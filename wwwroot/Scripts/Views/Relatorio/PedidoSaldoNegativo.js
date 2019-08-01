$(document).ready(function () {

    //    $.rmSearchOnDemand("#FiltroBandeira", { url: controller + "GetBandeiras", keyLimit: 2, textKeyAsParam: 'nome', height: 120, width: 576 });
    //    $.rmSearchOnDemand("#FiltroRede", { url: controller + "GetRedes", keyLimit: 2, textKeyAsParam: 'nome', height: 120, width: 576 });

    $("#TipoFiltro").live("change", function () {
        $(".inputErro").hide();
        var divs = $(".filtro");
        divs.hide();
        $(":input", divs).val("");

        if ($(this).val() != "") {
            switch ($(this).val()) {
                case "P":
                    $(".pdv").show();
                    break;
                case "B":
                    $(".bandeira").show();
                    break;
                case "R":
                    $(".rede").show();
                    break;
            }
        }
    });

    $(".findButton").live("click", function () {
        $(".inputErro").hide();
        $(".inputErroDtini").hide();
        $(".inputErroDtfin").hide();
        var dtini = $("#DTINI:text").val();
        var dtfin = $("#DTFIN:text").val();
        var text = $("#SETOR:text").val();

        if (dtini.trim() == "") {
            $(".inputErroDtini").show();
        }
        else if (dtfin.trim() == "") {
            $(".inputErroDtfin").show();
        }
        else if (text.trim() == "") {
            $(".inputErro").show();
        }
        else {
            $(".PedidosSN").submit();
        }

    });

    $(".tableDescAdic").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "aoColumns": [
            { "mDataProp": "DESCRICAO" },
            { "mDataProp": "DATAINI" },
            { "mDataProp": "DATAFIN" },
            { "mDataProp": "CANAL" },
            { "mDataProp": "DIVISAO",
                "fnRender": function (oObj) {
                    var result = "";

                    $(oObj.aData.DIVISAO).each(function () {
                        result += this + "<br />";
                    });
                    return result;
                }
            },
            {
                "mDataProp": "ACAO",
                "bSearchable": false,
                "bSortable": false,
                "fnRender": function (oObj) {
                    var linkEditar = '<a href="' + controller + 'Edit/' + oObj.aData.DESCADIC_ID + '" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';
                    var result = '<ul class="icons_16 clearfix2">';

                    if ($("#hiddenEditPermission").val() == 'True') {
                        result += "<li>" + linkEditar + "</li>";
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
