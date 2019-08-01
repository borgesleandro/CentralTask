
$(document).ready(function () {

  //ajusta o tamanho da div de acordo com a table
  $('#consulta').width($('.tamanhofieldset').width());

  $('#consultafarmNaoCad').width($('.tamanhofieldset').width());
  

 
  ////seta o período para 1 do mês anterior até a data corrente
  //var hojedate = new Date();
  //var inimesstring = ('01').slice(-2) + '/'
  //        + ('0' + (hojedate.getMonth())).slice(-2) + '/'
  //        + hojedate.getFullYear();

  //var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
  //                 + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
  //                 + hojedate.getFullYear();

  //$("#txtPeriodoINI").val(inimesstring);
  //$("#txtPeriodoFIM").val(hojestring);

  //$("select").multiselect().multiselectfilter();
 
   

  $(".sonumeroevirgula").keypress(function (e) {

    if (e.which != 44 && e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
      return false;
    }
    sonumeros(this);
  });

  function sonumeros(obj)
  {
    var aux = "";
    setTimeout(function () {
      //aux = $("#txtlistafiltro").val();
      aux = $(obj).val();
    }, 0);
    //var aux = e.originalEvent.clipboardData.getData('text');
    aux = aux.replace(/[^0-9,]/g, ''); // o que não for número e nem vírgula vai apagar
    setTimeout(function () {
      //substitui mais de uma vírgula em sequencia por uma só
      while (1 == 1) {
        if (aux.indexOf(',,') == -1) {
          break;
        }
        else {
          aux = aux.replace(/,,/g, ',');
        }
      }
      //$("#txtlistafiltro").val(aux.replace(/[^0-9,]/g, ''));
      $(obj).val(aux.replace(/[^0-9,]/g, ''));
    }, 0);
  }

  //###############################
  //só aceita números e virgulas no COLAR
  //###############################
  $(".sonumeroevirgula").bind('paste', function (e) {
    sonumeros(this);
  });





  function Validar ()
  {
    if ($('#ID_GRUPO_OL').val() == null || $('#ID_GRUPO_OL').val() == "") {
      alert("Selecione o grupo.");
      return false;
    }

    //###############################################
    //          VERIFICAÇÃO DE DATA
    //###############################################
    var dtvazia = false;
    if (($("#txtPeriodoINI").val() == "" || $("#txtPeriodoINI").val() == "null" || $("#txtPeriodoINI").val() == null) && ($("#txtPeriodoFIM").val() == "" || $("#txtPeriodoFIM").val() == "null" || $("#txtPeriodoFIM").val() == null)) {
      dtvazia = true;
    }

    if (dtvazia == true && $("#txtListaNotas").val() == "") {
      alert("É necessário informar a NF ou o período.");
      return false;
    }

    if (dtvazia == false) {
      var ssmsgDataInvalida = "";
      if ($("#txtPeriodoINI").val() == "" || $("#txtPeriodoINI").val() == "null" || $("#txtPeriodoINI").val() == null) {
        ssmsgDataInvalida = "É necessário informar o período.\n";
      }
      else {
        if ($("#txtPeriodoFIM").val() == "" || $("#txtPeriodoFIM").val() == "null" || $("#txtPeriodoFIM").val() == null) {
          ssmsgDataInvalida += "É necessário informar o período.\n";
        }
      }
      try {
        $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoINI").val());
      }
      catch (err) {
        ssmsgDataInvalida += "Período inicial inválido.\n";
      }
      try {
        $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoFIM").val());
      }
      catch (err) {
        ssmsgDataInvalida += "Período fim inválido.\n";
      }
      if (ssmsgDataInvalida == "") {
        if ($.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoFIM").val()) < $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoINI").val())) {
          ssmsgDataInvalida += "Período inicial não pode ser maior que o final\n";
        }
      }
      if (ssmsgDataInvalida != "") {
        alert(ssmsgDataInvalida);
        return false;
      }
    }
    //###############################################
    //          FIM VERIFICAÇÃO DE DATA
    //###############################################

    return true;
  }


  //#############################################
  //          PESQUISAR
  //#############################################
  $("#btnPesquisar").on("click", function () {

    $("#exportarLinkDiv").html("");


    if (Validar() == false)
    {
      return false;
    }


    ////Habilita imagem de LOAD
    $(".loading-save").show();


    var model = {
      grupo: $("#ID_GRUPO_OL").val(),
      descgrupo : $('#ID_GRUPO_OL :selected').text(),
      listafarmacias: $("#txtListaNotas").val(),
      PeriodoIni: $("#txtPeriodoINI").val(),
      PeriodoFim: $("#txtPeriodoFIM").val()
    };

    xhr = $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: "RelatConferenciaImportPedidoRede/List",
      async: true,
      data: JSON.stringify(model),
      success: function (response) {

        if (response.success == false) {
          alert(response.data);
        }
        else {
          //Tabela
          $("#consulta").html(response);
          $("#consulta").show();

          $("#tbpesquisa").dataTable({
            "sPaginationType": "full_numbers",
            "bPaginate": true,
            "bAutoWidth": false,
            "bProcessing": false,
            "bServerSide": false,
            "bSort": true,
            "sScrollX": "100%",
            "oLanguage":
            {
              "sZeroRecords": "Não foram encontrados resultados",
              "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
              "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
              "sInfoFiltered": "(Total de _MAX_ registros)"
            },
          });


          //######################################################
          //      FARMÁCIAS não cadastradas
          //se vier OK, carrega a lista com as farmácias não cadastradas
          xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "RelatConferenciaImportPedidoRede/ListFarmaciasNaoCad",
            async: true,
            //data: JSON.stringify(model),
            success: function (response) {

              if (response.success == false) {
                alert(response.data);
              }
              else {
                //Tabela
                $("#consultafarmNaoCad").html(response);
                $("#consultafarmNaoCad").show();

                $("#tbfarmNaoCad").dataTable({
                  "sPaginationType": "full_numbers",
                  "bPaginate": true,
                  "bAutoWidth": false,
                  "bProcessing": false,
                  "bServerSide": false,
                  "bSort": true,
                  "sScrollX": "100%",
                  "oLanguage":
                  {
                    "sZeroRecords": "Não foram encontrados resultados",
                    "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                    "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                    "sInfoFiltered": "(Total de _MAX_ registros)"
                  },
                });
              }
            },
            error: function (response) {
              //$(".loading-save").hide();
              $("#consultafarmNaoCad").html("Erro ao carregar os clientes não cadastrados");
              $("#consultafarmNaoCad").show();
            }
          });
          //######################################################
          //      FARMÁCIAS não cadastradas
          //######################################################



          //######################################################
          //      FARMÁCIAS cadastradas EM OUTRA EQUIPE
          xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "RelatConferenciaImportPedidoRede/ListFarmaciasCadOutraEquipe",
            async: true,
            //data: JSON.stringify(model),
            success: function (response) {
              if (response.success == false) {
                alert(response.data);
              }
              else {
                //Tabela
                $("#consultafarmCadOutraEquipe").html(response);
                $("#consultafarmCadOutraEquipe").show();

                $("#tbfarmCadOutraEquipe").dataTable({
                  "sPaginationType": "full_numbers",
                  "bPaginate": true,
                  "bAutoWidth": false,
                  "bProcessing": false,
                  "bServerSide": false,
                  "bSort": true,
                  "sScrollX": "100%",
                  "oLanguage":
                  {
                    "sZeroRecords": "Não foram encontrados resultados",
                    "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                    "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                    "sInfoFiltered": "(Total de _MAX_ registros)"
                  },
                });
              }
            },
            error: function (response) {
              //$(".loading-save").hide();
              $("#consultafarmCadOutraEquipe").html("Erro ao carregar os clientes cadastrados em outra equipe");
              $("#consultafarmCadOutraEquipe").show();
            }
          });
          //######################################################
          //      FARMÁCIAS cadastradas EM OUTRA EQUIPE
          //######################################################





        }
        $(".loading-save").hide();
      },
      error: function (response) {
        $(".loading-save").hide();
      }
    });
  });
  //#############################################




  $("#btnExportar").on("click", function () {

    //$("#exportarLinkDiv").html("Seu relatório está sendo processado e será disponibilizado via download automaticamente assim que estiver pronto.");


    //if ($("#CODDIV").val() == "") {
    //  alert("É necessário selecionar a Companhia.");
    //  return;
    //}
    if (Validar() == false) {
      return false;
    }


    ////Habilita imagem de LOAD
    $(".loading-save").show();


    var model = {
      grupo: $("#ID_GRUPO_OL").val(),
      descgrupo: $('#ID_GRUPO_OL :selected').text(),
      listafarmacias: $("#txtListaNotas").val(),
      PeriodoIni: $("#txtPeriodoINI").val(),
      PeriodoFim: $("#txtPeriodoFIM").val()
    };



    var modelvalid = "";

    xhr = $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: "RelatConferenciaImportPedidoRede/ModelToSession",
      async: false,
      data: JSON.stringify(model),
      success: function (response) {

        if (response.success) {
              
                $("#exportarLinkDiv").append("<a id='anchorLayout' href='RelatConferenciaImportPedidoRede/ExportarExcelCriadoEmMemoria' class=''></a>");
                $("#anchorLayout").get(0).click();
                ////DEsHabilita imagem de LOAD
                //$(".loading-save").hide();
                // o cookie é gravado na função que exporta o excel dentro da tela RelatorioRankingMedicosExportar.aspx
                var interval =
                       setInterval(function () {
                         if ($.cookie('DownloadRelConferenciaImpPedidosRede')) {
                           //setTimeout(function () {
                           $(".loading-save").hide();
                           //}, 1);
                           $.removeCookie('DownloadRelConferenciaImpPedidosRede', { path: '/' });
                           clearInterval(interval);
                         }
                       }, 1000);
        }
        else {
          //var errorList = "";
          //$.each(JSON.parse(response.data), function (i, item) {
          //  errorList += " - " + item + "<br/>";
          //});

          //alert(errorList);
          //modelvalid = false;
          alert("Erro ao tentar exportar o Excel. Entre em contato com o adminstrador do sistema.");
          ////DEsHabilita imagem de LOAD
          $(".loading-save").hide();
        }
      }
    });

    
     

  });

   

});
//######################################
//          fim do READY
//######################################




