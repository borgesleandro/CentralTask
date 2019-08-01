$(document).ready(function () {
  var currentAjaxRequest = null;
  var containerErrosPedidosRede = $(".containerErrosPedidosRede").text;

  $("#btnExportar").css({ visibility: 'hidden' });





  $("#btnExportar").on("click", function () {

    ////Habilita imagem de LOAD
    $(".loading-save").show();
    
    //var model = {
    //  errosImp : $("#Erros").val(),
    //  dtPedidoInicial : $("#dataPedidoInicial").val(),
    //  dtPedidoFinal : $("#dataPedidoFinal").val(),
    //  dtImportacaoInicial : $("#dataImportacaoInicial").val(),
    //  dtImportacaoFinal : $("#dataImportacaoFinal").val(),
    //};


    //var modelvalid = "";

    //xhr = $.ajax({
    //  type: 'POST',
    //  contentType: 'application/json',
    //  url: "RelatRessarcimento/ModelToSession",
    //  async: false,
    //  data: JSON.stringify(model),
    //  success: function (response) {

    //    if (response.success) {
    //      modelvalid = true;
    //    }
    //    else {
    //      var errorList = "";
    //      $.each(JSON.parse(response.data), function (i, item) {
    //        errorList += " - " + item + "<br/>";
    //      });

    //      alert(errorList);
    //      modelvalid = false;
    //    }
    //  }
    //});

    //if (modelvalid) {
    $("#exportarLinkDiv").append("<a id='anchorLayout' href='RelatErrosImportacaoPedidosRede/ExportarExcelCriadoEmMemoria' class=''></a>");
      $("#anchorLayout").get(0).click();

      var interval =
             setInterval(function () {
               if ($.cookie('DownloadRelatErroPedidoRede')) { //DownloadRelatRessarcimento
                 //setTimeout(function () {
                 $(".loading-save").hide();
                 //}, 1);
                 $.removeCookie('DownloadRelatErroPedidoRede', { path: '/' });
                 clearInterval(interval);
               }
             }, 3000);


    //}
    //else {
    //  alert("Erro ao tentar exportar o Excel. Entre em contato com o adminstrador do sistema.");
    //  ////DEsHabilita imagem de LOAD
    //  $(".loading-save").hide();
    //}
     
  });






  $(document).on("click", ".Filtro", function () {
    $(".loading-save").show();
    
    
      if ((($("#dataImportacaoInicial").val() == "" || $("#dataImportacaoInicial").val() == "null" || $("#dataImportacaoInicial").val() == null) && ($("#dataImportacaoFinal").val() == "" || $("#dataImportacaoFinal").val() == "null" || $("#dataImportacaoFinal").val() == null))
       && (($("#dataPedidoInicial").val() == "" || $("#dataPedidoInicial").val() == "null" || $("#dataPedidoInicial").val() == null) && ($("#dataPedidoFinal").val() == "" || $("#dataPedidoFinal").val() == "null" || $("#dataPedidoFinal").val() == null))
        ) {
            alert ("É necessário informar a data importação ou data do pedido inicial ou final.");
            $(".loading-save").hide();
            return;
        }


      //###############################################
      //          VERIFICAÇÃO DE DATA IMPORTAÇÃO
      //###############################################
      var ssmsgDataInvalida = "";
      try {
        $.datepicker.parseDate('dd/mm/yy', $("#dataImportacaoInicial").val());
      }
      catch (err) {
        ssmsgDataInvalida += "Data importação inicial inválida.\n";
      }
      try {
        $.datepicker.parseDate('dd/mm/yy', $("#dataImportacaoFinal").val());
      }
      catch (err) {
        ssmsgDataInvalida += "Data importação fim inválida.\n";
      }
     
      if (ssmsgDataInvalida == "") {
        if (!($("#dataImportacaoInicial").val() == "" || $("#dataImportacaoInicial").val() == "null" || $("#dataImportacaoInicial").val() == null) && !($("#dataImportacaoFinal").val() == "" || $("#dataImportacaoFinal").val() == "null" || $("#dataImportacaoFinal").val() == null)) {
            if ($.datepicker.parseDate('dd/mm/yy', $("#dataImportacaoFinal").val()) < $.datepicker.parseDate('dd/mm/yy', $("#dataImportacaoInicial").val())) {
              ssmsgDataInvalida += "Data importação inicial não pode ser maior que o final\n";
            }
          }
      }
      if (ssmsgDataInvalida != "") {
        alert(ssmsgDataInvalida);
        $(".loading-save").hide();
        return;
      }
      //###############################################
      //          FIM VERIFICAÇÃO DE DATA IMPORTAÇÃO
      //###############################################
    


      //###############################################
      //          VERIFICAÇÃO DE DATA PEDIDO
      //###############################################
      ssmsgDataInvalida = "";
      try {
        $.datepicker.parseDate('dd/mm/yy', $("#dataPedidoInicial").val());
      }
      catch (err) {
        ssmsgDataInvalida += "Data do pedido inicial inválida.\n";
      }
      try {
        $.datepicker.parseDate('dd/mm/yy', $("#dataPedidoFinal").val());
      }
      catch (err) {
        ssmsgDataInvalida += "Data do pedido fim inválida.\n";
      }
      if (ssmsgDataInvalida == "") {
        if (!($("#dataPedidoInicial").val() == "" || $("#dataPedidoInicial").val() == "null" || $("#dataPedidoInicial").val() == null) && !($("#dataPedidoFinal").val() == "" || $("#dataPedidoFinal").val() == "null" || $("#dataPedidoFinal").val() == null)) {
            if ($.datepicker.parseDate('dd/mm/yy', $("#dataPedidoFinal").val()) < $.datepicker.parseDate('dd/mm/yy', $("#dataPedidoInicial").val())) {
              ssmsgDataInvalida += "Data do pedido inicial não pode ser maior que o final\n";
            }
          }
        }
        if (ssmsgDataInvalida != "") {
          alert(ssmsgDataInvalida);
          $(".loading-save").hide();
          return;
        }
        //###############################################
        //          FIM VERIFICAÇÃO DE DATA IMPORTAÇÃO
        //###############################################


        if ($("#Erros").val() =="")
        {
          alert("Selecione o Erro");
          $(".loading-save").hide();
          return;
        }



      if (currentAjaxRequest != null) currentAjaxRequest.abort();
      var sendData = {};

    
      sendData.errosImp = $("#Erros").val();
      sendData.dtPedidoInicial = $("#dataPedidoInicial").val();
      sendData.dtPedidoFinal = $("#dataPedidoFinal").val();
      sendData.dtImportacaoInicial = $("#dataImportacaoInicial").val();
      sendData.dtImportacaoFinal = $("#dataImportacaoFinal").val();
      sendData.CNPJOL = $("#CNPJ_OL").val();

      $(document).on("change", sendData, function () {
        $("#btnExportar").css({
          visibility: 'hidden'
        });

        $(".ErrosPedidoRede").dataTable().fnClearTable();
      });

      currentAjaxRequest = $.post(controller + "Filtro", sendData, function (data) {
        $(".containerErrosPedidosRede").text("");
        $(".containerErrosPedidosRede").append(data);
        $(".mws-datatable-fn").dataTable({
          aaSorting: [[$(".data-sort-asc:first").length > 0 ? $(".data-sort-asc:first").index() : 0, "asc"]],
          sPaginationType: "full_numbers",
          aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
               { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
          oLanguage:
           {
             sZeroRecords: "Não foram encontrados resultados",
             sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
             sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
             sInfoFiltered: "(Total de _MAX_ registros)"
           },
          "fnDrawCallback": function () { $(".loading-save").hide(); }
        });        
      });


      if (containerErrosPedidosRede != "") {
        $("#btnExportar").css({
          visibility: 'visible'
        });
      }




    });
});


