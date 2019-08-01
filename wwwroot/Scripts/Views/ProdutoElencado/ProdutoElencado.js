$(document).ready(function () {


    $('#QTDRELACIONADOS').mask("?99999", { placeholder: "" });



    if (action != "Edit")
    {
        $("#CBOPRODUTO").chosen();
    }
    

    


    //$("#CX_EMBARQUE").mask("99999");
    $("#DESCONTOMAXIMO").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });

    $("select[name$='DIVISAO_ID']").on("change", function () {
        //Apagar items antigos do dropdown de SubCategoria
        var dropdownDivisao = $(this);
        var dropdownFamilia = $("#FAMILIA_ID");
        $("option", dropdownFamilia).each(function () {
            if ($(this).val() != "") $(this).remove();
        });
        //Carregar items novos
        var selectedValue = dropdownDivisao.val();
        if (selectedValue != "" && selectedValue > 0) {
            $.ajax({
                url: controller + "SubProdFill",
                type: "post",
                dataType: "json",
                data: { divisao_id: selectedValue },
                success: function (data) {
                    $(data.trd_divisao).each(function () {
                        var text = $(this).prop("Text");
                        var value = $(this).prop("Value");
                        dropdownFamilia.append("<option value='" + value + "'> " + text + "</option>");
                    });
                }
            });
        }
    });

    //SE FOR SELECIONADO TODOS OS PRODUTOS, DESMARCA OS, SELECIONADOS
    $(".CHKTODOSPROD").on("change", function () {
        if ($(this).is(":checked")) {
            $("input", $(".produtosassociados").dataTable().fnGetNodes()).attr("disabled", true);
            $("input", $(".produtosassociados").dataTable().fnGetNodes()).attr("checked", false);
            $('#hiddenProdutosassociados').val(''); //desmarca os itens selecionados
        }
        else {
            $("input", $(".produtosassociados").dataTable().fnGetNodes()).attr("disabled", false);
        }
    });
    

    //CLIQUE NO SALVAR
    $("#btnSalvar").on("click", function (event) {
        event.preventDefault();
        
        if ($("#CBOPRODUTO").val() == "") {
            alert("Selecione o produto elencado.");
            return false;
        }
        if ($("#DESCONTOMAXIMO").val() == "") {
            alert("Informe o desconto máximo.");
            return false;
        }
        else {
            var descontoValue = parseFloat($("#DESCONTOMAXIMO").val().replace(",", "."));
            if (descontoValue == 0) {
                alert("Informe o desconto máximo.");
                return false;
            }
        }

        if ($("#QTDRELACIONADOS").val() == "") {
            alert("Informe a quantidade de produtos relacionados.");
            return false;
        }
        else {
            if (parseFloat($("#QTDRELACIONADOS").val()) == 0) {
                alert("Informe a quantidade de produtos relacionados.");
                return false;
            }
        }
        


        if (!$(".CHKTODOSPROD").is(":checked")) {
            var rowsChecked = $(".checkProduto:checked", $(".produtosassociados").dataTable().fnGetNodes()).parent().parent();
            if (rowsChecked.length > 0) {

                //verifica se a quantidade de produtos relacionados é igual aos selecionados
                if (parseFloat($("#QTDRELACIONADOS").val()) != rowsChecked.length)
                {
                    alert("Quantidade de produtos relacionados informada diferente do número de produtos selecionados na lista.");
                    return false;
                }
                else{

                    var ssprod = "";
                    var ssvir = "";
                    $(rowsChecked).each(function () {
                        ssprod += ssvir + $(this).find(".checkProduto").val();
                        ssvir = ",";
                    }); 
                    //guarda os produtos selecionados na variavel hidden
                    $('#hiddenProdutosassociados').val(ssprod);
                }
            }
            else {
                alert("Marque a opção totos os produtos ou selecione pelo menos um produto na lista.");
                return false;
            }
        }
        
        if ($("#hdID_PRODELENCADO").val() != "") {
            //$(".blockade").show();
            $(".loading-save").show();
            
            $("form").submit(); //para funcionar no IE e no Chrome
        }else{
            //VALIDA SE JÁ EXISTE PRODUTO ELENCADO CADASTRADO COM ESTE VALOR DE DESCONTO MÁXIMO
            $.ajax({
                type: "POST",
                url: controller + "ValidarDESCONTOCADASTRADO",
                contentType: 'application/json',
                data: JSON.stringify({ CODPROD: $('#CBOPRODUTO').val().replace(/[^\w\s]/gi, ''), DESCONTOMAX: $("#DESCONTOMAXIMO").val()  }),
                async: true,
                success: function (data) {
                    //indica que pode cadastrar
                    if (data.ok == false) {
                        alert("Valor de desconto máximo já cadastrado para este produto!");
                        return false;
                    }
                    else {
                        //$(".blockade").show();
                        $(".loading-save").show();
                        $("form").submit(); //para funcionar no IE e no Chrome
                    }
                }
            });
        }

        return false;
    });





    $(document).on("click", ".deletarprodelencado", function () {
        var deactivateButton = $(this);
        var condicaoID = deactivateButton.attr("data-condicao");
        var tr = deactivateButton.parents("tr:first");

        alert("Deseja realmente inativar esse produto elencado?", "Inativar Produto elencado", null,
            function () {
                $(".loading-save").show();
                $.post(controller + "DeactivateJson", { id: condicaoID }, function (data) {
                    if (data) {

                        carregaListadeElencados("S");

                        alert("O produto elencado foi desativado com sucesso.");
                        //deactivateButton.remove();
                        //$(".condicao-status", tr).html("Inativo");
                        $(".loading-save").hide();
                        

                    }
                    else {
                        $(".loading-save").hide();
                        alert("Ocorreu um erro ao inativar o produto elencado. Por favor, tente novamente.");
                    }
                });
            }
        );
    });


    //$(".produtosassociados").dataTable({
    //    "bServerSide": false,
    //    "oLanguage":
    //        {
    //            sZeroRecords: "Não foram encontrados resultados",
    //            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
    //            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
    //            sInfoFiltered: "(Total de _MAX_ registros)"
    //        },
    //    "sPaginationType": "full_numbers"
    //});


    //aSorting: [1, "asc"],
    //sPaginationType: "full_numbers",
    //aoColumnDefs: [{ "bSearchable": false, "bSortable": true, "aTargets": ["dataTable-commands"] },
    //               { "bVisible": false, "aTargets": ["dataTable-hidden"] }],

    $(".produtosassociados").dataTable({
        sPaginationType: "full_numbers",
        aoColumnDefs: [{ "bVisible": false, "aTargets": ["dataTable-hidden"] }],
        oLanguage:
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)"
        },
        aaSorting: [[0, "desc"]],
    });



    //formata datatable Form.cshtml
    $(".produtosassociadosDetalhes").dataTable({
        aSorting: [1, "asc"],
        sPaginationType: "full_numbers",
        //aoColumnDefs: [{ "bSearchable": false, "bSortable": true, "aTargets": ["dataTable-commands"] },
        //               { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
        oLanguage:
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)"
        },
        aoColumns: [
              { "sWidth": "10%" },
              { "sWidth": "10%" },
              { "sWidth": "80%" },
        ]
    });



    carregaListadeElencados("N");
    
    






    $(document).on("click", ".btn-salvarordem", function () {

        
        var prodelencado = [];
        $(".rm-column-itemListaUm").each( function(){
            //alert ($(this).data("value"));
            //alert('aaaa');
            prodelencado.push($(this).data("value"));
        });

        var sendData;
        
        
        if ($("#listProdutoelencadoLista").length) {

            var prodelencadolista = [];
            $(".rm-column-itemListaDois").each(function () {
                //alert ($(this).data("value"));
                //alert('aaaa');
                prodelencadolista.push($(this).data("value"));
            });

            sendData = { Produtoelencado: prodelencado, ProdutoelencadoLista: prodelencadolista };
        }
        else {
            sendData = { Produtoelencado: prodelencado, ProdutoelencadoLista: null };
        }

        //$(".blockade").show();
        $(".loading-save").show();
        $.post(controller + "SalvarOrdem", $.toDictionary(sendData), function (data) {
            if (data) {
                //alert("Registros Salvos com sucesso!");
                $("form").action = "OrdenaProdutoselencados";
                $("form").submit();

            }
            else {
                $(".loading-save").hide();
                alert("Ocorreu um erro ao salvar seus registros.");                
            }
            
        }, "json");
        
    });




});




function carregaListadeElencados(bdestroi) {


    if (bdestroi == "S") {
        $(".tableProdutosLista").dataTable({
            "bDestroy": true
        }).fnDestroy();
    }

    //formata datatable Index.cshtml
    //CARREGA A LISTA COM OS PRODUTOS ELENCADOS
    $(".tableProdutosLista").dataTable({
        "bServerSide": true,
        "bAutoWidth": true,
        "bSort": false,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "aoColumns": [
            { "mDataProp": "ORDEM_PRODUTO", "bSortable": false },
            { "mDataProp": "CODPROD", "bSortable": false },
            { "mDataProp": "EAN13", "bSortable": false },
            { "mDataProp": "DESCRICAO", "bSortable": false },
            { "mDataProp": "ORDEM_REGRA", "bSortable": false },
            { "mDataProp": "DESCONTO_MAXIMO", "bSortable": false },
            { "mDataProp": "QTD_RELACIONADOS", "bSortable": false },
            { "mDataProp": "DT_ATIVACAO", "bSortable": false },
            { "mDataProp": "DT_INATIVACAO", "bSortable": false },
            { "mDataProp": "STATUS", "bSortable": false },
            {
                "mDataProp": "ACAO",
                "bSearchable": false,
                "bSortable": false,
                "fnRender": function (oObj) {
                    var linkEdicao = '<a href="' + controller + 'Edit/' + oObj.aData.ID_PROD_ELENCADO + '" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';
                    var result = '<ul class="icons_16 clearfix2">';

                    //DETALHES
                    result += '<li><a href="' + controller + 'Detalhes/' + oObj.aData.ID_PROD_ELENCADO + '" class="mws-ic-16 ic-page-white-text li_icon detalheprodelencado"  id="' + oObj.aData.ID_PROD_ELENCADO + '" data-condicao="' + oObj.aData.ID_PROD_ELENCADO + '" title="Detalhe produto elencado"></a></li>';


                    if ($("#hiddenEditPermission").val() == "True") {
                        result += "<li>" + linkEdicao + "</li>";
                        //INATIVAR
                        if (oObj.aData.DT_INATIVACAO == "") {
                            //botão de inativar produto elencado
                            result += '<li><a class="mws-ic-16 ic-cross li_icon deletarprodelencado"  id="' + oObj.aData.ID_PROD_ELENCADO + '" data-condicao="' + oObj.aData.ID_PROD_ELENCADO + '" title="Inativar produto elencado"></a></li>';
                        }
                    }
                    result += "</ul>";
                    return result;
                }
            }
        ],
        "oLanguage":
            {
                sZeroRecords: "Não foram encontrados resultados",
                sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                sInfoFiltered: "(Total de _MAX_ registros)"
            },
        "sPaginationType": "full_numbers"
    });


}

function carregaLista2(item) {

    //$(".blockade").show();
    $(".loading-save").show();

    //alert(item);
    var prodrelac_container = $("div.prodrelacionados");
    prodrelac_container.html("");

    $('#prodsel').val(item);

    $.post(controller + "GetProdElencadoLista", { codprod: item }, function (data) {
        //alert(data);
        prodrelac_container.html(data);

        //$(".blockade").hide();
        $(".loading-save").hide();
        
        

    }, "html");


}


////COPIADO DO DESCONTO MAXIMO
//var checkproduct = function (element, checked) {
//    if (checked)
//        $(".tableError").hide();

//    var index = $(element).data('index');

//    //$(".CHAVE", $(element).parents("tr:first")).val(checked ? $(element).val() : 0);
//    if (checked) {
//        //verifica se o objeto existe
//        if (!$("#CHAVE" + index).length) {
//            //se não existir cria
//            $("#hiddenaux").append('<input type="hidden" name = "CHAVE" id = "CHAVE' + index + '" class="check" value="' + $(element).val() + '\">');
//        }
//    }
//    else {
//        //remove o hidden referente ao chk desmarcado
//        $("#CHAVE" + index).remove();
//    }
//};

