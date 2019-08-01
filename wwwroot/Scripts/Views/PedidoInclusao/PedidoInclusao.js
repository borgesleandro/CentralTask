


function representantesChange() {

    $("#CHK_FATURADO_EM").attr('checked', false);
    $("#CHK_FATURADO_EM").change();

    
    limpacboCondicao();
    limpacboPrazo();

    if ($('#CBOREPRESENTANTES').val() != "") {
        //MONTA PARAMETROS A SERa PASSADO PARA A FUNÇão
        var pdata = { REP: $('#CBOREPRESENTANTES').val() }

        
                        //CARREGA COMBO FARMACIA
                        $.ajax({
                            type: "POST",
                            url: controller + "ObterFarmacias",
                            contentType: 'application/json',
                            data: JSON.stringify(pdata),
                            success: function (data) {

                                $("#CBOFARMACIA").attr('disabled', false); 

                                limpacboFarmacia();

                                if (data != "") {
                                    $.each(data, function () {
                                        var option = $('<option></option>');

                                        option.attr('value', this.CNPJ);
                                        option.text(this.RAZAOSOCIAL);

                                        $("#CBOFARMACIA").append(option);
                                    });

                                }
                                else {
                                    alert("Não existem clientes cadastrados para este representante");
                                }
                                $("#CBOFARMACIA").trigger("liszt:updated");

                            },
                            error: function () { alert('Erro ao carregar clientes'); }
                        });

    }
    else {
        //limpa os combos
        limpacboFarmacia();
        limpacboDistribuidor();
        limpacboCondicao();
        limpacboPrazo();
    }
}




function FarmaciaChange() {

  $("#CHK_FATURADO_EM").attr('checked', false);
  $("#CHK_FATURADO_EM").change();

  limpacboCondicao();
  limpacboPrazo();



  if ($('#CBOFARMACIA').val() != "") {
    //MONTA PARAMETROS A SERa PASSADO PARA A FUNÇão
    var pdata = { REP: $('#CBOREPRESENTANTES').val(), CNPJFARMACIA: $('#CBOFARMACIA').val() }


    var pdatarep = { REP: $('#CBOREPRESENTANTES').val() }

    //CARREGA QTDE DISTRIBUIDORES
    $.ajax({
      type: "POST",
      url: controller + "ObterQTDEDistribuidores",
      contentType: 'application/json',
      data: JSON.stringify(pdatarep),
      success: function (data) {

        $("#QTDDISTRIB").val('0');

        if (data != "") {
          $.each(data, function () {

            $("#QTDDISTRIB").val(this.qtde);

            //a primeira linha sempre estará visível
            $("#linhaCondicao_1").show();

            for (var i = 1 ; i <= 5 ; i++) {
              //Só deixa visível a quantidade de linhas que estiver parametrizada para esse setor
              if (i <= this.qtde) {
                $("#linhaDistribuidor_" + i).show();
              }
              else {
                $("#linhaDistribuidor_" + i).hide();
                $("#linhaCondicao_" + i).hide();
              }
            }


            //CARREGA DISTRIBUIDORES
            $.ajax({
              type: "POST",
              url: controller + "ObterDistribuidores",
              contentType: 'application/json',
              data: JSON.stringify(pdata),
              success: function (data) {

                limpacboDistribuidor();

                if (data != "") {
                    $.each(data, function () {
                        for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {
                          var option = $('<option></option>');

                          option.attr('value', this.codigo);
                          option.text(this.descricao);

                          $("#CBODISTRIBUIDOR" + i).append(option);
                        }
                    });
                }
                else {
                    alert("Não existem distribuidores cadastradas para este representante");
                }
                for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {
                    $("#CBODISTRIBUIDOR" + i).trigger("liszt:updated");
                }
              },
              error: function () { alert('Erro ao carregar os Distribuidores'); }
            });
          });
        }
        else {
            alert("Não existem quantidade de distribuidores cadastradas para este representante");
        }
      },
        error: function () { alert('Erro ao carregar os Distribuidores'); }
    });
  }
  else {
      //limpa os combos
      //limpacboFarmacia();
      limpacboDistribuidor();
      limpacboCondicao();
      limpacboPrazo();
  }
}




function carregaCondicao(indexcbo) {


    //VERIFICA SE OS DISTRIBUIDORES SÃO DO MESMO TIPO
    if ($('#CBODISTRIBUIDOR' + indexcbo).val() != $('#hiddenDISTRIBUIDOR' + indexcbo).val() ) {
      //Não pode ter dois distribuidores com tipos de PedidoSellIn diferentes

                var sair = false;
                //verifica se esta repetindo o distribuidor
                for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {
                    if ($('#CBODISTRIBUIDOR' + i).val() != "") {
                        for (var y = i + 1 ; y <= $("#QTDDISTRIB").val() ; y++) {
                            if ($('#CBODISTRIBUIDOR' + y).val() != "") {
                                  var auxDist1 = $('#CBODISTRIBUIDOR' + i).val().split('-');
                                  var auxDist2 = $('#CBODISTRIBUIDOR' + y).val().split('-');
                                  if (auxDist1[1] != auxDist2[1])
                                  {
                                    $('#CBODISTRIBUIDOR' + indexcbo).val($('#hiddenDISTRIBUIDOR' + indexcbo).val());
                                    $("#CBODISTRIBUIDOR" + indexcbo).trigger("liszt:updated");
                                    
                                    alert('Não pode selecior Distribuidores com tipo de pedido sell in diferentes.');
                                    break;
                                  }
                            }
                        }
                    }
                }
                if (sair == true)
                {
                      return false;
                }

          //$('#CBODISTRIBUIDOR' + indexcbo).val($('#hiddenDISTRIBUIDOR' + indexcbo).val());
          //$("#CBODISTRIBUIDOR" + indexcbo).trigger("liszt:updated");
          //return false;
    }

    

    //verifica se ja carregou o grid e se esta mudando o distribuidor
    if ($('#CBODISTRIBUIDOR' + indexcbo).val() != $('#hiddenDISTRIBUIDOR' + indexcbo).val() && $("#hdQTDLINHASGRID").val() > 0) {

        alert("A alteração do distribuidor irá limpar a lista de produtos. Conforma a limpeza da lista de produtos?", "Inclusão de Pedidos", null, function () {
            $.ajax({
                type: "POST",
                url: controller + "LimpaListaProdutos",
                contentType: 'application/json',
                success: function () {
                    //seta a quantidade de linhas
                    $("#hdQTDLINHASGRID").val('0');
                    $("#tabprodutos").dataTable().fnDraw(false);
                    $('#lblunidades').text(' ');
                    $('#lblprecofabrica').text(' ');
                    $('#lblprecoliquido').text(' ');

                }
            });

            //GUARDA O distribuidor selecionado em variavel hidden
            $('#hiddenDISTRIBUIDOR' + indexcbo).val($('#CBODISTRIBUIDOR' + indexcbo).val());

            preenchecond(indexcbo);
        },
            function () {
                $('#CBODISTRIBUIDOR' + indexcbo).val($('#hiddenDISTRIBUIDOR' + indexcbo).val());
                $("#CBODISTRIBUIDOR" + indexcbo).trigger("liszt:updated");
                return false;
            });
    }
    else {
        //GUARDA O distribuidor selecionado em variavel hidden
        $('#hiddenDISTRIBUIDOR' + indexcbo).val($('#CBODISTRIBUIDOR' + indexcbo).val());
        preenchecond(indexcbo);
    }
}

function preenchecond(indexcbo) {

    $("#CBOPRAZO" + indexcbo).empty();
    var option = $('<option></option>');
    option.attr('value', "");
    option.text("Selecione uma opção");
    $("#CBOPRAZO" + indexcbo).append(option);
    $("#CBOPRAZO" + indexcbo).trigger("liszt:updated");
    $("#CBOCONDICAO" + indexcbo).empty();
    $("#CBOCONDICAO" + indexcbo).append(option);

    if ($('#CBODISTRIBUIDOR' + indexcbo).val() != "" && $('#CBODISTRIBUIDOR' + indexcbo).val() != null) {

        var auxcnpj = $('#CBODISTRIBUIDOR' + indexcbo).val().split('-');
        var pdata = { CNPJ_OL: auxcnpj[0] }
        //habilita a linha da condição
        $("#linhaCondicao_" + indexcbo).show();
        //CARREGA COMBO CONDIÇÃO
        $.ajax({
            type: "POST",
            url: controller + "ObterCondicaoComercial",
            contentType: 'application/json',
            data: JSON.stringify(pdata),
            success: function (data) {

                if (data != "") {

                    $.each(data, function () {
                        var option = $('<option></option>');
                        option.attr('value', this.codigo);
                        option.text(this.descricao);
                        $("#CBOCONDICAO" + indexcbo).append(option);
                    });
                }
                else {
                    alert("Não existem condições cadastradas para o distribuidor da " + indexcbo + "ª opção");
                }
                $("#CBOCONDICAO" + indexcbo).trigger("liszt:updated");
            },
            error: function () { alert('Erro ao carregar Condição'); }
        });
    }
    else {
        if (indexcbo != 1) {
            //Desabilita a linha da condição
            $("#linhaCondicao_" + indexcbo).hide();
        }
    }
    $("#CBOCONDICAO" + indexcbo).trigger("liszt:updated");
}

function carregaPrazo(indexcbo, valselecionado) {

    $("#CBOPRAZO" + indexcbo).empty();
    var option = $('<option></option>');
    option.attr('value', "");
    option.text("Selecione uma opção");
    $("#CBOPRAZO" + indexcbo).append(option);

    if ($('#CBOCONDICAO' + indexcbo).val() != "" && $('#CBOCONDICAO' + indexcbo).val() != null) {
      var auxcnpj = $('#CBODISTRIBUIDOR' + indexcbo).val().split('-');
      var pdata = { CNPJ_OL: auxcnpj[0], CONDCOM: $('#CBOCONDICAO' + indexcbo).val() }

        //CARREGA COMBO PRAZO
        $.ajax({
            type: "POST",
            url: controller + "ObterPrazos",
            contentType: 'application/json',
            data: JSON.stringify(pdata),
            success: function (data) {

                if (data != "") {

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CBOPRAZO" + indexcbo).append(option);
                    });

                }
                else {
                    alert("Não existem prazos cadastrados para o distribuidor e condição da " + indexcbo + "ª opção");
                }

                if (valselecionado != "") {
                    $("#CBOPRAZO" + indexcbo).val(valselecionado);
                }

                $("#CBOPRAZO" + indexcbo).trigger("liszt:updated");

            },
            error: function () { alert('Erro ao carregar o prazo'); }
        });
    }
}


function limpacboFarmacia() {

    var option = $('<option></option>');
    option.attr('value', "");
    option.text("Selecione uma opção");

    $("#CBOFARMACIA").empty();
    $("#CBOFARMACIA").append(option);
    $("#CBOFARMACIA").trigger("liszt:updated");
}

function limpacboDistribuidor() {

    for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {
        $("#CBODISTRIBUIDOR" + i).attr('disabled', false); //.trigger("liszt:updated");

        var option = $('<option></option>');
        option.attr('value', "");
        option.text("Selecione uma opção");

        $("#CBODISTRIBUIDOR" + i).empty();
        $("#CBODISTRIBUIDOR" + i).append(option);
        $("#CBODISTRIBUIDOR" + i).trigger("liszt:updated");
    }
}

function limpacboCondicao() {


    for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {

        var option = $('<option></option>');
        option.attr('value', "");
        option.text("Selecione uma opção");

        $("#CBOCONDICAO" + i).empty();
        $("#CBOCONDICAO" + i).append(option);
        $("#CBOCONDICAO" + i).trigger("liszt:updated");
    }
}

function limpacboPrazo() {
    for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {
        
        var option = $('<option></option>');
        option.attr('value', "");
        option.text("Selecione uma opção");

        $("#CBOPRAZO" + i).empty();
        $("#CBOPRAZO" + i).append(option);
        $("#CBOPRAZO" + i).trigger("liszt:updated");
    }
}


//insere a LINHA NO GRID
var InsertGridRow = function () {
    $(".produtoErro").slideUp("fast");

    var auxprod = $("#PRODUTO").val().split('-');
  //var produtoId = $("#PRODUTO").val();//$("input[name='PRODUTO']").val();
    var produtoId = auxprod[0];

    var quantidade = $("#txtQuantidade").val();;

    //validacoes
    var ssmsgerro = "";
    var ssquebra = "";
    //tem que ter preenchido pelo menos 1 distribuidor
    if ($('#CBODISTRIBUIDOR1').val().length == 0) {
        ssmsgerro = "Selecione o 1º distribuidor.";
        ssquebra = " , ";
    }

    //verifica se esta repetindo o distribuidor
    for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {
        if ($('#CBODISTRIBUIDOR' + i).val() != "") {
            for (var y = i + 1 ; y <= $("#QTDDISTRIB").val() ; y++) {
                if ($('#CBODISTRIBUIDOR' + i).val() == $('#CBODISTRIBUIDOR' + y).val()) {
                    ssmsgerro += ssquebra + " O " + i + " distribuidor não pode ser igual ao " + y + " distribuidor.";
                    ssquebra = " , ";
                }
            }

            if ($('#CBOCONDICAO' + i).val() == "" || $('#CBOCONDICAO' + i).val() == null) {
                ssmsgerro += ssquebra + " Selecione a " + i + "ª condição.";
                ssquebra = " , ";
            }
            if ($('#CBOPRAZO' + i).val() == "" || $('#CBOPRAZO' + i).val() == null) {
                ssmsgerro += ssquebra + " Selecione o " + i + "º prazo.";
                ssquebra = " , ";
            }
        }
    }

    if (ssmsgerro != "") {
        $(".produtoErro").text(ssmsgerro).slideDown("fast");
    } else {
        if (produtoId != "") {
            if (quantidade == "" || quantidade == 0) {
                $(".produtoErro").text("Quantidade deve ser informada.").slideDown("fast");
            }
            else {
                var sendData = {};

                sendData.REPRESENTANTE = $('#CBOREPRESENTANTES').val();

                sendData.PRODUTO_ID = produtoId;
                sendData.QTD = quantidade;
                
                var auxcnpj1 = $('#CBODISTRIBUIDOR1').val().split('-');
                sendData.CNPJ_DISTRIB1 = auxcnpj1[0];

                sendData.CONDICAO1 = $('#CBOCONDICAO1').val();
                sendData.DESCCONDICAO1 = $("#CBOCONDICAO1 option:selected").text();

                if ($("#QTDDISTRIB").val() > 1 && $('#CBOCONDICAO2').val() != "" && $('#CBOCONDICAO2').val() != null) {
                    sendData.CONDICAO2 = $('#CBOCONDICAO2').val();
                    sendData.DESCCONDICAO2 = $("#CBOCONDICAO2 option:selected").text();
                };
                if ($("#QTDDISTRIB").val() > 2 && $('#CBOCONDICAO3').val() != "" && $('#CBOCONDICAO3').val() != null) {
                    sendData.CONDICAO3 = $('#CBOCONDICAO3').val();
                    sendData.DESCCONDICAO3 = $("#CBOCONDICAO3 option:selected").text();
                };
                if ($("#QTDDISTRIB").val() > 3 && $('#CBOCONDICAO4').val() != "" && $('#CBOCONDICAO4').val() != null) {
                    sendData.CONDICAO4 = $('#CBOCONDICAO4').val();
                    sendData.DESCCONDICAO4 = $("#CBOCONDICAO4 option:selected").text();
                };
                if ($("#QTDDISTRIB").val() > 4 && $('#CBOCONDICAO5').val() != "" && $('#CBOCONDICAO5').val() != null) {
                    sendData.CONDICAO5 = $('#CBOCONDICAO5').val();
                    sendData.DESCCONDICAO5 = $("#CBOCONDICAO5 option:selected").text();
                };

                sendData.PRAZO1 = $('#CBOPRAZO1').val();
                sendData.DESCPRAZO1 = $("#CBOPRAZO1 option:selected").text();

                if ($("#QTDDISTRIB").val() > 1 && $('#CBOPRAZO2').val() != "" && $('#CBOPRAZO2').val() != null) {
                    sendData.PRAZO2 = $('#CBOPRAZO2').val();
                    sendData.DESCPRAZO2 = $("#CBOPRAZO2 option:selected").text();
                };
                if ($("#QTDDISTRIB").val() > 2 && $('#CBOPRAZO3').val() != "" && $('#CBOPRAZO3').val() != null) {
                    sendData.PRAZO3 = $('#CBOPRAZO3').val();
                    sendData.DESCPRAZO3 = $("#CBOPRAZO3 option:selected").text();
                };
                if ($("#QTDDISTRIB").val() > 3 && $('#CBOPRAZO4').val() != "" && $('#CBOPRAZO4').val() != null) {
                    sendData.PRAZO4 = $('#CBOPRAZO4').val();
                    sendData.DESCPRAZO4 = $("#CBOPRAZO4 option:selected").text();
                };
                if ($("#QTDDISTRIB").val() > 4 && $('#CBOPRAZO5').val() != "" && $('#CBOPRAZO5').val() != null) {
                    sendData.PRAZO5 = $('#CBOPRAZO5').val();
                    sendData.DESCPRAZO5 = $("#CBOPRAZO5 option:selected").text();
                };
                sendData.CNPJ_FARMACIA = $("#CBOFARMACIA").val();

                    //verifica se existeo produto na lista
                    xhr = $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: controller + "VerificaExisteItemList",
                        data: JSON.stringify(sendData),
                        traditional: true,
                        success: function (data) {
                            if (data.ERRO == "") {

                                
                                if (data.EXISTE == "SIM") {

                                    alert("Produto já existe na lista. Deseja alterar o produto?", "Inclusão de Pedidos", null, function () {
                                       
                                        //inclui o PRODUTO na LISTA
                                        xhr = $.ajax({
                                            type: 'POST',
                                            contentType: 'application/json',
                                            url: controller + "IncluirProdutos",
                                            data: JSON.stringify(sendData),
                                            traditional: true,
                                            success: function (data) {
                                                if (data.errorMessage == "") {
                                                    //     
                                                    $('#lblunidades').text(data.totalunidades)
                                                    $('#lblprecofabrica').text(data.sstotprecofabrica)
                                                    $('#lblprecoliquido').text(data.sstotprecoliquido)
                                                    $('#txtQuantidade').val('');
                                                    //seta a quantidade de linhas
                                                    $("#hdQTDLINHASGRID").val(data.totallinhasgrid);
                                                    $("#tabprodutos").dataTable().fnDraw(false);
                                                    //seta o foco e traz a lista de produtos aberta
                                                    //$("#PRODUTO_chzn").closest('.chzn-container').trigger('mousedown');
                                                    //$('#PRODUTO_chzn').trigger("liszt:updated");
                                                    $('#PRODUTO').prop('selectedIndex', 0);
                                                    $('#PRODUTO').trigger("liszt:updated");
                                                    $("#PRODUTO_chzn").children('.chzn-drop').children('.chzn-search').children('input[type="text"]').focus();
                                                    $("#PRODUTO_chzn").addClass('chzn-container-active');
                                                    $('#PRODUTO_chzn').trigger("liszt:updated");
                                                } else {
                                                    alert(data.errorMessage);
                                                    
                                                    $('#PRODUTO').prop('selectedIndex', 0);
                                                    $('#PRODUTO').trigger("liszt:updated");
                                                    $("#PRODUTO_chzn").children('.chzn-drop').children('.chzn-search').children('input[type="text"]').focus();
                                                    $("#PRODUTO_chzn").addClass('chzn-container-active');
                                                    $('#PRODUTO_chzn').trigger("liszt:updated");
                                                }
                                            }
                                        });

                                    });

                                }
                                else {
                                    //se não existir na lista chama a função para incluir
                                    //inclui o PRODUTO na LISTA
                                    xhr = $.ajax({
                                        type: 'POST',
                                        contentType: 'application/json',
                                        url: controller + "IncluirProdutos",
                                        data: JSON.stringify(sendData),
                                        traditional: true,
                                        success: function (data) {
                                            if (data.errorMessage == "") {
                                                //     
                                                $('#lblunidades').text(data.totalunidades)
                                                $('#lblprecofabrica').text(data.sstotprecofabrica)
                                                $('#lblprecoliquido').text(data.sstotprecoliquido)
                                                                                                
                                                $('#txtQuantidade').val('');


                                                //seta a quantidade de linhas
                                                $("#hdQTDLINHASGRID").val(data.totallinhasgrid);

                                                $("#tabprodutos").dataTable().fnDraw(false);

                                                //seta o foco e traz a lista de produtos aberta
                                                //$("#PRODUTO_chzn").closest('.chzn-container').trigger('mousedown');
                                                //$('#PRODUTO_chzn').trigger("liszt:updated");
                                                
                                                $('#PRODUTO').prop('selectedIndex', 0);
                                                $('#PRODUTO').trigger("liszt:updated");

                                                $("#PRODUTO_chzn").children('.chzn-drop').children('.chzn-search').children('input[type="text"]').focus();
                                                $("#PRODUTO_chzn").addClass('chzn-container-active');
                                                $('#PRODUTO_chzn').trigger("liszt:updated");

                                                
                                            } else {
                                                alert(data.errorMessage);

                                                
                                                //seta o foco e traz a lista de produtos aberta
                                                //$("#PRODUTO_chzn").closest('.chzn-container').trigger('mousedown');
                                                $('#PRODUTO').prop('selectedIndex', 0);
                                                $('#PRODUTO').trigger("liszt:updated");

                                                $("#PRODUTO_chzn").children('.chzn-drop').children('.chzn-search').children('input[type="text"]').focus();
                                                $("#PRODUTO_chzn").addClass('chzn-container-active');
                                                $('#PRODUTO_chzn').trigger("liszt:updated");
                                            }
                                        }
                                    });
                                }

                            } else {
                                alert(data.ERRO);
                            }
                        }
                    });
            }
        } else {
            $(".produtoErro").text("Selecione um produto.").slideDown("fast");
        }
    }
};




//insere a LINHA NO GRID
var salvarprodutosbanco = function () {

    $(".salvarErro").hide();

    var errorsCount = 0;
    var errmensagem = "";

    //########################################
    //          VALIDAÇÕES
    //########################################

    //VALIDA DATA PEDIDO
    if ($('#txtDataPedido').val() == "") {
        errmensagem += "Informe a data do pedido.<br/>"
        errorsCount++;
    }
    else {
        if ($('#txtDataPedido').val().length < 10) {
            errmensagem += "Data do pedido inválida.<br/>";
            errorsCount++;
        }
        else {
            try {
                $.datepicker.parseDate('dd/mm/yy', $("#txtDataPedido").val());
            }
            catch (err) {
                errmensagem += "Data do pedido inválida.<br/>"
                errorsCount++;
            }
        }
    }

    if ($('#CBOREPRESENTANTES').val() == "") {
        errmensagem += "Escolha um representante para o pedido.<br/>";
        errorsCount++;
    }

    //FATURAMENTO
    if ($("#CHK_FATURADO_EM").is(":checked")) {
        if ($('#txtDataFaturado').val() == "") {
            errmensagem += "Informe a data de faturamento para o pedido.<br/>";
            errorsCount++;
        }
        else {
            if ($('#txtDataFaturado').val().length < 10) {
                errmensagem += "Data do faturamento inválida.<br/>";
                errorsCount++;
            }
            else {
                try {
                    $.datepicker.parseDate('dd/mm/yy', $("#txtDataFaturado").val());
                }
                catch (err) {
                    errmensagem += "Data do faturamento inválida.<br/>";
                    errorsCount++;
                }
            }
        }

        if ($('#txtDataPedido').val().length == 10 && $("#txtDataFaturado").val().length == 10) {
            //DATA DE FATURAMENTO NÃO PODE SER MENOR QUE A DATA DO PEDIDO
            if ($.datepicker.parseDate('dd/mm/yy', $("#txtDataFaturado").val()) < $.datepicker.parseDate('dd/mm/yy', $("#txtDataPedido").val())) {
                errmensagem += "Data faturamento não pode ser menor que a data do pedido.<br/>";
                errorsCount++;
            }
        }

    }

    if ($('#CBOFARMACIA').val() == "") {
        errmensagem += "Escolha um cliente para o pedido.<br/>";
        errorsCount++;
    }

    if ($('#hdQTDLINHASGRID').val() == "0") {
        errmensagem += "Adicione ao menos um produto ao pedido.<br/>";
        errorsCount++;
    }


    
    

    //########################################
    //          FIM VALIDAÇÕES
    //########################################
    
    //se tem alguma validação na atendida, não prossegue
    if (errorsCount > 0) {
        $(".loading-save").hide();
        $(".salvarErro").html(errmensagem).slideDown("slow");
        return false;
    }
    else {
        
             //CHAMA A FUNÇÃO DE SALVAR SA CONTROLER
            var sendDatavalida = {};
            sendDatavalida.REPRESENTANTES = $('#CBOREPRESENTANTES').val();
            sendDatavalida.FARMACIA = $('#CBOFARMACIA').val();
            var auxcnpj1 = $('#CBODISTRIBUIDOR1').val().split('-');
            sendDatavalida.DISTRIBUIDOR1 = auxcnpj1[0];

      //valida DADOS DO PEDIDO 
            $.ajax({
              type: "POST",
              url: controller + "ValidarPedido",
              contentType: 'application/json',
              data: JSON.stringify(sendDatavalida),
              async: true,
              success: function (data) {

                if (data.ok == true) {
                      
                      var msgConfirm = "";
                      msgConfirm += data.mensagem + "<br><br>\nConfirma a inclusão do pedido ?";
                      //solicita confirmação para inclusão do pedido
                      $("#dialog-confirm").html(msgConfirm);
                      //$("#dialog-confirm").attr('height', '130px');
                      //$("#dialog-confirm").css("height", "190px");
                      //$("#dialog-confirm").css('text-align', 'center');

                      var buttonsModal3 = [];
                      buttonsModal3.push(
                          {
                            text: "Sim",
                            "class": "mws-button green",
                            click: function () {

                              ////para a janela ficar atras do load
                              $('.ui-dialog').css('z-index', -1);
                              $('.ui-widget-overlay').css('z-index', 2);

                              //CHAMA A FUNÇÃO DE SALVAR SA CONTROLER
                              var sendData = {};

                              sendData.txtDataPedido = $('#txtDataPedido').val();
                              sendData.REPRESENTANTES = $('#CBOREPRESENTANTES').val();
                              sendData.CHK_FATURADO_EM = $("#CHK_FATURADO_EM").is(":checked");
                              sendData.txtDataFaturado = $('#txtDataFaturado').val();
                              sendData.FARMACIA = $('#CBOFARMACIA').val();
                              sendData.NumeroOS = $('#NumeroOS').val();

                              var auxcnpj1 = $('#CBODISTRIBUIDOR1').val().split('-');
                              sendData.DISTRIBUIDOR1 = auxcnpj1[0];
                              var auxcnpj2 = $('#CBODISTRIBUIDOR2').val().split('-');
                              sendData.DISTRIBUIDOR2 = auxcnpj2[0];
                              var auxcnpj3 = $('#CBODISTRIBUIDOR3').val().split('-');
                              sendData.DISTRIBUIDOR3 = auxcnpj3[0];
                              var auxcnpj4 = $('#CBODISTRIBUIDOR4').val().split('-');
                              sendData.DISTRIBUIDOR4 = auxcnpj4[0];
                              var auxcnpj5 = $('#CBODISTRIBUIDOR5').val().split('-');
                              sendData.DISTRIBUIDOR5 = auxcnpj5[0];

                              xhr = $.ajax({
                                type: 'POST',
                                contentType: 'application/json',
                                url: controller + "SalvarPedido",
                                data: JSON.stringify(sendData),
                                traditional: true,
                                success: function (data) {

                                  if (data.ocorreuerro == "false") {
                                    //FECHA A JANELA ABERTA PARA ABRIR OUTRA
                                    $('.ui-dialog .ui-dialog-titlebar-close').click();

                                    $("#dialog-confirm").html('<br>' + data.mensagem);

                                    var buttonsModal3 = [];
                                    //cria o botão cancelar
                                    buttonsModal3.push(
                                        {
                                          text: "OK",
                                          "class": "mws-button blue",
                                          click: function () {
                                            window.location.href = controller + "Index";
                                          }
                                        }
                                    );

                                    $("#dialog-confirm").css('text-align', 'center');
                                    $("#dialog-confirm").dialog({
                                      resizable: false,
                                      modal: true,
                                      width: 450,
                                      height: 210,
                                      position: ['center', 'center'],
                                      buttons: buttonsModal3,
                                      close: function () {
                                        window.location.href = controller + "Index";
                                      }
                                    });


                                  } else {
                                    //chama o fechar da própria janela modal2
                                    $('.ui-dialog .ui-dialog-titlebar-close').click();

                                    $(".loading-save").hide();
                                    alert(data.mensagem);
                                  }
                                },
                                error: function () {
                                  //chama o fechar da própria janela modal2
                                  $('.ui-dialog .ui-dialog-titlebar-close').click();
                                  $(".loading-save").hide();
                                  alert('Erro ao salvar dados');
                                }
                              });

                            }
                          }
                      );
                      buttonsModal3.push(
                          {
                            text: "Não",
                            "class": "mws-button red",
                            click: function () {
                              //chama o fechar da própria janela modal2
                              $('.ui-dialog .ui-dialog-titlebar-close').click();
                            }
                          }
                      );


                      $("#dialog-confirm").css('text-align', 'left');
                      $("#dialog-confirm").dialog({
                        dialogClass: "DIALOGmodal",
                        resizable: false,
                        modal: true,
                        draggable: true,
                        width: 450,
                        height: 280,
                        position: ['center', 'center'],
                        buttons: buttonsModal3,
                        open: function () {
                          //para a janela ficar a frente da outra
                          $('.ui-dialog').css('z-index', 103);
                          $('.ui-widget-overlay').css('z-index', 102);
                        },
                        close: function () {
                          $(".loading-save").hide();
                          return false;
                        }
                      });
                }
                else {
                      $(".loading-save").hide();
                      alert(data.mensagem);
                      return false;
                }

              }
            });
       
    }
};


function Alteraproduto(vcondicao1, vprazo1, vcondicao2, vprazo2, vcondicao3, vprazo3, vcondicao4, vprazo4, vcondicao5, vprazo5, vIdprod, vcaixaembarque, vqtd) {

    $('#CBOCONDICAO1').val(vcondicao1);
    $("#CBOCONDICAO1").trigger("liszt:updated");

    carregaPrazo(1, vprazo1);//indica que é para carregar o cbo prazo da primeira linha
    
    $('#CBOCONDICAO2').val(vcondicao2);
    $("#CBOCONDICAO2").trigger("liszt:updated");
    if (vcondicao2 != "") {
        carregaPrazo(2, vprazo2);//indica que é para carregar o cbo prazo da primeira linha
    }

    $('#CBOCONDICAO3').val(vcondicao1);
    $("#CBOCONDICAO3").trigger("liszt:updated");
    if (vcondicao3 != "") {
        carregaPrazo(3, vprazo3);//indica que é para carregar o cbo prazo da primeira linha
    }

    $('#CBOCONDICAO4').val(vcondicao1);
    $("#CBOCONDICAO4").trigger("liszt:updated");
    if (vcondicao4 != "") {
        carregaPrazo(4, vprazo4);//indica que é para carregar o cbo prazo da primeira linha
    }

    $('#CBOCONDICAO5').val(vcondicao1);
    $("#CBOCONDICAO5").trigger("liszt:updated");
    if (vcondicao2 != "") {
        carregaPrazo(5, vprazo5);//indica que é para carregar o cbo prazo da primeira linha
    }

    var auxprod = vIdprod + '-' + vcaixaembarque;
    $('#PRODUTO').val(auxprod);
    $("#PRODUTO").trigger("liszt:updated");

    $('#txtQuantidade').val(vqtd);
  
}


$(document).ready(function () {
    
    //IDENTIFICA QUE CLICOU O ENTER QUANDO ESTAVA POSICIONADO NA QUANTIDADE
    $("#txtQuantidade").keydown(function (e) {
        /* * verifica se o evento é Keycode (para IE e outros browsers) * se não for pega o evento Which (Firefox) */
        var tecla = (e.keyCode ? e.keyCode : e.which);
        if (tecla == 13) {
            //chama o clique do botão adicionar produto
            $('.incluirProduto').click();
        }
    });

    
    ////VALIDA SE A QUANTIDADE É múltipla da caixa de embarque de pedido SELLIN
    //$(document).on("focusout", "#txtQuantidade", function () {
     
    //});





    $('.ajusta_tabela').width($('.tamanholinha').width());

    //seta o período com o promeiro dia do mes e a data corrente
    var hojedate = new Date();
    var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                     + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                     + hojedate.getFullYear();
    $("#txtDataPedido").val(hojestring);

    //SOMENTE NÚMERO
    $('#NumeroOS').mask("?999999999999999999", { placeholder: "" });
    $('#txtQuantidade').mask("?99999", { placeholder: "" });

    //coloca a função de pesuisa nos combos
    $("#PRODUTO").chosen();
    $("#CBOREPRESENTANTES").chosen();
    $("#CBOFARMACIA").chosen();

    //DESABILITA OS CBOS PARA HABILITAR CONFORME FOR SELECIONANDO 
    for (i = 1 ; i <= 5 ; i++) {
        $("#CBODISTRIBUIDOR" + i).chosen();
        $("#CBOCONDICAO" + i).chosen();
        $("#CBOPRAZO" + i).chosen();
    }

    if ($("#CBOFUNCAOSISTEMA").val() != "COPIA") {
        //DESABILITA O COMBO FARMACIA
        $("#CBOFARMACIA").attr('disabled', true).trigger("liszt:updated");

        //DESABILITA OS CBOS PARA HABILITAR CONFORME FOR SELECIONANDO 
        for (i = 1 ; i <= 5 ; i++) {
              $("#CBODISTRIBUIDOR" + i).attr('disabled', true).trigger("liszt:updated");
              if (i != 1) { //  a primeira linha sempres visível
                //habilita a linha da condição
                $("#linhaCondicao_" + i).hide();
            }
        }
    }

    $("#CHK_FATURADO_EM").change(function () {
        //se estiver marcado habilita a caixa de texto de "data de faturado em"
        if ($("#CHK_FATURADO_EM").is(":checked")) {
            $("#txtDataFaturado").css("display", "block");

            //só terá o primeiro distribuidor DESABILITA os outros
            for (var i = 2 ; i <= $("#QTDDISTRIB").val() ; i++) {

                $("#CBODISTRIBUIDOR" + i).val('');
                $("#CBODISTRIBUIDOR" + i).attr('disabled', true).trigger("liszt:updated");
            }
        }
        else {
            
            for (var i = 1 ; i <= $("#QTDDISTRIB").val() ; i++) {
                $("#CBODISTRIBUIDOR" + i).attr('disabled', false).trigger("liszt:updated");
            }
            $("#txtDataFaturado").attr('value', "");
            $("#txtDataFaturado").css("display", "none");
        }
    });



      //quando selecionar o DISTRIBUIDOR verifica se é pedido SELL IN
    $("#CBODISTRIBUIDOR1").change(function () {
      var auxprod = $("#CBODISTRIBUIDOR1").val().split('-');
            $("#PEDIDO_SELLIN_DISTRIBUIDOR").val(auxprod[1]);
      });



    //quando selecionar o pruduto colocar o focu na qtd
    $("#PRODUTO").change(function () {
        //alert('sss');

        // PEGA A CAIXA DE EMBARQUE E COLOCA NA HIDDEN
      //CAIXAEMBARQUE
      var auxprod = $("#PRODUTO").val().split('-');
      $("#CAIXAEMBARQUE").val(auxprod[1]);

        $("#txtQuantidade").focus();
    });

    //#################################################################
    //QUANDO SELECIONAR O REPRESENTANTE carrega CBO FARMACIA e DISTRIBUIDOR
    //#################################################################
    $("#CBOREPRESENTANTES").change(function () {

        //verifica se mudou o representante e se existe produto na lista
        if ($('#CBOREPRESENTANTES').val() != $('#hiddenREPRESENTANTES').val() && $("#hdQTDLINHASGRID").val() > 0) {

            alert("A alteração do representante irá limpar a lista de produtos. Confirma a limpeza da lista de produtos?", "Inclusão de Pedidos", null, function () {
                $.ajax({
                    type: "POST",
                    url: controller + "LimpaListaProdutos",
                    contentType: 'application/json',
                    success: function () {
                        //seta a quantidade de linhas
                        $("#hdQTDLINHASGRID").val('0');
                        $("#tabprodutos").dataTable().fnDraw(false);

                        $('#lblunidades').text(' ');
                        $('#lblprecofabrica').text(' ');
                        $('#lblprecoliquido').text(' ');
                    }
                });

                //GUARDA O representante selecionado em variavel hidden
                $('#hiddenREPRESENTANTES').val($('#CBOREPRESENTANTES').val());
                representantesChange();
            },
                function () {
                    $('#CBOREPRESENTANTES').val($('#hiddenREPRESENTANTES').val());
                    $('#CBOREPRESENTANTES').trigger("liszt:updated");
                    return false;
                });
        }
        else {
            //GUARDA O distribuidor selecionado em variavel hidden
            $('#hiddenREPRESENTANTES').val($('#CBOREPRESENTANTES').val());
            representantesChange();
        }
    });



    //#################################################################
    //QUANDO SELECIONAR FARMÁCIA REINICIAR O PEDIDO
    //#################################################################
    $("#CBOFARMACIA").change(function () {
        //verifica se mudou o representante e se existe produto na lista
        if ($('#CBOFARMACIA').val() != $('#hiddenFarmacia').val() && $("#hdQTDLINHASGRID").val() > 0) {

            alert("A alteração do cliente irá limpar a lista de produtos. Confirma a limpeza da lista de produtos?", "Inclusão de Pedidos", null, function () {
                $.ajax({
                    type: "POST",
                    url: controller + "LimpaListaProdutos",
                    contentType: 'application/json',
                    success: function () {
                        //seta a quantidade de linhas
                        $("#hdQTDLINHASGRID").val('0');
                        $("#tabprodutos").dataTable().fnDraw(false);

                        $('#lblunidades').text(' ');
                        $('#lblprecofabrica').text(' ');
                        $('#lblprecoliquido').text(' ');
                    }
                });

                //GUARDA a farmácia selecionada em variavel hidden
                $('#hiddenFARMACIA').val($('#CBOFARMACIA').val());
                FarmaciaChange();
            },
                function () {
                    $('#CBOFARMACIA').val($('#hiddenFARMACIA').val());
                    $('#CBOFARMACIA').trigger("liszt:updated");
                    return false;
                });
        }
        else {
            //GUARDA a farmácia selecionada em variavel hidden
          $('#hiddenFARMACIA').val($('#CBOFARMACIA').val());
          FarmaciaChange();
        }
    });


    $("#tabprodutos").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableProdutos",
        "bProcessing": true,
        "sScrollX": "100%",
        "bAutoWidth": true,
        "aoColumns": [
                        {
                            "mDataProp": "PODEDELETAR",
                            "bSearchable": false,
                            "bSortable": false,
                            //"sClass": "coluna1",
                            "fnRender": function (oObj) {
                                
                                return '<a class="mws-ic-16 ic-delete li_icon deleteProduto" /><a class="mws-ic-16 ic-edit li_icon" onclick="Alteraproduto(\'' + oObj.aData.CONDICAO1 + '\' , \'' + oObj.aData.PRAZO1 + '\' , \'' + oObj.aData.CONDICAO2 + '\' , \'' + oObj.aData.PRAZO2 + '\' , \'' +
                                    oObj.aData.CONDICAO3 + '\' , \'' + oObj.aData.PRAZO3 + '\' , \'' + oObj.aData.CONDICAO4 + '\' , \'' + oObj.aData.PRAZO4 + '\' , \'' +
                                    oObj.aData.CONDICAO5 + '\' , \'' + oObj.aData.PRAZO5 + '\' , \'' + oObj.aData.PRODUTO_ID + '\' , \'' + oObj.aData.CAIXAEMBARQUE + '\' , \'' + oObj.aData.QTD + '\')" />';
                            }
                        },
                        {
                            "mDataProp": "CODPROD",
                        },
                        {
                            "mDataProp": "PRODUTO_NOME",
                            "fnRender": function (oObj) {
                              return '<input type="hidden" class="produtoID" name="produtoID" value="' + oObj.aData.PRODUTO_ID + '"/>' +
                                '<input type="hidden" class="CAIXAEMBARQUE" name="CAIXAEMBARQUE" value="' + oObj.aData.CAIXAEMBARQUE + '"/>' +
                                '<label class="valueLabel">' + oObj.aData.PRODUTO_NOME + '</label>';
                            }
                        },
                        {
                            "mDataProp": "QTD",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var obj = "<input type='hidden'id='PRODUTO_MIN_QTD_ROW' name='PRODUTO_QTD_ROW'  value='" + oObj.aData.QTD + "'/>" +
                                    "<label class='valueLabel'  data-type='QTD' style='width: 100%; display: block; height: 26px;'>" + oObj.aData.QTD + "</label>";
                                return obj;
                            }
                        },
                        {
                            "mDataProp": "PRECO_FABRICA",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="precofabrica" name="precofabrica" value="' + oObj.aData.PRECO_FABRICA + '"/><label class="valueLabel">' + oObj.aData.PRECO_FABRICA + '</label>';
                            }
                        },
                        {
                            "mDataProp": "PERC_DESCONTO",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="percdesconto" name="percdesconto" value="' + oObj.aData.PERC_DESCONTO + '"/><label class="valueLabel">' + oObj.aData.PERC_DESCONTO.replace("%", "") + '</label>';
                            }
                        },
                        {
                            "mDataProp": "PRECO_LIQUIDO",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="precoliquido" name="precoliquido" value="' + oObj.aData.PRECO_LIQUIDO + '"/><label class="valueLabel">' + oObj.aData.PRECO_LIQUIDO + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCCONDICAO1",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="condicao1" name="condicao1" value="' + oObj.aData.DESCCONDICAO1 + '"/><label class="valueLabel">' + oObj.aData.DESCCONDICAO1 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCCONDICAO2",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="condicao2" name="condicao2" value="' + oObj.aData.DESCCONDICAO2 + '"/><label class="valueLabel">' + oObj.aData.DESCCONDICAO2 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCCONDICAO3",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="condicao3" name="condicao3" value="' + oObj.aData.DESCCONDICAO3 + '"/><label class="valueLabel">' + oObj.aData.DESCCONDICAO3 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCCONDICAO4",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="condicao4" name="condicao4" value="' + oObj.aData.DESCCONDICAO4 + '"/><label class="valueLabel">' + oObj.aData.DESCCONDICAO4 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCCONDICAO5",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="condicao5" name="condicao5" value="' + oObj.aData.DESCCONDICAO5 + '"/><label class="valueLabel">' + oObj.aData.DESCCONDICAO5 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCPRAZO1",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="prazo1" name="prazo1" value="' + oObj.aData.DESCPRAZO1 + '"/><label class="valueLabel">' + oObj.aData.DESCPRAZO1 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCPRAZO2",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="prazo2" name="prazo2" value="' + oObj.aData.DESCPRAZO2 + '"/><label class="valueLabel">' + oObj.aData.DESCPRAZO2 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCPRAZO3",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="prazo3" name="prazo3" value="' + oObj.aData.DESCPRAZO3 + '"/><label class="valueLabel">' + oObj.aData.DESCPRAZO3 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCPRAZO4",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="prazo4" name="prazo4" value="' + oObj.aData.DESCPRAZO4 + '"/><label class="valueLabel">' + oObj.aData.DESCPRAZO4 + '</label>';
                            }
                        },
                        {
                            "mDataProp": "DESCPRAZO5",
                            "fnRender": function (oObj) {
                                return '<input type="hidden" class="prazo5" name="prazo1" value="' + oObj.aData.DESCPRAZO5 + '"/><label class="valueLabel">' + oObj.aData.DESCPRAZO5 + '</label>';
                            }
                        }

        ],
        "fnDrawCallback": function (oSettings) {
            oSettings.aoColumns[0].nTh.style.minWidth = "40px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);
        },

        //"fnHeaderCallback": function( nHead, aData, iStart, iEnd, aiDisplay ) {
        //    nHead.getElementsByTagName('th')[0].width = "110px";
            
        //    return nHead;
        //},
        //"fnInitComplete": function( nRow) {
        //        if (nRow.cells[0]) nRow.cells[0].width = "110px";  // column index starts with 0 and we check if cells[2] is null to be ultra safe
        //},
        //"fnRowCallback": function (nRow) {

        //    if (nRow.cells[0]) nRow.cells[0].width = "65px";  // column index starts with 0 and we check if cells[2] is null to be ultra safe
        //    return nRow;
        //},
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



    if ($("#CBOFUNCAOSISTEMA").val() == "COPIA") {
        $('#tabprodutos').dataTable().fnDraw(false);

        
        for (var i = parseInt($("#QTDDISTRIB").val()) + 1; i <= 5 ; i++) {
            if (i != 1) { //  a primeira linha sempres visível
                //habilita a linha
                $("#linhaDistribuidor_" + i).hide();
                $("#linhaCondicao_" + i).hide();
            }
        }


    }


    $(document).on("click", ".deleteProduto", function () {
        var currentRow = $(this).parents("tr:first");
        alert("Confirma a exclusão do produto da lista?", "Inclusão de Pedidos", null, function () {

            $.post(controller + "DeleteProduto", { produtoID: $(".produtoID", currentRow).val() }, function (data) {
                $('#lblunidades').text(data.totalunidades)
                $('#lblprecofabrica').text(data.totprecofabrica)
                $('#lblprecoliquido').text(data.totprecoliquido)

                //DIMINUI 1 NA QUANTIDADE DE LINHAS DO GRID
                //seta a quantidade de linhas
                $("#hdQTDLINHASGRID").val(data.totallinhasgrid);


                $('#tabprodutos').dataTable().fnDraw(false);
            });
              

        });
    });


    $(document).on("click", ".incluirProduto", function () {
      
        if ($('#PEDIDO_SELLIN_DISTRIBUIDOR').val() == "TRUE" || $('#PEDIDO_SELLIN_DISTRIBUIDOR').val() == "True") {
            if ($("#PRODUTO").val() == "") {
                alert('Selecione o produto antes de informar a quantidade');
                $("#txtQuantidade").val("0");
                return false;
            }
            else {
                var auxprod = $("#PRODUTO").val().split('-');
                var caixaembarque = auxprod[1];
                if (caixaembarque != "") {
                    //Verifica se a qtd digitada é maior que a caixa de embarque
                    if (parseInt(caixaembarque) > parseInt($("#txtQuantidade").val()) && parseInt($("#txtQuantidade").val()) > 0) {
                          alert('Quandidade digitada deve ser múltiplo da caixa de embarque');
                          $("#txtQuantidade").focus();
                          return false;
                    }
                    else {
                        if (parseInt($("#txtQuantidade").val()) > 0) {
                            //verifica se o valor digitado é múltiplo da caixa de embarque
                            var remainder = parseInt($("#txtQuantidade").val()) % parseInt(caixaembarque);
                            if (remainder != 0) {
                                alert('Quandidade digitada deve ser múltiplo da caixa de embarque');
                                $("#txtQuantidade").focus();
                                return false;
                            }
                        }
                    }
                }
            }
        }



        $(".salvarErro").hide();
        InsertGridRow();
    });


    $(document).on("click", ".salvarprodutos", function () {
        $(".loading-save").show(); salvarprodutosbanco();
    });




    $('.grid_tabela').width($(".tamanhofieldset").width());


});
//######################################
//          fim do READY
//######################################





