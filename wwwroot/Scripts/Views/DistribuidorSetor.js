

$(document).ready(function () {

    $("#CNPJ_DIST").chosen();

    $("#SETOR").chosen();


    $(document).on("change", "#CNPJ_DIST", function () {
        //limpa cbo setor
        $('#SETOR').val(' ');
        $('#SETOR').trigger("liszt:updated");

        var setores_container = $("div.setores");
        var selectedValue = $(this).val();
        setores_container.html("");
        if (selectedValue != "") {

            $.post(controller + "GetSetores", { cnpj: selectedValue }, function (data) {
                setores_container.html(data);
            }, "html");
        }
    });


    $(document).on("change", "#SETOR", function () {
        //limpa cbo DISTRIBUIDOR
        $('#CNPJ_DIST').val(' ');
        $('#CNPJ_DIST').trigger("liszt:updated");

        var setores_container = $("div.setores");
        var selectedValue = $(this).val();
        setores_container.html("");
        if (selectedValue != "") {

            $.post(controller + "GetDistribuidores", { setor: selectedValue }, function (data) {
                setores_container.html(data);
            }, "html");
        }
    });






    $(document).on("click", ".btn-salvar", function () {

       
        var sendData = { cnpj: $("#CNPJ_DIST").val(), setor: $("#SETOR").val(), setores: $("#listSetor").val(), distribuidores: $("#listDistribuidor").val() };
        $.post(controller + "Salvar", $.toDictionary(sendData), function (data) {
            if (data) {
                alert("Registros Salvos com sucesso!");
            }
            else {
                alert("Ocorreu um erro ao salvar seus registros.");
            }
        }, "json");
    });



    $("#btnExportar").on("click", function () {
      //$("#exportarLinkDiv").html("Seu relatório está sendo processado e será disponibilizado via download automaticamente assim que estiver pronto.");

      ////Habilita imagem de LOAD
      $(".loading-save").show();
       
        $("#exportarLinkDiv").append("<a id='anchorLayout' href='DistribuidorSetor/ExportarExcelCriadoEmMemoria' class=''></a>");
        $("#anchorLayout").get(0).click();
        //////DEsHabilita imagem de LOAD
        //$(".loading-save").hide();


      // o cookie é gravado na função que exporta o excel dentro da tela RelatorioRankingMedicosExportar.aspx
        var interval =
               setInterval(function () {
                 if ($.cookie('DownloadDistribuidorxSetor')) {
                   //setTimeout(function () {
                   $(".loading-save").hide();
                   //}, 1);
                   $.removeCookie('DownloadDistribuidorxSetor', { path: '/' });
                   clearInterval(interval);
                 }
               }, 1000);


      


    });



});