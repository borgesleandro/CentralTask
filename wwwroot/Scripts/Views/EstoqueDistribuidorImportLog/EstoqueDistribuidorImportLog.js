var tableToExcel = (function () {
    var uri = 'data:application/vnd.ms-excel;base64,'
      , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
      , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
      , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
    return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
    }
})()



function validatela() {

    //VALIDA DATA PEDIDO
    if ($('#dtInicio').val() == "") {
        //errmensagem += "Informe a data do pedido.<br/>"
        alert('Data início inválida');
        $(".loading-save").hide();
        return false;
    }
    else {
        if ($('#dtInicio').val().length < 10) {
            alert('Data início inválida');
            $(".loading-save").hide();
            return false;
        }
        else {
            try {
                $.datepicker.parseDate('dd/mm/yy', $("#dtInicio").val());
            }
            catch (err) {
                alert('Data início inválida');
                $(".loading-save").hide();
                return false;
            }
        }
    }

    if ($('#dtFim').val() == "") {
        alert('Data fim inválida');
        $(".loading-save").hide();
        return false;
    }
    else {
        if ($('#dtFim').val().length < 10) {
            alert('Data fim inválida');
            $(".loading-save").hide();
            return false;
        }
        else {
            try {
                $.datepicker.parseDate('dd/mm/yy', $("#dtFim").val());
            }
            catch (err) {
                alert('Data fim inválida');
                $(".loading-save").hide();
                return false;
            }
        }
    }
    if ($('#dtInicio').val().length == 10 && $("#dtFim").val().length == 10) {
        if ($.datepicker.parseDate('dd/mm/yy', $("#dtFim").val()) < $.datepicker.parseDate('dd/mm/yy', $("#dtInicio").val())) {
            alert('Data fim inválida');
            $(".loading-save").hide();
            return false;
        }
    }


    return true;
};


$(document).ready(function () {
    $("select[multiple]").multiselect().multiselectfilter();
    $("select:not([multiple])").chosen();

    $("#btnPesquisar").on("click", function () {
        $(".loading-save").show();
        $("#exportarLinkDiv").html("");

        //Valida o preenchimento da tela
        if (validatela() == false)
            return;

         
        var model = {
            DataInicio: $("#dtInicio").val(),
            DataFim: $("#dtFim").val(),
            ListaDistribuidorSelecionado: $("#CNPJ_OL").val()
        };

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "EstoqueDistribuidorImportLog/Pesquisar",
            async: true,
            data: JSON.stringify(model),
            success: function (response) {

                if (response.success == false) {
                    $(".loading-save").hide();
                    alert(response.data);

                }
                else {


                    //Tabela
                    $("#consulta").html(response);

                    $("#tabDistImportLog").dataTable({
                        "sPaginationType": "full_numbers",
                        "bAutoWidth": true,
                        "bProcessing": true,
                        "bServerSide": false,
                        "bSort": false,
                        "sScrollX": "100%",
                        "oLanguage": {
                            "sZeroRecords": "Nenhum dado encontrado."
                        }
                         , "fnInitComplete": function () {
                             $(".loading-save").hide();
                         }
                        //, "fnDrawCallback": function (oSettings) {
                        //    oSettings.aoColumns[0].nTh.style.minWidth = "90px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);                         
                        //    //oSettings.aoColumns[0].minWidth = "90px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);                         
                        //}
                    });
                    var csvContent = "data:text/csv;charset=utf-8,\uFEFF";



                     
                }
            },
            error: function (response) {
                alert('Erro ao realizar pesquisa ' + response);
                $(".loading-save").hide();
            }
        });

    });



    $("#btnExportar").on("click", function () {
        $("#exportarLinkDiv").html("");
        $(".loading-save").show();

        //Valida o preenchimento da tela
        if (validatela() == false)
            return;

        var model = {
            DataInicio: $("#dtInicio").val(),
            DataFim: $("#dtFim").val(),
            ListaDistribuidorSelecionado: $("#CNPJ_OL").val(),
            Exportar: true
        };
        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "EstoqueDistribuidorImportLog/Pesquisar",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='EstoqueDistribuidorImportLog.xls' class=''><img src='Content/botao-salvar-download.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });
    });
});
  

 

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}


