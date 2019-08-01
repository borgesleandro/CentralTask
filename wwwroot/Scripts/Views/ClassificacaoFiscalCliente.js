$(document).ready(function () {

    $("#btnPesquisar").on("click", function() {

        if ($("#CNPJ").val() != "" || $("#RAZAOSOCIAL").val() != "") {

            $.get(controller + "List", null, function(response) {

                var razaosocial = $("#RAZAOSOCIAL").val();
                var cnpj = $("#CNPJ").val();

                $("#consulta").html(response);
                $("#ResultadoConsulta").dataTable({
                    "sPaginationType": "full_numbers",
                    "bAutoWidth": false,
                    "bProcessing": true,
                    "bServerSide": true,
                    "bSort": true,
                    "sAjaxSource": controller + "SetDataTable",
                    "fnServerData": function(sSource, aoData, fnCallback) {
                        aoData.push( // FILTROS  parametro
                        { "name": "pCnpj", "value": cnpj },
                        { "name": "pRazaoSocial", "value": razaosocial });
                        $.post(sSource, aoData, function(json) {
                            fnCallback(json);
                        });
                    },
                    //colunas do minha view de parametros PARA SEREM EXIBIDOS
                    "aoColumns": [
                        { "mDataProp": "pCnpj", "sWidth": "14%" },
                        { "mDataProp": "pRazaoSocial", "sWidth": "13%" },
                        { "mDataProp": "pEndereco", "sWidth": "25%" },
                        { "mDataProp": "pBairro", "sWidth": "4%" },
                        { "mDataProp": "pCidade", "sWidth": "5%" },
                        { "mDataProp": "pUF", "sWidth": "5%" },
                        { "mDataProp": "pClassificacaoFiscal", "sWidth": "5%" },
                        { "mDataProp": "ACAO",
                         "bSearchable": false,
                         "bSortable": false,
                          "fnRender": function (oObj) {
                              var linkEdicao = '<a href="' + controller + 'Edit/' + oObj.aData.pCnpj + '" class="mws-ic-16 ic-edit li_icon" title="Editar" title="Editar"></a>';
                            var result = '<ul class="icons_16 clearfix2">';
                              //  if ($("#hiddenEditPermission").val()) {
                                    result += "<li>" + linkEdicao + "</li>";
                              //  }
                                result += "</ul>";
                                return result;
                            }
                         }



                    ]
                });
            });


        } else {
            alert("CNPJ ou Razão Social  precisam ser preenchidos.");
        }

    });



   /* $(document).on("click", ".btn-salvar", function () {

      
        var data = {
            classifFiscal: $("#CLASSFISCAL").val(),
            cnpj: $("#CNPJSELECIONADO").val()
        };

        $.ajax({
            url: controller + "Salvar",
            data: JSON.stringify(data),
            contentType: 'application/json',
            type: 'POST',
            success: function (response) {
                if (response.ok) {
                    var strSucesso = "Registros salvos com sucesso.";
                    alert(strSucesso);
                } else {
                    alert(response.erros.join("<br />"));
                }
            }
        });
    });*/













});
        

