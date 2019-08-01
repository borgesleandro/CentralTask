$(document).ready(function () {

    $("#distribuidor").multiselect().multiselectfilter();
    $("#CODPROD").multiselect().multiselectfilter();
    $("#PK_CODLINHA").multiselect().multiselectfilter();

    $("#CODPROD").multiselect("disable");
    $("#divisao").chosen();
    //$("#PK_CODLINHA").chosen();
    
    var dropdownDivisao = $("#divisao");
    var dropdownDistribuidor = $("#distribuidor");
    var dropdownprodutos = $("#CODPROD");
    var dropdownlinhaproduto = $("#PK_CODLINHA");

    $(".editButton").on("click", function () {
        if ($("#descontoMax").valid()) {
            $(".loading-save").show();
            window.location.href = controller + "Edit" + '?cnpj=' + dropdownDistribuidor.val() + '&codprod=' + dropdownprodutos.val() + '&divisaoID=' + dropdownDivisao.val() + '&linhaproduto=' + dropdownlinhaproduto.val();
        }
    });

    $("#PK_CODLINHA").change(function () {

        //if ($('#distribuidor').val() != "") {
        if ($('#PK_CODLINHA').val() != null) {
            //var selectedValue = $("#PK_CODLINHA").val();

            //apaga Grid 
            $(".descontos").hide();

            //desmarca a Divisão
            $("select#divisao").prop('selectedIndex', 0);
            $("#divisao").trigger("liszt:updated");
            //alert('3');


            $.ajax({
                type: "POST",
                url: controller + "ObterProdutosPorLinha",
                contentType: 'application/json',
                data: JSON.stringify({ linhas: $('#PK_CODLINHA').val() }),
                success: function (data) {
                    $("#CODPROD").multiselect("enable");
                    $("#CODPROD").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CODPROD").append(option);
                    });

                    $("#CODPROD").multiselect("refresh");
                }
            });
        }
        else {
            $("#CODPROD").multiselect("uncheckAll");
            $("#CODPROD").multiselect("disable");
        }
    });
 
    $("#CODPROD").change(function () {
        //apaga Grid 
        $(".descontos").hide();

        //desmarca a Divisão
        $("select#divisao").prop('selectedIndex', 0);
        $("#divisao").trigger("liszt:updated");
    });

    $("#distribuidor").change(function () {
   
        if ($('#distribuidor').val() != "") {
            var selectedValue = $("#distribuidor").val();
            $(".descontos").hide();
            clearDropDown(dropdownDivisao);
            if (selectedValue != "") {
                popularizeDropDown(dropdownDivisao, controller + "GetDivisions", { cnpj : selectedValue });
            }
            else {
                dropdownDivisao.attr("disabled", "disabled");
            }
        }
    });


    dropdownDivisao.on("change", function () {
        if (dropdownDivisao.val() > 0) {
            $(".mws-datatable-fn").dataTable().fnClearTable();
            popularizeGrid($(".mws-datatable-fn"), controller + "ListDiscount", { cnpj: dropdownDistribuidor.val(), codprod: dropdownprodutos.val(), divisaoID: dropdownDivisao.val(), linhaproduto: dropdownlinhaproduto.val() });
        }
    });
});

var clearDropDown = function (element) {
    $("option", element).each(function () {
        if ($(this).val() != "") $(this).remove();
    });

};

var popularizeDropDown = function (objDpd, action, params) {
    $.ajax({
        url: action,
        type: "get",
        //dataType: "json",
        data: params,
        traditional:true,
        success: function (data) {

            $("#divisao").empty();

            var option = $('<option></option>');
            option.attr('value', "");
            option.text("Selecione uma opção");
            $("#divisao").append(option);
            
            $.each(data, function () {
                var option = $('<option></option>');

                option.attr('value', this.value);
                option.text(this.text);

                $("#divisao").append(option);
            });
            $("#divisao").trigger("liszt:updated");
            if (data.length > 0) { objDpd.removeAttr("disabled"); }
        }
    });
};

var popularizeGrid = function (objDpd, action, params) {

    $(".loading-save").show();


    $.ajax({
        url: action,
        type: "get",
        //dataType: "json",
        traditional: true,
        data: params,
        success: function (data) {
            //Preenche listagem de produtos
            if (data.error != "" || data.result == null) {
                //rotina exibe erro
            }
            else {
                $(data.result).each(function (index, item) {
                    objDpd.dataTable().fnAddData(
                    [
                        item.distribuidor,
                        item.codigo,
                        item.name,
                        item.discount
                        //,item.type
                    ]
                    );
                });

                if ($(data.result).length > 0) {
                    var selectedValue = $("#distribuidor").val();
                    if (selectedValue.length == 1) {
                        //$('.mws-datatable-fn td:nth-child(1),th:nth-child(1)').hide();
                        $('.mws-datatable-fn th:nth-child(1)').hide();
                        var allRows = $(".mws-datatable-fn").dataTable().fnGetNodes();
                        $("td:nth-child(1)", allRows).hide();

                    }
                    else {
                        //$('.mws-datatable-fn td:nth-child(1),th:nth-child(1)').show();
                        $('.mws-datatable-fn th:nth-child(1)').show();
                        var allRows = $(".mws-datatable-fn").dataTable().fnGetNodes();
                        $("td:nth-child(1)", allRows).show();
                    }
                    $(".loading-save").hide();
                    $(".descontos").show();
                } else {
                    $(".loading-save").hide();
                    $(".descontos").hide();
                }
            }
        }
    });
};