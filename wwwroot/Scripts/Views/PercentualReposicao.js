$(document).ready(function () {
    $("select[multiple]").multiselect().multiselectfilter();
    $("#Equipes").multiselect("disable");
    $("#Produtos").multiselect("disable");
    $("select:not([multiple])").chosen();

    $('#Desconto').maskMoney({ showSymbol: false, decimal: ",", thousands: "" , allowZero:true});






    //function list(callBack) {
    //    $("#exportarLinkDiv").html("");

    //    $.get(controller + "List", null, function (response) {

    //        var cia = $("#Cia").val();
    //        var equipes = $("#Equipes").val();
    //        var distribuidores = $("#Distribuidores").val();
    //        var linhasDeProduto = $("#LinhasDeProduto").val();
    //        var produtos = $("#Produtos").val();
    //        var bandeira = $("#BandeiraID").val();


    //      //vERIFICAR COMO FAZER COM AJAX FORM E tirar bServerSide 
    //        $("#consulta").html(response);
    //        var table = $("#descontos").dataTable({
    //            "sPaginationType": "full_numbers",
    //            "bAutoWidth": false,
    //            "bProcessing": true,
    //            "bServerSide": true,
    //            "bSort": true,
    //            "sAjaxSource": controller + "SetDataTable",
    //            "fnServerData": function (sSource, aoData, fnCallback) {
    //                aoData.push(
    //                { "name": "Cia", "value": cia },
    //                { "name": "Equipes", "value": equipes },
    //                { "name": "Distribuidores", "value": distribuidores },
    //                { "name": "LinhasDeProduto", "value": linhasDeProduto },
    //                { "name": "Produtos", "value": produtos },
    //                { "name": "Bandeira", "value": bandeira });
    //                $.post(sSource, aoData, function (json) {
    //                    $.percentuais = json.ids;

    //                    if (callBack) {
    //                        callBack();
    //                    }

    //                    fnCallback(json);
    //                });
    //            },
    //            "fnDrawCallback": function () {
    //                //$('#descontos tbody td:nth-child(6)').editable(controller + 'UpdateRow', {
    //                //    "id": "id",
    //                //    "name": "desconto",
    //                //    "onsubmit": function (settings, element) {
    //                //        var value = $(element).find('input').val();
    //                //        alert("Confirma a alteração de desconto?", "Confirmação", null, function () {
    //                //            $.ajax({
    //                //                url: controller + 'UpdateRow',
    //                //                type: 'POST',
    //                //                data: { id: $(element).attr('id'), desconto: value },
    //                //                success: function (result) {
    //                //                    $(element).html(result);
    //                //                    table.fnDraw();
    //                //                }
    //                //            });
    //                //        });

    //                //        return false;
    //                //    }
    //                //});
    //            },
    //            "fnRowCallback": function (nRow, aData) {
    //                $('td:eq(4)', nRow).attr('id', aData.Id);
    //            },
    //            "aoColumns": [
    //                { "mDataProp": "Cia", "sWidth": "15%" },
    //                { "mDataProp": "Equipe", "sWidth": "15%" },
    //                { "mDataProp": "Distribuidor", "sWidth": "30%" },
    //                { "mDataProp": "Bandeira", "sWidth": "10%" },
    //                { "mDataProp": "Produto", "sWidth": "20%", },
    //                { "mDataProp": "Desconto", "sWidth": "10%", }
    //            ]
    //        });
    //    });
    //}






    $("#Cia").change(function () {
        if ($('#Cia').val() != "") {
            $.ajax({
                type: "POST",
                url: controller + "ObterEquipesPorCia",
                contentType: 'application/json',
                data: JSON.stringify({ cia: $('#Cia').val() }),
                success: function (data) {
                    $("#Equipes").multiselect("enable");
                    $("#Equipes").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#Equipes").append(option);
                    });

                    $("#Equipes").multiselect("refresh");
                }
            });
        }
        else {
            $("#Equipes").multiselect("uncheckAll");
            $("#Equipes").multiselect("disable");
        }
    });

    $("#LinhasDeProduto").change(function () {
        if ($('#LinhasDeProduto').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "ObterProdutosPorLinha",
                contentType: 'application/json',
                data: JSON.stringify({ linhas: $('#LinhasDeProduto').val() }),
                success: function (data) {
                    $("#Produtos").multiselect("enable");
                    $("#Produtos").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#Produtos").append(option);
                    });

                    $("#Produtos").multiselect("refresh");
                }
            });
        }
        else {
            $("#Produtos").multiselect("uncheckAll");
            $("#Produtos").multiselect("disable");
        }
    });







    $("#btnPesquisar").click(function () {


      ////Habilita imagem de LOAD
      $(".loading-save").show();



      var model = {
        cia: $("#Cia").val(),
        equipes : $("#Equipes").val(),
        distribuidores: $("#Distribuidores").val(),
        linhasDeProduto: $("#LinhasDeProduto").val(),
        produtos: $("#Produtos").val(),
        bandeira : $("#BandeiraID").val()
      };

      

      xhr = $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: "PercentualReposicao/List",
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


            $("#descontos").dataTable({
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








    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        if ($("#Cia").val() == "") {
            alert("É necessário selecionar a Companhia.");
            return;
        }

        $(".loading-save").show();

        var cia = $("#Cia").val();
        var equipes = $("#Equipes").val();
        var distribuidores = $("#Distribuidores").val();
        var linhasDeProduto = $("#LinhasDeProduto").val();
        var produtos = $("#Produtos").val();
        var bandeira = $("#Bandeiras").val();

        var model = { Cia: cia, Equipes: equipes, Distribuidores: distribuidores, LinhasDeProduto: linhasDeProduto, Produtos: produtos, Bandeira: bandeira }

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "PercentualReposicao/ExportarExcel",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='PercentualReposicao.xls' class=''><img src='Content/botao-salvar-download.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                $(".loading-save").hide();
            }
        });

    });




    $(".btn-salvar").click(function () {


        if ($("#Cia").val() == "") {
            alert("É necessário selecionar a Companhia.");
            return;
        }

        var ssequip = $("#Equipes").val();
        if (!ssequip ) {
            alert("É necessário selecionar a Equipe.");
            return;
        }

        var ssprod = $("#Produtos").val();
        if (!ssprod) {
            alert("É necessário selecionar o Produto.");
            return;
        }

        var ssdistribuidor = $("#Distribuidores").val();
        if (!ssdistribuidor) {
            alert("É necessário selecionar o Distribuidor.");
            return;
        }


        var ssbandeira = $("#BandeiraID").val();
        if (!ssbandeira) {
            alert("É necessário selecionar uma opção de Bandeira.");
            return;
        }

        if (($("#BandeiraID").val() == "[TODOS OS REGISTROS]") ||  ($("#BandeiraID").val() == "[TODAS AS BANDEIRAS]")) {
            alert("Não é possivel aplicar o desconto para a bandeira selecionada.");
            return false;
        }

        
        if ($("#Desconto").val()=="") {
            alert("É necessário informar um Desconto.");
            return;
        }


        alert("Deseja realmente aplicar o desconto para o filtro selecionado?", "Confirmação", null,
        function () {
                //list(function () {
                //$("#consulta").html("");
                //$.ajax({
                //    type: "POST",
                //    url: controller + "Save",
                //    contentType: 'application/json',
                //    data: JSON.stringify({
                //        ids: $.percentuais,
                //        param: {
                //            Cia: $("#Cia").val(),
                //            Equipes: $("#Equipes").val(),
                //            Distribuidores: $("#Distribuidores").val(),
                //            LinhasDeProduto: $("#LinhasDeProduto").val(),
                //            Produtos: $("#Produtos").val(),
                //            Bandeira: $("#BandeiraID").val(),
                //            Desconto: $("#Desconto").val()
                //        }
                //    }),
                //    success: function (response) {
                //        if (response.ok) {
                //            alert("Registros salvos com sucesso!");
                //            list();
                //        } else {
                //            alert("Ocorreu um erro ao tentar salvar os registros: " + response.message);
                //        }
                //    }
          //});

          $("#consulta").html("");

                $.ajax({
                  type: "POST",
                  url: controller + "Save",
                  contentType: 'application/json',
                  data: JSON.stringify({
                    ids: $.percentuais,
                    param: {
                      Cia: $("#Cia").val(),
                      Equipes: $("#Equipes").val(),
                      Distribuidores: $("#Distribuidores").val(),
                      LinhasDeProduto: $("#LinhasDeProduto").val(),
                      Produtos: $("#Produtos").val(),
                      Bandeira: $("#BandeiraID").val(),
                      Desconto: $("#Desconto").val()
                    }
                  }),
                  success: function (response) {
                    if (response.ok) {
                      $("#btnPesquisar").click();
                      alert("Registros salvos com sucesso!");
                      
                    } else {
                      alert("Ocorreu um erro ao tentar salvar os registros: " + response.message);
                    }
                  }
                });
            });
        });
    

});