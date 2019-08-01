
var oTable = null;

$(document).ready(function () {
    

    otable = $(".tableListaUsuarios").dataTable({
        aaSorting: [[1, "asc"]],
        "bDestroy": true,
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bAutoWidth": true,
        "bProcessing": false,
        "bServerSide": false,
        //"bSort": true,
        "sScrollX": "100%",
        "oLanguage":
        {
            "sZeroRecords": "Não foram encontrados resultados",
            "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
            "sInfoFiltered": "(Total de _MAX_ registros)"
        },
        "fnInitComplete": function () {
            this.fnAdjustColumnSizing(true);
        },
    });




    $("#btnExportar").on("click", function () {
    
        ////Habilita imagem de LOAD
        $(".loading-save").show();

        $("#exportarLinkDiv").append("<a id='anchorLayout' href='RelatDistribuidor/ExportarExcelCriadoEmMemoria' class=''></a>");
        $("#anchorLayout").get(0).click();
        //////DEsHabilita imagem de LOAD
        //$(".loading-save").hide();
        
        // o cookie é gravado na função que exporta o excel dentro da tela RelatorioRankingMedicosExportar.aspx
        var interval =
            setInterval(function () {
                if ($.cookie('DownloadDistribuidores')) {
                    //setTimeout(function () {
                    $(".loading-save").hide();
                    //}, 1);
                    $.removeCookie('DownloadDistribuidores', { path: '/' });
                    clearInterval(interval);
                }
            }, 1000);





    });



    $(window).resize(function () {
        //para ajustar o cabeçalho no Firefox do DATATABLE
        setTimeout(function () {
            otable.fnAdjustColumnSizing(true);
        }, 1);
    });


});