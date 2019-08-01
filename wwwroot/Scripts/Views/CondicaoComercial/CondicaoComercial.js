var multiselectCondicao = null;
var currentAjaxSearchRequest = null;
$(document).ready(function () {

    $("#CNPJ_OL").multiselect().multiselectfilter();

    $("#Text").multiselect().multiselectfilter();

    var currentAjaxRequest = null;
    var currentAjaxRequestCheckAll = null;
    multiselectCondicao = $.rmMultiselect(".multiselectPDV", { labelActive: 'PDVs Disponíveis', labelDeactive: 'PDVs Selecionados' });

    if ($("#Finalizada").val() == "True") {
        $(".checkAll").attr("disabled", "disabled");
    }

    $(document).on("click", ".btn-finalizarCondicao", function () {
        var button = $(this);

        FinalizarCondicao($("#CondicaoID").val(), function () {
            $(".descontoDiv").remove();
            $(".check").remove();
            $(".checkAll").remove();
            button.remove();
        });
    });

    $(document).on("click", ".finalizarCondicao", function () {
        var button = $(this);
        var ul = button.parents("ul:first");
        var tr = button.parents("tr:first");
        var condicaoID = $(this).attr("data-condicao");

        FinalizarCondicao(condicaoID, function (data) {
            var status = "<span style='color: green; font-weight: bold'>Sim</span>";
            $(".editar-action,.aplicar-action").remove();
            var buttonsAdd =
                '<form action="/CondicaoComercial/DuplicarCondicao?condicaoID=' + condicaoID + '" class="duplicarForm clearfix2" method="post"> ' +
                    '<ul class="icons_16 clearfix2">' +
                        '<li>' +
                            '<a class="mws-ic-16 ic-application-double li_icon duplicar" data-condicao="' + condicaoID + '"  title="Duplicar Condição" ></a>' +
                        '</li>' +
                    '</ul>' +
                '</form>' +
                '<ul class="icons_16 clearfix2">' +
                    '<li>' +
                        '<a class="mws-ic-16 ic-cross li_icon deletarCondicao"  data-condicao="' + condicaoID + '" title="Inativar Condição"></a>' +
                    '</li>' +
                '</ul>';

            $(".details-action", tr).after(buttonsAdd);
            $(".condicao-status", tr).html("Ativo");
            if (data.cargoAprovador != "") {
                $(".cargo-aprov", tr).html(data.cargoAprovador);
            }
            $(".CNPJpendente", tr).html($(".CNPJaberto", tr).html());
            $(".CNPJaberto", tr).html("0");
            ul.after(status);
            ul.remove();
        })

    });

    $(document).on("click", ".duplicar", function () {
        var tr = $(this).parents("tr:first");
        var condicaoID = $(this).attr("data-condicao");
        alert("Deseja realmente duplicar esta condição? Será criada uma nova condição copia desta.", "Duplicar Condição Comercial", null,
            function () {
                $(".loading-save").show();
                $(".duplicarForm", tr).submit();
            }
        );
    });

    //Só pode excluir Condições que estejam INATIVAS  que NÃO POSSUAM PEDIDOS NA pv046
    $(document).on("click", ".apagarCondicao", function () {
        var deactivateButton = $(this);
        var condicaoID = deactivateButton.attr("data-condicao");
        var tr = deactivateButton.parents("tr:first");

        alert("Deseja realmente excluir essa condição? Uma vez excluída, ela não poderá ser recuperada.", "Excluir Condição Comercial", null,
            function () {
                $.post(controller + "ExcluirJson", { id: condicaoID }, function (data) {
                    if (data.ok) {
                        alert("A condição comercial foi excluída com sucesso.");
                        tr.remove();
                    }
                    else {
                        //alert("Ocorreu um erro ao inativar a condição comercial. Por favor, tente novamente.");
                        alert(data.msgErro);
                    }
                });
            }
        );
    });

    $(document).on("click", ".deletarCondicao", function () {
        var deactivateButton = $(this);
        var condicaoID = deactivateButton.attr("data-condicao");
        var tr = deactivateButton.parents("tr:first");

        alert("Deseja realmente inativar essa condição? Uma vez inativada, ela não poderá ser reativada.", "Inativar Condição Comercial", null,
            function () {
                $.post(controller + "DeactivateJson", { id: condicaoID }, function (data) {
                    if (data) {
                        alert("A condição comercial foi desativada com sucesso.");
                        deactivateButton.remove();
                        $(".condicao-status", tr).html("Inativo");
                    }
                    else {
                        alert("Ocorreu um erro ao inativar a condição comercial. Por favor, tente novamente.");
                    }
                });
            }
        );
    });

    $(document).on("click", ".aplicarCNPJ", function () {

        var dropdownCNPJ = $(".multiselectPDV");
        var sendData = {};
        sendData.condicaoID = $("#id").val();
        sendData.PDV = dropdownCNPJ.val();


        $(".loading-save").show();
        $.post(controller + "AplicarFiltrosCNPJ", $.toDictionary(sendData), function (data) {
            if (data.errorMessage != "") {
                $(".loading-save").hide();
                alert(data.errorMessage);
            } else {
                var mensagem = "";

                if (data.cnpjsRetorno.length > 0) {
                    mensagem = " Porém alguns CNPJs não puderam ser dessaciados por já terem passado por prévia aprovação.";

                    $(data.cnpjsRetorno).each(function () {
                        $("option[value='" + this + "']", dropdownCNPJ).attr("selected", "selected");
                    });
                    reloadMultiselectCondicao();
                }
                $(".loading-save").hide();
                alert("PDVs Associados com sucesso!" + mensagem);
            }

        });

    });

    $(document).on("click", ".RemoverProdCondicao", function () {
      var errorDiv = $(".errorMessage");
      errorDiv.removeClass("success").removeClass("error").hide();
      $.post(controller + "RemoverProdCondicao", $("#condicaoAplicarForm").serialize(), function (data) {

        if (data.errorMessage != "") {
          errorDiv.html(data.errorMessage).addClass("error");
        }
        else {
          $(".produtosAplicar").dataTable().fnDraw(false);
          errorDiv.html("Produto(s) removido(s) com sucesso").addClass("success");
        }

        $("#DescontoCondicao").val("0");
        errorDiv.show();

      });
    });

    $(document).on("click", ".aplicarCondicao", function () {

        if ($('#SomarPercentual').val() != 0 && $('#DescontoCondicao').val() != 0)
        {
            alert("Não é permitido preencher desconto da condição e percentual para somar na mesma operação");
            return false;
        }
        if ($('#flgdescontocliente').val().toUpperCase() != "TRUE" && $("#DescontoCondicao").val() == 0) {
            alert("Desconto não pode ser 0!")
            return false;
        }
        else {
            var errorDiv = $(".errorMessage");
            errorDiv.removeClass("success").removeClass("error").hide();
            $.post(controller + "AplicarCondicao", $("#condicaoAplicarForm").serialize(), function (data) {

            if (data.errorMessage != "") {
                errorDiv.html(data.errorMessage).addClass("error");
            }
            else {
                $(".produtosAplicar").dataTable().fnDraw(false);
                errorDiv.html("Condição aplicada com sucesso").addClass("success");
            }

            $("#DescontoCondicao").val("0");
            errorDiv.show();
        });
      }
    });

    $(document).on("click", ".aplicarCondicaoSoma", function () {

        if ($('#SomarPercentual').val() != 0 && $('#DescontoCondicao').val() != 0) {
            alert("Não é permitido preencher desconto da condição e percentual para somar na mesma operação");
            return false;
        }
        if ($('#flgdescontocliente').val().toUpperCase() != "TRUE" && $("#SomarPercentual").val() == 0) {
            alert("Percentual não pode ser 0!")
            return false;
        }
        else {
            var errorDiv = $(".errorMessage");
            errorDiv.removeClass("success").removeClass("error").hide();
            $.post(controller + "AplicarCondicao", $("#condicaoAplicarForm").serialize(), function (data) {

                if (data.errorMessage != "") {
                    errorDiv.html(data.errorMessage).addClass("error");
                }
                else {
                    $(".produtosAplicar").dataTable().fnDraw(false);
                    errorDiv.html("Condição aplicada com sucesso").addClass("success");
                }

                $("#SomarPercentual").val("0");
                errorDiv.show();
            });
        }
    });

    $(".percentual").maskMoney({ showSymbol: false, decimal: ",", thousands: "", allowZero: true });

    $(".dropdowncondicao").live("change", function () {
        var value = $(this).val();
        $("#DTINI").val("");
        $("#DTFIN").val("");
        if (value != "") {
            if (currentAjaxRequest != null) currentAjaxRequest.abort();

            currentAjaxRequest = $.post(controller + "GetCondicao", { pCondcom: value }, function (data) {
                $("#DTINI").val(data.dtinicial);
                $("#DTFIN").val(data.dtfinal);
            });
        }
    });

    $('#UF').change(function () {
        getCidades($('#CIDADE'), $(this).val());
    });

    $(document).on("click", "#PESQUISAR", function () {
        if (currentAjaxSearchRequest != null) currentAjaxSearchRequest.abort();
        $(".div-loading").show();
        getCNPJ();

    });

    $(document).on("click", ".check", function () {
        $.post(controller + "CheckProduto", { check: $(this).is(":checked"), produtoID: $(this).val() });
    });

    $(document).on("click", ".checkAll", function () {
        var checked = $(this).is(":checked");

        var rows = $(".produtosAplicar").dataTable().fnGetNodes();


        $('input', rows).attr('checked', checked);



        if (currentAjaxRequestCheckAll != null) currentAjaxRequestCheckAll.abort();
        currentAjaxRequestCheckAll = $.post(controller + "CheckAll", { check: checked });


    });

    //$(".filterTable").on("change", function () {
    //    if ($(this).hasClass("dropdownDivisao")) {
    //        $(".dropdownFamilia").val("");
    //        $(".dropdownFamilia option[value != '']").remove();

    //        $.post(controller + "GetFamilias", { divisaoID: $(this).val() }, function (data) {
    //            $(data).each(function () {
    //                var text = $(this).prop("Text");
    //                var value = $(this).prop("Value");
    //                $(".dropdownFamilia").append("<option value='" + value + "' >" + text + "</option>");
    //            });
    //        });
    //    }
    //    $(".produtosAplicar").dataTable().fnDraw(false);

    //});

    $(".produtosAplicar").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "condicaoID", "value": $("#CondicaoID").val() });
            aoData.push({ "name": "canalID", "value": $("#CanalID").val() });
            //aoData.push({ "name": "divisaoID", "value": $("#DivisaoID").val() });
            aoData.push({ "name": "familiaID", "value": $("#FamiliaID").val() });
            aoData.push({ "name": "grupoID", "value": $("#GrupoID").val() });
            aoData.push({ "name": "linhaID", "value": $("#PK_CODLINHA").val() });
            aoData.push({ "name": "onlyAssociate", "value": $("#OnlyAssociate").is(":checked") });

        },
        "bProcessing": true,
        "aoColumns": [
                        {
                            "mDataProp": null,
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (data, type, row, meta) {
                                var result = "";

                                if (!data.aData.FLG_CADASTRO_COMPLETO) {
                                    result = '<input type="checkbox" ' + (data.aData.CHECKED ? 'checked="checked"' : '') + ' class="check" ' + (data.aData.DISABLED ? 'disabled="disabled"' : '') + 'value="' + data.aData.ID + '" \">';
                                }
                                return result;
                            }
                        },
                        {
                            "mDataProp": "CODPROD"
                        },
                        {
                            "mDataProp": "DESCRICAO"
                        },

                        //alçada para condição criara pelo rep (manter comentado caso volte)
                        //{
                        //    "mDataProp": "DESC_MAX_ALCADA",
                        //    "bSearchable": false,
                        //    "bSortable": false

                        //},
                        {
                            "mDataProp": null,
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (data, type, row, meta) {
                                var result = "";
                                var CondicoesExistentes = data.aData.CONDICOES_EXISTENTES;
                                if (CondicoesExistentes.length > 0) {
                                    $(CondicoesExistentes).each(function () {
                                        result = this.Desconto ;
                                    });
                                }
                                else {
                                    result = "";
                                }
                                return result;
                            }

                        },
                        {
                            "mDataProp": null,
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (data, type, row, meta) {
                                var result = "";
                                var CondicoesExistentes = data.aData.CONDICOES_EXISTENTES;
                                if (CondicoesExistentes.length > 0) {
                                    $(CondicoesExistentes).each(function () {
                                        result = this.DescontoMaximo ;
                                    });
                                }
                                else {
                                    result = "";
                                }
                                return result;
                            }

                        },
                        {
                            "mDataProp": "DESC_MAX_POLITICA",
                            "bSearchable": false,
                            "bSortable": false
                        },

        ],
        "fnDrawCallback": function () {
            isCheckAll();
        },
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

    $(".resultTable").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableVisaoPDVProduto",
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "canalID", "value": $("#CANAL").val() });
            aoData.push({ "name": "condicaoID", "value": $("#CONDICAO").val() });
            aoData.push({ "name": "produtoID", "value": $("#PRODUTO_ID").val() });
            aoData.push({ "name": "cnpj", "value": $("input[name='PDV']").val() });
            aoData.push({ "name": "razaosocial", "value": $("input[name='PDV_INPUT']").val() });
            aoData.push({ "name": "dataInicial", "value": $("#DTINI").val() });
            aoData.push({ "name": "dataFinal", "value": $("#DTFIN").val() });

        },
        "bProcessing": true,
        "aoColumns": [
                        {
                            "mDataProp": "ID",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                return '<input type="checkbox" ' + (oObj.aData.CHECKED ? 'checked="checked"' : '') + ' class="check" value="' + oObj.aData.ID + '" \">';
                            }
                        },
                        { "mDataProp": "DESCRICAO" },
                        {
                            "mDataProp": "CONDICOES_EXISTENTES",
                            "bSearchable": false,
                            "bSortable": false,
                            "fnRender": function (oObj) {
                                var result = "";
                                var CondicoesExistentes = oObj.aData.CONDICOES_EXISTENTES;
                                if (CondicoesExistentes.length > 0) {
                                    result = "<table>" +
                                        "  <thead>" +
                                        "      <tr>" +
                                        "          <th>" +
                                        "              Condição" +
                                        "          </th>" +
                                        "          <th>" +
                                        "              Desconto" +
                                        "          </th>" +
                                        "          <th>" +
                                        "              Data Inicial" +
                                        "          </th>" +
                                        "          <th>" +
                                        "              Data Final" +
                                        "          </th>" +
                                        "      </tr>" +
                                        "  </thead>" +
                                        "  <tbody> ";
                                    $(CondicoesExistentes).each(function () {
                                        result = result +
                                                "<tr><td>" +
                                                this.Descricao +
                                                "</td>" +
                                                "<td>" +
                                                this.Desconto +
                                                "</td>" +
                                                "<td>" +
                                                this.DataInicial +
                                                "</td>" +
                                                "<td>" +
                                                this.DataFinal +
                                                "</td></tr>";
                                    });
                                    result = result + "</tbody></table>";


                                }
                                else {
                                    result = "Não existe condição existente para este produto.";
                                }
                                return result;
                            }

                        }
        ],
        "fnDrawCallback": function () {
            isCheckAll();
        },
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

    $("#btnPesquisar").on("click", function () {
        
        if (currentAjaxSearchRequest != null) currentAjaxSearchRequest.abort();
        $(".div-loading").show();

        
        var model = {
            Distribuidor: $("#CNPJ_OL").val(),
            StatusCondicoes: $("#Text").val()
        }

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: controller + "Pesquisar",
            async: true,
            data: JSON.stringify(model),
            success: function (response) {
                $(".containerCondicao").text("");
                $(".containerCondicao").append(response);


                $(".tabelaIndex").dataTable({
                    aaSorting: [[8, "asc"], [7, "desc"], [0, "asc"]],
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
                $(".div-loading").hide();
            },
        });


    });

    $("#CNPJ_OL").multiselect('uncheckAll');
    
});

var isCheckAll = function () {
    var allRows = $(".produtosAplicar").dataTable().fnGetNodes();

    var checkedRows = $("input:checked", allRows);

    if (allRows.length == checkedRows.length) {
        $("#checkAllProduto").attr("checked", "checked");

    }
    else {
        $("#checkAllProduto").removeAttr("checked");
    }


};

var getCidades = function (obj, uf) {
    var firstOption = $("option[value='']", obj);

    $("option", obj).each(function () {
        if ($(this).val() != "") $(this).remove();
    });

    if (uf != "") {
        firstOption.text("<Todas>");

        $.ajax({
            url: controller + "GetCidades",
            type: "get",
            dataType: "json",
            data: { uf: uf },
            success: function (data) {
                $.each(data, function (index, item) {
                    obj.append("<option value='" + item.Value + "' >" + item.Text + "</option>");
                });
            }
        });
    }
    else {
        firstOption.text("Selecione um UF");

    }
};

var getCNPJ = function () {

    var filtros = {};
    var dropdown = $("#PDV");
    filtros.bandeira = $("#BANDEIRA").val();
    filtros.cidade = $("#CIDADE").val();
    filtros.uf = $("#UF").val();
    filtros.brick_id = $("input[name='BRICK']").val();
    filtros.brick_descricao = $("input[name='BRICK_INPUT']").val();
    filtros.id = $('#id').val();


    $("option:not(:selected)", dropdown).remove();



    currentAjaxSearchRequest = $.ajax({
        url: controller + "getCNPJ",
        type: "get",
        dataType: "json",

        data: filtros,
        success: function (data) {
            $(data).each(function () {
                if (dropdown.find('option[value="' + this.CNPJ + '"]').length == 0)
                    dropdown.append("<option value='" + this.CNPJ + "' >" + this.RAZAOSOCIAL + "</option>");
            });
            reloadMultiselectCondicao();
            $(".div-loading").hide();
        }
    });

};

var reloadMultiselectCondicao = function () {
    multiselectCondicao.trigger('loadValues');
};

var FinalizarCondicao = function (condicaoID, callback) {

  //Verifica se esta marcado o DESCONTO CLIENTE e tem algum DESCONTO CADASTRADO 
  $.post(controller + "VerificaFinalizarCondicao", { condicaoID: condicaoID }, function (data) {
    if (data.errorMessage != "") {
      $(".loading-save").hide();
      alert(data.errorMessage);
    }
    else {
      if (data.ok != "FALSE") {
        if (data.TIPODESCONTO == "CLIENTE") {
          alert("Ao finalizar esta condição comercial ela irá zerar todos os descontos cadastrados para os produtos associados a ela. " +
           "Deseja realmente finalizar a edição desta condição comercial?", "Finalizar Condição Comercial", null,
           function () {

             //alert("Deseja realmente finalizar esta condição. Após finalizada, ela não poderá ser mais editada", "Finalizar Condição Comercial", null,
             alert("Ao finalizar esta condição comercial ela se tornará ativa e qualquer outra condição comercial de mesmo nome será automaticamente desativada. " +
                 "Deseja realmente finalizar a edição desta condição comercial?", "Finalizar Condição Comercial", null,
                 function () {
                   $(".loading-save").show();
                   $.post(controller + "FinalizarCondicao", { condicaoID: condicaoID }, function (data) {
                     if (data.errorMessage != "") {
                       $(".loading-save").hide();
                       alert(data.errorMessage);
                     }
                     else {
                       $(".loading-save").hide();
                       alert("Cadastro da Condição Comercial finalizado com sucesso.", null, null, null, null, {
                         callBack: function () { location.reload(); }
                       });
                       callback(data);
                     }

                   });

                 });
           });
        }
        else {
          // se for o desconto do fornecedor, não pode salvar com desconto zerado
          alert("Condição não pode ser finalizada! Existe(m) desconto(s) zerados associados!")
          return false;
        }
      }
      else {
        //alert("Deseja realmente finalizar esta condição. Após finalizada, ela não poderá ser mais editada", "Finalizar Condição Comercial", null,
        alert("Ao finalizar esta condição comercial ela se tornará ativa e qualquer outra condição comercial de mesmo nome será automaticamente desativada. " +
            "Deseja realmente finalizar a edição desta condição comercial?", "Finalizar Condição Comercial", null,
            function () {
              $(".loading-save").show();
              $.post(controller + "FinalizarCondicao", { condicaoID: condicaoID }, function (data) {
                if (data.errorMessage != "") {
                  $(".loading-save").hide();
                  alert(data.errorMessage);
                }
                else {
                  $(".loading-save").hide();
                  alert("Cadastro da Condição Comercial finalizado com sucesso.", null, null, null, null, {
                    callBack: function () { location.reload(); }
                  });
                  callback(data);
                }

              });

            });
      }
    }
  });




};