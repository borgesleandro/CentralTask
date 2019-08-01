$(document).ready(function () {
    var timeout = null;
    var table = $("#criterios");
    var attributeType = "data-type";
    UpdateMenu();
    QuantitySelected();

    //Somente os selecionados
    $(document).on("click", "#onlyChecked", function () {
        table.dataTable().fnDraw(false);
    });

    //Item do menu
    $(document).on("click", ".linkItem", function () {
        $(".criteriosTable_descricao").text($(this).text());
        table.attr(attributeType, $(this).attr(attributeType));
        table.dataTable().fnFilter('');
    });


    var aoColumns = actionName == "Detail" ? [
       
        {
            "mDataProp": "value",
            "bSearchable": false,
            "bSortable": false
        },
        {
            "mDataProp": "text"
        }
    ] :
        [
            {
                "mDataProp": "selected",
                "bSearchable": false,
                "bSortable": false,
                "fnRender": function (oObj) {
                    var result = '<input type="checkbox" class="check" ' + (oObj.aData.selected != null && oObj.aData.selected ? 'checked="checked"' : '') + ' value="' + oObj.aData.value + '" />';
                    return result;
                }
            },
        {
            "mDataProp": "value",
            "bSearchable": false,
            "bSortable": false
        },
        {
            "mDataProp": "text"
        }];

    //DataTable
    table.dataTable({
        "bServerSide": true,
        "sAjaxSource": controllerTabs + "AjaxDataTableTabsGrid",
        "bProcessing": true,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "type", "value": table.attr(attributeType) });
            aoData.push({ "name": "checkAll", "value": $("#checkAll").is(":checked") });
            aoData.push({ "name": "checkAllChanged", "value": $("#checkAll").attr("data-changed") });
            aoData.push({ "name": "onlyChecked", "value": actionName == "Detail" ? true : $("#onlyChecked").is(":checked") });
            aoData.push({ "name": "controllerName", "value": controllerName });

        },
        "aoColumns": aoColumns,
        "fnDrawCallback": function (oObj) {
            $("#checkAll").attr("data-changed", 0);
            $("#checkAll").attr("checked", (oObj.aoData.length > 0 && oObj.aoData[0]._aData.checkedAll));
            UpdateMenu();
            QuantitySelected();
        },
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

    //CheckItem
    $(document).on("click", ".check", function () {
        var sendData = {};
        sendData.type = $(this).parents("table:first").attr(attributeType);
        sendData.id = $(this).val();
        sendData.check = $(this).is(":checked");
        sendData.controllerName = controllerName;

        $.post(controllerTabs + "CheckItem", sendData, function () {
            UpdateMenu();
            QuantitySelected();

        });

    });


    //CheckAll
    $(document).on("click", "#checkAll", function () {
        var checkAll = $(this);
        checkAll.attr("data-changed", "1");
        table.dataTable().fnDraw(false);


    });

});

var UpdateMenu = function () {
    $.post(controllerTabs + "UpdateMenu", null, function (data) {

        var selectedType = $(".dataTable").attr("data-type");

        $(".criteriosTable").removeClass("active");
        $(".linkItem").removeClass("active");

        $(data).each(function () {
            $(".linkItem[data-type='" + this + "']").addClass("active");
            if (selectedType == this) {
                $(".criteriosTable").addClass("active");
            }
        });

    });
};

var QuantitySelected = function () {
    $.post(controllerTabs + "QuantitySelected", { type: $("#criterios").attr("data-type") }, function (data) {
        $(".criteriosTable_quantity").text(data);
    });
};
