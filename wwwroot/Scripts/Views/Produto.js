$(document).ready(function () {
    
    $("#distribuidor").multiselect().multiselectfilter();
    $("#distribuidor").multiselect("disable");

    $("#valorDesconto").maskMoney({ showSymbol: false, decimal: ",", thousands: "", precisionBefore: 3, allowZero: true });
    $("#valorDesconto").attr("disabled", "disabled");

  //$("#CX_EMBARQUE").mask("99999");
    $("#CX_EMBARQUE").maskMoney({ showSymbol: false, decimal: "", thousands: "", allowZero: false  });

    $("#chkDescMax").live("click", function () {
        if ($("#chkDescMax").is(':checked')) {
          $("#distribuidor").multiselect("enable");
          $("#valorDesconto").removeAttr("disabled");
        }
        else {
          $("#distribuidor").multiselect("uncheckAll");
          $("#distribuidor").multiselect("disable");
          $("#valorDesconto").attr("disabled", "disabled");
          $("#valorDesconto").val('');
        }
      
    });
     



    $(".imagemProduto").live("click", function () {

        
        var id = $(this).attr("data-id");
        //alert('bbbb');
        $.post(controller + "GetImageModal", { seqprod: id }, function(data) {
            var buttonsModal = { };
            buttonsModal["Fechar"] = function() {
                $(this).dialog("destroy").remove();
            };

            $(data).dialog({
                resizable: false,
                draggable: false,
                //width: "500px",
                position: ['center', 100],
                modal: true,
                buttons: buttonsModal
            });
        });
    });
    
    $("select[name$='DIVISAO_ID']").on("change", function() {
        //Apagar items antigos do dropdown de SubCategoria
        var dropdownDivisao = $(this);
        var dropdownFamilia = $("#FAMILIA_ID");
              
        $("option", dropdownFamilia).each(function() {
            if ($(this).val() != "") $(this).remove();
        });
       
        //Carregar items novos
        var selectedValue = dropdownDivisao.val();
        if (selectedValue != "" && selectedValue > 0) 
        {
            $.ajax({
                url: controller + "SubProdFill",
                type: "post",
                dataType: "json",
                data: { divisao_id: selectedValue },
                success: function(data) {
                    $(data.trd_divisao).each(function() {
                        var text = $(this).prop("Text");
                        var value = $(this).prop("Value");
                        dropdownFamilia.append("<option value='" + value + "'> " + text + "</option>");
                    });
                }
            });
        }

    });

    
   


    $("select[name$='DIVISAO_ID']").on("change", function () {

      $("option", $("#distribuidor")).each(function () {
        if ($(this).val() != "") $(this).remove();
      });
      $("#distribuidor").multiselect("refresh");

      var selectedValue = $('#DIVISAO_ID').val();
      if (selectedValue != "") {
        //BUSCA DISTRIBUIDORES
        //#######################################################
        //$("#distribuidor").multiselect("enable");
        //$("#distribuidor").empty();
        $.ajax({
          type: "POST",
          url: controller + "ObterDistribuidores",
          contentType: 'application/json',
          data: JSON.stringify({ divisaoid: selectedValue }),
          success: function (data) {
              $.each(data, function () {
                var option = $('<option></option>');

                option.attr('value', this.cnpj);
                option.text(this.nome);

                $("#distribuidor").append(option);
              });

              $("#distribuidor").multiselect("refresh");

              if (!$("#chkDescMax").is(':checked')) {
                $("#distribuidor").multiselect("uncheckAll");
                $("#distribuidor").multiselect("disable");
              }
          }
        });
        //#######################################################
      }
    });

    $("select[name$='CODDIV']").on("change", function () {
        
        //Apagar items antigos do dropdown de linha
        var dropdownDivisao = $(this);
        var dropdownlLinha = $("#PKFK_CODLINHA");


        
        $("option", dropdownlLinha).each(function () {
            if ($(this).val() != "") $(this).remove();
        });

        
        //Carregar items novos
        var selectedValue = dropdownDivisao.val();
        if (selectedValue != "" ) {

            //BUSCA AS LINHAS
            $.ajax({
                type: "POST",
                url: controller + "ObterLinhas",
                contentType: 'application/json',
                data: JSON.stringify({ coddiv: selectedValue }),
                success: function (data) {

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        dropdownlLinha.append(option);
                    });

                }
            });
           
        }
    });

    $(".tableProdutos").dataTable({
        "bServerSide": true,
        "sAjaxSource": controller + "AjaxDataTableAplicar",
        "aoColumns": [
            { "mDataProp": "CODPROD" },
            { "mDataProp": "EAN13" },
            { "mDataProp": "DESCRICAO" },
            { "mDataProp": "DIVISAO" },
            //{ "mDataProp": "TIPO_LISTA" },
            //{ "mDataProp": "GRUPO_LISTA" },
            { "mDataProp": "PKFK_CODLINHA" },
            { "mDataProp": "CX_EMBARQUE" },
            { "mDataProp": "FLG_PMC_LIVRE" },
            { "mDataProp": "FLG_PERMITE_ALT_DESCONTO" },
            { "mDataProp": "STATUS" },
            { "mDataProp": "STATUS_PAI" },
            { "mDataProp": "SEQ_BALCAO" },
            {
                "mDataProp": "ACAO",
                "bSearchable": false,
                "bSortable": false,
                "fnRender": function(oObj) 
                {
                    var linkImagem = '<a data-id="'+ oObj.aData.CODPROD +'" class="mws-ic-16 ic-image-2 li_icon imagemProduto" title="Visualizar Imagem"></a>';
                    var linkEdicao = '<a href="'+ controller + 'Edit/' + oObj.aData.SEQPROD +'" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';
                    var linkDetalhe = '<a href="'+ controller + 'Details/' + oObj.aData.SEQPROD +'" class="mws-ic-16 ic-page-white-text li_icon" title="Detalhes"></a>';
                    var result = '<ul class="icons_16 clearfix2">';
                    
                    result += "<li>" + linkDetalhe + "</li>";
                    

                    if ($("#hiddenEditPermission").val() == "True") {
                        result += "<li>" + linkEdicao + "</li>";
                    }

                    if (oObj.aData.IMAGEM.length > 0) {
                        result += "<li>" + linkImagem + "</li>";                       
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



    $("#btnExportar").on("click", function () {
        ////Habilita imagem de LOAD
        $(".loading-save").show();

        $("#exportarLinkDiv").append("<a id='anchorLayout' href='Produto/ExportarExcelCriadoEmMemoria' class=''></a>");
        $("#anchorLayout").get(0).click();
        
        // o cookie é gravado na função que exporta o excel dentro da tela
        var interval =
            setInterval(function () {
                if ($.cookie('DownloadProdutos')) {
                    //setTimeout(function () {
                    $(".loading-save").hide();
                    //}, 1);
                    $.removeCookie('DownloadProdutos', { path: '/' });
                    clearInterval(interval);
                }
            }, 1000);
    });

});

function ValidaDescontoMaximo() {

    if (inputImage != null) {
        if (inputImage.files && inputImage.files[0]) {
            if ((inputImage.files[0].size / 1024).toFixed(2) > 3000) {
                alert('Imagem excedeu o tamanho de 3MB.');
                return false;
            }
        }
    }
    $(".criaproduto").submit();
    
}

