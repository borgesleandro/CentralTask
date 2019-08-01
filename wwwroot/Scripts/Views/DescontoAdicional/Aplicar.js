$(document).ready(function () {
    var currentAjaxRequestCheckAll = null;
    var currentRequestSearch = null;
    var form = $(".mws-form:first");

    $(".findButton").live("click", function () {
        $(".pdv").dataTable().fnDraw();
    });



    $(".salvar").live("click", function () {
        $(".gridError").removeClass("field-validation-error").addClass("field-validation-valid").html("");
        var tr = $(".pdv").dataTable().fnGetNodes();
        if (tr.length > 0 && $(":checked", tr).length > 0) {
            if (form.valid()) {
                form.submit();
            }
        } else {
            $(".gridError").removeClass("field-validation-valid").addClass("field-validation-error").html("Escolha ao menos 1 item.");
        }
    });


    $(".pdv").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "bProcessing": true,
        "aoColumns": [
                        { "mDataProp": "CHECKED",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                return '<input type="checkbox" ' + (oObj.aData.CHECKED ? 'checked="checked"' : '') + ' class="check" value="' + oObj.aData.CNPJ + '" \">';
                            }
                        },
                        { "mDataProp": "CNPJ" },
                        { "mDataProp": "RazaoSocial" },
                        { "mDataProp": "NomeFantasia" },
                        { "mDataProp": "Bandeira" },
                        { "mDataProp": "Rede" }
                    ],
        "fnDrawCallback": function (oObj) {
            $(".checkAll").attr("checked", oObj.aoData[0]._aData.CHECKEDALL);

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

    $(document).on("click", ".check", function () {
        $.post(controller + "CheckEstab", { check: $(this).is(":checked"), cnpj: $(this).val() }, function (data) {
            $(".checkAll").attr("checked", data);
        });

    });

    $(document).on("click", ".checkAll", function () {
        var checked = $(this).is(":checked");

        var rows = $(".pdv").dataTable().fnGetNodes();


        $('input', rows).attr('checked', checked);



        if (currentAjaxRequestCheckAll != null) currentAjaxRequestCheckAll.abort();
        currentAjaxRequestCheckAll = $.post(controller + "CheckAll", { check: checked });


    });


    $(".dataTables_filter input").unbind('keypress keyup');
    $(document).on("keyup", ".dataTables_filter input", function (e) {
        var value = $(this).val();
        clearTimeout(currentRequestSearch);

        currentRequestSearch = setTimeout(function () {
            $(".pdv").dataTable().fnFilter(value);
        }, 1000);
    });


});

