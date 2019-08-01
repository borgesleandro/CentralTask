$(document).ready(function () {

  $("#distribuidor").chosen();

  //$("#status").chosen();
  


    var currentAjaxRequest = null;

    var LimpaTela = function (complete) {
        if (complete) {
            $("#divisoes").val("");
        }
        $(".prazosDiv").html("");
        $(".btn-salvar").addClass("gray").removeClass("blue");

    };




    $(document).on("click", "#duplicar-segmentacao", function() {
        var buttonsModal2 = [];
        if ($('#distribuidor').val() == "") {
          alert("Selecione um distribuidor.");
          return false;
        }
        if ($('#divisoes').val() == "") {
          alert("Selecione uma divisão.");
          return false;
        }
    
        $(".loading-save").show();

        //##############################################
        //GET DUPLICAR
        $.get(controller + "Duplicar", null, function (response) {
            //////apaga a janela modal
            $('.modaldetalheped').dialog("close").dialog("destroy").remove();

            //Botão de realizar a cópia na janela modal
            buttonsModal2.push(
                        {
                            text: "Copiar",
                            "class": "mws-button blue",
                            click: function () {
                                //$('.ui-widget-overlay').css('z-index', 999);

                              
                                $(".loading-saveduplicar").show();

                                var DistribuidorDestino = $("#distribuidor").val();
                                var DivisaoDestino = $("#divisoes").val();

                                var DistribuidorOrigem = $('#DistribuidorDuplicar').val();
                                var DivisaoOrigem = $('#DivisoesDuplicar').val();

                                if ($('#DistribuidorDuplicar').val() == "") {
                                  $(".loading-saveduplicar").hide();
                                  alert("Selecione o distribuidor de origem.");
                                  return false;
                                }
                                if ($('#DivisoesDuplicar').val() == "") {
                                  $(".loading-saveduplicar").hide();
                                  alert("Selecione a divisão de orgiem.");
                                  return false;
                                }

                                $.post(controller + "ValidarDuplicacao", { DistribuidorDestino: DistribuidorDestino, DivisaoDestino: DivisaoDestino }, function (responseValidacao) {
                                  if (responseValidacao.erro == "TRUE") {
                                    $(".loading-saveduplicar").hide();
                                    alert(responseValidacao.message);
                                  }
                                  else {
                                    alert(responseValidacao.message, "Cópia de segmentação de prazos de Distribuidor", null, function () {

                                      $.post(controller + "Duplicar", { DistribuidorDestino: DistribuidorDestino, DistribuidorOrigem: DistribuidorOrigem, DivisaoDestino: DivisaoDestino, DivisaoOrigem: DivisaoOrigem }, function (duplicarResponse) {
                                        if (duplicarResponse.ok) {
                                            alert('Cópia realiezada com sucesso');
                                            carregaLista();
                                            $('.ui-dialog .ui-dialog-titlebar-close').click();
                                            $(".loading-saveduplicar").hide();
                                        } else {
                                            alert("Ocorreu um erro ao tentar duplicar o segmentação: " + duplicarResponse.message);
                                            $(".loading-saveduplicar").hide();
                                        }
                                      }, "json");
                                    }, null, null);
                                  }
                                });
                            }
                        }
                    );


              //Botão de fechar janela modal
              buttonsModal2.push(
              {
                text: "Fechar",
                "class": "mws-button gray",
                click: function () {
                  //chama o fechar da própria janela modal2
                  $('.ui-dialog .ui-dialog-titlebar-close').click();
                }
              });




              $(response).dialog({
                  resizable: false,
                  //draggable: true,
                  dialogClass: "DIALOGmodalDuplicar",
                  title: "Copiar segmentação de outro Distribuidor", // "Número do pedido: " + numeropedidooriginal,
                  width: "60%",
                  height: 450,
                  modal: true,
                  position: "top-50",
                  buttons: buttonsModal2,
                  open: function () {
                        $('.ui-dialog').css('z-index', 103);
                        $('.ui-widget-overlay').css('z-index', 102);
    
                        $("#DistribuidorDuplicar").chosen();

                        $('.DIALOGmodalDuplicar').css('top', 40);


                        $(document).on("change", "#DistribuidorDuplicar", function () {
                              DistribuidorOrigem = $(this).val();
                              if (currentAjaxRequest != null) currentAjaxRequest.abort();

                              $("option", $("#DivisoesDuplicar")).each(function () {
                                if ($(this).val() != "") $(this).remove();
                              });
                              if (currentAjaxRequest != null) currentAjaxRequest.abort();

                              var sendData = {};
                              sendData.cnpj_dist = $("#DistribuidorDuplicar").val();

                              currentAjaxRequest = $.post(controller + "GetDivisoes", sendData, function (data) {
                                  $(data).each(function () {
                                        var text = $(this).prop("DESCRICAO");
                                        var value = $(this).prop("DIVISAO_ID");
                                        $("#DivisoesDuplicar").append("<option value='" + value + "'> " + text + "</option>");
                                  });
                              }, "json");
                          });
                        $(".loading-save").hide();
                  }
              });
         
        });
        //##############################################
        //FIM GET DUPLICAR


      });
    








    $(document).on("click", ".btn-salvar", function() {
        if (!$(this).hasClass("gray")) {
            
            if (currentAjaxRequest != null) currentAjaxRequest.abort();
        
            
            var sbAlterar = false;
            var sendData = {};
            sendData.cnpj_dist = $("#distribuidor").val();
            sendData.divisaoID = $("#divisoes").val();

            //só vai passar as linhas em que tenha alguma operação (I = incluir , A = alterar, E = excluir)
            var segmentacaoArray = new Array();
            $($(".prazosDataTable").dataTable().fnGetNodes()).each( function() {
                var tr = $(this);

                //20160909
                //if ($("#acao", tr).val() != '') {
                    //SE FOR ação exclusão e tiver incluido agora, não joga no banco de dados
                    if ($("#acao", tr).val() == 'E' && $("#statusinicial", tr).val() == '') {
                    }
                    else {

                        sbAlterar = true;

                        var segmentacaoItem = {};
                        segmentacaoItem.Prazo_ID = $("#prazoID", tr).val();
                        segmentacaoItem.Codigo = $(".codigoPrazo", tr).html().trim();


                        //segmentacaoItem.Dtinclusao = $(".datainclusao", tr).html().trim();
                        //segmentacaoItem.Dtexclusao = $(".dataexclusao", tr).html().trim();
                        segmentacaoItem.Dtinclusao = $(".datainclusao", tr).text();
                        segmentacaoItem.Dtexclusao = $(".dataexclusao", tr).text();
                        segmentacaoItem.acao = $("#acao", tr).val();

                        segmentacaoArray.push(segmentacaoItem);
                    }
                //}
            });

            sendData.segmentacaoPrazo = segmentacaoArray;
            

            //alert('aa');
            if (sbAlterar) {
                currentAjaxRequest = $.post(controller + "SaveSegmentacaoPrazo", $.toDictionary(sendData), function (data) {
                    if (data != "") {
                        alert(data);
                    }
                    else {
                        carregaLista();
                        //alert("Segmentação de Prazo foi cadastrada com sucesso.");
                        alert("Segmentação de Prazo foi salvo com sucesso.");
                    }
                });
            }
            else {
                alert('Nenhuma informação será modificada!');
            }
        }
    });








    $(document).on("click", ".btn-incluir", function () {

        //##########################################
        //pega data Corrente
        var hojedate = new Date();
        var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                    + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                    + hojedate.getFullYear()
                    + ' ' + ('0' + hojedate.getHours()).slice(-2) + ':'
                    + ('0' + hojedate.getMinutes()).slice(-2);


        //##########################################



        if ($("#prazos").val() == null) {
            alert("Selecione algum prazo");
        }
        else {

            //##########################################
            //verifica se selecionou mais de um prazo e informou o código do prazo
            if ($("#prazos option:selected").length > 1 && $("#codigo").val().trim() !='' )
            {
                alert('Não pode ser selecionado mais de um Prazo na lista para o mesmo Código do Prazo.');
            }
            else{

                
                //pega as linhas do grid
                var rows = $(".prazosDataTable").dataTable().fnGetNodes();


                var reativar = "";
                var ssvir = "";

                 


                    //INCLUSAO/ALTERAÇÃO DE LINHAS
                    $($("#prazos").val()).each(function () {

                        var prazoHidden = $("#prazoID[value='" + this + "']", rows);
                        if (prazoHidden.length > 0) {

                            //acao = "A" // ALTERAR
                            if (prazoHidden.parents("tr:first").find(':input[id="acao"]').val() == '')
                                prazoHidden.parents("tr:first").find(':input[id="acao"]').val('A');
                            
                            prazoHidden.parents("tr:first").find('span.codigoPrazo').text($("#codigo").val());

                        }
                        else {

                            //ADICIONA UM ITEM NOVO
                            var option = $("#prazos option[value='" + this + "']");
                            var prazo = "<input name='prazoID' id='prazoID' type='hidden' maxlength='40' value='" + option.val() + "' />" + option.html();
                            var codigo = " <span class='codigoPrazo'>" + $("#codigo").val() + "</span>";

                            var dataexclusao = "<span id='dataexclusao' class='dataexclusao'></span>";
                            dataexclusao += "<input name='dataexclusaoini' id='dataexclusaoini' type='hidden' value='' />";

                            var datainclusao = " <span id='datainclusao' class='datainclusao'>" + hojestring + "</span>";
                            datainclusao += "<input name='datainclusaoini' id='datainclusaoini' type='hidden' value='" + hojestring + "' />";

                            var codigo = " <span class='codigoPrazo'>" + $("#codigo").val() + "</span>";

                            var Button = "<a id='remover' class='removerPrazo mws-ic-16 ic-cross li_icon' title='Remover Prazo' />";
                            
                            var status = "<input name='acao' id='acao' type='hidden' value='I' />";
                            status += " <span class='status'>Ativo</span>";

                            status += " <input name='statusinicial' id='statusinicial' type='hidden' value='' />";

                            var row = [prazo, codigo, datainclusao, dataexclusao, status, Button];

                            $(".prazosDataTable").dataTable().fnAddData(row);
                        }
                    });
                



                ////VERIFICA SE ALGUM PRAZO QUE ESTAVA INATIVO SERÁ REATIVADO, se SIM exibir mensagem perguntando se quer reativar
                ////###########################
                //$($("#prazos").val()).each(function () {
                //    var option = $("#prazos option[value='" + this + "']");
                //    var prazo = option.html();

                //    var prazoHidden = $("#prazoID[value='" + this + "']", rows);

                //    //caso o prazo exista irá ser alterado
                //    if (prazoHidden.length > 0) {
                //        //var tr = prazoHidden.parents("tr:first");
                //        //$(".prazosDataTable").dataTable().fnDeleteRow(tr[0]);
                //        var statusini = prazoHidden.parents("tr:first").find(':input[id="statusinicial"]').attr("value").toLowerCase();
                //        if (statusini == "inativo") {
                //            reativar += ssvir + prazo;
                //            ssvir = " , ";
                //        }
                //    }
                //});
                ////###########################





                ////caso tenha esteja reativando algum prazo
                //if (reativar.length > 0) {
                //    //exibir pergunta CONFIRMA REATIVAÇÃO DOS PRAZOS ...


                //    //solicita confirmação para inclusão do pedido
                //    $("#dialog-confirm").html('<br>Confirma a reativação dos prazos ' + reativar);

                //    var buttonsModal3 = [];
                //    buttonsModal3.push(
                //        {
                //            text: "Sim",
                //            "class": "mws-button green",
                //            click: function () {

                //                //INCLUSAO/ALTERAÇÃO DE LINHAS
                //                $($("#prazos").val()).each(function () {

                //                    var prazoHidden = $("#prazoID[value='" + this + "']", rows);
                //                    if (prazoHidden.length > 0) {

                //                        //ALTERA UMA LINHA EXISTENTE
                //                        var statusini = prazoHidden.parents("tr:first").find(':input[id="statusinicial"]').attr("value").toLowerCase();
                //                        if (statusini == "inativo") {
                                                                                       
                //                            prazoHidden.parents("tr:first").find('a.reativarPrazo').remove();

                //                            var Button = "<a id='remover' class='removerPrazo mws-ic-16 ic-cross li_icon' title='Remover Prazo' />";
                //                            prazoHidden.parents("tr:first").find('td:nth-child(6)').append(Button);

                //                            prazoHidden.parents("tr:first").find('span.status').text('Ativo');

                //                            //acao = "R" // REATIVAR
                //                            prazoHidden.parents("tr:first").find(':input[id="acao"]').val('R');
                //                            prazoHidden.parents("tr:first").find('span.datainclusao').text(hojestring);
                //                            prazoHidden.parents("tr:first").find('span.dataexclusao').text('');

                //                        }
                //                        else {

                //                            //acao = "A" // ALTERAR
                //                            prazoHidden.parents("tr:first").find(':input[id="acao"]').val('A');
                //                            prazoHidden.parents("tr:first").find('span.dataexclusao').text('');
                //                        }
                //                        prazoHidden.parents("tr:first").find('span.codigoPrazo').text($("#codigo").val());

                //                    }
                //                    else {

                //                        //ADICIONA UM ITEM NOVO
                //                        var option = $("#prazos option[value='" + this + "']");
                //                        var prazo = "<input name='prazoID' id='prazoID' type='hidden' maxlength='40' value='" + option.val() + "' />" + option.html();
                //                        var codigo = " <span class='codigoPrazo'>" + $("#codigo").val() + "</span>";

                //                        var dataexclusao = "<span id='dataexclusao' class='dataexclusao'></span>";
                //                        dataexclusao += "<input name='dataexclusaoini' id='dataexclusaoini' type='hidden' value='' />";

                //                        var datainclusao = " <span id='datainclusao' class='datainclusao'>" + hojestring + "</span>";
                //                        datainclusao += "<input name='datainclusaoini' id='datainclusaoini' type='hidden' value='" + hojestring + "' />";

                //                        var codigo = " <span class='codigoPrazo'>" + $("#codigo").val() + "</span>";

                //                        var Button = "<a id='remover' class='removerPrazo mws-ic-16 ic-cross li_icon' title='Remover Prazo' />";

                //                        var status = "<input name='acao' id='acao' type='hidden' value='I' />";
                //                        status += " <span class='status'>Ativo</span>";

                //                        status += " <input name='statusinicial' id='statusinicial' type='hidden' value='' />";

                //                        var row = [prazo, codigo, datainclusao, dataexclusao, status, Button];

                //                        $(".prazosDataTable").dataTable().fnAddData(row);
                //                    }
                //                });


                //                //chama o fechar da própria janela modal2
                //                $('.ui-dialog .ui-dialog-titlebar-close').click();
                                        

                //            }
                //        }
                //    );
                //    buttonsModal3.push(
                //        {
                //            text: "Não",
                //            "class": "mws-button red",
                //            click: function () {
                //                //chama o fechar da própria janela modal2
                //                $('.ui-dialog .ui-dialog-titlebar-close').click();
                //            }
                //        }
                //    );


                //    $("#dialog-confirm").css('text-align', 'center');
                //    $("#dialog-confirm").dialog({
                //        dialogClass: "DIALOGmodal",
                //        resizable: false,
                //        modal: true,
                //        draggable: true,
                //        width: 350,
                //        height: 210,
                //        position: ['center', 'center'],
                //        buttons: buttonsModal3,
                //        open: function () {
                //            //para a janela ficar a frente da outra
                //            $('.ui-dialog').css('z-index', 103);
                //            $('.ui-widget-overlay').css('z-index', 102);
                //        },
                //        close: function () {
                //            //$(".loading-save").hide();
                //            //////NÃO 
                //            ////$('#dialog-confirm').dialog("close").dialog("destroy").remove();
                //            return false;
                //        }
                //    });
                //    //fim PERGUNTA SE DESEJA REATIVAR PRAZO
                //    //##########################################

                //}
                //else {
                //    //CASO NÃO ESTEJA REATIVANDO NENHUM PRAZO


                //    //INCLUSAO/ALTERAÇÃO DE LINHAS
                //    $($("#prazos").val()).each(function () {

                //        var prazoHidden = $("#prazoID[value='" + this + "']", rows);
                //        if (prazoHidden.length > 0) {

                //            //alert('bb');

                //            //acao = "A" // ALTERAR
                //            prazoHidden.parents("tr:first").find(':input[id="acao"]').val('A');
                //            //prazoHidden.parents("tr:first").find('span.dataexclusao').text('');
                            
                //            prazoHidden.parents("tr:first").find('span.codigoPrazo').text($("#codigo").val());
                            
                //        }
                //        else {

                //            //ADICIONA UM ITEM NOVO
                //            var option = $("#prazos option[value='" + this + "']");
                //            var prazo = "<input name='prazoID' id='prazoID' type='hidden' maxlength='40' value='" + option.val() + "' />" + option.html();
                //            var codigo = " <span class='codigoPrazo'>" + $("#codigo").val() + "</span>";

                //            var dataexclusao = "<span id='dataexclusao' class='dataexclusao'></span>";
                //            dataexclusao += "<input name='dataexclusaoini' id='dataexclusaoini' type='hidden' value='' />";


                //            //var hojedate = new Date();
                //            //var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                //            //            + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                //            //            + hojedate.getFullYear()
                //            //            + ' ' + ('0' + hojedate.getHours()).slice(-2) + ':'
                //            //            + ('0' + hojedate.getMinutes()).slice(-2);
                //            var datainclusao = " <span id='datainclusao' class='datainclusao'>" + hojestring + "</span>";
                //            datainclusao += "<input name='datainclusaoini' id='datainclusaoini' type='hidden' value='" + hojestring + "' />";

                //            var codigo = " <span class='codigoPrazo'>" + $("#codigo").val() + "</span>";

                //            var Button = "<a id='remover' class='removerPrazo mws-ic-16 ic-cross li_icon' title='Remover Prazo' />";
                //            //Button += "<a id='reativar' class='reativarPrazo mws-ic-16 ic-edit li_icon' title='Reativar Prazo' />";

                //            var status = "<input name='acao' id='acao' type='hidden' value='I' />";
                //            status += " <span class='status'>Ativo</span>";

                //            status += " <input name='statusinicial' id='statusinicial' type='hidden' value='' />";

                //            var row = [prazo, codigo, datainclusao, dataexclusao, status, Button];

                //            $(".prazosDataTable").dataTable().fnAddData(row);
                //        }
                //    });
                //}




            
            }
        }
    });















    //REMOVER PRAZO
    $(document).on("click", ".removerPrazo", function() {
        
        var hojedate = new Date();
        var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                    + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                    + hojedate.getFullYear()
                    + ' ' + ('0' + hojedate.getHours()).slice(-2) + ':'
                    + ('0' + hojedate.getMinutes()).slice(-2);
        
        //$(this).closest('tr').find('td:nth-child(5)').text('Inativo'); // Status
        $(this).closest('tr').find('span.status').text('Inativo');

        if ($(this).closest('tr').find(':input[id="statusinicial"]').attr("value").toLowerCase() == "") { //indica que vai incluir
            $(this).closest('tr').find(':input[id="acao"]').val(''); // seta a Ação para NADA

            //seta a data de exclusao
            $(this).closest('tr').find('span.dataexclusao').text(hojestring);
        }
        else {
            //caso o status inicial for desativado e estiver desativando novamente, não faz nada
            if ($(this).closest('tr').find(':input[id="statusinicial"]').attr("value").toLowerCase() == "inativo") {
                $(this).closest('tr').find(':input[id="acao"]').val(''); // seta a Ação para E = exclusão

                //mantem a data de exclusão inicial
                $(this).closest('tr').find('span.dataexclusao').text($(this).closest('tr').find(':input[id="dataexclusaoini"]').attr("value"));
            }
            else {
                $(this).closest('tr').find(':input[id="acao"]').val('E'); // seta a Ação para E = exclusão

                //seta a data de exclusao
                $(this).closest('tr').find('span.dataexclusao').text(hojestring);

            }
        }

        var Button = "<a id='reativar' class='reativarPrazo mws-ic-16 ic-edit li_icon' title='Reativar Prazo' />";
        $(this).closest('tr').find('td:nth-child(6)').append(Button); //botão de reativar

        //coluna de botão
        $(this).closest('tr').find('a:[id="remover"]').remove(); // remove o botão de exclusao
    });






    //REATIVAR PRAZO
    $(document).on("click", ".reativarPrazo", function () {
        var hojedate = new Date();
        var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                    + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                    + hojedate.getFullYear()
                    + ' ' + ('0' + hojedate.getHours()).slice(-2) + ':'
                    + ('0' + hojedate.getMinutes()).slice(-2);

        //$(this).closest('tr').find('td:nth-child(5)').text('Inativo'); // Status
        $(this).closest('tr').find('span.status').text('Ativo');

        //////caso o status inicial for ATIV|O e estiver reativando novamente, não faz nada
        if ($(this).closest('tr').find(':input[id="statusinicial"]').attr("value").toLowerCase() == "ativo") {
            $(this).closest('tr').find(':input[id="acao"]').val(''); // seta a Ação para nada

            //mantem a data de inclusão original
            $(this).closest('tr').find('span.datainclusao').text($(this).closest('tr').find(':input[id="datainclusaoini"]').attr("value"));
        }
        else {
            //seta data de inclusão ou reativação para data corrente
            $(this).closest('tr').find('span.datainclusao').text(hojestring);
            if ($(this).closest('tr').find(':input[id="statusinicial"]').attr("value").toLowerCase() == '') { //indica que vai incluir
                    $(this).closest('tr').find(':input[id="acao"]').val('I'); // seta a Ação para I = INCLUIR
                }
                else {
                    $(this).closest('tr').find(':input[id="acao"]').val('R'); // seta a Ação para R = reativar
                }
        }

        $(this).closest('tr').find('span.dataexclusao').text('');//data exclusao

        var Button = "<a id='remover' class='removerPrazo mws-ic-16 ic-cross li_icon' title='Remover Prazo' />";
        $(this).closest('tr').find('td:nth-child(6)').append(Button); //botão de reativar

        //coluna de botão
        $(this).closest('tr').find('a:[id="reativar"]').remove(); // remove o botão de exclusao
    });









    $(document).on("click", ".codigoPrazo", function () {

        $(".codigoInput").each(function () {
            var valueRestore = $(this).val();
            var spanRestore = $(this).parents(".codigoPrazo:first");
            spanRestore.html(valueRestore);
        });

        var value = $(this).html();

        var input = "<input type ='text' value='" + value.trim() + "' class='codigoInput' />";
        $(this).html(input);
        $(".codigoInput").focus();

    });

    $(document).on("focusout", ".codigoInput", function() {
        var spanRestore = $(this).parents(".codigoPrazo:first");
        spanRestore.html($(this).val());
        
        //MARCA A LINHA COMO ALTERAÇÃO DO código
        if (spanRestore.parents("tr:first").find(':input[id="acao"]').val() == '') {
            spanRestore.parents("tr:first").find(':input[id="acao"]').val('A');
        }
        
    });

    $(document).on("change", "#distribuidor", function () {

        if (currentAjaxRequest != null) currentAjaxRequest.abort();

        $("option", $("#divisoes")).each(function () {
            if ($(this).val() != "") $(this).remove();
        });
        LimpaTela(true);
        if (currentAjaxRequest != null) currentAjaxRequest.abort();

        var sendData = {};

        sendData.cnpj_dist = $("#distribuidor").val();


        currentAjaxRequest = $.post(controller + "GetDivisoes", sendData, function (data) {
            $(data).each(function () {
                var text = $(this).prop("DESCRICAO");
                var value = $(this).prop("DIVISAO_ID");
                $("#divisoes").append("<option value='" + value + "'> " + text + "</option>");
            });

        }, "json");


    });

    $(document).on("change", "#divisoes", function () {
        carregaLista();
    });



    $(document).on("change", "#cboStatus", function () {
      carregaLista();
    });




    function carregaLista() {
        if (currentAjaxRequest != null) currentAjaxRequest.abort();

        LimpaTela(false);

        var sendData = {};

        sendData.cnpj_dist = $("#distribuidor").val();
        sendData.divisaoID = $("#divisoes").val();
        sendData.status = $("#cboStatus").val();

        currentAjaxRequest = $.post(controller + "GetSegmentacaoPrazo", sendData, function (data) {
            $(".prazosDiv").html(data);
            $(".btn-salvar").addClass("blue").removeClass("gray");
        }, "html");
    }
});


