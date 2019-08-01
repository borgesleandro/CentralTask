
$(document).ready(function () {

    //ajusta o tamanho da div de acordo com a table
    $('#consulta').width($('.tamanhofieldset').width());
    
    //aplica mascara de CNPJ
    $("#CNPJFARMACIA").mask("99.999.999/9999-99");

    //seta o período para 1 do mês anterior até a data corrente
    var hojedate = new Date();
    var inimesstring = ('01').slice(-2) + '/'
            + ('0' + (hojedate.getMonth())).slice(-2) + '/'
            + hojedate.getFullYear();

    var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                     + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                     + hojedate.getFullYear();

    $("#txtPeriodoINI").val(inimesstring);
    $("#txtPeriodoFIM").val(hojestring);
    
    $("select").multiselect().multiselectfilter();
    
    //RETIRA A função multiselect do cbo Farmacia
    $("#FARMACIA").multiselect("destroy");
    $("#FARMACIA").chosen();

    $("#divfarmacia").hide();

    

    //#####################################################
    //          BOTÃO LUPA DE FARMACIA
    //#####################################################
    $("#btnLupa").on("click", function () {
        if ($('#CNPJFARMACIA').val() != "" || $('#RAZAOSOCIALFARMACIA').val() != "") {
            //MONTA PARAMETROS A SERa PASSADO PARA A FUNÇão
            var pdata = { CNPJ: $('#CNPJFARMACIA').val(), RAZAOSOCIAL: $('#RAZAOSOCIALFARMACIA').val(), Representantes: $("#REPRESENTANTES").val(), }
            
            $(".loading-save").show();

            //AS FARMACIAS PELO FILTRO
            $.ajax({
                type: "POST",
                url: controller + "ObterFarmacias",
                contentType: 'application/json',
                data: JSON.stringify(pdata),
                beforeSend: function () {
                    //$('#divfarmacia').append('<p>carregando...</p>');
                },
                success: function (data) {
                    $("#FARMACIA").empty();
                    if (data != "") {
                        var option = $('<option></option>');
                        option.attr('value', "");
                        option.text("Selecione uma opção");
                        $("#FARMACIA").append(option);


                        $.each(data, function () {
                            var option = $('<option></option>');

                            option.attr('value', this.codigo);
                            option.text(this.descricao);

                            $("#FARMACIA").append(option);
                        });
                        $("#FARMACIA").trigger("liszt:updated");
                        $("#divfarmacia").show();

                        //função utilizada para trazer a lista do select ABERTA
                        $('#FARMACIA_chzn').trigger("mousedown");

                        $(".loading-save").hide();
                    }
                    else {
                        $(".loading-save").hide();
                        alert("Não existem clientes cadastrados com esses parâmetros");
                        $('#CNPJFARMACIA').attr('value', "");
                        $("#divfarmacia").hide();
                    }
                    //$("#FARMACIA").multiselect("refresh");
                }
            });
        }
        else {
            alert("Informe o CNPJ ou parte da Razão Social");
            $("#FARMACIA").empty();
            $("#divfarmacia").hide();
            $(".loading-save").hide();
        }
    });





    //#####################################################
    //      BOTAO DE LIMPEZA DE FILTRO DE FARMACIA
    //#####################################################
    $("#btnlimpa").on("click", function () {
        $('#CNPJFARMACIA').attr('value', '');
        $("#CNPJFARMACIA").mask("99.999.999/9999-99");

        $('#RAZAOSOCIALFARMACIA').attr('value', "");

        $("#FARMACIA").empty();
        $("#divfarmacia").hide();
    });

    

    $("#REPRESENTANTES").change(function () {
        $("#btnlimpa").click();
    });


    //#####################################################
    //          LISTA DE FARMACIAS
    //#####################################################
    $("#FARMACIA").change(function () {
        if ($('#FARMACIA').val() != "") {
            $('#CNPJFARMACIA').attr('value', $('#FARMACIA').val());
            $("#CNPJFARMACIA").mask("99.999.999/9999-99");

            var razao = $('#FARMACIA option:selected').text()

            $('#RAZAOSOCIALFARMACIA').attr('value', razao.substring(20).trim());

            //esaconde combo FARMACIA
            $("#FARMACIA").empty();
            $("#divfarmacia").hide();
        }
    });

    


    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisar").on("click", function () {

        $("#exportarLinkDiv").html("");

        //###############################################
        //          VERIFICAÇÃO DE DATA
        //###############################################
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
            return;
        }
        //###############################################
        //          FIM VERIFICAÇÃO DE DATA
        //###############################################



        ////Habilita imagem de LOAD
        $(".loading-save").show();


        var model = {
          //Companhia: $("#CODDIV").val(),
          //Equipe: $("#EQUI_EQUIPE").val(),
          Distribuidor: $("#CNPJ_OL").val(),
          Representantes: $("#REPRESENTANTES").val(),
          //NumeroPedidos: $("#NumeroPedido").val(),
          //NumeroPedidosTablet: $("#NumeroPedidoTablet").val(),
          PeriodoIni: $("#txtPeriodoINI").val(),
          PeriodoFim: $("#txtPeriodoFIM").val(),
          //Campanha: $("#CAMPANHA").val(),
          CnpjFarmacia: $("#CNPJFARMACIA").val(),
          RazaoSocialFarmacia: $("#RAZAOSOCIALFARMACIA").val(),
          Origem: $("#ORIGEM").val(),
          //Status: $("#STATUS").val()
        };


        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "RelatRessarcimento/List",
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

      
      ////Habilita imagem de LOAD
      $(".loading-save").show();


      var model = {
        //Companhia: $("#CODDIV").val(),
        //Equipe: $("#EQUI_EQUIPE").val(),
        Distribuidor: $("#CNPJ_OL").val(),
        Representantes: $("#REPRESENTANTES").val(),
        //NumeroPedidos: $("#NumeroPedido").val(),
        //NumeroPedidosTablet: $("#NumeroPedidoTablet").val(),
        PeriodoIni: $("#txtPeriodoINI").val(),
        PeriodoFim: $("#txtPeriodoFIM").val(),
        //Campanha: $("#CAMPANHA").val(),
        CnpjFarmacia: $("#CNPJFARMACIA").val(),
        RazaoSocialFarmacia: $("#RAZAOSOCIALFARMACIA").val(),
        Origem: $("#ORIGEM").val(),
        //Status: $("#STATUS").val()
      };

      
      var modelvalid = "";

      xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "RelatRessarcimento/ModelToSession",
        async: false,
        data: JSON.stringify(model),
        success: function (response) {

          if (response.success) {
            modelvalid = true;
          }
          else {
            var errorList = "";
            $.each(JSON.parse(response.data), function (i, item) {
              errorList += " - " + item + "<br/>";
            });

            alert(errorList);
            modelvalid = false;
          }
        }
      });
      
      if (modelvalid) {
        $("#exportarLinkDiv").append("<a id='anchorLayout' href='RelatRessarcimento/ExportarExcelCriadoEmMemoria' class=''></a>");
        $("#anchorLayout").get(0).click();
        ////DEsHabilita imagem de LOAD
        //$(".loading-save").hide();
        // o cookie é gravado na função que exporta o excel dentro da tela RelatorioRankingMedicosExportar.aspx
        var interval =
               setInterval(function () {
                 if ($.cookie('DownloadRelatRessarcimento')) {
                   //setTimeout(function () {
                   $(".loading-save").hide();
                   //}, 1);
                   $.removeCookie('DownloadRelatRessarcimento', { path: '/' });
                   clearInterval(interval);
                 }
               }, 1000);


      }
      else {
        alert("Erro ao tentar exportar o Excel. Entre em contato com o adminstrador do sistema.");
        ////DEsHabilita imagem de LOAD
        $(".loading-save").hide();
      }



      //xhr = $.ajax({
      //  type: 'POST',
      //  contentType: 'application/json',
      //  url: "RelatRessarcimento/ExportarExcelCriadoEmMemoria",
      //  async: false,
      //  data: JSON.stringify(model),
      //  success: function (response, status, request) {
          
      //    var type = request.getResponseHeader('Content-Type');
      //    var blob = new Blob(["\ufeff", response], { type: type });
      //    var downloadUrl = URL.createObjectURL(blob);
          
      //    setTimeout(function () {
      //      $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='Ressarcimento.xlsx' class=''><img src='Content/botao-salvar-download.png'/></a>")
      //      $("#div2").append("<a id='anchorLayout' href='Ferramentas/ExportarExcelCriadoEmMemoria?nomeArquivo=" + $("#txtNomeArquivo").val() + "&VeioPesquisar=NAO' class=''></a>");
      //    }, 2000);

      //    $(".loading-save").hide();
      //  },
      //  error: function (response) {
      //    alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
      //    $(".loading-save").hide();
      //  }
      //});




       



    });







});
//######################################
//          fim do READY
//######################################


 


//function validatela() {

//    //VALIDA DATA PEDIDO
//    if ($('#dtInicio').val() == "") {
//        //errmensagem += "Informe a data do pedido.<br/>"
//        alert('Data início inválida');
//        $(".loading-save").hide();
//        return false;
//    }
//    else {
//        if ($('#dtInicio').val().length < 10) {
//            alert('Data início inválida');
//            $(".loading-save").hide();
//            return false;
//        }
//        else {
//            try {
//                $.datepicker.parseDate('dd/mm/yy', $("#dtInicio").val());
//            }
//            catch (err) {
//                alert('Data início inválida');
//                $(".loading-save").hide();
//                return false;
//            }
//        }
//    }

//    if ($('#dtFim').val() == "") {
//        alert('Data fim inválida');
//        $(".loading-save").hide();
//        return false;
//    }
//    else {
//        if ($('#dtFim').val().length < 10) {
//            alert('Data fim inválida');
//            $(".loading-save").hide();
//            return false;
//        }
//        else {
//            try {
//                $.datepicker.parseDate('dd/mm/yy', $("#dtFim").val());
//            }
//            catch (err) {
//                alert('Data fim inválida');
//                $(".loading-save").hide();
//                return false;
//            }
//        }
//    }
//    if ($('#dtInicio').val().length == 10 && $("#dtFim").val().length == 10) {
//        if ($.datepicker.parseDate('dd/mm/yy', $("#dtFim").val()) < $.datepicker.parseDate('dd/mm/yy', $("#dtInicio").val())) {
//            alert('Data fim inválida');
//            $(".loading-save").hide();
//            return false;
//        }
//    }


//    return true;
//};


