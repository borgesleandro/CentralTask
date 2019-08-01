$(document).ready(function () {

    

    $("#CNPJ_OL").chosen();
    $("#AREAATUACAO").multiselect().multiselectfilter();
    //$("#AREAATUACAO").chosen();
    $("#PRAZO").chosen();
    $("#CNPJDIST").mask("99.999.999/9999-99");
    $("#CNPJCLIENTE").mask("99.999.999/9999-99");
    //aplica mascara para aceitar apenas números
    $('#NumeroPedido').mask("?999999999999999999", { placeholder: "" });
    $("#ListaProdutos").multiselect().multiselectfilter();


    $("#cboDIVISOES_RECEBE_PRECO").multiselect().multiselectfilter();

    function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
      return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999")
      return false;

    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0, tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false;

    return true;
  }

    //CARREGA OS PRAZOS DO DISTRIBUIDOR SELECIONADO
    $(".CNPJ_OLindex").change(function () {
        if ($(".CNPJ_OLindex").val() == "" || $(".CNPJ_OLindex").val() == "null" || $(".CNPJ_OLindex").val() == null) {
            var option = $('<option></option>');
            option.attr('value', "");
            option.text("Selecione uma opção");

            $("#PRAZO").empty();
            $("#PRAZO").append(option);
            $("#PRAZO").trigger("liszt:updated");
        }
        else
        {
            $.ajax({
                type: "POST",
                url: controller + "ObterPrazos", //ObterEquipesPorCia
                contentType: 'application/json',
                data: JSON.stringify({ CNPJ: $('.CNPJ_OLindex').val() }),
                success: function (data) {
                    //$("#CNPJ_OL").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Selecione uma opção");

                    $("#PRAZO").empty();
                    $("#PRAZO").append(option);
                    $("#PRAZO").trigger("liszt:updated");

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.Value);
                        option.text(this.Text);

                        $("#PRAZO").append(option);
                    });
                    $("#PRAZO").trigger("liszt:updated");

                }
            });
        }
    });




    
    $(document).on("click", "#btnCONCLUIRHOMOLOGACAO", function () {
        if (!confirm("Confirma a conclusão da homologação?\nOs dados só podem ser copiados uma vez por distribuidor.")) {
            return false;
        }

        var ssmsg = "";
        if ($(".CNPJ_OLindex").val() == "" || $(".CNPJ_OLindex").val() == "null" || $(".CNPJ_OLindex").val() == null) {
            ssmsg += "Selecione o distribuidor.<br>\n";
        }

        if (ssmsg != "") {
            alert(ssmsg);
            return false;
        }


        //CHAMA A FUNÇÃO PARA REALIZAR A GRAVAÇÃO DOS PEDIDOS DE HOMOLOGAÇÃO
        //parametros para a validação das Farmácias e produtos
        var model = {
            CNPJ: $(".CNPJ_OLindex").val()
        };

        $(".loading-save").show();

        $.ajax({
            type: "POST",
            url: controller + "CONCLUIRHOMOLOGACAO",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {
                if (data.success == false) {
                    alert(data.message);
                    $(".loading-save").hide();
                }
                else {
                    alert(data.message);
                    $(".loading-save").hide();
                }
            },
            error: function (data) {
                alert("Houve um erro ao concluir a homologação para o distribuidor selecionado.")
                $(".loading-save").hide();
            }
        });



    });

    //BOTÃO PARA SALVAR OS PRODUTOS NOS PEDIDOS PADRÕES
    $(document).on("click" , "#btnALTERARPRODUTOS", function () {

        var ssmsg = "";
        if ($("#ListaProdutos").val() == "" || $("#ListaProdutos").val() == "null" || $("#ListaProdutos").val() == null) {
            ssmsg += "Informe pelo menos um produto.<br>\n";
        }
        else {
            if ($("#ListaProdutos").val().length > 5) {
                ssmsg += "Informe no máximo 5 produtos.<br>\n";
            }
        }
        if (ssmsg != "") {
            alert(ssmsg);
            return false;
        }

        

        //CHAMA A FUNÇÃO PARA REALIZAR A GRAVAÇÃO DOS PEDIDOS DE HOMOLOGAÇÃO
        //parametros para a validação das Farmácias e produtos
        var model = {
            Listaprodutos: $("#ListaProdutos").val()
        };

        $(".loading-save").show();

        $.ajax({
            type: "POST",
            url: controller + "ALTERARPRODUTOS",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {
                if (data.success == false) {
                    alert(data.message);
                    $(".loading-save").hide();
                }
                else {
                    $(".loading-save").hide();
                }
            },
            error: function (data) {
                alert("Houve um erro ao realizar a validação dos dados informados.")
                $(".loading-save").hide();
            }
        });
        

    });






    $("#Cliente").change(function () {

        var option = $('<option></option>');
        option.attr('value', "");
        option.text("Selecione uma opção");
        $("#CNPJ_OL").empty();
        $("#CNPJ_OL").append(option);
        $("#CNPJ_OL").trigger("liszt:updated");

        if ($('#Cliente').val() != "") {
                        
            $.ajax({
                type: "POST",
                url: controller + "ObterDistribuidoresCliente", //ObterEquipesPorCia
                contentType: 'application/json',
                data: JSON.stringify({ cliente: $('#Cliente').val() }),
                success: function (data) {
                    //$("#CNPJ_OL").empty();
                    
                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CNPJ_OL").append(option);
                    });
                    $("#CNPJ_OL").trigger("liszt:updated");
                }
            });
        }
    });


    

    //GERAR PEDIDOS
    $("#btnGerarPedidos").on("click", function () {
        //valida os dados da tela
        var ssmsg = "";
        if ($(".CNPJ_OLindex").val() == "" || $(".CNPJ_OLindex").val() == "null" || $(".CNPJ_OLindex").val() == null) {
            ssmsg += "Selecione o distribuidor.<br>\n";
        }

        if ($("#PRAZO").val() == "" || $("#PRAZO").val() == "null" || $("#PRAZO").val() == null) {
            ssmsg += "Selecione um prazo.<br>\n";
        }

        if ($("#CNPJCLIENTE").val() == "" || $("#CNPJCLIENTE").val() == "null" || $("#CNPJCLIENTE").val() == null) {
            ssmsg += "Informe o CNPJ do cliente.<br>\n";
        }
        else {
            var achoucnpjInvalido = false;
            if (!validarCNPJ($("#CNPJCLIENTE").val())) {
                ssmsg += "CNPJ cliente inválido.<br>\n";
            }
        }

        //if ($("#ListaProdutos").val() == "" || $("#ListaProdutos").val() == "null" || $("#ListaProdutos").val() == null) {
        //    ssmsg += "Informe pelo menos um produto.<br>\n";
        //}

        if ($("#ListEmails").val() == "" || $("#ListEmails").val() == "null" || $("#ListEmails").val() == null) {
            ssmsg += "Informar o e-mail.<br>\n";
        }

        if (ssmsg != "") {
            alert(ssmsg);
            return false;
        }

        //CHAMA A FUNÇÃO PARA REALIZAR A GRAVAÇÃO DOS PEDIDOS DE HOMOLOGAÇÃO
        //parametros para a validação das Farmácias e produtos
        var model = {
            validaFarmacia: 'FALSE',
            CNPJ: $("#CNPJCLIENTE").val().replace(/[^\d]+/g, ''),
            Listaprodutos: $("#ListaProdutos").val()
        };

        $(".loading-save").show();

        $.ajax({
            type: "POST",
            url: controller + "ValidaDadosInformados",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {
                if (data.success == false) {
                    alert(data.message);
                    $(".loading-save").hide();
                }
                else {

                    //alert('1');
                    //SE FOR OK, VAI CHAMAR A FUNÇÃO DE GRAVAÇÃO DO PEDIDO
                    var model = {
                        CnpjDist: $(".CNPJ_OLindex").val().replace(/[^\d]+/g, ''),
                        Nome: '',
                        NomeResumido: '',
                        Cidade: '',
                        AreaAtuacao: '',
                        Prazo: $("#PRAZO").val(),
                        CodigoPrazo: '',
                        CodigoCondicao: '',
                        CNPJFarmacia: $("#CNPJCLIENTE").val().replace(/[^\d]+/g, ''),
                        ListaProdutos: $("#ListaProdutos").val(),
                        ListaEmails: $("#ListEmails").val(),
                        Cliente: '',
                        Distribuidor: ''
                    };

                    //alert('2');

                    xhr = $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: controller + "CreatePedidos", //GERA OS PEDIDOS DE HOMOLOGAÇÃO PARA O DISTRIBUIDOR SELECIONADO
                        async: true,
                        data: JSON.stringify(model),
                        success: function (response) {

                            //alert('3');

                            if (response.success == false) {
                                alert(response.data);
                            }
                            else {
                                alert(response);
                            }
                            $(".loading-save").hide();
                        },
                        error: function (response) {
                            $(".loading-save").hide();
                        }
                    });
                    //alert('4');
                }
            },
            error: function (data) {
                alert("Houve um erro ao realizar a validação dos dados informados.")
                $(".loading-save").hide();
            }
        });
    });

    //DISTRIBUIDOR NOVO
    //SALVA OS DADOS INFORMADOS E GERA OS PEDIDOS 
    $("#btnSalvar").on("click", function () {

        
        //$("#exportarLinkDiv").html("");
        var ssmsg = "";
        if ($("#CNPJDIST").val() == "" || $("#CNPJDIST").val() == "null" || $("#CNPJDIST").val() == null) {
            ssmsg += "Informe o CNPJ do distribuidor.<br>\n";
        }
        else {
            if (!validarCNPJ($("#CNPJDIST").val())) {
                ssmsg += "CNPJ do distribuidor inválido.<br>\n";
            }
        }

        if ($("#NOME").val() == "" || $("#NOME").val() == "null" || $("#NOME").val() == null) {
            ssmsg += "Informe a razão social.<br>\n";
        }
        if ($("#NOME_RESUMIDO").val() == "" || $("#NOME_RESUMIDO").val() == "null" || $("#NOME_RESUMIDO").val() == null) {
            ssmsg += "Informe a razão social resumida.<br>\n";
        }
        if ($("#Cidade").val() == "" || $("#Cidade").val() == "null" || $("#Cidade").val() == null) {
            ssmsg += "Informe a cidade onde fica localizado o CD.<br>\n";
        }
        if ($("#AREAATUACAO").val() == "" || $("#AREAATUACAO").val() == "null" || $("#AREAATUACAO").val() == null) {
            ssmsg += "Selecione a área de atuação do distribuidor.<br>\n";
        }
        if ($("#PRAZO").val() == "" || $("#PRAZO").val() == "null" || $("#PRAZO").val() == null) {
            ssmsg += "Informe o prazo.<br>\n";
        }
        if ($("#ListEmails").val() == "" || $("#ListEmails").val() == "null" || $("#ListEmails").val() == null) {
            ssmsg += "Informar o email.<br>\n";
        }

        if ($("#CNPJCLIENTE").val() == "" || $("#CNPJCLIENTE").val() == "null" || $("#CNPJCLIENTE").val() == null) {
            ssmsg += "Informe o CNPJ do cliente.<br>\n";
        }
        else {
            var achoucnpjInvalido = false;
            if (!validarCNPJ($("#CNPJCLIENTE").val())) {
                ssmsg += "CNPJ do cliente inválido.<br>\n";
            }
        }

        if (ssmsg != "") {
            alert(ssmsg);
            return false;
        }

        if (($("#Cliente").val() != "" || $("#CNPJ_OL").val() != "") && ($("#Cliente").val() == "" || $("#CNPJ_OL").val() == "")) {
            alert("Informe o cliente e o distribuidor.");
            return false;
        }

        //parametros para a validação das Farmácias e produtos
        var model = {
            validaFarmacia: 'FALSE',
            CNPJs: '',
            Listaprodutos: $("#ListaProdutos").val(),
        };

        $(".loading-save").show();



        

        var ssAuxDivrecebPreco = $('#cboDIVISOES_RECEBE_PRECO').val();
        if (ssAuxDivrecebPreco == null)
        {
            ssAuxDivrecebPreco = "";
        }

        $.ajax({
            type: "POST",
            url: controller + "ValidaDadosInformados",
            contentType: "application/json",
            data: JSON.stringify(model),
            success: function (data) {

                if (data.success == false) {
                    alert(data.message);
                    $(".loading-save").hide();
                }
                else {

                    //SE FOR OK, VAI CHAMAR A FUNÇÃO DE GRAVAÇÃO DO PEDIDO
                    var model = {
                        CnpjDist: $("#CNPJDIST").val().replace(/[^\d]+/g, ''),
                        Nome: $("#NOME").val(),
                        NomeResumido: $("#NOME_RESUMIDO").val(),
                        Cidade: $("#Cidade").val(),
                        AreaAtuacao: $("#AREAATUACAO").val(),
                        Prazo: $("#PRAZO").val(),
                        CodigoPrazo: $("#CodigoPrazo").val(),
                        CNPJFarmacia: $("#CNPJCLIENTE").val().replace(/[^\d]+/g, ''),
                        ListaProdutos: $("#ListaProdutos").val(),
                        ListaEmails: $("#ListEmails").val(),
                        Cliente: $("#Cliente").val(),
                        Distribuidor: $("#CNPJ_OL").val().replace(/[^\d]+/g, ''),
                        cboDIVISOES_RECEBE_PRECOPost: ssAuxDivrecebPreco.toString()
                    };

                    
                    xhr = $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: controller + "Create",
                        async: true,
                        data: JSON.stringify(model),
                        success: function (response) {

                            if (response.success == false) {
                                alert(response.data);
                            }
                            else {
                                alert(response);
                            }
                            $(".loading-save").hide();
                        },
                        error: function (response) {
                            alert("Houve um erro ao salvar os dados informados.")
                            $(".loading-save").hide();
                        }
                    });
                }
            },
            error: function (data) {
                alert("Houve um erro ao realizar a validação dos dados informados.")
                $(".loading-save").hide();
            }
        });
    });
});




