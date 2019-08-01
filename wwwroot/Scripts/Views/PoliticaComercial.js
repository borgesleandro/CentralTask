$(document).ready(function () {


    $(document).on("click", ".check_all_Filtro", function () {

        
        if ($(this).is(":checked") == true)
        {   
            $(".check_filtroitem", $(".alcadaFiltroExcecaoProdutos").dataTable().fnGetNodes()).attr("checked", true);
        } else {
            
            $(".check_filtroitem", $(".alcadaFiltroExcecaoProdutos").dataTable().fnGetNodes()).attr("checked", false);
        }
        
    });

    //STARTA O TOOLTIP DO MODAL
    if ($.fn.tipsy) {
        var gravity = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
        for (var i in gravity)
            $(".mws-tooltip-" + gravity[i]).tipsy({ gravity: gravity[i] });        
    }


    // Utilizado para limpara a caixa de buscar do datatable ao pesquisar um registro e excluir
    jQuery.fn.dataTableExt.oApi.fnFilterClear = function (oSettings) {
        var i, iLen;

        /* Remove global filter */
        oSettings.oPreviousSearch.sSearch = "";

        /* Remove the text of the global filter in the input boxes */
        if (typeof oSettings.aanFeatures.f != 'undefined') {
            var n = oSettings.aanFeatures.f;
            for (i = 0, iLen = n.length; i < iLen; i++) {
                $('input', n[i]).val('');
            }
        }

        /* Remove the search text for the column filters - NOTE - if you have input boxes for these
            * filters, these will need to be reset
            */
        for (i = 0, iLen = oSettings.aoPreSearchCols.length; i < iLen; i++) {
            oSettings.aoPreSearchCols[i].sSearch = "";
        }

        /* Redraw */
        oSettings.oApi._fnReDraw(oSettings);
    };


    $(".dropdownidtipopedidoCCOrrente").on("change", function () {
            $("#ID_TIPO_PEDIDO").val($(".dropdownidtipopedido").val());
            $("#SearchDescontoCcorrente").submit();

    });

    
    $(".dropdownidtipopedido").on("change", function () {
        $(".alcadaGrid").hide();
        $(".descontosGrid").hide();
        $(".dropdownDesconto").val("");
    });

    $(".dropdownDesconto").on("change", function () {
        if ($(".dropdownidtipopedido").val() == "")
        {
            alert('Selecione o tipo de pedido');

            return false;
        }
        else {
            $("#ID_TIPO_PEDIDO").val($(".dropdownidtipopedido").val());
        }
        
        $("#SearchDesconto").submit();
    });

    
    $(".desc_max_alt").maskMoney({ showSymbol: false, decimal: ",", allowNegative:true,  allowZero: true,  thousands: ""  });

    $(".checkAll").on("click", function () {
        var checked = $(this).is(":checked");
        var sendData = {};
        sendData.isChecked = checked;
        sendData.textFilter = $(":input", $(".dataTables_filter")).val();
        sendData.canalID = $("#CanalID").val();
        sendData.politicaID = $("#PoliticaID").val();
        sendData.familiaID = $("#FamiliaID").val();
        sendData.grupoID = $("#GrupoID").val();

        $.post(controller + "CheckAllProduto", sendData, function () {
            $(".check").attr("checked", checked);
        });
    });

    $(".check").live("click", function () {
        var requestType = $(this).is(":checked") ? "Add" : "Remove";
        $.post(controller + requestType + "Produto", { produtoID: $(this).val() });
    });


    $("#DescontoMaximo").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });

    $(".filterTable").on("change", function () {
        $(".produtosTable").dataTable().fnDraw(false);
    });

    $(".produtosTable").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "politicaID", "value": $("#PoliticaID").val() });
            aoData.push({ "name": "canalID", "value": $("#CanalID").val() });
            aoData.push({ "name": "familiaID", "value": $("#FamiliaID").val() });
            aoData.push({ "name": "grupoID", "value": $("#GrupoID").val() });
            aoData.push({ "name": "linhaID", "value": $("#LinhaID").val() });

        },
        "bProcessing": true,
        "aoColumns": [
                        {
                            "mDataProp": "ID",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var result = '<input type="checkbox" ' + (oObj.aData.Checked ? 'checked="checked"' : '') + ' class="check" value="' + oObj.aData.ID + '" \">';
                                return result;
                            }
                        },
                        {
                            "mDataProp": "CODPROD"
                        },
                        { "mDataProp": "DESCRICAO" },
                        {
                            "mDataProp": "POLITICAS_DIVERGENTES",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var result = "";
                                var politicasDivergentes = oObj.aData.POLITICAS_DIVERGENTES;
                                if (politicasDivergentes.length > 0) {
                                    $(politicasDivergentes).each(function () {
                                        result = this.Desconto + " %";
                                    });                                    
                                }
                                else {
                                    result = "";
                                }
                                return result;
                            }

                        }
        ],
        "oLanguage":
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)",
            sProcessing: "<div class='dataTable-loading' />"
        },
        "sPaginationType": "full_numbers",
    });

    $(".produtosTableDetails").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableProdutoDetails",
        "bProcessing": true,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "politicaID", "value": $("#PoliticaID").val() });

        },
        "aoColumns": [
            {
                "mDataProp": "CODPROD",
            },
            {
                "mDataProp": "PRODUTO"
            },
            {
                "mDataProp": "DESCONTO",
                "bSearchable": false,
                "bSortable": false

            }
        ],
        "oLanguage":
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)",
            sProcessing: "<div class='dataTable-loading' />"
        },
        "sPaginationType": "full_numbers",
    });


    $(".tipopedidoHierarquiaRequired").on("change", function () {
       $("#Descontos").val("");

       if ($("#HIDDENmostrarContaCorrente").val() == "S") {
          $(".alcadaTableDetailsCcorrente").dataTable().fnDraw(true);
       }
       else {
          $(".alcadaTableDetails").dataTable().fnDraw(true);
       }
    });

    $(document).on("change", "#Descontos", function () {

        if ($(".tipopedidoHierarquiaRequired").val().trim() == "")
        {
            alert("Selecione um tipo de pedido!")
            return false;
        }
        
        $(".alcadaTableDetails").dataTable().fnDraw(true);
    });


    
    $(".alcadaTableDetailsCcorrente").dataTable({
       "bServerSide": true,
       "sAjaxSource": controller + "AjaxDataTableAlcadaDetailsCCorrente",
       "bProcessing": true,
       "fnServerParams": function (aoData) {
          aoData.push({ "name": "idtipopedido", "value": $(".tipopedidoHierarquiaRequired").val() }); //$(".tipopedidoHierarquiaRequired").val()
          aoData.push({ "name": "politicaID", "value": $("#PoliticaID").val() });

       },
       "aoColumns": [
          {
             "mDataProp": "ORDEM_HIERARQUIA",
             "bSearchable": false,
             "bSortable": false
          },
          {
             "mDataProp": "CargosDescription",
             "bSearchable": false,
             "bSortable": false
          },
          {
             "mDataProp": "descontoMIN",
             "bSearchable": false,
             "bSortable": false
          }
          ,
          {
             "mDataProp": "descontoMAX",
             "bSearchable": false,
             "bSortable": false
          }
       ],
       "oLanguage":
       {
          sZeroRecords: "Não foram encontrados resultados",
          sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
          sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
          sInfoFiltered: "(Total de _MAX_ registros)",
          sProcessing: "<div class='dataTable-loading' />"
       },
       "sPaginationType": "full_numbers",
    });


    $(".alcadaTableDetails").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAlcadaDetails",
        "bProcessing": true,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "idtipopedido", "value": $(".tipopedidoHierarquiaRequired").val() }); //$(".tipopedidoHierarquiaRequired").val()
            aoData.push({ "name": "desconto", "value": $("#Descontos").val().replace(",", ".") });
            aoData.push({ "name": "politicaID", "value": $("#PoliticaID").val() });

        },
        "aoColumns": [
                        {
                            "mDataProp": "ORDEM_HIERARQUIA",
                            "bSearchable": false,
                            "bSortable": false
                        },
                        {
                            "mDataProp": "CargosDescription",
                            "bSearchable": false,
                            "bSortable": false
                        },
                        {
                            "mDataProp": "desconto",
                            "bSearchable": false,
                            "bSortable": false
                        }
        ],
        "oLanguage":
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)",
            sProcessing: "<div class='dataTable-loading' />"
        },
        "sPaginationType": "full_numbers",
    });



    var currentAjaxRequest = null;
    $(".filtroCanal").on("click", function () {

        if (currentAjaxRequest != null) currentAjaxRequest.abort();

        
        currentAjaxRequest = $.post(controller + "FiltroCanal", { canalID: $("#CANAL").val() }, function (data) {
            $(".containerPolitica").text("");
            $(".containerPolitica").append(data);
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
                }
            });

        });

    });



    
    $(".salvarAlcadaCreate").live("click", function () {
        var mensagem = "";
     
       //VALIDA SE ESTÃO PREENCHIDAS OS DESCONTOS
       $($(".TableCcorrente").dataTable().fnGetNodes()).each(function () {
          var tr = $(this);
          var Hierarquiaordem = $("input[name='ORDEM_HIERARQUIA']", tr).val();
          var descmin = $("input[name='DESC_MIN_ALT']", tr).val();
          var descmax = $("input[name='DESC_MAX_ALT']", tr).val();

          if (descmin == "" || descmax =="")
          {
             if (mensagem != "")
             {
                mensagem += " <br/>";
             }
             //mensagem += "Informe o desconto mínimo e máximo para o nível " + Hierarquiaordem;
             mensagem += "Informe o valor inicial e o final para o nível " + Hierarquiaordem;
          }
           
       });
        
       if (mensagem == "")
       {
          $(".formAlcadaCreate").submit();
       }
       else {
          alert(mensagem);
       }


    });


    //-----------------------------
    // INÍCIO - Exceção - OS #14572 
    //-----------------------------
    $(document).on("click", ".check_all", function () {
        $(":checkbox", $(".alcadaExcecaoProdutos").dataTable().fnGetNodes()).attr("checked", $(this).is(":checked"));
    });

   
    $(document).on("click", ".incluirEditarExcecao", function () {

        var produtosID = new Array();
        var todosProdutosExecaoID = new Array();
        var canal_ID = $("#CANAL_ID").val();
        var idTipopedido = $(".dropdownidtipopedido").val();

        
        $($(".alcadaExcecaoProdutos").dataTable().fnGetNodes()).each(function () {
            var tr = $(this);

            var atualizarReg = $("input[name='checkItem']", tr).is(":checked");

            if (atualizarReg == true) {                
                produtosID.push($("input[name='checkItem']", tr).val());
            }
            todosProdutosExecaoID.push($("input[name='checkItem']", tr).val());
            
        });
        
        $.post(controller + "ExcecaoProduto", $.toDictionary({ todosProdutosExecaoID: todosProdutosExecaoID, produtosID: produtosID, idTipopedido: idTipopedido, canal_ID: canal_ID }), function (data) {

            var buttonsModal = {};

            
            $(".modalAux").dialog("destroy").remove();
            
            $(data).dialog({
                title: 'Exceções',
                resizable: false,
                draggable: false,
                width: "1100px",
                position: ['center', 100],
                modal: true,
                
                open: function (event, ui) {

                    $(".alcadaFiltroCargos").dataTable({
                        "bFilter": false,
                        "bInfo": false,
                        "bDestroy": true,
                        "bLengthChange": false,
                        "bPaginate": false,
                        "bSort": false                       

                        //"fnDrawCallback": function (oSettings) {
                        //    $(".desc_max_alt_cargo").maskMoney({ showSymbol: false, decimal: ",", allowNegative: false, allowZero: true, thousands: ""});
                        //}
                    });

                    $(".desc_max_alt_cargo").maskMoney({ showSymbol: false, decimal: ",", allowNegative: false, allowZero: true, thousands: "" });

                   
                    $(".alcadaFiltroExcecaoProdutos").dataTable({
                        "bServerSide": false,
                        "bSort": false,
                        "bDestroy": true,
                        "bProcessing": false,
                        "bAutoWidth": false,
                        "iDisplayLength": 5,
                        "sPaginationType": "full_numbers",
                        "oLanguage":
                        {
                            sZeroRecords: "Nenhum produto selecionado para alteração",
                            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                            sInfoFiltered: "(Total de _MAX_ registros)",
                            sProcessing: "<div class='dataTable-loading' />"
                        }
                    });

                    $('.dropdownProduto').multiselect({ 'appendTo': '#' + this.id }).multiselectfilter();
                    
                    $(".alcadaFiltroCargos").dataTable().parents(".dataTables_wrapper:first").css("background", "none");

                    
                    //$(document).on("click", ".check_all_Filtro", function () {
                    //    $(":checkbox", $(".alcadaFiltroExcecaoProdutos").dataTable().fnGetNodes()).attr("checked", $(this).is(":checked"));
                    //});


                    
                }
                
            });

            
            $(".loading-save").hide();

        }, "html");

        return false;

    });


    $(".alcadaExcecaoProdutos").dataTable({
        "bServerSide": false,        
        "bSort": false,
        //"bDestroy": true,
        "bProcessing": false,
        "bAutoWidth": false,
        "sPaginationType": "full_numbers",
        "iDisplayLength": 5,
        "oLanguage":

        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)",
            sProcessing: "<div class='dataTable-loading' />"
        },
    });



    $(document).on("click", ".incluirAtualizarNovoDesconto", function () {
        
        var mensagem = "";
        var valor_antes = 0;

        var politProds = [];
        var vetCargo_ID= [];
        var vetNovoDesconto= [];
        var vetPolitProdIns= [];
        var vetPolitProdUpd= [];

        var politprod_ID = 0;
        var alcada_ID = 0;
        
        var cargo_ID = 0;
        var desc_MIN = 0;
        var desc_MAX = 0;

        var id_Tipo_Pedido = $("#ID_TIPO_PEDIDO").val();
        var canal_ID = $("#CANAL_ID").val();
        var descPolitica = $("#DESC_MAX").val();

        var temDescontoIgualPolitica = false;
        var contLinha = 0;
        
        //---------------------------------------
        // BUSCA VALORES - NOVO DESCONTO
        //---------------------------------------
        $($(".alcadaFiltroCargos").dataTable().fnGetNodes()).each(function () {

            var tr = $(this);
            
            var cargo_ID = $("input[name='IDCARGOS']", tr).val();
            var cargo_Desc = $("input[name='DESCCARGO']", tr).val();
            var novoDesconto = $("input[name='NOVO_DESC']", tr).val().replace(",", ".");
            
            contLinha = contLinha + 1;

            vetCargo_ID.push(cargo_ID);
            vetNovoDesconto.push($("input[name='NOVO_DESC']", tr).val());

            
            if (novoDesconto != "" && novoDesconto != "0.00") {

                if (parseFloat(novoDesconto) > parseFloat(descPolitica))
                {
                    if (mensagem != "") { mensagem += " <br/>"; }
                    mensagem += "Desconto do cargo '" + cargo_Desc + "' - (" + novoDesconto + ") não pode ser maior que o da política";
                }

                if (((parseFloat(novoDesconto) <= parseFloat(valor_antes)) && parseFloat(valor_antes) != 0) && novoDesconto != "0.00")
                {
                    if (mensagem != "") { mensagem += " <br/>"; }
                    mensagem += "Desconto do cargo '" + cargo_Desc + "' - (" + novoDesconto + ") não pode ser menor/igual que o desconto da hierarquia anterior - (" + valor_antes + ")";
                }

                if (parseFloat(novoDesconto) == parseFloat(descPolitica))
                {
                    temDescontoIgualPolitica = true;
                }


                valor_antes = novoDesconto;
                
                //var colLinha = contLinha + 2
                //$($(".alcadaFiltroExcecaoProdutos").dataTable().fnGetNodes()).each(function () {

                //    var trFiltro = $(this);
                //    var valorProximoCargo = trFiltro.find('td:eq(' + colLinha + ')').text();
                //    var descProd = $("input[name='DESC_PRODUTO']", trFiltro).val();

                //    if (parseFloat(novoDesconto) >= parseFloat(valorProximoCargo)) {
                //        if (mensagem != "") { mensagem += " <br/>"; }
                //        mensagem += "Cargo: " + cargo_Desc + " <br/>";                       
                //        mensagem += "Produto: " + descProd + " <br/>";
                //        mensagem += "Novo desconto (" + parseFloat(novoDesconto) + ") não pode ser maior ou igual que desconto da hierarquia posterior (" + parseFloat(valorProximoCargo) + ") já cadastrada." + " <br/>";
                //    }                    

                //});

            }

            

        });

        //Todos os valores estão zerados
        if (valor_antes == 0)
        {
            if (mensagem != "") { mensagem += " <br/>"; }
            mensagem += "Pelo menos um cargo deve possuir um novo desconto.";
        }

        if (temDescontoIgualPolitica == false) {
            if (mensagem != "") { mensagem += " <br/>"; }
            mensagem += "Pelo menos um cargo deve possuir desconto igual ao da política.";
        }

        // SE DEU ALGUMA MENSAGEM DE ERRO , NÃO PROSSEGUE
        if (mensagem != "") {
            alert(mensagem);
        } else {
            
            //----------------------------------------
            // GUARDA PRODUTOS MARCADOS PARA ATUALIZAR
            //----------------------------------------
            
            $($(".alcadaFiltroExcecaoProdutos").dataTable().fnGetNodes()).each(function () {
                var tr = $(this);

                var atualizarReg = $("input[name='checkFiltroItem']", tr).is(":checked");                

                if (atualizarReg == true) {                    
                    vetPolitProdUpd.push($("input[name='checkFiltroItem']", tr).val());                    
                }

                
            });

            //-------------------------------------------------------
            //Verifica se tem algum produto para incluir ou atualizar
            //-------------------------------------------------------
            
            if (($("#ddlPRODUTO").val() != null) || vetPolitProdUpd.length > 0) {
                
                $(".loading-save").show();
                $.post(controller + "IncluirEditarExcecaoJson", $.toDictionary({
                        canal_ID: canal_ID, idTipopedido: id_Tipo_Pedido, vetCargo_ID: vetCargo_ID, vetNovoDesconto: vetNovoDesconto
                        , vetPolitProdIns: $("#ddlPRODUTO").val(), vetPolitProdUpd: vetPolitProdUpd})
                    , function (data) {
                    if (data.ok) {
                        $(".loading-save").hide();
                        //RECARREGAR O GRID DE EXCEÇÕES ATUALIZADO OU VOLTAR PARA TELA ANTERIOR RECARREGANDO
                        alert("Dados atualizados com sucesso.", null, null, null, null, {
                            callBack: function () {
                                //Response.Redirect(Request.Url.ToString(), false); 
                                //location.reload(true);
                                //window.location.href = controller + "SearchDesconto/" + canal_ID;
                                $("#SearchDesconto").submit();
                            }
                        });
                        
                    }
                    else {
                        $(".loading-save").hide();
                        alert(data.msgErro);                        
                    }
                });
            } else {
                alert('Selecione pelo menos um produto a ser incluído ou atualizado na tabela de exceção.')
            }
            
        } 
        return false;

      
    });

    $(document).on("click", ".excluirNivelAlcadaPadrao", function () {
        
        var deactivateButton = $(this);
        var alcadaPadraoID = deactivateButton.attr("data-value");
        var tr = deactivateButton.parents("tr:first");

        var descPolitica = $("#DESC_MAX").val();
        var valDesconto = $("input[name='DESC_MAX_ALT']", tr).val();

        //Tem que deixar pelo menos um cargo com o valor igual ao da política
        if (parseFloat(valDesconto) != parseFloat(descPolitica))
        {
            alert("Confirma exclusão do nível de alçada padrão?", "Excluir nível alçada padrão", null,
                function () {
                    $.post(controller + "ExcluirAlcadaPadraoJson", { alcadaPadraoID: alcadaPadraoID }, function (data) {
                        if (data.ok) {
                            //Depois de deletar da tabela, permanece com o cargo para poder futuramente incluir novo desconto
                            //$(".alcadaPadraoDesconto").dataTable().fnDeleteRow(tr[0]);                        
                            $("input[name='DESC_MAX_ALT']", tr).val("0,00");
                        }
                        else {
                            alert(data.msgErro);
                        }
                    });
                }
            );
        } else {
            alert("Pelo menos um cargo deve possuir desconto igual ao da política.");
        }
    });

    $(document).on("click", ".excluirExcecao", function () {
        var deactivateButton = $(this);
        var excecaoID = deactivateButton.attr("data-value");
        var tr = deactivateButton.parents("tr:first");
        
        alert("Confirma exclusão do produto?", "Excluir produto exceção", null,
            function () {
                $.post(controller + "ExcluirExcecaoJson", { excecaoID: excecaoID }, function (data) {
                    if (data.ok) {
                        $(".alcadaExcecaoProdutos").dataTable().fnDeleteRow(tr[0]);
                        $(".alcadaExcecaoProdutos").dataTable().fnFilterClear(); //Limpa caixa de busca se tiver feito pesquisa                        
                    }
                    else {
                        alert(data.msgErro);
                    }
                });
            }
        );
        
    });

    $("#ddlPRODUTO").multiselect('uncheckAll');
    //--------------------------
    // FIM - Exceção - OS #14572 
    //-------------------------


});