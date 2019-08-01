function fnValor(v) {
    //v = v.replace(/[^\d+(\.\,\d+)]?/g, "") //Remove tudo o que não é decimal
    v = v.replace(/[^\,\d]|(,{2})|((^,).*)?/g, "") //Remove tudo o que não é decimal, deixa apenas caracter (,) e retira a primeira (,) da string se estiver na primeira posicao.
    return v
}
/*Função que Executa os objetos*/
function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}
function Mascara(o, f) {
  v_obj = o
  v_fun = f
  setTimeout("execmascara()", 1)
}




function ValidaEmail(desc_email) {    var msg = "";    if (desc_email.length > 0) {        if (desc_email.length > 255) {            return "E-mail excede o tamanho máximo de 255 caracteres";        }        else {            var pattern1 = new RegExp(/^[;]/i);
            if (pattern1.test(desc_email) == true) {                //return "Email não pode iniciar por ;";                msg = "Email não pode iniciar por ;";            }            var pattern2 = new RegExp("(;$)");
            //teste.replaceFirst("(,$)", ""))
            if (pattern2.test(desc_email) == true) {                //return "Email não pode terminar por ;";                msg += "Email não pode terminar por ;";            }                        if (msg != "") {                return msg;
            }            //var emails = desc_email.split(/;/);            var emails = desc_email.split(";");            var pattern = new RegExp(/^[+a-za-z0-9._-]+@[a-za-z0-9.-]+\.[a-za-z]{2,4}$/i);            for (var i = 0; i < emails.length; i++) {                if (emails[i].trim() != "") {                    if (pattern.test(emails[i].trim()) == false) {                        return "Email inválido";                    }                }                else {                    return "O caracter ';' não pode aparecer duas vezes seguidas!";
                }            }        }
    }
    return "";
    
}





$(document).ready(function () {

    //retira o disabled do cbo antes do submit
    $(".mws-form.formeditaredi").submit(function () {

        //Valida o email informado caso esteja preenchido        if ($('#EMAIL_SP').val().trim() != "") {            var ssmsg = ValidaEmail($('#EMAIL_SP').val().trim());            if (ssmsg != "") {                alert('Crítica para o(s) endereço(s) de email para onde devem ser enviadas as críticas! \n\n<br/> ' + ssmsg);                return false;            }        }
        if ($('#EMAIL_RESP_FTP_DIST').val().trim() != "") {            var ssmsg = ValidaEmail($('#EMAIL_RESP_FTP_DIST').val().trim());            if (ssmsg != "") {                alert('Crítica para o(s) endereço(s) de email para receber informação sobre problemas de conexão!  \n\n<br/> ' + ssmsg);                return false;            }        }


        if ($('#DIR_RAIZ_FTP').val().trim() == "") {
            alert('Selecione a pasta raiz');
            return false;
        }

        if ($("#MODELO_PASTA_ID").val().trim() == "") {
            alert('Selecione o modelo da pasta');
            return false;
        }


        $('#DIR_RAIZ_FTP').removeAttr('disabled');
        $('#MODELO_PASTA_ID').removeAttr('disabled');
    });

    $(".blockade").hide();

    $("#UF_FATURAMENTO").chosen();
    
    //$("#SFA_OperLogi_UF_FATURAMENTO").chosen();
    $("#areaDeAtuacao").multiselect().multiselectfilter();

    $("#cboDIVISOES_RECEBE_PRECO").multiselect().multiselectfilter();

    $("#GRUPOID").multiselect().multiselectfilter();
    


    if ($("#GrupoExecDist") != null && $("#GrupoExecDist") != undefined && $("#GrupoExecDist") != -1)
        $("#GrupoExec").val($("#GrupoExecDist").val());

    $("#STATUS").change(function () {
        if ($("#STATUS").attr("checked")) {
            $(".basicos").removeClass("required");
        }
        else {
            $(".basicos").addClass("required");
        }
    });


    //QUANDO SELECIONAR RADIO "MODELO DE FTP", recarrega o combo "Selecione o meodelo de pasta"
    //############################################
    $("input[name='ftp_unico_todos_clientes']").change(function () {
        //alert($('input:radio[name=ftp_unico_todos_clientes]:checked').val());

        var varftp = false;
        if ($('input:radio[name=ftp_unico_todos_clientes]:checked').val() == 1)
        {
            varftp =true;
        }

        $.ajax({
            type: "POST",
            url: controller + "ObterModelospasta",
            contentType: 'application/json',
            data: JSON.stringify({ ftpcompartilhado: varftp }),
            success: function (data) {
                $("#MODELO_PASTA_ID").empty();

                var option = $('<option></option>');
                option.attr('value', '');
                option.text('---');

                $("#MODELO_PASTA_ID").append(option);


                $.each(data, function () {
                    var option = $('<option></option>');
                    option.attr('value', this.MODELO_PASTA_ID);
                    option.text(this.DESCRICAO);

                    $("#MODELO_PASTA_ID").append(option);
                });
            }
        });
    });
    //############################################


    $("#TIPO_COMUNICACAO").change(function () {
        if ($("#TIPO_COMUNICACAO").attr("checked")) {
            $(".ftpdistribuidor").removeAttr("readonly");
            $(".ftpdistribuidor").css("background-color", "white");
        }
        else {
            $(".ftpdistribuidor").attr("readonly", "readonly");
            $(".ftpdistribuidor").css("background-color", "#f2f2f2");
        }
    });

    $("#rdbFLG_ENVIA_NFE_Nao").on('click', function () {
        $("#DT_INICIO_ENVIA_NFE").removeClass("required");
        $(".dtEvnioNFe").hide();
    });

    $("#rdbFLG_ENVIA_NFE_Sim").on('click', function () {
        $("#DT_INICIO_ENVIA_NFE").addClass("required");
        $(".dtEvnioNFe").show();
    });



    //NOVA PASTA 
    $("#btnNovaPasta").on("click", function (e) {

        $(".loading-save").show();
        
        var dadosmodal = "<form class='modalnovapasta'><div class='mws-form-row' style='margin-top:10px;margin-left:10px; margin-bottom:10px;'> <label>Nome da pasta</label><div class='mws-form-item small'><input type='text' class = 'mws-textinput txtnovapasta' maxlength = '20'> </input> </div></div></form>";

        $('.modalnovapasta').dialog("close").dialog("destroy").remove();

        var buttonsModal2 = [];
            //BOTOES
            buttonsModal2.push(
                //CRIA BOTÃO LOG
                {
                    text: "OK",
                    "class": "mws-button blue",
                    click: function () {
                        var sbachou = false;
                        jQuery($('#DIR_RAIZ_FTP')).find('option').each(function (opt) {
                            if ($(this).val().trim().toLowerCase() == $('.txtnovapasta').val().trim().toLowerCase())
                            {
                                sbachou = true;
                                $(this).attr('selected', true);
                            }
                            else{
                                $(this).attr('selected', false);
                            }
                        });
                        if (sbachou == false)
                            {
                                $('#DIR_RAIZ_FTP').append('<option selected="selected" value="' + $('.txtnovapasta').val() + '"> ' + $('.txtnovapasta').val() + ' </option>');
                                //$('#cboPastaRaiz').val($('.txtnovapasta').val());
                            }
                        $('.modalnovapasta').dialog("close").dialog("destroy").remove();
                    }
                }
               ,
                {
                    text: "Fechar",
                    "class": "mws-button gray",
                    click: function () {
                        //chama o fechar da própria janela modal2
                        $('.ui-dialog .ui-dialog-titlebar-close').click();
                    }
                }
            );

       $(dadosmodal).dialog({
                    resizable: false,
                    draggable: true,
                    title: "Criar nova pasta no FTP do Running",
                    width: "300px",
                    modal: true,
                    position: "top+20",
                    buttons: buttonsModal2,
                    open: function () {
                          
                        $(".loading-save").hide();

                        ////seta o top da página
                        $('body').scrollTop(0);

                        ////para a janela ficar a frente da outra
                        $('.ui-dialog').css('z-index', 103);
                        $('.ui-widget-overlay').css('z-index', 102);

                        $(".modalnovapasta").submit(function () {
                            return false;
                        });

                    }
       });
    });

    
    // ############################################################
    // JANELA MODAL  DEFINIR MODELO DE PASTA 
    // ############################################################
    $("#btndefinirmodelopasta").on("click", function () {


        if ($('#DIR_RAIZ_FTP').val().trim() == "") {
            alert('Selecione a pasta raiz');
            return false;
        }

        if ($("#MODELO_PASTA_ID").val().trim() == "") {
            alert('Selecione o modelo da pasta');
        }
        else {
            
            $(".loading-save").show();

            currentAjaxRequest2 = $.post(controller + "getTelaModeloPasta", {
                OPERLOG: $("#OPERLOG").val(), modeloselecionado: $("#MODELO_PASTA_ID").val(), dirraiz: $("#DIR_RAIZ_FTP").val(), flgPASTAPACAODOCOMPARTILHADA: $("#FLG_PASTA_PEDIDO_COMPARTILHADA").val()
            }, function (data2) {

                //////apaga a janela modal ( a classe modalmodelopasta só existe dentro da janela modal)
                $('.modalmodelopasta').dialog("close").dialog("destroy").remove();

                var buttonsModal2 = [];
                //BOTOES
                buttonsModal2.push(
                    //CRIA BOTÃO LOG
                    {
                        text: "OK",
                        "class": "mws-button blue",
                        click: function () {
                            $('.ui-widget-overlay').css('z-index', 999);
                            CarregaCamposCaminhoArquivos();
                        }
                    }
                   ,
                    {
                        text: "Fechar",
                        "class": "mws-button gray",
                        click: function () {
                            //chama o fechar da própria janela modal2
                            $('.ui-dialog .ui-dialog-titlebar-close').click();
                        }
                    }
                );

                $(".loading-save").hide();
                $(data2).dialog({
                    resizable: false,
                    draggable: true,
                    title: ($("#DIR_ENVIO_SP").val().trim()!="" ? "Alteração do " : "Novo") + " modelo de pasta - " + $("#MODELO_PASTA_ID option:selected").html() + "\xa0\xa0\xa0\xa0\xa0\xa0", //"\xa0" = adiciona espações para o botão fexhar não passar por cima da string 
                    //hide: 'blind',
                    //width: 'auto',
                    minWidth: 860,
                    height: 'auto',
                    modal: true,
                    //stack: false,
                    //position: "right-100 top+40",
                    position: "top+30",
                    //stack: false,
                    buttons: buttonsModal2,
                    //maxHeight: 600,
                    create: function (event, ui) {
                        $(this).css("minWidth", "660px");
                    },
                    open: function () {


                        registraEventosjanelamodalDefinirModeloDados();
                        
                        //para a janela ficar a frente da outra
                        $('.ui-dialog').css('z-index', 103);
                        $('.ui-widget-overlay').css('z-index', 102);

                        ////seta o top da página
                        //$('body').scrollTop(0);

                        $("#tbmodelopasta").dataTable({
                            sPaginationType: "full_numbers",
                            "bPaginate": true,
                            "bAutoWidth": false,
                            "bProcessing": false,
                            "bServerSide": false,
                            "bDestroy": true,
                            oLanguage:
                            {
                                sZeroRecords: "Não foram encontrados resultados",
                                sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                                sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                                sInfoFiltered: "(Total de _MAX_ registros)"
                            }
                        });
                    }
                });
            });
        }
    });
    



    function registraEventosjanelamodalDefinirModeloDados() {

        //#######################################
        //          JANELA MODAL
        //#######################################


        //          RADIO BUTTON JANELA MODAL
        //#######################################
        $("input[name='flgcriarnovapasta']").change(function () {


            if ($('input:radio[name=flgcriarnovapasta]:checked').val() == 1) {
                $("#txtnovapastaabaixoraiz").removeAttr("disabled");
                $("#cboPastasexistentes").val("");
                $("#cboPastasexistentes").attr("disabled", "disabled");
            }
            else {
                $("#txtnovapastaabaixoraiz").val("");
                $("#txtnovapastaabaixoraiz").attr("disabled", "disabled");
                $("#cboPastasexistentes").removeAttr("disabled");
            }
        });


        // CLIQUE BOTÃO DE DEFINIR LISTA DE PASTAS DA JANELA MODAL
        //#######################################
        //DEFINIR MODELO DE PASTA 
        $("#btncarregargrdmodelo").on("click", function () {

            var isChecked = jQuery("input:radio[name=flgcriarnovapasta]:checked").val();
            if (!isChecked) {
                alert('Indique se Creia nova pasta abaixo da raiz ou utiliza pasta existente.');
                return false;
            }
            else {
                if ($('input:radio[name=flgcriarnovapasta]:checked').val() == 0) {
                    if ($("#cboPastasexistentes").val().trim() == "") {
                        alert("Selecione a pasta existente a ser utilizada.");
                        return false;
                    }
                }
            }

            var isChecked = jQuery("input:radio[name=flgPASTAPEDIDOCOMPARTILHADA]:checked").val();
            if (!isChecked) {
                alert('Indique se é Estrutura completa para o CD ou  Pasta "PEDIDO" compartilhada.');
                return false;
            }

            carregaCaminhosmodeloFTPCompartilhado();

        });

        //#######################################
        //          JANELA MODAL
        //#######################################


        //FUNÇÃO PARA CARREGAR A LISTA COM OS CAMINHOS A SEREM SELECIONADOS PELO USUÁRIO
        function carregaCaminhosmodeloFTPCompartilhado() {
            //alert('aaa');

            //$(".tbmodelopasta").dataTable().destroy();
            //$(".tbmodelopasta").dataTable().fnDestroy();
            //$(".tbmodelopasta").dataTable().bDestroy();

            $(".tbmodelopasta").dataTable({
                "bDestroy": true
            }).fnDestroy();

            var dirsubpasta = "";
            if ($('input:radio[name=flgcriarnovapasta]:checked').val() == 1) 
                {
                    dirsubpasta = $("#txtnovapastaabaixoraiz").val();
                }
            else{
                dirsubpasta = $("#cboPastasexistentes").val();
            }
             
            $(".tbmodelopasta").dataTable({
                "aaSorting": [[0, "desc"]],
                "sPaginationType": "full_numbers",
                "bPaginate": true,
                "bAutoWidth": false ,
                "bProcessing": true ,
                "bServerSide": false,
                "bDestroy": true,
                "sAjaxSource": controller + "SetDataTablemodelopastas",
                "sScrollX": "100%",
                "fnServerParams": function (aoData) {
                    //PARAMETROS passados para a controler
                    //string OPERLOG, int modeloselecionado, string dirraiz , string dirsubpasta
                    //aoData.push({ "name": "FLG_TIPO_PEDIDO", "value": $('input:radio[name=FLG_TIPO_PEDIDO]')[0].checked });
                    aoData.push({ "name":"OPERLOG" , "value": $("#OPERLOG").val()});
                    aoData.push({ "name":"modeloselecionado" , "value": $("#MODELO_PASTA_ID").val()});
                    aoData.push({ "name":"dirraiz" , "value": $("#DIR_RAIZ_FTP").val()});
                    aoData.push({ "name": "dirsubpasta", "value": dirsubpasta });
                    aoData.push({ "name": "flgPASTAPEDIDOCOMPARTILHADA", "value": $('input:radio[name=flgPASTAPEDIDOCOMPARTILHADA]:checked').val() });
                },
                "aoColumns": [
                                {
                                    "mDataProp": "selecionado",
                                    "fnRender": function (oObj) {
                                        var result = '<input type="checkbox" class="check" ' + (oObj.aData.selecionado != null && oObj.aData.selecionado ? 'checked="checked"' : '') + ' value="' + oObj.aData.caminho + '"'  + (oObj.aData.bloqueada != null && oObj.aData.bloqueada == 1 ? 'Disabled="true"' : '') + '/>';
                                        result += '<input type="hidden" class="bloqueada" value="' + oObj.aData.bloqueada  + '" />';
                                        return result;
                                    }
                                },
                                {
                                    "mDataProp": "caminho",
                                    "fnRender": function (oObj) {
                                        return '<input type="hidden" class="pasta" value="' + oObj.aData.pasta + '"/><label class="caminhoNome">' + oObj.aData.caminho + '</label> ';
                                    }
                                }
                ],
                "fnDrawCallback": function () {

                },
                "oLanguage":
                {
                    sZeroRecords: "Não foram encontrados resultados",
                    sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                    sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                    sInfoFiltered: "(Total de _MAX_ registros)"
                }
            });
        }
    }

    

    //depois de clicar no botão OK da janela modal
    //Carrega os campos de caminho dos arquivos da tela com os caminhos do modal "Definir modelo de pasta
    function CarregaCamposCaminhoArquivos() {
        //chama o fechar da própria janela modal2
        $('.ui-dialog .ui-dialog-titlebar-close').click();

        var isChecked = jQuery("input:radio[name=flgPASTAPEDIDOCOMPARTILHADA]:checked").val();
        if (isChecked) {
            $("#FLG_PASTA_PEDIDO_COMPARTILHADA").val($('input:radio[name=flgPASTAPEDIDOCOMPARTILHADA]:checked').val());
        }

        //limpa os caminhos dos arquivos
        $("#DIR_ENVIO_SP").val($(this).find(".check").val());
        $("#DIR_RECEBE_SP").val($(this).find(".check").val());
        $("#DIR_ESPELHO").val($(this).find(".check").val());
        $("#DIR_ESTOQUE").val($(this).find(".check").val());
        $("#DIR_RESTRICAO").val($(this).find(".check").val());
        $("#DIR_ESTORNO").val($(this).find(".check").val());
        $("#DIR_DEVOLUCAO").val($(this).find(".check").val());
        $("#DIR_CANCELAMENTO").val($(this).find(".check").val());
        $("#DIR_OFERTA").val($(this).find(".check").val());
        $("#DIR_PEDIDO_DISTRIB").val($(this).find(".check").val());
        $("#DIR_PRECO").val($(this).find(".check").val());
        
        $(".tbmodelopasta").dataTable({
            "bDestroy": true
        }).fnDestroy();

        var rowsChecked = $(".check:checked", $(".tbmodelopasta").dataTable().fnGetNodes()).parent().parent();
        if (rowsChecked.length > 0) {

            //VARRE AS LINHAS SELECIONADAS NO GRIS
            $(rowsChecked).each(function () {
                switch ($(this).find(".pasta").val()) {
                    case ("PEDIDO"):
                        $("#DIR_ENVIO_SP").val($(this).find(".check").val());
                        break;
                    case ("RETORNO"):
                        $("#DIR_RECEBE_SP").val($(this).find(".check").val());
                        break;
                    case ("ESPELHO"):
                        $("#DIR_ESPELHO").val($(this).find(".check").val());
                        break;
                    case ("ESTOQUE"):
                        $("#DIR_ESTOQUE").val($(this).find(".check").val());
                        break;
                    case ("RESTRICAO"):
                        $("#DIR_RESTRICAO").val($(this).find(".check").val());
                        break;
                    case ("ESTORNO"):
                        $("#DIR_ESTORNO").val($(this).find(".check").val());
                        break;
                    case ("DEVOLUCAO"):
                        $("#DIR_DEVOLUCAO").val($(this).find(".check").val());
                        break;
                    case ("CANCELAMENTO"):
                      $("#DIR_CANCELAMENTO").val($(this).find(".check").val());
                      break;
                    case ("OFERTA"):
                        $("#DIR_OFERTA").val($(this).find(".check").val());
                        break;
                    case ("PEDIDO_REDE"):
                        $("#DIR_PEDIDO_DISTRIB").val($(this).find(".check").val());
                        break;
                    case ("PRECO"):
                        $("#DIR_PRECO").val($(this).find(".check").val());
                        break;
                }
            });

        }
    }

    $("#PERC_LEI_FEDERAL_PIS_COFINS").maskMoney({ showSymbol: false, precision:5 ,    decimal: ",", thousands: "" });
    $("#SFA_OperLogi_PERC_LEI_FEDERAL_PIS_COFINS").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
    $("#SFA_OperLogi_VAL_MIN_PED.mws-textinput").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
    $("#VAL_MIN_PEDIDO.mws-textinput").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
    $("#CNPJ_DIST.mws-textinput").mask("?99.999.999/9999-99");


    //$("#SFA_OperLogi_PERC_SPREAD.mws-textinput").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
    $(".PERC_SPREAD").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });


    $("#btnSalvar").on("click", function (event) {

        event.preventDefault();


        if ($("#SFA_OperLogi_CNPJ_OL.mws-textinput").length) {
            if (!validarCNPJ($("#SFA_OperLogi_CNPJ_OL.mws-textinput").val())) {
                alert("CNPJ do Distribuidor inválido.");
                return false;
            }
        }

        if ($("#I_SP_PV075_CNPJ_OL_FATURA.mws-textinput").length) {
            if (!validarCNPJ($("#I_SP_PV075_CNPJ_OL_FATURA.mws-textinput").val())) {
                alert("CNPJ de Faturamento inválido.");
                return false;
            }
        }

        //Percentual de spread NÃO PODE SER MAIOR QUE 100 %
        if ($(".PERC_SPREAD").length) {
            if (parseFloat($(".PERC_SPREAD").val().replace(",", ".")) > 100) {
                alert("Percentual de spread não pode ser maior que 100%.");
                return false;
            }
        }


        if ($("#areaDeAtuacao").val() == null) {
            alert("Selecione uma área de atuação.");
            return false;
        }


        if ($("#PedidosPharmalink").val() == "S")
            $("#IncluirPharmalink").val(confirm("Incluir condições Pharmalink?"));

        if ($("form").validate().form()) {
            $(".blockade").show();
           $("form").submit(); //para funcionar no IE.
        }
    });

    $("#btnSalvarEDI").on("click", function (event) {


        event.preventDefault();

        if ($("#GrupoExec").val() == "") {
            alert("Selecione um grupo de execução.");
            return false;
        }


        if ($("#MODELO_PASTA_ID").val().trim() == "") {
            alert('Selecione o modelo da pasta');
            return false;
        }


        if ($('#DIR_RAIZ_FTP').val().trim() == "") {
            alert('Selecione a pasta raiz');
            return false;
        }


        //seta as Divisões ID selecionadas para passar para a controler
        $('#cboDIVISOES_RECEBE_PRECOPost').val($('#cboDIVISOES_RECEBE_PRECO').val());
        

        if ($("#PedidosPharmalink").val() == "S")
            $("#IncluirPharmalink").val(confirm("Incluir condições Pharmalink?"));

        if ($(".formeditaredi").validate().form()) {
            $(".blockade").show();
            $(".formeditaredi").submit(); //para funcionar no IE e no Chrome
        }
    });

    $("#btnSalvarEdit").on("click", function () {


        //Percentual de spread NÃO PODE SER MAIOR QUE 100 %
        if ($(".PERC_SPREAD").length) {
            if (parseFloat($(".PERC_SPREAD").val().replace(",", ".")) > 100) {
                alert("Percentual de spread não pode ser maior que 100%.");
                return false;
            }
        }


        if ($("form").validate().form())
            $(".blockade").show();

    });

    $("#FLG_EQUIPE_NO_ARQUIVO_DE_PEDIDO").change();

    if (($("#rdbFLG_ENVIA_NFE_Nao").attr('checked') === undefined) && $("#rdbFLG_ENVIA_NFE_Sim").attr('checked') === undefined) {
        $("#DT_INICIO_ENVIA_NFE").removeClass("required");
        $(".dtEvnioNFe").hide();
    }
    //else {
    //    $("#DT_INICIO_ENVIA_NFE").addClass("required");
    //    $(".dtEvnioNFe").show();
    //}

    $("#FLG_ENVIA_NFE").change();
    $("#TIPO_COMUNICACAO").change();
    $("#STATUS").change();



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




    //################################################
    //CÓDIGO PARA A TABELA DE LINHA CONDICAO COMERCIAL
    $(".CondicaoolDataTable").dataTable({
        sPaginationType: "full_numbers",
        bPaginate: false,
        bFilter:false,
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

    //$(document).on("click", ".codigoPrazo", function () {
    $(".codigoPrazo").on("click", function () {
        $(".codigoInput").each(function () {
            var valueRestore = $(this).val();
            var spanRestore = $(this).parents(".codigoPrazo:first");
            spanRestore.html(valueRestore);
        });

        var value = $(this).html();

        var input = "<input type ='text' maxlength='8' value='" + value.trim() + "' class='codigoInput' />";
        $(this).html(input);
        $(".codigoInput").focus();
    });

    $(document).on("focusout", ".codigoInput", function () {
        var spanRestore = $(this).parents(".codigoPrazo:first");
        spanRestore.html($(this).val());

        spanRestore.parents("tr:first").find('.CONDICAOOL').val($(this).val());

        //MARCA A LINHA COMO ALTERAÇÃO DO código
        if (spanRestore.parents("tr:first").find(':input[id="ACAO"]').val() == '') {
            spanRestore.parents("tr:first").find(':input[id="ACAO"]').val('A');
        }
    });
    //BLOQUEIA A DIGITAÇÃO DA ASPAS SIMPLES 
    $(document).on("keydown", ".codigoInput", function (e) {
        //alert(e.which);
        if (e.which === 192 && e.shiftKey === false) { // 192 é ASPAS SIMPLES 
            return false;
            // ou:
            // e.preventDefault();
        }
    });
    //################################################

      

    //VAOLOR MÍNIMO DO PEDIDO POR TIPO DE ESTABELECIMENTO ( LOTR_CODIGO)
      $(".valorminimo").on("click", function () {
        $(".valorminimoInput").each(function () {
          var valueRestore = $(this).val();
          var spanRestore = $(this).parents(".valorminimo:first");
          spanRestore.html(valueRestore);
        });

        var value = $(this).html();

        var input = "<input type ='text' maxlength='10' value='" + value.trim() + "' class='valorminimoInput' />";
        $(this).html(input);
        //$(".valorminimoInput").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
        //$(".valorminimoInput").mask("?9999999,99", { placeholder: "" }); //, 
        $(".valorminimoInput").on('keypress', function () {
          //alert('aaaaa');
          Mascara(this, fnValor);
          //alert($(".valorminimoInput").val());
          //v.replace(/[^\,\d]|(,{2})|((^,).*)?/g, "") //Remove tudo o que não é decimal, deixa apenas caracter (,) e retira a primeira (,) da string se estiver na primeira posicao.
        });
        $(".valorminimoInput").on('keyup', function () {
              Mascara(this, fnValor);
        });
        $(".valorminimoInput").on("keydown", function () {
              Mascara(this, fnValor);
        });
        $(".valorminimoInput").focus();
      });

      $(document).on("focusout", ".valorminimoInput", function () {
        var spanRestore = $(this).parents(".valorminimo:first");
        spanRestore.html($(this).val());
        spanRestore.parents("tr:first").find('.VALOR').val($(this).val());
        //MARCA A LINHA COMO ALTERAÇÃO DO código
        if (spanRestore.parents("tr:first").find(':input[id="ACAO"]').val() == '') {
          spanRestore.parents("tr:first").find(':input[id="ACAO"]').val('A');
        }
      });



});