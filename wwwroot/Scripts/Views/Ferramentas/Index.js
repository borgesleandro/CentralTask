var xhr;
var dataView;
var nomeArquivo = '';

$(document).ready(function () {

  

  
    $("#filtros").html("<div style='margin-left:10px; margin-top:10px; padding-bottom: 10px;'><b>Carregando filtros...</b></div>");

    $(".datepicker").keyup(function (e) {
        if (e.keyCode == 72) {
            var hojedate = new Date();

            var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                     + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                     + hojedate.getFullYear();

            $(this).val(hojestring);
        }
        else {
            if (e.keyCode == 77) {
                var hojedate = new Date();

                var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                         + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                         + hojedate.getFullYear();

                $(this).val(hojestring);
            }
        }
    });

    $("#btnGerarCSV").click(function () {

      
        //DefinirDialog();
        //$('.ui-button').not(":contains('Fechar')").hide();
        //$('.ui-button:contains(Gerar)').show();
        //$('#opcoesmodalinner').dialog('option', 'title', 'Exportando Relatório');
        //$('#opcoesmodalinner').dialog('option', 'width', '480px');
        //$("#opcoesmodalinner").css('text-align', 'left');

        //$("#opcoesmodalinner").dialog('open');

        //$("#ui-id-1").css('color', 'white');

        //$("#opcoesmodalinner").html(
        //                    "<div id='div1'>" +
        //                    "Informe o nome do arquivo a ser gerado:" +
        //                    "<input value='" + $("#txtNomeArquivoPesquisaMaior").val().trim().replace(/ /g, "_") + "' id='txtNomeArquivo' type='text'  style='margin-top: 10px; margin-left: 10px;'/>.csv<br/>" +
        //                    //"<input type='checkbox' id='chkCompactar'/>Gerar arquivo compactado (.zip)" +
        //                    //"<input type='button' id='btnNomeArquivo' value='Ok' style='margin-top: 10px; width: 170px;'/>" +
        //                    "</div>" +
        //                    "<div id='div2'></div>"
      //                    );


      $(".loading-save").show();

      //CARLOS
      if ($("#txtNomeArquivoPesquisaMaior").val().trim() == "") {
        alert('Informe o nome do arquivo a ser gerado!');
        $(".loading-save").hide();
      }
      else {
        
        $("#dialog-confirmexcel").css('text-align', 'center');
        $("#dialog-confirmexcel").dialog({
          resizable: false,
          modal: true,
          width: 350,
          height: 310,
          position: ['center', 'center'],
          buttons: {
            "Continuar": function () {
                $(this).dialog("close");


                  $("#btnPesquisar").attr('disabled', true);
                  $("#btnGerarCSV").attr('disabled', true); 
              
                    var listaSeqCampo = [];
                    var listaWhere = [];
                    var listaChkSoma = [];

                    $.each($(".chkfiltro:checked"), function (i, item) {
                      listaSeqCampo.push(parseInt($(item).attr('id').replace("chkfiltro", "")));
                    })

                    $.each($(".txtfiltro:text[value!='']"), function (i, item) {
                      listaWhere.push($(item).attr('id').replace('txtFiltro', '') + "|" + $(item).val());
                    });

                    $.each($(".chksoma:checked"), function (i, item) {
                      listaChkSoma.push(parseInt($(item).attr('id').replace("chksoma", "")));
                    })

                    var model = {
                      DataPedidoInicial: $("#txtDataPedidoInicial").val(),
                      DataPedidoFinal: $("#txtDataPedidoFinal").val(),
                      DataDevolucaoInicial: $("#txtDataDevolucaoInicial").val(),
                      DataDevolucaoFinal: $("#txtDataDevolucaoFinal").val(),
                      //SoFaturados: true,
                      SoFaturados: $("#chkSoFaturados").is(':checked') ? true : false,
                      ApenasDevolucoes: false,
                      //Consolidar: false,                          
                      Consolidar: $("#chkConsolidar").is(':checked') ? true : false,
                      ListaSeqCampo: listaSeqCampo,
                      ListaWhere: listaWhere,
                      ListaChkSoma: listaChkSoma
                    };

                    var jsonresult = "";


                    $.ajax({
                      type: 'POST',
                      contentType: 'application/json',
                      url: "Ferramentas/ModelToSession",
                      async: false,
                      data: JSON.stringify(model),
                      success: function (response) {

                        if (response.success) {

                          $.ajax({
                            type: 'POST',
                            contentType: 'application/json',
                            url: "Ferramentas/VerificaExportar",
                            async: false,
                            data: JSON.stringify(model),
                            success: function (response) {
                              if (response.success) {
                                //chama a exportação para o Excel
                                $("#divAuxPesq").append("<a id='anchorLayoutpesq' href='Ferramentas/ExportarExcelCriadoEmMemoria?nomeArquivo=" + $("#txtNomeArquivoPesquisaMaior").val().trim() + "&VeioPesquisar=SIM' class=''></a>");
                                $("#anchorLayoutpesq").get(0).click();

                                $("#btnPesquisar").attr('disabled', false);
                                $("#btnGerarCSV").attr('disabled', false);


                                // o cookie é gravado na função que exporta o excel dentro da tela RelatorioRankingMedicosExportar.aspx
                                var interval =
                                       setInterval(function () {
                                         if ($.cookie('DownloadPesquisaInfoPV')) {
                                           $(".loading-save").hide();
                                           $.removeCookie('DownloadPesquisaInfoPV', { path: '/' });
                                           clearInterval(interval);
                                         }
                                       }, 1000);


                              }
                              else {
                                alert("Não existem resultados com os parâmetros pesquisados");// response.data);

                                $("#btnPesquisar").attr('disabled', false);
                                $("#btnGerarCSV").attr('disabled', false);

                                $(".loading-save").hide();

                              }

                            }
                          });
                          //##################################


                        }
                        else {

                          var errorList = "";
                          $.each(JSON.parse(response.data), function (i, item) {
                            errorList += " - " + item + "<br/>";
                          });

                          alert(errorList);

                          $("#btnPesquisar").attr('disabled', false);
                          $("#btnGerarCSV").attr('disabled', false);


                          $(".loading-save").hide();

                        }

                  
                      }
                    });

            },
            "Cancelar": function () {
              $("#btnPesquisar").attr('disabled', false);
              $("#btnGerarCSV").attr('disabled', false);
              $(".loading-save").hide();
              $(this).dialog("close");
            }
          }
        });

      }



    });

    $("#btnPesquisar").on('click', function () {


        //CARLOS
        if ($("#txtNomeArquivoPesquisaMaior").val().trim() == "") {
            alert('Informe o nome do arquivo a ser gerado caso a consulta possua mais de ' + $("#MAXLINHAS_TELA").val() + ' linhas');
        }
        else {

            $("#btnPesquisar").attr('disabled', true);
            $("#dialog-confirm").css('text-align', 'center');
            $("#dialog-confirm").dialog({
                resizable: false,
                modal: true,
                width: 350,
                height: 310,
                position: ['center', 'center'],
                buttons: {
                    "Continuar": function () {
                        $(this).dialog("close");
                        var listaSeqCampo = [];
                        var listaWhere = [];
                        var listaChkSoma = [];

                        $.each($(".chkfiltro:checked"), function (i, item) {
                            listaSeqCampo.push(parseInt($(item).attr('id').replace("chkfiltro", "")));
                        })

                        $.each($(".txtfiltro:text[value!='']"), function (i, item) {
                            listaWhere.push($(item).attr('id').replace('txtFiltro', '') + "|" + $(item).val());
                        });

                        $.each($(".chksoma:checked"), function (i, item) {
                            listaChkSoma.push(parseInt($(item).attr('id').replace("chksoma", "")));
                        })

                        var model = {
                            DataPedidoInicial: $("#txtDataPedidoInicial").val(),
                            DataPedidoFinal: $("#txtDataPedidoFinal").val(),
                            DataDevolucaoInicial: $("#txtDataDevolucaoInicial").val(),
                            DataDevolucaoFinal: $("#txtDataDevolucaoFinal").val(),
                            //SoFaturados: true,
                            SoFaturados: $("#chkSoFaturados").is(':checked') ? true : false,
                            ApenasDevolucoes: false,
                            //Consolidar: false,                          
                            Consolidar: $("#chkConsolidar").is(':checked') ? true : false,
                            ListaSeqCampo: listaSeqCampo,
                            ListaWhere: listaWhere,
                            ListaChkSoma: listaChkSoma
                        };

                        var jsonresult = "";


                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json',
                            url: "Ferramentas/ModelToSession",
                            async: false,
                            data: JSON.stringify(model),
                            success: function (response) {

                                if (response.success) {

                                    //window.open('Ferramentas/Relatorio', '_blank');

                                  //alert('11111');

                                    //CARLOS 17/04/2015
                                    //##################################
                                    $.ajax({
                                        type: 'POST',
                                        contentType: 'application/json',
                                        url: "Ferramentas/VerificaPesquisar",
                                        async: false,
                                        data: JSON.stringify(model),
                                        success: function (response) {

                                            //alert('aaa');
                                            if (response.tela) {
                                                //alert('bbbbb');
                                                window.open('Ferramentas/Relatorio', '_blank');
                                            }
                                            else {
                                                //alert('cccc');
                                                //chama a exportação para o Excel
                                                $("#divAuxPesq").append("<a id='anchorLayoutpesq' href='Ferramentas/ExportarExcelCriadoEmMemoria?nomeArquivo=" + $("#txtNomeArquivoPesquisaMaior").val().trim() + "&VeioPesquisar=SIM' class=''></a>");
                                                $("#anchorLayoutpesq").get(0).click();
                                            }

                                        }
                                    });
                                    //##################################


                                }
                                else {

                                    var errorList = "";
                                    $.each(JSON.parse(response.data), function (i, item) {
                                        errorList += " - " + item + "<br/>";
                                    });

                                    alert(errorList);
                                }

                                $("#btnPesquisar").attr('disabled', false);
                            }
                        });
                    },
                    "Cancelar": function () {
                        $("#btnPesquisar").attr('disabled', false);
                        $(this).dialog("close");
                    }
                }
            });

        }


        //if (confirm("Dependendo da combinação dos campos escolhidos para a pesquisa, esta operação pode demorar. Caso a consulta seja complexa e/ou o período escolhido seja muito grande, recomendamos exportar diretamente o relatório através do botão 'Exportar Relatório'. Deseja continuar?")) {


    });

    $("#btnSalvarFiltro").on('click', function () {

        if (confirm('Deseja salvar esta configuração de filtro?')) {

            var nomefiltro = '';
            nomefiltro = prompt('Com qual nome gostaria de salvar o filtro?', '');

            while (nomefiltro == '') {
                nomefiltro = prompt('Você precisa digitar um nome para o filtro.\nCom qual nome gostaria de salvar o filtro?', '');
            }

            if (nomefiltro) {
                var filtropublico = confirm('Deseja que o filtro seja público?');

                var listaSeqCampo = [];
                var listaWhere = [];
                var listaChkSoma = [];

                $.each($(".chkfiltro:checked"), function (i, item) {
                    listaSeqCampo.push(parseInt($(item).attr('id').replace("chkfiltro", "")));
                })

                $.each($(".txtfiltro:text[value!='']"), function (i, item) {
                    listaWhere.push($(item).attr('id').replace('txtFiltro', '') + "|" + $(item).val());
                });

                $.each($(".chksoma:checked"), function (i, item) {
                    listaChkSoma.push(parseInt($(item).attr('id').replace("chksoma", "")));
                })

                var filtro = {
                    ListaSeqCampo: listaSeqCampo,
                    ListaWhere: listaWhere,
                    ListaChkSoma: listaChkSoma
                };

                var model = {
                    NOME_FILTRO: nomefiltro,
                    JSON_FILTRO: JSON.stringify(filtro),
                    FLG_PUBLICO: filtropublico
                };

                $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: "Ferramentas/SalvarFiltro",
                    async: false,
                    data: JSON.stringify(model),
                    success: function (response) {

                        if (response.success) {
                            alert('Filtro salvo com sucesso.');
                        }
                        else {
                            $.each(JSON.parse(response.data), function (i, item) {
                                alert(item);
                            });
                        }

                        $("#btnSalvarFiltro").attr('disabled', false);
                    },
                    error: function (response) {
                        alert('Problemas ao salvar o filtro. Contacte o administrador do sistema.');
                        $("#btnSalvarFiltro").attr('disabled', false);
                    }
                })
            }
        }
    });



    function ExibirbtnExibirFiltrosSalvos()
    {
      DefinirDialog();
      $('.ui-button').not(":contains('Fechar')").hide();
      $('#opcoesmodalinner').dialog('option', 'title', 'Carregar Filtro');

      $("#opcoesmodalinner").html("<img src='Content/ajax-loader.gif'></img> Obtendo filtros salvos...");

      xhr = $.post("Ferramentas/GetFiltrosSalvos", function (result) {

        var parsedresult = result;

        if (parsedresult.success) {
          if (parsedresult.data.length > 0) {
            $("#opcoesmodalinner").empty();

            var modalGrid = "<div style='margin-bottom: 5px;'>Filtrar: <input type='text' id='txtFiltrar'/></div><div id='modalgrid' style='height: 300px; width: 350px; border: 1px solid black;'></div>";

            $("#opcoesmodalinner").html(modalGrid);

            var columns = [];
            columns.push({ id: 'ID', name: 'Filtro', field: 'NOME_FILTRO' }, { id: 'ID', name: 'Exc', field: 'EXC', sortable: false, width: 25, minWidth: 25, maxWidth: 30, cssClass: "ui-icon mws-ic-16 classe-control ic-trash" }); //cssClass: "cell-effort-driven", , formatter: Slick.Formatters.Checkmark 

            var options = {
              enableCellNavigation: true,
              forceFitColumns: true
            };

            grid = new Slick.Grid("#modalgrid", parsedresult.data, columns, options);


            //#######################################
            grid.onClick.subscribe(function (e) {
              var cell = grid.getCellFromEvent(e),
                  row = cell.row;
              // var item = dataView.rows[row];

              col = cell.cell;

              var idFiltro = grid.getDataItem(row).ID

              //alert(grid.getDataItem(row).NOME_FILTRO);
              $("#txtNomeArquivoPesquisaMaior").val(grid.getDataItem(row).NOME_FILTRO);

              if (col == 0) {
                CarregarFiltro(idFiltro);
                $("#opcoesmodalinner").dialog('close');
              }
              else {
                alert("Confirma a exclusão do filtro : " + grid.getDataItem(row).NOME_FILTRO + "?", "Confirmação de exclusão", null, function () {

                  $.post("Ferramentas/ExcluirFiltro", { idFiltro: idFiltro }, function (response) {

                    if (response.success) {
                      //REMOVE A LINHA EXCLUÍDA
                      var dd = grid.getData();
                      var current_row = row; //grid.getActiveCell().row;
                      dd.splice(current_row, 1);
                      var r = current_row;
                      while (r < dd.length) {
                        grid.invalidateRow(r);
                        r++;
                      }
                      grid.updateRowCount();
                      grid.render();
                      grid.scrollRowIntoView(current_row - 1)

                      alert('Filtro excluído com sucesso.');
                    }
                    else {
                      alert('Problemas ao excluir o filtro. Contacte o administrador do sistema.');
                    }

                  }).error(function (response) {
                    alert('Problemas ao excluir o filtro. Contacte o administrador do sistema.');
                  });
  
                });
              }


            });

            //grid.onClick.subscribe(function (e, args) {
            //    var idFiltro = grid.getDataItem(args.cell).ID

            //    CarregarFiltro(idFiltro);
            //    $("#opcoesmodalinner").dialog('close');
            //});
            //#######################################


            //Filtro
            var tempData = [];
            $('#txtFiltrar').keyup(function (e) {
              var searchList = $.trim(this.value.toLowerCase()).split(' ');
              if (searchList[0] == "") {
                grid.setData(parsedresult.data);
                grid.invalidate();
                grid.render();
              }
              else {
                if (gridFilter(searchList));
                {
                  tempData = OrdenarJSON(tempData, 'NOME_FILTRO', true);
                  grid.setData(tempData);
                  grid.invalidate();
                  grid.render();
                }
                this.focus();
              }

            });

            function gridFilter(rec) {
              tempData = [];
              $.each(rec, function (i, filtro) {
                $.each(parsedresult.data, function (i2, item) {
                  if (typeof item !== 'undefined' && item != null && item.NOME_FILTRO.toString().toLowerCase().indexOf(filtro) != -1) {


                    tempData.push(item);
                  }
                });
              });

              if (tempData.length > 0)
                return true;

              return false;
            }

          }
        }
        else {
          $("#opcoesmodalinner").html(parsedresult.data);
        }

      }).error(function (result) {
        parsedresult = JSON.parse(result);
        $("#opcoesmodalinner").html(parsedresult.data);
      });

      $("#opcoesmodalinner").dialog('open');

      $("#ui-id-1").css('color', 'white');
    }

    $("#btnExibirFiltrosSalvos").on('click', function () {
      ExibirbtnExibirFiltrosSalvos();
    });




    

    function CarregarFiltro(idFiltro) {

        $.post("Ferramentas/CarregarFiltro", { idFiltro: idFiltro }, function (response) {

            if (response.success) {

                var filtro = JSON.parse(response.data);

                $.each($(".chkfiltro"), function (i, item) {
                    //CARLOS 17/04/2015
                    //####################
                    //vai LIMPAR O CAMPO PARA DEPOIS CARREGAR
                    $(item).attr('checked', false);
                    //####################
                    $.each(filtro.ListaSeqCampo, function (i2, item2) {
                        if (parseInt($(item).attr('id').replace("chkfiltro", "")) == item2) {
                            $(item).attr('checked', true);
                        }
                    });

                })

                $.each($(".chksoma"), function (i, item) {
                    //CARLOS 17/04/2015
                    //####################
                    //vai LIMPAR O CAMPO PARA DEPOIS CARREGAR
                    $(item).attr('checked', false);
                    //####################

                    $.each(filtro.ListaChkSoma, function (i2, item2) {
                        if (parseInt($(item).attr('id').replace("chksoma", "")) == item2) {
                            $(item).show();
                            $(item).attr('checked', true);
                        }
                    });

                })

                $.each($(".txtfiltro:text"), function (i, item) {
                    //CARLOS 17/04/2015
                    //####################
                    //vai LIMPAR O CAMPO PARA DEPOIS CARREGAR
                    $(item).val("");
                    //####################

                    $.each(filtro.ListaWhere, function (i2, item2) {
                        if (parseInt($(item).attr('id').replace("txtFiltro", "")) == item2.split('|')[0]) {
                            $(item).val(item2.split('|')[1]);
                        }
                    });

                });

                alert('Filtro carregado com sucesso.');
            }
            else {
                alert('Problemas ao carregar o filtro. Contacte o administrador do sistema.');
            }

            $("#btnCarregarFiltro").attr('disabled', false);
        }).error(function (response) {
            alert('Problemas ao carregar o filtro. Contacte o administrador do sistema.');
            $("#btnCarregarFiltro").attr('disabled', false);
        });
    }

    $("#filtros").html("<div style='margin-left:10px; margin-top:10px; padding-bottom: 10px;'><b>Carregando filtros...</b></div>");

    $.post("Ferramentas/GetFiltrosGrupos", null, function (grupos) {
        $("#filtros").empty();

        $("#filtros").append("<div id='divcategorias' style='margin-left:10px; margin-top: 5px;'><label id='plusminus'> - </label><b>Categorias</b><div id='divcategoriasinner'></div></div>");
        $("#plusminus").live('click', function () {
            $("#divcategoriasinner").toggle('slow');
            if ($("#plusminus").html() == " + ")
                $("#plusminus").html(" - ");
            else
                $("#plusminus").html(" + ");
        });

        if (grupos) {
            $.each(grupos, function (i, item) {
                $("#divcategoriasinner").append("<div id='div" + item + "' style='margin-left:10px; margin-top: 5px;'><label id='plus" + item + "'> - </label><b>" + item + "</b><div id='div" + item + "inner'></div></div>");
                $("#plus" + item).live('click', function () {
                    $("#div" + item + "inner").toggle('slow');
                    if ($("#plus" + item).html() == " + ")
                        $("#plus" + item).html(" - ");
                    else
                        $("#plus" + item).html(" + ");

                });
            });

            $.post("Ferramentas/GetFiltrosCampos", null, function (campos) {
                $.each(campos, function (i, item) {

                    //Abrindo DIV
                    var append = "<tr style='height: 30px;'><div class='filtros" + item.SEQ_CAMPO + "' style='width: 900px'>";

                    //Adicionando CHECKBOX
                    append += "<td><input title='Exibir " + item.DESC_CAMPO + " no relatório.' type='checkbox' class='chkfiltro mws-tooltip-s' id='chkfiltro" + item.SEQ_CAMPO + "'/></td><td style='padding-right: 15px; border-right: 1px solid #ccc;'></td>";

                    //Adicionando DESCRICAO
                    append += "<td style='width: 250px; padding-left: 20px; border-right: 1px solid #ccc;'>" + item.DESC_CAMPO + "</td>";

                    //Se o resultado do campo puder ser somado, adiciona checkbox para permitir que essa escolha seja feita
                    if (item.PODE_SOMAR == 1) {
                        append += "<td style='padding-left: 5px; border-right: 1px solid #ccc;'><input title='Somar " + item.DESC_CAMPO + "' type='checkbox' class='chksoma mws-tooltip-e' id='chksoma" + item.SEQ_CAMPO + "' style='display:none;' /></td>";
                    }
                    else {
                        append += "<td style='padding-left: 35px; border-right: 1px solid #ccc;'></td>";
                    }

                    //Se campo puder ser filtrado, adiciona botão que abre modal de filtro
                    if (item.PODE_FILTRAR == 1) {
                        append += "<td style='padding-left: 50px;'><input title='Filtro de " + item.DESC_CAMPO + " selecionado.' type='text' class='txtfiltro mws-tooltip-e' id='txtFiltro" + item.SEQ_CAMPO + "' size='70' disabled /></td>";
                        append += "<td style='padding-left: 5px; background-size:16px 16px;'><input title='Filtrar " + item.DESC_CAMPO + ".' type='button' id='btn" + item.SEQ_CAMPO + "' class='mws-ic ic-filter li_icon mws-tooltip-e'/></td>";
                        append += "<td style='padding-left: 5px;'><input title='Limpar filtro de " + item.DESC_CAMPO + ".' type='button' id='btnlimpa" + item.SEQ_CAMPO + "' class='mws-ic-16 ic-delete li_icon mws-tooltip-e'/></td>";
                    }
                    else {
                        append += "<td style='padding-left: 75px;'></td><td style='padding-left: 5px;'></td><td style='padding-left: 5px;'></td>";
                    }

                    append += "</tr>";

                    $("#div" + item.GRUPO_CAMPO + "inner").append(append);

                    $("#chkfiltro" + item.SEQ_CAMPO).on('change', function () {
                        if ($("#chksoma" + item.SEQ_CAMPO)) {
                            if ($(this).attr('checked') == 'checked') {
                                $("#chksoma" + item.SEQ_CAMPO).show();
                            }
                            else {
                                $("#chksoma" + item.SEQ_CAMPO).hide();
                                $("#chksoma" + item.SEQ_CAMPO).attr('checked', false);
                            }
                        }
                    });

                    if ("#btnlimpa" + item.SEQ_CAMPO) {
                        $("#btnlimpa" + item.SEQ_CAMPO).on("click", function () {
                            $("#txtFiltro" + item.SEQ_CAMPO).val('');
                        });
                    }

                    if ("#btn" + item.SEQ_CAMPO) {
                        $("#btn" + item.SEQ_CAMPO).on("click", function () {

                            //Conversão para filtros numéricos não apresentados como lista
                            if (item.TIPO == "N" && item.ESQUEMA_TABELA == null)
                                item.TIPO = "9";

                            ExibeOpcoesModal(item.SEQ_CAMPO, item.DESC_CAMPO, item.TIPO, ((item.COD_BANCO != null) ? 2 : 1), $("#txtFiltro" + item.SEQ_CAMPO).val());
                        });
                    }

                    $('#chkfiltro' + item.SEQ_CAMPO).tipsy({ gravity: 'e' });
                    $('#chksoma' + item.SEQ_CAMPO).tipsy({ gravity: 'n' });
                    $('#btn' + item.SEQ_CAMPO).tipsy({ gravity: 's' });
                    $('#btnlimpa' + item.SEQ_CAMPO).tipsy({ gravity: 's' });
                });
            });
        }
    });

});

$(document).on('mouseenter', ".slick-row", function () {
    $(this).css("background-color", "#e5e5c5");
}).on('mouseleave', ".slick-row", function () {
    $(this).css("background-color", "white");
});

function DefinirDialog() {
    $("#opcoesmodalinner").dialog({
        position: "center",
        modal: true,
        resizable: false,
        autoOpen: false,
        width: 'auto',
        height: 'auto',
        position: ['center', 'center'],
        open: function (event, ui) {
            $(".ui-dialog-titlebar-close", $(this).parent()).hide();
        },
        close: function () {
            $("#opcoesmodalinner").empty();
            if (xhr)
                xhr.abort();
        },
        buttons: {
            "Salvar": function () {
              SalvarFiltrosModal($(this).data("seqcampo"), $(this).data("tipo"));
            },
            "Inserir Lista": function () {
                $("#divlista").css('display', 'block');
                $("#modalgrid").css('display', 'none');
                $("#divfiltro").css('display', 'none');
                $('.ui-button:contains(Lista)').hide();
            },
            "Limpar": function () {
                LimparModal($(this).data("tipo"));
            },
            "Fechar": function () {
                $(this).dialog("close");
            }
        }
    });
};



function EsconderListardIn(esconder) {

  if (esconder == true) {
    $("#divlista").css('display', 'none');
    $("#txtModalValor").attr('disabled', false);
    $("#txtlistafiltro").val('');
  }
  else {
    $("#divlista").css('display', 'block');
    $("#txtModalValor").val('');
    $("#txtModalValor").attr('disabled', true);
    //$("#modalgrid").css('display', 'none');
    //$("#divfiltro").css('display', 'none');
    //$('.ui-button:contains(Lista)').hide();
  }
}


function ExibeOpcoesModal(seqcampo, descricao, tipo, numcolunas, oldvalues) {

    var gridValuesArray = [];

    DefinirDialog();

    switch (tipo) {
        case "9":
            {
                $('#opcoesmodalinner').dialog('option', 'title', descricao);
                $("#opcoesmodalinner").append(
                    "<tr style='height: 26px;'><td><input type='radio' name='maiormenorigual' id='rdbModalMaior' onClick='EsconderListardIn(true);'/>Maior que</td><td></td></tr>" +
                    "<tr style='height: 26px;'><td><input type='radio' name='maiormenorigual' id='rdbModalMenor' onClick='EsconderListardIn(true);'/>Menor que</td><td style='padding-left: 60px;'><input type='number' id='txtModalValor'></td></tr>" +
                    "<tr style='height: 26px;'><td><input type='radio' name='maiormenorigual' id='rdbModalIgual' onClick='EsconderListardIn(true);'/>Igual a</td><td></td></tr>" +
                    "<tr style='height: 26px;'><td colspan='2'><input type='radio' name='maiormenorigual' id='rdbModalIn' onClick='EsconderListardIn(false);'/>Lista</td></tr>" +
                    "<tr style='height: 26px;'><td colspan='2'><div id='divlista' style='display:none'><div style='width:340px;'>Os valores devem ser separados por vírgulas e não podem conter caracteres especiais.</div><textarea id='txtlistafiltro' rows='15' cols='40' style='resize: none;'/></div></td></tr>");

                
                $("#txtlistafiltro").keypress(function (e) {

                  if (e.which != 44 &&  e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        return false;
                    }
                });




                //###############################
                //só aceita números e virgulas no COLAR
                //###############################
                $("#txtlistafiltro").bind('paste', function (e) {
                  var aux = "";
                  setTimeout(function () {
                    aux=$("#txtlistafiltro").val();
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
                    $("#txtlistafiltro").val(aux.replace(/[^0-9,]/g, ''));
                  }, 0);
                });


                $("#txtModalValor").keypress(function (e) {
                  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                    return false;
                  }
                });

                $('.ui-button:contains(Relatório)').hide();

                $('.ui-button:contains(Lista)').hide();
                //$('.ui-button:contains(Lista)').show();
                if (oldvalues)
                    SetOldValues(oldvalues, tipo);
                break;
            }

        case "A":
        case "N":
            {
                $('.ui-button:contains(Lista)').show();
                $("#opcoesmodalinner").dialog('option', 'title', descricao);

                $("#opcoesmodalinner").html("<img src='Content/ajax-loader.gif'></img> Obtendo dados do filtro...");

                if (oldvalues)
                    gridValuesArray = SetOldValues(oldvalues, tipo);

                xhr = $.post("Ferramentas/GetRegistrosFiltro", { seqcampo: seqcampo }, function (result) {

                    var parsedresult = JSON.parse(result);

                    if (parsedresult.success) {
                        var modalGrid = "<div id='divfiltro' style='margin-bottom: 5px;'>Filtrar: <input type='text' id='txtFiltrar'/></div><div id='modalgrid' style='height: 300px; width: 600px; border: 1px solid black;'></div>";

                        $("#opcoesmodalinner").html(modalGrid + "<div id='divlista' style='display:none'><div style='width:340px;'>Os valores devem ser separados por vírgulas e não podem conter caracteres especiais.</div><textarea id='txtlistafiltro' rows='15' cols='40' style='resize: none;'/></div>");

                        if (parsedresult.data.length > 0) {

                            var columns = [];
                            var searchString = "";

                            var checkboxSelector = new Slick.CheckboxSelectColumn({
                                cssClass: "slick-cell-checkboxsel"
                            });

                            columns.push(checkboxSelector.getColumnDefinition());

                            var rowHash = parsedresult.data[0];
                            for (var key in rowHash) {
                                if ($.inArray(key, columns) == -1) {
                                    if (key != "id")
                                        columns.push({ id: key, name: key, field: key, minWidth: key.length * 1.5 });
                                }
                            }


                            var widthsArray = [];

                            $.each(columns, function (colIndex, column) {
                                widthsArray.push(0);
                            });

                            $.each(parsedresult.data, function (rowIndex, row) {

                                $.each(columns, function (colIndex, column) {

                                    $("#auxSpan").html(row[column.id]);
                                    if (widthsArray[colIndex] < $("#auxSpan").html().length) {
                                        widthsArray[colIndex] = $("#auxSpan").html().length;
                                    }

                                });

                            });

                            $.each(widthsArray, function (i, item) {
                                columns[i].width = item;
                            });

                            var options = {
                                enableCellNavigation: true,
                                forceFitColumns: true
                            };

                            dataView = new Slick.Data.DataView();
                            grid = new Slick.Grid("#modalgrid", dataView, columns, options);

                            grid.setSelectionModel(new Slick.RowSelectionModel({ selectActiveRow: false }));
                            grid.registerPlugin(checkboxSelector);

                            dataView.onRowCountChanged.subscribe(function (e, args) {
                                grid.updateRowCount();
                                grid.render();
                            });

                            dataView.onRowsChanged.subscribe(function (e, args) {
                                grid.invalidateRows(args.rows);
                                grid.render();
                            });

                            $("#txtFiltrar").keyup(function (e) {
                                Slick.GlobalEditorLock.cancelCurrentEdit();

                                searchString = this.value;
                                updateFilter();
                            });

                            function updateFilter() {
                                dataView.setFilterArgs({
                                    searchString: searchString
                                });
                                dataView.refresh();
                            }

                            function myFilter(item, args) {

                                if (item["ID"] !== undefined) {
                                    if ($.type(item["ID"]) === "string") {
                                        if (args.searchString != "" && item["ID"].toLowerCase().indexOf(args.searchString) == -1 && item["DESCRICAO"].toLowerCase().indexOf(args.searchString.toLowerCase()) == -1) {
                                            return false;
                                        }
                                    }
                                    else {
                                        if (args.searchString != "" && item["ID"].toString().indexOf(args.searchString) == -1 && item["DESCRICAO"].toLowerCase().indexOf(args.searchString.toLowerCase()) == -1) {
                                            return false;
                                        }
                                    }
                                }
                                else {
                                    if (item["DESCRICAO"].toLowerCase().indexOf(args.searchString.toLowerCase()) == -1) {
                                        return false;
                                    }
                                }

                                return true;
                            }

                            dataView.beginUpdate();
                            dataView.setItems(parsedresult.data);
                            dataView.setFilterArgs({
                                searchString: searchString
                            });
                            dataView.setFilter(myFilter);

                            dataView.endUpdate();

                            var teste = dataView.syncGridSelection(grid, true, true);

                            if (gridValuesArray.length > 0)
                                grid.setSelectedRows(gridValuesArray);


                        }
                    }
                    else {
                        $("#opcoesmodalinner").html(parsedresult.data);
                    }
                }).error(function (result) {
                    parsedresult = JSON.parse(result);
                    $("#opcoesmodalinner").html(parsedresult.data);
                });



                break;
            }

        case "D":
            {
                $('.ui-button:contains(Lista)').hide();
                $('#opcoesmodalinner').dialog('option', 'title', descricao);
                $("#opcoesmodalinner").append("<input type='text' id='txtInicial' style='margin-top:10px; margin-left: 10px;' /></br><input type='text' id='txtFinal' style='margin-top:10px; margin-left: 10px; /></br>");
                
                $("#txtInicial").datepicker({ dateFormat: 'dd/mm/yy' });
                $("#txtInicial").mask("?99/99/9999");

                $("#txtFinal").datepicker({ dateFormat: 'dd/mm/yy' });
                $("#txtFinal").mask("?99/99/9999");

                if (oldvalues)
                    SetOldValues(oldvalues, tipo);

                break;
            }

        case "S":
            {
                $('.ui-button:contains(Lista)').hide();
                $('#opcoesmodalinner').dialog('option', 'title', descricao);
                $("#opcoesmodalinner").append(
                    "<tr style='height: 26px;'><td><input type='radio' name='simnao' id='rdbSim' value='sim' style=''/>Sim</td></tr>" +
                    "<tr style='height: 26px;'><td><input type='radio' name='simnao' id='rdbNao' value='nao' style=''/>Não</td></tr>");

                if (oldvalues)
                    SetOldValues(oldvalues, tipo);

                break;
            }

        case "T":
            {
                $('.ui-button:contains(Lista)').hide();
                $('#opcoesmodalinner').dialog('option', 'title', descricao);
                //$("#opcoesmodalinner").append("Data/hora inicial: <input type='date' id='txtDataModalInicial' style='' /> às <input type='time' id='txtHoraModalInicial' style='margin-left: 10px;' />h</br>");
                //$("#opcoesmodalinner").append("Data/hora final  : <input type='date' id='txtDataModalFinal' style='' /> às <input type='time' id='txtHoraModalFinal' style='margin-left: 10px;' />h");
                
                $("#opcoesmodalinner").append("<tr><td>Data/hora inicial: </td><td><input type='text' id='txtDataModalInicial' style='width: 75px;' /></td><td> &nbsp; às <input type='text' id='txtHoraModalInicial' style='margin-left: 1px;width: 45px;' />h</td></br>");
                $("#opcoesmodalinner").append("<tr><td>Data/hora final:   </td><td><input type='text' id='txtDataModalFinal' style='width: 75px;' /></td><td> &nbsp; às <input type='text' id='txtHoraModalFinal' style='margin-left: 1px;width: 45px;' />h</td>");

                $("#txtDataModalInicial").datepicker({ dateFormat: 'dd/mm/yy' });
                $("#txtDataModalInicial").mask("?99/99/9999");
                $("#txtHoraModalInicial").mask("?99:99");
                
                $("#txtDataModalFinal").datepicker({ dateFormat: 'dd/mm/yy' });
                $("#txtDataModalFinal").mask("?99/99/9999");
                $("#txtHoraModalFinal").mask("?99:99");

                if (oldvalues)
                    SetOldValues(oldvalues, tipo);

                break;
            }

    }

    $("#opcoesmodalinner").data("tipo", tipo);
    $("#opcoesmodalinner").data("seqcampo", seqcampo);

    $("#opcoesmodalinner").dialog('open');

    $("#ui-id-1").css('color', 'white');
}

function SetOldValues(oldvalues, tipo) {
    switch (tipo) {
        case "9":
            {
                var sinal = oldvalues.split(' ')[0];
                var valor = oldvalues.split(' ')[1];

                switch (sinal) {
                    case ">":
                      $("#rdbModalMaior").attr('checked', 'checked');
                      $("#txtModalValor").val(valor);
                        break;
                    case "<":
                      $("#rdbModalMenor").attr('checked', 'checked');
                      $("#txtModalValor").val(valor);
                        break;
                    case "=":
                      $("#rdbModalIgual").attr('checked', 'checked');
                      $("#txtModalValor").val(valor);
                                            
                        break;
                  case "in":
                    $("#rdbModalIn").attr('checked', 'checked');

                    var auxval = oldvalues.replace(/in/g, '');
                    auxval = auxval.replace(/\(/g, '');
                    auxval = auxval.replace(/\)/g, '');

                    auxval = auxval.replace(/ /g, '');

                    //aquiiiiiii
                    $("#txtModalValor").val("");
                    $("#txtlistafiltro").val(auxval);

                    $("#divlista").css('display', 'block');

                    break;
                }

                
                

            }
            break;

        case "A":
        case "N":
            {
                var oldvaluessplit = oldvalues.split(',');

                var gridValuesArray = [];

                if ($.type(dataView.getItemById(0).ID) !== "number") {
                    if (dataView.getItemById(0).ID !== undefined) {
                        $.each(oldvaluessplit, function (i, item) {
                            for (x = 0; x < dataView.getLength() ; x++) {
                                if (item.replace(/'/g, '') == dataView.getItemById(x).ID)
                                    gridValuesArray.push(x);
                            }
                        });
                    }
                    else {
                        $.each(oldvaluessplit, function (i, item) {
                            for (x = 0; x < dataView.getLength() ; x++) {
                                if (item.replace(/'/g, '') == dataView.getItemById(x).DESCRICAO)
                                    gridValuesArray.push(x);
                            }
                        });
                    }
                }
                else {
                    if (dataView.getItemById(0).ID !== undefined) {
                        $.each(oldvaluessplit, function (i, item) {
                            for (x = 0; x < dataView.getLength() ; x++) {
                                if (item.replace(/'/g, '') == dataView.getItemById(x).ID)
                                    gridValuesArray.push(x);
                            }
                        });
                    }
                    else {
                        $.each(oldvaluessplit, function (i, item) {
                            for (x = 0; x < dataView.getLength() ; x++) {
                                if (item.replace(/'/g, '') == dataView.getItemById(x).DESCRICAO)
                                    gridValuesArray.push(x);
                            }
                        });
                    }
                }

                return gridValuesArray;
            };
            break;

        case "D":
            {
                var dataini = oldvalues.substring(1, 11);
                var datafim = oldvalues.substring(15, 25);
                $("#txtInicial").val(dataini);
                $("#txtFinal").val(datafim);
            }
            break;

        case "S":
            {
                if (oldvalues == "Sim")
                    $("#rdbSim").attr('checked', 'checked');
                else
                    $("#rdbNao").attr('checked', 'checked');
            }
            break;

        case "T":
            {
                var dataini = oldvalues.substring(1, 11);
                var horaini = oldvalues.substring(12, 17);
                var datafim = oldvalues.substring(22, 32);
                var horafim = oldvalues.substring(33, 38);
                $("#txtDataModalInicial").val(dataini);
                $("#txtHoraModalInicial").val(horaini);
                $("#txtDataModalFinal").val(datafim);
                $("#txtHoraModalFinal").val(horafim);
            }
            break;
    }
}

function ColetarFiltrosSelecionados(tipo) {

    var valores = "";

    switch (tipo) {

        case "9":
            if ($("#rdbModalMaior").attr('checked')) {
              valores = "> ";
              valores += $("#txtModalValor").val();
            }
            else if ($("#rdbModalMenor").attr('checked'))
            {
              valores = "< ";
              valores += $("#txtModalValor").val();
            }
            else if ($("#rdbModalIgual").attr('checked'))
              {
              valores = "= ";
              valores += $("#txtModalValor").val();
            }
            else if ($("#rdbModalIn").attr('checked')) {


              valores = "in ( ";
              //retirar as ,, da lista
              var valaux = $("#txtlistafiltro").val();
              while (1 == 1) {
                if (valaux.indexOf(',,') == -1) {
                  break;
                }
                else {
                  valaux = valaux.replace(/,,/g, ',');
                }
              }

              ////alert(valaux.toString().substr(0, 1));
              if (valaux.substr(0, 1) == ",")
              {
                valaux = valaux.substr(1, valaux.length);
              }
              //var tamanho = valaux.length;
              //alert(valaux.substr(3, 1));

              ////verifica se o ultimo carcter é a vírgula, se for retira
              if (valaux.substr(valaux.length - 1, 1) == ",") {
                valaux = valaux.substr(0, valaux.length - 1);
              }

              valores += valaux.replace(' ', '').replace(/,,/g, ',').replace(/,/g, ' , ');
              
              valores += " ) ";
            }
            
            break;

        case "A":
            if (!$("#divlista").is(":visible")) {
                selectedIndexes = grid.getSelectedRows();
                jQuery.each(selectedIndexes, function (index, value) {
                    if (dataView.getItemById(value).ID) {
                        valores += "'" + dataView.getItemById(value).ID + "'";
                    }
                    else {
                        valores += "'" + dataView.getItemById(value).DESCRICAO + "'";
                    }
                    if (index < selectedIndexes.length - 1)
                        valores += ",";
                });
            }
            else {
                var valoressplit = $("#txtlistafiltro").val().replace(' ', '').split(',');
                var novosvalores = [];
                $.each(valoressplit, function (i, item) {
                    novosvalores.push("'" + item + "'");
                });

                valores = novosvalores.join();
            }
            break;

        case "D":
            valores = $("txtInicial").val() + ";" + $("#txtFinal").val();
            break;

        case "N":
            if (!$("#divlista").is(":visible")) {
                selectedIndexes = grid.getSelectedRows();
                jQuery.each(selectedIndexes, function (index, value) {
                    valores += dataView.getItemById(value).ID;
                    if (index < selectedIndexes.length - 1)
                        valores += ",";
                });
            }
            else {
                valores = $("#txtlistafiltro").val();
            }
            break;

        case "S":
            if ($("#rdbSim").attr('checked')) {
                valores = "Sim";
            }
            else {
                if ($("#rdbNao").attr('checked'))
                    valores = "Não";
            }
            break;

        case "T":
            valores += "'" + $("#txtDataModalInicial").val() + " " + ($("#txtHoraModalInicial").val()==""?"00:00":$("#txtHoraModalInicial").val()) + "' a '" + $("#txtDataModalFinal").val() + " " + ($("#txtHoraModalFinal").val()==""?"00:00":$("#txtHoraModalFinal").val()) + "'";
            break;
    }

    return valores;
}

function FecharModal() {
    $("#opcoesmodalinner").dialog('close');
    $("#resultmodal").dialog('close');
}

function SalvarFiltrosModal(seqcampo, tipo) {
    if (tipo == "N" || tipo == "A") {
        $("#txtFiltrar").val('');
        $("#txtFiltrar").trigger('keyup');
    }
    else if (tipo == "9")
    {
      if ($("#rdbModalMaior").attr('checked') || $("#rdbModalMenor").attr('checked') || $("#rdbModalIgual").attr('checked'))
      {
        if ($("#txtModalValor").val() == '') {
          alert("Você precisa escolher informar o valor.");
          return false;
        } 
      }
      else if ($("#rdbModalIn").attr('checked')) {
        if ($("#txtlistafiltro").val() == '') {
          alert("Você precisa escolher informar o valor da lista.");
          return false;
        }
      }
    }
    else if (tipo == "T") {
        if (ValidadatasModalIniFim() ==false) {
          return false;
        }

    }

    $("#txtFiltro" + seqcampo).val(ColetarFiltrosSelecionados(tipo));
    FecharModal();
}




function ValidadatasModalIniFim()
{

  // Regex validate hour
  var matchhora = new RegExp(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/gi);

        if ($('#txtDataModalInicial').val() == "") {
          alert('Data início inválida');
          //$(".loading-save").hide();
          return false;
      }
      else {
        if ($('#txtDataModalInicial').val().length < 10) {
              alert('Data início inválida');
              return false;
          }
          else {
              try {
                $.datepicker.parseDate('dd/mm/yy', $("#txtDataModalInicial").val());
              }
              catch (err) {
                  alert('Data início inválida');
                  return false;
              }

              if ($("#txtHoraModalInicial").val() != "") {
                if (!$("#txtHoraModalInicial").val().match(matchhora)) {
                  alert('Hora início inválida');
                  return false;
                }
              }

          }
      }


      if ($('#txtDataModalFinal').val() == "") {
        alert('Data final inválida');
          return false;
      }
      else {
        if ($('#txtDataModalFinal').val().length < 10) {
              alert('Data final inválida');
              return false;
          }
          else {
              try {
                $.datepicker.parseDate('dd/mm/yy', $("#txtDataModalFinal").val());
              }
              catch (err) {
                  alert('Data final inválida');
                  return false;
              }

          //valida a HORA FINAL

              if ($("#txtHoraModalFinal").val() != "") {
                if (!$("#txtHoraModalFinal").val().match(matchhora)) {
                  alert('Hora final inválida');
                  return false;
                }
              }
          }
      }
      if ($('#txtDataModalInicial').val().length == 10 && $("#txtDataModalFinal").val().length == 10) {
        if ($.datepicker.parseDate('dd/mm/yy', $("#txtDataModalFinal").val()) < $.datepicker.parseDate('dd/mm/yy', $("#txtDataModalInicial").val())) {
          alert('Data final não pode ser menor que a data inicial');
          return false;
        }
        else {
          if ($("#txtDataModalFinal").val() == $("#txtDataModalInicial").val()) {
            if ($("#txtHoraModalInicial").val() != "" && $("#txtHoraModalFinal").val() != "") {
              var dtauxini = $("#txtHoraModalInicial").val().replace(':', '');
              var dtauxfim = $("#txtHoraModalFinal").val().replace(':', '');
              if (dtauxfim < dtauxini) {
                alert('Data/hora final não pode ser menor que a data/hora inicial');
                return false;
              }
            }
          }
        }
      }

      return true;
}



function LimparModal(tipo) {
    switch (tipo) {
        case "S":
            {
                $("#rdbSim").removeAttr('checked');
                $("#rdbNao").removeAttr('checked');
                break;
            }

        case "N":
        case "A":
            {
                grid.setSelectedRows([]);
                break;
            }

        case "T":
            {
                //$("input[type='date']").val('');
                //$("input[type='time']").val('');
                $("input[type='text']").val('');
                break;
            }

        case "9":
            {
                $("#rdbModalMaior").removeAttr('checked');
                $("#rdbModalMenor").removeAttr('checked');
                $("#rdbModalIgual").removeAttr('checked');
                $("#rdbModalIn").removeAttr('checked');
                $("#txtModalValor").val('')
                break;
            }

    }

    if ($("#txtlistafiltro").val() != "")
        $("#txtlistafiltro").val("");
}

function SetProgressCounter(value) {
    //$("#progressBar").html(value);
    $("#progressBar").css('width', value + '%');
}

$.extend($.ui.dialog.prototype, {
    'addbutton': function (buttonName, func) {
        var buttons = this.element.dialog('option', 'buttons');
        buttons[buttonName] = func;
        this.element.dialog('option', 'buttons', buttons);
    }
});

$.extend($.ui.dialog.prototype, {
    'removebutton': function (buttonName) {
        var buttons = this.element.dialog('option', 'buttons');
        delete buttons[buttonName];
        this.element.dialog('option', 'buttons', buttons);
    }
});

function JSON2CSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

    var str = '';
    var line = '';

    if ($("#labels").is(':checked')) {
        var head = array[0];
        if ($("#quote").is(':checked')) {
            for (var index in array[0]) {
                var value = index + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[0]) {
                line += index + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }

    for (var i = 0; i < array.length; i++) {
        var line = '';

        if ($("#quote").is(':checked')) {
            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }
        } else {
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    return str;

}

function OrdenarJSON(json, prop, asc) {
    return json = json.sort(function (a, b) {
        if (asc) return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        else return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
    });
}

function actuateLink(link) {
    var allowDefaultAction = true;

    if (link.click) {
        link.click();
        return;
    }
    else if (document.createEvent) {
        var e = document.createEvent('MouseEvents');
        e.initEvent(
           'click'     // event type
           , true      // can bubble?
           , true      // cancelable?
        );
        allowDefaultAction = link.dispatchEvent(e);
    }

    if (allowDefaultAction) {
        var f = document.createElement('form');
        f.action = link.href;
        document.body.appendChild(f);
        f.submit();
    }
}

