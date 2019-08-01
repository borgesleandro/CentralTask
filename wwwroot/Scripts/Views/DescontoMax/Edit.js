$(document).ready(function () {

    $("#valorDesconto").maskMoney({ showSymbol: false, decimal: ",", thousands: "", precisionBefore: 3, allowZero: true });

    $(".mws-form").submit(function () {

        
        var allRows = $(".produtos").dataTable().fnGetNodes();
        var checkedRows = $("input:checked", allRows);

        $(".tableError").hide();
        //if ($("tbody input:checked", $(".produtos")).length == 0) {
        if (checkedRows.length == 0 ){
            $(".tableError").text("É obrigatória a escolha de pelo menos 1 item.");
            $(".tableError").show();
            return false;
        }


        if ($("#valorDesconto").val().length == 0) {
            $(".tableError").text("É obrigatória informar o valor de desconto.");
            $(".tableError").show();
            return false;
        }



        if (parseFloat($("#valorDesconto").val().replace(',','.')) > 100) {
            $(".tableError").text("O valor de desconto não pode ser maior que 100%.");
            $(".tableError").show();
            return false;
        }
        


        return true;

        //return false;

    });



    //$("#TRD_FAMILIA").on("change", function () {
    //    var selectedValue = $(this).val();
    //    enableChecks();
    //    if (selectedValue > 0) {
    //        $(".produtos").dataTable().fnFilter(selectedValue, 0);
    //        $(".rbtFamilia").removeAttr("disabled");
    //    }
    //    else {
    //        $(".produtos").dataTable().fnFilter("", 0);
    //        $(".rbtProduto").attr("checked", true).trigger("click");
    //        $(".rbtFamilia").attr("disabled", "disabled");
    //    }

    //});

    //$(".rbtFamilia").on("click", function () {
    //    $(".acao").addClass("required");
    //    $(".acaoDiv").show();
    //    checkAll(true);
    //    disableChecks();
    //});
    //$(".rbtProduto").on("click", function () {
    //    $(".acao").removeClass("required");
    //    $(".acaoDiv").hide();
    //    checkAll(false);
    //    enableChecks();
    //});


    var allRows = $(".produtos").dataTable().fnGetNodes();
    var checkedRows = $("input:checkbox", allRows);

    //$(".produtoCheck").on("click", function () {
    checkedRows.on("click", function () {
        checkproduct(this, $(this).is(":checked"));
    });

    $("#checkAllProduto").on("click", function () {
        checkAll($("#checkAllProduto").is(':checked'));
    });

    

    //"drawCallback": function (settings) {
    //    alert('DataTables has redrawn the table');
    //}

    //$('.produtos').dataTable({
    //    "fnDrawCallback": function () {
    //        isCheckAll();
    //    }
    //    , "sPaginationType": "full_numbers"
    //});


});


//var checkAll = function (checked) {

//    var allRows = $(".produtos").dataTable().fnGetNodes();

//    var checkedRows = $("input:checked", allRows);


//    alert('11');

//    alert(checkedRows.length);
//    checkedRows.each(function () {
//         $(this).attr("checked", checked);
//        checkproduct(this, $(this).is(":checked"));

//    });
//};



//var checkAll = function (checked) {
//    $(".produtoCheck").each(function () {
//         $(this).attr("checked", checked);
//        checkproduct(this, $(this).is(":checked"));
       
//    });
//};



var checkAll = function (checked) {

    var allRows = $(".produtos").dataTable().fnGetNodes();
    var checkedRows = $("input:checkbox", allRows);

    checkedRows.each(function () {
         $(this).attr("checked", checked);
        checkproduct(this, $(this).is(":checked"));

    });
};
 




//var disableChecks = function () {
//    $(".dataTables_filter input").val("").trigger("keyup").attr("disabled", "disabled");
//    $(".checkBox").each(function () { checkproduct(this, true); }).attr("disabled", "disabled").attr("checked", true);
    
//};

//var enableChecks = function () {

//    $(".dataTables_filter input").val("").trigger("keyup").removeAttr("disabled");
//    $(".checkBox").each(function () { checkproduct(this, false); }).removeAttr("disabled").attr("checked", false);
    
//};

var checkproduct = function (element, checked) {
    if (checked)
        $(".tableError").hide();
    
    var index = $(element).data('index');

    //$(".CHAVE", $(element).parents("tr:first")).val(checked ? $(element).val() : 0);

    if (checked) {
        //verifica se o objeto existe
        if (!$("#CHAVE" + index).length) {
            //se não existir cria
            $("#hiddenaux").append('<input type="hidden" name = "CHAVE" id = "CHAVE' + index + '" class="check" value="' + $(element).val() + '\">');
        }
    }
    else {
        //remove o hidden referente ao chk desmarcado
        $("#CHAVE" + index).remove();
    }
    





};
