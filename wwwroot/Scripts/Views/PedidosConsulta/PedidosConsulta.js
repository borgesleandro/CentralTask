
$(document).ready(function () {

    //ajusta o tamanho da div de acordo com a table
    $('#consulta').width($('.tamanhofieldset').width());
    

    //aplica mascara de CNPJ
    $("#CNPJFARMACIA").mask("99.999.999/9999-99");


    //aplica mascara para aceitar apenas números
    //$('#NumeroPedido').maskMoney({ showSymbol: false, precision: 0, defaultZero: false, allowZero: false, thousands: "" });
    //$('#NumeroPedidoTablet').maskMoney({ showSymbol: false, precision: 0, defaultZero: false, allowZero: false, thousands: "" });
    $('#NumeroPedido').mask("?999999999999999999", { placeholder: "" });
    $('#NumeroPedidoTablet').mask("?999999999999999999", { placeholder: "" });
    $('#NumeroPedidoSAP').mask("?999999999999999999", { placeholder: "" });
    
    //seta o período para 1 do mês anterior até a data corrente
    var hojedate = new Date();
    var inimesstring ="";

    var mes = ('0' + (hojedate.getMonth())).slice(-2);
    if (mes =="00")
    {
      var ano = hojedate.getFullYear() - 1;
      var inimesstring = ('01').slice(-2) + '/'
            + '12/'
          + ano ;
    }
    else{
      var inimesstring = ('01').slice(-2) + '/'
            + ('0' + (hojedate.getMonth())).slice(-2) + '/'
          + hojedate.getFullYear();
    }

     


    var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                     + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                     + hojedate.getFullYear();

    $("#txtPeriodoINI").val(inimesstring);
    $("#txtPeriodoFIM").val(hojestring);



    

    $("select").multiselect().multiselectfilter();
    $("#EQUI_EQUIPE").multiselect("disable");
    $("#CODDIV").multiselect("destroy");
    $("#CODDIV").chosen();

    
    if ($("#txtTEMCOMPROVACAO").val() == "S") {
        $("#POSSUIANEXOS").multiselect("destroy");
    }
    
    //18/04/2017
    //$("#CAMPANHA").multiselect("destroy");
    //$("#CAMPANHA").chosen();

    
    //RETIRA A função multiselect do cbo Farmacia
    $("#FARMACIA").multiselect("destroy");
    $("#FARMACIA").chosen();

    $("#divfarmacia").hide();



    //$("#APROVACAOCLIENTE").val("");
    //alert('11');
    //$(".testeAPROVACAOCLIENTE").selected = false; 


    




    //$("#NumeroPedido").live('mouseup', function () { $(this).select(); });
    
    $("#NumeroPedido").focus(function (e) {
        var that = this;
        setTimeout(function () { $(that).select(); }, 10);
        return false;
    });

    $("#NumeroPedidoTablet").focus(function (e) {
        var that = this;
        setTimeout(function () { $(that).select(); }, 10);
        return false;
    });

    $("#NumeroPedidoSAP").focus(function (e) {
        var that = this;
        setTimeout(function () { $(that).select(); }, 10);
        return false;
    });


    


    $(".linkanexo").live("click", function () {
        var caminho = $(this).attr("data-caminho");
        var w = window.open(caminho, '_blank', 'left=150,top=50,width=1200,height=700,toolbar=0,resizable=0');
    });


    //#####################################################
    //          BOTÃO LUPA DE FARMACIA
    //#####################################################
    $("#btnLupa").on("click", function () {

        if ($('#CNPJFARMACIA').val() != "" || $('#RAZAOSOCIALFARMACIA').val() != "") {
            //MONTA PARAMETROS A SERa PASSADO PARA A FUNÇão
            var pdata = { CNPJ: $('#CNPJFARMACIA').val(), RAZAOSOCIAL: $('#RAZAOSOCIALFARMACIA').val() }

            $(".loading-save").show();

            //AS FARMACIAS PELO FILTRO
            $.ajax({
                type: "POST",
                url: "PedidosCosulta/ObterFarmacias",//url: controller + "ObterFarmacias",
                contentType: 'application/json',
                data: JSON.stringify(pdata),
                beforeSend: function () {
                    //$('#divfarmacia').append('<p>carregando...</p>');
                },
                success: function (data) {
                    $("#FARMACIA").empty();
                    if (data != "") {

                        var option = $('<option></option>');
                        option.attr('value', "");
                        option.text("Selecione uma opção");
                        $("#FARMACIA").append(option);


                        $.each(data, function () {
                            var option = $('<option></option>');

                            option.attr('value', this.codigo);
                            option.text(this.descricao);

                            $("#FARMACIA").append(option);
                        });
                        $("#FARMACIA").trigger("liszt:updated");
                        $("#divfarmacia").show();

                        //função utilizada para trazer a lista do select ABERTA
                        $('#FARMACIA_chzn').trigger("mousedown");


                        $(".loading-save").hide();
                    }
                    else {
                        $(".loading-save").hide();
                        alert("Não existem clientes cadastrados com esses parâmetros");
                        $('#CNPJFARMACIA').attr('value', "");
                        $("#divfarmacia").hide();
                    }
                    //$("#FARMACIA").multiselect("refresh");
                }
            });

        }
        else {
            alert("Informe o CNPJ ou parte da Razão Social");
            $("#FARMACIA").empty();
            $("#divfarmacia").hide();
            $(".loading-save").hide();
        }
    });





    //#####################################################
    //      BOTAO DE LIMPEZA DE FILTRO DE FARMACIA
    //#####################################################
    $("#btnlimpa").on("click", function () {

        $('#CNPJFARMACIA').attr('value', '');
        $("#CNPJFARMACIA").mask("99.999.999/9999-99");

        $('#RAZAOSOCIALFARMACIA').attr('value', "");

        $("#FARMACIA").empty();
        $("#divfarmacia").hide();

    });






    //#####################################################
    //          LISTA DE FARMACIAS
    //#####################################################
    $("#FARMACIA").change(function () {
        if ($('#FARMACIA').val() != "") {
            $('#CNPJFARMACIA').attr('value', $('#FARMACIA').val());
            $("#CNPJFARMACIA").mask("99.999.999/9999-99");

            var razao = $('#FARMACIA option:selected').text()

            $('#RAZAOSOCIALFARMACIA').attr('value', razao.substring(20).trim());

            //esaconde combo FARMACIA
            $("#FARMACIA").empty();
            $("#divfarmacia").hide();
        }
    });




    //#################################################################
    //QUANDO SELECIONAR A COMPANHIA VAI CARREGAR O COMBO EQUIPE
    //#################################################################
    $("#CODDIV").change(function () {
        if ($('#CODDIV').val() != "") {
            $.ajax({
                type: "POST",
                url: "PedidosCosulta/ObterEquipesPorCia",//url: controller + "ObterEquipesPorCia",
                contentType: 'application/json',
                data: JSON.stringify({ cia: $('#CODDIV').val() }),
                success: function (data) {
                    $("#EQUI_EQUIPE").multiselect("enable");
                    $("#EQUI_EQUIPE").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#EQUI_EQUIPE").append(option);
                    });

                    $("#EQUI_EQUIPE").multiselect("refresh");
                }
            });


            //MONTA PARAMETROS A SERa PASSADO PARA A FUNÇão
            var pdata = { cia: $('#CODDIV').val(), equipes: $('#EQUI_EQUIPE').val() }


            //CARREGA COMBO REPRESENTANTE POR COMPANHIA
            $.ajax({
                type: "POST",
                url: "PedidosCosulta/ObterRepCiaEquipe",//url: controller + "ObterRepCiaEquipe",
                contentType: 'application/json',
                data: JSON.stringify(pdata),
                success: function (data) {
                    $("#REPRESENTANTES").multiselect("enable");
                    $("#REPRESENTANTES").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#REPRESENTANTES").append(option);
                    });

                    $("#REPRESENTANTES").multiselect("refresh");
                }
            });

        }
        else {
            $("#EQUI_EQUIPE").multiselect("uncheckAll");
            $("#EQUI_EQUIPE").multiselect("disable");
        }
    });






    //#################################################################
    //QUANDO SELECIONAR A EQUIPE carrega CBO REPRESENTANTE
    //#################################################################
    $("#EQUI_EQUIPE").change(function () {
        if ($('#EQUI_EQUIPE').val() != "") {
            //MONTA PARAMETROS A SERE, PASSADOR PARA A FUNÇÕES
            //var pdata = { Cia: $('#CODDIV').val(), Equipes: $('#EQUI_EQUIPE').val() }

            //MONTA PARAMETROS A SERa PASSADO PARA A FUNÇão
            var pdata = { cia: $('#CODDIV').val(), equipes: $('#EQUI_EQUIPE').val() }


            //CARREGA COMBO REPRESENTANTE POR COMPANHIA
            $.ajax({
                type: "POST",
                url: "PedidosCosulta/ObterRepCiaEquipe",//url: controller + "ObterRepCiaEquipe",
                contentType: 'application/json',
                data: JSON.stringify(pdata),
                success: function (data) {
                    $("#REPRESENTANTES").multiselect("enable");
                    $("#REPRESENTANTES").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#REPRESENTANTES").append(option);
                    });

                    $("#REPRESENTANTES").multiselect("refresh");
                }
            });

        }
    });

     




    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisar").on("click", function () {

        $("#exportarLinkDiv").html("");

        //###############################################
        //          VERIFICAÇÃO DE DATA
        //###############################################
        var ssmsgDataInvalida = "";
        if ($("#txtPeriodoINI").val() == "" || $("#txtPeriodoINI").val() == "null" || $("#txtPeriodoINI").val() == null) {
            ssmsgDataInvalida = "É necessário informar o período.\n";
        }
        if ($("#txtPeriodoFIM").val() == "" || $("#txtPeriodoFIM").val() == "null" || $("#txtPeriodoFIM").val() == null) {
            ssmsgDataInvalida += "É necessário informar o período.\n";
        }
        try {
            $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoINI").val());
        }
        catch (err) {
            ssmsgDataInvalida += "Período inicial inválido.\n";
        }
        try {
            $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoFIM").val());
        }
        catch (err) {
            ssmsgDataInvalida += "Período fim inválido.\n";
        }
        if (ssmsgDataInvalida == "") {
            if ($.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoFIM").val()) < $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoINI").val())) {
                ssmsgDataInvalida += "Período inicial não pode ser maior que o final\n";
            }
        }
        if (ssmsgDataInvalida != "") {
            alert(ssmsgDataInvalida);
            return;
        }
        //###############################################
        //          FIM VERIFICAÇÃO DE DATA
        //###############################################



        ////Habilita imagem de LOAD
        $(".loading-save").show();

        
        var statuscli = null;
        var possuianexos = "";
        if ($("#txtTEMCOMPROVACAO").val() == "S") {
            statuscli = $("#STATUSAPROVACAOCLIENTE").val();
            possuianexos = $("#POSSUIANEXOS").val();
        }

        var model = {
            Companhia: $("#CODDIV").val(),
            Equipe: $("#EQUI_EQUIPE").val(),
            Distribuidor: $("#CNPJ_OL").val(),
            Representantes: $("#REPRESENTANTES").val(),
            NumeroPedidos: $("#NumeroPedido").val(),
            NumeroPedidosTablet: $("#NumeroPedidoTablet").val(),
            NumeroPedidosSAP: $("#NumeroPedidoSAP").val(),
            PeriodoIni: $("#txtPeriodoINI").val(),
            PeriodoFim: $("#txtPeriodoFIM").val(),
            Campanha: $("#CAMPANHA").val(),
            CnpjFarmacia: $("#CNPJFARMACIA").val(),
            RazaoSocialFarmacia: $("#RAZAOSOCIALFARMACIA").val(),
            StatusPedido: $("#STATUS").val(),
            Origem: $("#ORIGEM").val(),
            STATUSAPROVACAOCLIENTE: statuscli,
            POSSUIANEXOS: possuianexos
        };




        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "PedidosCosulta/List",
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


                    //se tiver comprovação, entrou uma coluna na frente, mesmo assim vai ordenar pela data
                    if ($("#txtTEMCOMPROVACAO").val() == "S") {
                        $("#tbpesquisa").dataTable({
                            aaSorting: [[1, "asc"]],
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
                    else {
                        $("#tbpesquisa").dataTable({
                            aaSorting: [[0, "asc"]],
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
                    //$('.dataTables_scrollHead').css('float', 'left');
                    //$('.dataTables_scrollBody').css('float', 'left');
                    //$('.tabprodutos_info').css('float', 'left');
                    //$('.tabprodutos_paginate').css('float', 'left');


                }
                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });

         
         
    });
    //#############################################

     
    

    


});
//######################################
//          fim do READY
//######################################










//######################################
//          CONSULTA APROVADORES
//######################################
function ConsultarAprovadoresPedido(vsOPERACAO) {

    if (vsOPERACAO == "ABRIR") {

        $('#popAprovadores').css("display", "block");
    }
    else {
        $('#popAprovadores').css("display", "none");
    }
}


//######################################
//          CONSULTA SETOR
//######################################
function ConsultarSetorEmissor(vsOPERACAO) {

    if (vsOPERACAO == "ABRIR") {

        $('#pop').css("display", "block");
    }
    else {
        $('#pop').css("display", "none");
    }
}


//######################################
//          CONSULTA DETALHES STATUS CANCELAMENTO
//######################################
function ConsultarDetalheStatusCancelado(vsOPERACAO) {

    if (vsOPERACAO == "ABRIR") {
        $('#popdetCancel').css("display", "block");
    }
    else {
        $('#popdetCancel').css("display", "none");
    }
}





//##################################
//DETALHE DO PEDIDO
//##################################  pedidoorigemsaldonegativo
function GetDetalhesPedido(datapedido, numeropedido, grupopedidoid, statuspedido, dtfatSist, dtenvioNFE, flgPedidoSellin, origem, monitorar, chaveEXIGECOMPROVACAO , QtdAnexos) {
    
    origem = (typeof origem === 'undefined') ? 0 : origem;
    

    $(".loading-save").show();

    var currentAjaxRequest2 = null;
    if (currentAjaxRequest2 != null) currentAjaxRequest2.abort();

    
    //controller + 
    currentAjaxRequest2 = $.post("PedidosCosulta/getDetailModal2", {
        numeropedido: numeropedido,
        datapedido: datapedido
    }, function (data2) {
        var buttonsModal2 = [];

        //////apaga a janela modal
        $('.modaldetalheped').dialog("close").dialog("destroy").remove();
        

        //##################################//##################################
        //            CRIAÇÃO DOS BOTÕES DA TELA DETALHE DO PEDIDO
        //##################################//##################################


        //qtdAnexos
        //origem 4 = terceiros, pedidos importados 
        if (origem != 4 && flgPedidoSellin == 'true' && chaveEXIGECOMPROVACAO=="S") {

            var btDisabled = false;
            var classeBotao = "mws-button blue"
            if (QtdAnexos != null && QtdAnexos == 0) {
                btDisabled = true;
                classeBotao = "mws-button gray";
            }

            buttonsModal2.push(
                //EXIBIR LISTA DE ARQUIVOS ANEXOS
                {
                    text: "Exibir anexos",
                    textcolor: "Exibir anexos",
                    disabled: btDisabled,
                    "class": classeBotao,
                    click: function () {
                        $(".loading-save").show();
                        $('.ui-widget-overlay').height($(document).height());
                        $('.ui-widget-overlay').css('z-index', 999);
                        ExibirListaAnexos(numeropedido, grupopedidoid);
                    }
                }
            )
        }
        




        if (origem != 4) {
            buttonsModal2.push(
                //CRIA MONITORAR PEDIDO
                {
                    text: "Monitorar pedido",
                    "class": "mws-button blue",
                    click: function () {
                        $(".loading-save").show();
                        $('.ui-widget-overlay').height($(document).height());
                        $('.ui-widget-overlay').css('z-index', 999);
                        MonitorarPedido(numeropedido, grupopedidoid);

                    }
                }
            )
        }
                
        //VERIFICA SE PODE ALTERAR STATUS PEDIDO
        if (origem != 4 && (statuspedido.trim() == "2" || statuspedido.trim() == "3" || statuspedido.trim() == "5" || statuspedido.trim() == "6" || statuspedido.trim() == "11") && $("#hdpodealterar").val() == "True") {

            var sbMostrarbtn = true;
            //Pedido cancelado:
            //    * Só pode voltar para Enviado para OL se dt_fat_sist estiver preenchida
            //    * Só pode voltar para Aguardando NF se dt_envio_nfe estiver preenchida

            //Se os dois campos estiverem nulos, não mostrar o botão de alterar status
            //Senão, usar as condições para preencher o combo.
            if ((statuspedido.trim() == "6" && dtfatSist == null && dtenvioNFE == null) || (statuspedido.trim() == "6" && dtfatSist == "" && dtenvioNFE == "")) //6 = CANCELADO
            {
                sbMostrarbtn = false;
            }

            //dtfatSist, dtenvioNFE
            if (sbMostrarbtn == true) {
                buttonsModal2.push(
                    //CRIA BOTÃO ALTERAR STATUS PEDIDO
                    {
                        text: "Alterar status",
                        "class": "mws-button blue",
                        click: function () {
                            $('.ui-widget-overlay').css('z-index', 999);
                            AlterarStatus(numeropedido, dtfatSist, dtenvioNFE);
                        }
                    }
                )
            }
        }

        if (origem != 4 && flgPedidoSellin == 'false') {
            buttonsModal2.push(
            //CRIA BOTÃO EXIBIR ARQUIVOS
            {
                text: "Exibir arquivos",
                "class": "mws-button blue",
                click: function () {
                    $(".loading-save").show();
                    $('.ui-widget-overlay').height($(document).height());
                    $('.ui-widget-overlay').css('z-index', 999);
                    ExibirArquivos(datapedido, numeropedido);

                }
            }
            )
        }


        //retirado dia 21/02/2019, pois a função está desatualizada
        //if (origem != 4) {
        //    buttonsModal2.push(
        //    //CRIA BOTÃO COPIAR PEDIDO
        //    {
        //        text: "Copiar Pedido",
        //        "class": "mws-button blue",
        //        click: function () {
        //            $(".loading-save").show();
        //            $('.ui-widget-overlay').css('z-index', 999);
        //            //alert("Cancelar");
        //            CopiarPedido(numeropedido);
        //        }
        //    }
        //    )
        //}

        if (origem != 4) {
            //VERIFICA SE PODE INCLUIR PARA CRIAR O BOTAO CANCELAR
            if ($("#hdpodeincluir").val() == "True") { //hidden que tem a permissão de acesso do usuário
                buttonsModal2.push(
                //CRIA BOTÃO LOG
                {
                    text: "Cancelar pedido",
                    "class": "mws-button blue",
                    click: function () {
                        $('.ui-widget-overlay').css('z-index', 999);
                        GetTelaCancelarPedido(numeropedido);
                    }
                }
                )
            }
        }

        if (origem != 4) {
            //VERIFICA SE PODE REENVIAR PEDIDO
            if (statuspedido.trim() == "7" && $("#hdpodeincluir").val() == "True") {
                buttonsModal2.push(
                //CRIA BOTÃO REENVIAR PEDIDO
                {
                    text: "Reenviar pedido",
                    "class": "mws-button blue",
                    click: function () {
                        $('.ui-widget-overlay').css('z-index', 999);
                        ReenviarPedido(numeropedido);
                    }
                }
                )
            }
        }


        if (origem != 4) {
            //BOTOES
            buttonsModal2.push(
                //CRIA BOTÃO LOG
                {
                    text: "Log Pedido",
                    "class": "mws-button blue",
                    click: function () {
                        $('.ui-widget-overlay').css('z-index', 999);
                        GetLogPedido(datapedido, grupopedidoid);
                    }
                }
               ,
                //CRIA BOTÃO CRITICAS
                {
                    text: "Críticas de retorno e espelho",
                    "class": "mws-button blue",
                    click: function () {
                        $('.ui-widget-overlay').css('z-index', 999);
                        GetCriticas(numeropedido);
                    }
                }
               ,
               //CRIA BOTÃO visualizar impressão
                {
                    text: "Visualizar impressão",
                    "class": "mws-button blue",
                    click: function () {
                        //abre a janela nova com o HTML
                        //var w = window.open("" , "popupWindow", "width=600,height=600,scrollbars=yes");
                        var html = data2;
                        //var w = window.open(controller + "ImpDetalhesPedido22", '_blank', 'left=150,top=50,width=1200,height=700,toolbar=0,resizable=0');
                        var w = window.open("PedidosCosulta/ImpDetalhesPedido22", '_blank', 'left=150,top=50,width=1200,height=700,toolbar=0,resizable=0');
                        w.onload = function () {
                            $('#divConteudo', this.document.body).html(html);
                        };
                    }
                }
                )
            }
            

            buttonsModal2.push(
            {
                text: "Fechar",
                "class": "mws-button gray",
                click: function () {
                    //chama o fechar da própria janela modal2
                    $('.ui-dialog .ui-dialog-titlebar-close').click();
                }
            }
            )

        

        //Desabilita o scroll da pagina de tras
        //$('body').css('overflow', 'hidden');

        ////armazena a largura e a altura da tela
        //var maskHeight = $(document).height();
        //var maskWidth = $(window).width();
        ////Define largura e altura do div#mask iguais ás dimensões da tela
        //$('#mask').css({ 'width': maskWidth, 'height': maskHeight });
        ////efeito de transição
        //$('#mask').fadeIn(1000);
        //$('#mask').fadeTo("slow", 0.8);
        //$('textarea').appendTo(document.body).val(data2)
        //$(data2).dialog();
        $(".loading-save").hide();
        $(data2).dialog({
            resizable: false,
            draggable: true,
            title: "Pedido - Detalhes", // "Número do pedido: " + numeropedidooriginal,
            dialogClass: "DIALOGdetmodal", //classe para identificar a janela que esta sendo aberta
            //hide: 'blind',
            //width: "1220px",
            width: "90%",
            modal: true,
            //stack: false,
            //position: "right-100 top+40",
            position: "top-0",
            //stack: false,
            buttons: buttonsModal2,
            //maxHeight: 600,
            open: function () {

                //para a janela ficar a frente da outra
                $('.ui-dialog').css('z-index', 103);
                $('.ui-widget-overlay').css('z-index', 102);

                //STARTA O TOOLTIP DO MODAL
                if ($.fn.tipsy) {
                    var gravity = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
                    for (var i in gravity)
                        $(".mws-tooltip-" + gravity[i]).tipsy({ gravity: gravity[i] });
                    //$('.DIALOGdetmodal input[title], select[title], textarea[title]').tipsy({ trigger: 'focus', gravity: 'w' });
                }
              
                //$(".modal2 .mws-datatable-fn").dataTable({
                //.tbDetalhepesquisa
                //$(".modaldetalheped .mws-table").dataTable({
                
                $("#tbDetalhepesquisa").dataTable({
                    aaSorting: [[0, "asc"], [2, "asc"]],
                    sPaginationType: "full_numbers",
                    "bPaginate": true,
                    "bAutoWidth": false,
                    "bProcessing": true,
                    "bServerSide": false,
                    "sScrollX": "100%",
                    "bSort": true,                    
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados",
                        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        sInfoFiltered: "(Total de _MAX_ registros)"
                    }
                });
                
                //$("#ordemaprovacoes").dataTable({
                //    "sPaginationType": "full_numbers",
                //    "bPaginate": true,
                //    "bAutoWidth": true,
                //    "bProcessing": false,
                //    "bServerSide": false,
                //    "bSort": false,
                //    "sScrollX": "100%",
                //    "oLanguage":
                //    {
                //        "sZeroRecords": "Não foram encontrados resultados",
                //        "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                //        "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                //        "sInfoFiltered": "(Total de _MAX_ registros)"
                //    },
                //});






            }

        });

    });



    //});
};
//DETALHE DO PEDIDO



function SalvarNovoStatus(numeropedido , statusanterior) {



    //11260498
    if ($("#NOVOSTATUS").val() == "" ) {
        alert("Selecione o novo status");
        return false;
    }



    alert("Confirma a alteração do status do pedido?", "Alterar status", $('.ui-widget-overlay').css('z-index', 105)
        , function () {
             

            $.ajax({
                type: "POST",
                url: "PedidosCosulta/ALTERARSTATUS", //url: controller + "ALTERARSTATUS",
                contentType: 'application/json',
                data: JSON.stringify({
                    numeropedido: numeropedido, statusanterior: statusanterior , novostatus: $("#NOVOSTATUS").val()
                }),
                success: function (response) {
                    if (response.ok) {

                        if (response.podealterar == false) {
                            //não pode alterar o status do pedido
                            //alert("Não pode haver pedido criado para próximo distribuidor");
                            alert(response.MENSAGEM);
                        }
                        else {
                            alert("O status do pedido " + numeropedido + " foi alterado com sucesso");

                            //chama o click do botão para recarregar a lista
                            $('#btnPesquisar').click();

                            //fecha a tela de detalhe de pedido
                            $('.modaldetalheped').dialog("close").dialog("destroy").remove();

                            //$('.DIALOGmodal3').dialog("destroy").remove();
                            $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();
                        }


                    } else {
                        alert("Ocorreu um erro ao tentar reenviar o pedido: " + response.message);
                    }
                }
            });
        });
}

//#####################################################
//             ALTERAR STATUS PEDIDO
//#####################################################
function AlterarStatus(numeropedido , dtfatSist ,  dtenvioNFE ) {

    //Verifica se status permite alteração de status
    if ($("#HDSTATUS").val() != "2" && $("#HDSTATUS").val() != "3" && $("#HDSTATUS").val() != "5" && $("#HDSTATUS").val() != "6" && $("#HDSTATUS").val() != "11") {
        ssmsg = "Status atual do pedido não permite alteração de status.";
        alert(ssmsg);
        $('.ui-widget-overlay').css('z-index', 102);
        return;
    }


    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();

    //currentAjaxRequest3 = $.post(controller + "getTelaAlterarStatus", {
    currentAjaxRequest3 = $.post("PedidosCosulta/getTelaAlterarStatus", {
        statusPedido: $("#HDSTATUS").val() ,
        dtaftsist: dtfatSist,
        dtenvionfe: dtenvioNFE
    }, function (data3) {
        var buttonsModal3 = [];
        ////apaga a janela modal
        $(".modal3").dialog("destroy").remove();
        
        //cria o botão SALVAR
        buttonsModal3.push({
            text: "Salvar",
            "class": "mws-button blue",
            click: function () {
                SalvarNovoStatus(numeropedido, $("#HDSTATUS").val());
            }
        });

        //cria o botão cancelar
        buttonsModal3.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                $('.ui-widget-overlay').css('z-index', 102);

                //chama o fechar da própria janela DIALOGmodal3
                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();

            }
        });


        $(".loading-save").hide();
        $(data3).dialog({
            dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
            resizable: false,
            draggable: true,
            title: "Alterar Status", 
            width: "620px",
            modal: true,
            buttons: buttonsModal3,
            open: function () {

                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOGmodal3').css('z-index', 106);
                
            },
            close: function () {
                $('.ui-widget-overlay').css('z-index', 102);
            }
            ,
            error: function (response) {
                alert(response);
            }
        });

    });
}





//##################################
//LOG DO PEDIDO
//##################################  
function GetLogPedido(datapedido, grupopedidoID) {


    //alert(grupopedidoID);

    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();

    
    //currentAjaxRequest3 = $.post(controller + "getLogPedido", {
    currentAjaxRequest3 = $.post("PedidosCosulta/getLogPedido", {
        datapedido: datapedido,
        grupoPedidoID: grupopedidoID
    }, function (data3) {
        var buttonsModal3 = [];

        ////apaga a janela modal
        $(".modal3").dialog("destroy").remove();

        
        //cria o botão cancelar
        buttonsModal3.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                $('.ui-widget-overlay').css('z-index', 102);

                //chama o fechar da própria janela DIALOGmodal3
                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();

            }
        });

        
            $(".loading-save").hide();
            $(data3).dialog({
                dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
                resizable: false,
                draggable: true,
                title: "Log Pedido", // "Número do pedido: " + numeropedidooriginal,
                width: "1220px",
                modal: true,
                buttons: buttonsModal3,
                open: function () {

                    //para a janela ficar a frente da outra
                    $('.ui-widget-overlay').css('z-index', 105);

                    $('.DIALOGmodal3').css('z-index', 106);


                    //#tbDetalhepesquisa
                    $(".modal3 .mws-table").dataTable({
                        aSorting: [1, "asc"],
                        sPaginationType: "full_numbers",
                        "bPaginate": true,
                        "bAutoWidth": false,
                        "bProcessing": true,
                        "bServerSide": false,
                        "bSort": false,
                        oLanguage:
                        {
                            sZeroRecords: "Não foram encontrados resultados",
                            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                            sInfoFiltered: "(Total de _MAX_ registros)"
                        }
                    });

                },
                close: function () {
                    $('.ui-widget-overlay').css('z-index', 102);
                }
                ,
                error: function (response) {
                    alert(response);
                }
            });
        
    });


};
//LOG DO PEDIDO





//##################################
//CRITICAS DO PEDIDO
//##################################  
function GetCriticas(numeropedido) {


    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();
    
    currentAjaxRequest3 = $.post("PedidosCosulta/getCriticasPedido", {
    //currentAjaxRequest3 = $.post(controller + "getCriticasPedido", {
        numeropedido: numeropedido
    }, function (data3) {
        var buttonsModal3 = [];

        ////apaga a janela modal
        $(".modal3").dialog("destroy").remove();


        //cria o botão cancelar
        buttonsModal3.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                $('.ui-widget-overlay').css('z-index', 102);
                //$(this).dialog("destroy").remove();

                //$(data3).dialog.close();
                //chama o fechar da própria janela DIALOGmodal3
                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();

            }
        });


        $(".loading-save").hide();
        $(data3).dialog({
            dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
            resizable: false,
            draggable: true,
            title: "Críticas de retorno e espelho",
            width: "1220px",
            modal: true,
            buttons: buttonsModal3,
            open: function () {
                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOGmodal3').css('z-index', 106);

                //07/04/2015
                //$('.DIALOGmodal3').css('top', 150);
                //07/04/2015
                ////seta o top da página
                //$('body').scrollTop(0);


                //#tbDetalhepesquisa
                $(".modal3 .mws-table").dataTable({
                    aSorting: [1, "asc"],
                    sPaginationType: "full_numbers",
                    "bPaginate": true,
                    "bAutoWidth": true,
                    "bProcessing": true,
                    "bServerSide": false,
                    "bSort": false,
                    "sScrollX": "100%",
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados",
                        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        sInfoFiltered: "(Total de _MAX_ registros)"
                    }
                    
                });

            },
            close: function () {
                $('.ui-widget-overlay').css('z-index', 102);
            }

        });

    });


};
//CRITICAS DO PEDIDO



//REENVIAR DO PEDIDO
function ReenviarPedido(numeropedido) {


    //VERIFICA SE JÁ ESTA CANCELADO
    if ($("#HDSTATUS").val() != "7") {
        ssmsg = "Pedido não pode ser reenviado.";
        alert(ssmsg);
        $('.ui-widget-overlay').css('z-index', 102);
        return;
    }

    alert("Confirma o reenvio do pedido para faturamento?", "Reenviar pedido", $('.ui-widget-overlay').css('z-index', 102)
        , function () {
        $.ajax({
            type: "POST",
            url: "PedidosCosulta/REENVIAPEDIDO", //url: controller + "REENVIAPEDIDO",
            contentType: 'application/json',
            data: JSON.stringify({
                numeropedido: numeropedido
            }),
            success: function (response) {
                if (response.ok) {
                    //alert("Dados salvos com sucesso!");
                    alert("O pedido " + numeropedido + " foi reenviado com sucesso");

                    //chama o click do botão para recarregar a lista
                    $('#btnPesquisar').click();

                    //fecha a tela de detalhe de pedido
                    $('.modaldetalheped').dialog("close").dialog("destroy").remove();
                    //$('.DIALOGmodal3').dialog("destroy").remove();


                } else {
                    alert("Ocorreu um erro ao tentar reenviar o pedido: " + response.message);
                }
            }
        });




    });

}



//CÓPIA DE PEDIDO
function CopiarPedido(numeropedido) {

    $('#txtNumeroPedidoaCopiar').val(numeropedido);

    $('.createForm').attr('target', '');

    $('.createForm').attr('action', controllerPedidoInclusaoCopiaPedido);
    $('.createForm').submit();

}


function ReprocessarArquivo(vsTipo) {
    
    var nomearquivo;

    if (vsTipo == "RETORNO")
            nomearquivo = $('#txtnomearqRETORNO').val()
    
    if (vsTipo == "ESPELHO")
            nomearquivo = $('#txtnomearqESPELHO').val()
    

    $.ajax({
        type: "POST",
        //url: controller + "ReprocessarArquivo",
        url: "PedidosCosulta/ReprocessarArquivo",
        contentType: 'application/json',
        data: JSON.stringify({
            numeropedido: $('#txtNUMEROPEDIDO').val()
            , nomearquivo: nomearquivo
            , tipoarquivo:vsTipo
        }),
        success: function (response) {
            if (response.ok) {
                if (vsTipo == "RETORNO")
                    $('#btnReprocRetorno').css("visibility", "hidden");

                if (vsTipo == "ESPELHO")
                    $('#btnReprocEspelho').css("visibility", "hidden");

                alert("O pedido " + $('#txtNUMEROPEDIDO').val() + " será reprocessado dentro de 5 minutos, favor aguardar");

            }
            else {
                alert("Ocorreu um erro ao tentar disponibilizar o pedido para reprocessamento: " + response.message);
            }

        }
    });

    
}







function ArquivoNaoEncontrado() {
    alert('Arquivo não encontrado!');
}



//##################################
//EXIBE LISTA ANEXOS DO PEDIDO
//##################################  
function ExibirListaAnexos(numeropedido, grupopedidoid) {
    
    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();

    //currentAjaxRequest3 = $.post("PedidosCosulta/getCriticasPedido", {
    currentAjaxRequest3 = $.post("PedidosCosulta/getListaAnexos", {
        numeropedido: numeropedido
        , grupoPedidoID: grupopedidoid
    }, function (data3) {
        var buttonsModal3 = [];

        ////apaga a janela modal
        $(".modal3").dialog("destroy").remove();
        
        //cria o botão cancelar
        buttonsModal3.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                $('.ui-widget-overlay').css('z-index', 102);
        
                //chama o fechar da própria janela DIALOGmodal3
                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();
            }
        });


        $(".loading-save").hide();
        $(data3).dialog({
            dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
            resizable: false,
            draggable: true,
            title: "Lista de anexos",
            width: "1220px",
            modal: true,
            buttons: buttonsModal3,
            open: function () {
                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOGmodal3').css('z-index', 106);


                //////#tbDetalhepesquisa
                $("#tbLogpesquisa").dataTable({
                    aSorting: [1, "asc"],
                    sPaginationType: "full_numbers",
                    "bPaginate": true,
                    "bAutoWidth": true,
                    "bProcessing": true,
                    "bServerSide": false,
                    "bSort": false,
                    "sScrollX": "100%",
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados",
                        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        sInfoFiltered: "(Total de _MAX_ registros)"
                    }

                });

            },
            close: function () {
                $('.ui-widget-overlay').css('z-index', 102);
            }
        });
    });

};
//EXIBE LISTA ANEXOS DO PEDIDO




//#####################################################
//FUNÇÃO PARA INICIAR MONITORAMENTO DO PEDIDO
//function ExibirArquivos(numeropedido) {
//#####################################################
function MonitorarPedido(numeropedido, grupopedidoid) {

    

    $(".loading-save").show();

    //cópia do email para:
    //OS HD 
    var ssDialogEmail = '<form class="mws-form modalMonitorar">';
        ssDialogEmail += '  <div class="mws-form-row">&nbsp;</div>';
        ssDialogEmail += '  <div class="mws-form-row">';
        ssDialogEmail += '    <div class="grid_4">';
        ssDialogEmail += '        <label>Número OS sistema HD</label>';
        ssDialogEmail += '        <div class="mws-form-item">';
        ssDialogEmail += '            <input type="text" name="NumeroOSHD" id="NumeroOSHD" class="mws-textinput " />';
        ssDialogEmail += '        </div>';
        ssDialogEmail += '    </div>';
        ssDialogEmail += '  </div >';
        ssDialogEmail += '  <div class="mws-form-row">';
        ssDialogEmail += '    <div class="grid_8" syle="margin-top:10px !important;">';
        ssDialogEmail += '        <label>Copia de email para</label>';
        ssDialogEmail += '        <div class="mws-form-item">';
        ssDialogEmail += '            <input type="text" name="txtCopiaEmail" id="txtCopiaEmail" value = "resolvedores@running.com.br" maxlength="100" class="mws-textinput " />';
        ssDialogEmail += '        </div>';
        ssDialogEmail += '    </div>';
        ssDialogEmail += '  </div>';
        ssDialogEmail += '  <div class="mws-form-row">&nbsp;</div>';
        ssDialogEmail += '</form>';
    
        var buttonsModal3 = [];
    
        ////apaga a janela modal
        $(".modalMonitorar").dialog("destroy").remove();

        //cria o botão SALVAR
        buttonsModal3.push({
            text: "Ok",
            "class": "mws-button blue",
            click: function () {
                //SalvarNovoStatus(numeropedido, $("#HDSTATUS").val());
                                
                //PARAMETROS                 
                sSEQPEDIDO = numeropedido;
                sgrupoPedidoID = grupopedidoid;
                siniciar = true;
                sEmailCopia = $('#txtCopiaEmail').val();
                sOSHD = $('#NumeroOSHD').val();
                
                $.post("MonitorarPedido/IniFimMONITORAR" , { SEQPEDIDO: sSEQPEDIDO, grupoPedidoID: sgrupoPedidoID, iniciar: siniciar, EmailCopia: sEmailCopia, OSHD: sOSHD } , function (data) {

                    //alert(data.message);
                    if (data.ok) {
                        if (data.message != '') {
                            alert(data.message);
                        }
                        else {
                            alert("Monitoramento iniciado com sucesso!");
                        }

                        //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                        $('.ui-widget-overlay').css('z-index', 102);

                        //chama o fechar da própria janela DIALOGmodal3
                        $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();

                        
                    }
                    else {
                        alert('Falha ao iniciar monitoramento: ' + data.message);
                    }

                });
                
            }
        });

        //cria o botão cancelar
        buttonsModal3.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                $('.ui-widget-overlay').css('z-index', 102);

                //chama o fechar da própria janela DIALOGmodal3
                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();
            }
        });
    
        $(".loading-save").hide();
        $(ssDialogEmail).dialog({
            dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
            resizable: false,
            draggable: true,
            title: "Monitorar pedido",
            width: "320px",
            modal: true,
            buttons: buttonsModal3,
            open: function () {
                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOGmodal3').css('z-index', 106);
                                      
                $('#NumeroOSHD').mask("?99999999999999", { placeholder: "" });
            },
            close: function () {
                $('.ui-widget-overlay').css('z-index', 102);
            }
        });
    
        //alert('MONITORAR');
}





//EXIBIR ARQUIVOS DE PEDIDO
function ExibirArquivos(datapedido, numeropedido) {

    $(".loading-save").show();

    var currentAjaxRequest3 = null;
    if (currentAjaxRequest3 != null) currentAjaxRequest3.abort();


    
    //currentAjaxRequest3 = $.post(controller + "getArquivosPedido", {
    currentAjaxRequest3 = $.post("PedidosCosulta/getArquivosPedido", {
        numeropedido: numeropedido,
        datapedido: datapedido
    }, function (data3) {
        var buttonsModal3 = [];

        ////apaga a janela modal
        $(".modal3").dialog("destroy").remove();


        //cria o botão cancelar
        buttonsModal3.push({
            text: "Fechar",
            "class": "mws-button gray",
            click: function () {
                //diminui o Z-INDEX da parte cinza que deixa as janelas modal para a tela de detalhes ficar a frente
                $('.ui-widget-overlay').css('z-index', 102);

                //chama o fechar da própria janela DIALOGmodal3
                $('.DIALOGmodal3 .ui-dialog-titlebar-close').click();

            }
        });


        $(".loading-save").hide();
        $(data3).dialog({
            dialogClass: "DIALOGmodal3", //classe para identificar a janela que esta sendo aberta
            resizable: false,
            draggable: true,
            title: "Arquivos do Pedido", // "Número do pedido: " + numeropedidooriginal,
            //width: "1220px",
            width: "90%",
            modal: true,
            buttons: buttonsModal3,
            open: function () {

                //para a janela ficar a frente da outra
                $('.ui-widget-overlay').css('z-index', 105);

                $('.DIALOGmodal3').css('z-index', 106);


                //#tbDetalhepesquisa
                $(".modal3 .mws-table").dataTable({
                    aSorting: [1, "asc"],
                    sPaginationType: "full_numbers",
                    "bPaginate": true,
                    "bAutoWidth": false,
                    "bProcessing": true,
                    "bServerSide": false,
                    "bSort": true,
                    oLanguage:
                    {
                        sZeroRecords: "Não foram encontrados resultados",
                        sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                        sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                        sInfoFiltered: "(Total de _MAX_ registros)"
                    }
                });


                //16/03/2016
                splitINI();


            },
            close: function () {
                $('.ui-widget-overlay').css('z-index', 102);
            }
            ,
            error: function (response) {
                alert(response);
            }
        });

    });







    



    var myLayout;


     

      function toggleLiveResizing () {
            $.each( $.layout.config.borderPanes, function (i, pane) {
                var o = myLayout.options[ pane ];
                o.livePaneResizing = !o.livePaneResizing;
            });
        };
	
    function toggleStateManagement ( skipAlert, mode ) {
        if (!$.layout.plugins.stateManagement) return;

        var options	= myLayout.options.stateManagement
		,	enabled	= options.enabled // current setting
        ;
        if ($.type( mode ) === "boolean") {
            if (enabled === mode) return; // already correct
            enabled	= options.enabled = mode
        }
        else
            enabled	= options.enabled = !enabled; // toggle option

        if (!enabled) { // if disabling state management...
            myLayout.deleteCookie(); // ...clear cookie so will NOT be found on next refresh
            if (!skipAlert)
                alert( 'This layout will reload as the options specify \nwhen the page is refreshed.' );
        }
        else if (!skipAlert)
            alert( 'This layout will save & restore its last state \nwhen the page is refreshed.' );

        // update text on button
        var $Btn = $('#btnToggleState'), text = $Btn.html();
        if (enabled)
            $Btn.html( text.replace(/Enable/i, "Disable") );
        else
            $Btn.html( text.replace(/Disable/i, "Enable") );
    };

    // set EVERY 'state' here so will undo ALL layout changes
    // used by the 'Reset State' button: myLayout.loadState( stateResetSettings )
    var stateResetSettings = {
        north__size:		"auto"
	,	north__initClosed:	false
	,	north__initHidden:	false
	,	south__size:		"auto"
	,	south__initClosed:	false
	,	south__initHidden:	false
	,	west__size:			200
	,	west__initClosed:	false
	,	west__initHidden:	false
	,	east__size:			300
	,	east__initClosed:	false
	,	east__initHidden:	false
    };

    

    function splitINI() {

        
        //return false;

        // this layout could be created with NO OPTIONS - but showing some here just as a sample...
        // myLayout = $('body').layout(); -- syntax with No Options

        myLayout = $('.splitter').layout({
            //	reference only - these options are NOT required because 'true' is the default
            closable: false	// pane can open & close
		    ,resizable: true	// when open, pane can be resized 
		    , slidable: false	// when closed, pane can 'slide' open over other panes - closes on mouse-out
		    //, livePaneResizing: true

            //    //	some resizing/toggling settings
		    //, north__slidable: false	// OVERRIDE the pane-default of 'slidable=true'
		    //, north__togglerLength_closed: '100%'	// toggle-button is full-width of resizer-bar
		    //, north__spacing_closed: 20		// big resizer-bar when open (zero height)
		    //, south__resizable: false	// OVERRIDE the pane-default of 'resizable=true'
		    //, south__spacing_open: 0		// no resizer-bar when open (zero height)
		    //, south__spacing_closed: 20		// big resizer-bar when open (zero height)

            //	some pane-size settings
            , west__size: "33%"
		    , west__minSize: 100
		    , east__size: "33%"
		    , east__minSize: 100
            , center__size: "33%"
		    , center__minSize: 100
		    //, east__maxSize: .5 // 50% of layout width
		    //, center__minWidth: 100

            //    //	some pane animation settings
		    //, west__animatePaneSizing: false
		    //, west__fxSpeed_size: "fast"	// 'fast' animation when resizing west-pane
		    //, west__fxSpeed_open: 1000	// 1-second animation when opening west-pane
		    //, west__fxSettings_open: { easing: "easeOutBounce" } // 'bounce' effect when opening
		    //, west__fxName_close: "none"	// NO animation when closing west-pane

            //    //	enable showOverflow on west-pane so CSS popups will overlap north pane
		    //, west__showOverflowOnHover: true

                //	enable state management
		    , stateManagement__enabled: true // automatic cookie load & save enabled by default

		    , showDebugMessages: true // log and/or display messages from debugging & testing code

        });

        // if there is no state-cookie, then DISABLE state management initially
        var cookieExists = !$.isEmptyObject( myLayout.readCookie() );
        if (!cookieExists) toggleStateManagement( true, false );

        //myLayout

        //    // add event to the 'Close' button in the East pane dynamically...
		//	.bindButton('#btnCloseEast', 'close', 'east')

		//	// add event to the 'Toggle South' buttons in Center AND South panes dynamically...
		//	.bindButton('.south-toggler', 'toggle', 'south')

		//	// add MULTIPLE events to the 'Open All Panes' button in the Center pane dynamically...
		//	.bindButton('#openAllPanes', 'open', 'north')
		//	.bindButton('#openAllPanes', 'open', 'south')
		//	.bindButton('#openAllPanes', 'open', 'west')
		//	.bindButton('#openAllPanes', 'open', 'east')

		//	// add MULTIPLE events to the 'Close All Panes' button in the Center pane dynamically...
		//	.bindButton('#closeAllPanes', 'close', 'north')
		//	.bindButton('#closeAllPanes', 'close', 'south')
		//	.bindButton('#closeAllPanes', 'close', 'west')
		//	.bindButton('#closeAllPanes', 'close', 'east')

		//	// add MULTIPLE events to the 'Toggle All Panes' button in the Center pane dynamically...
		//	.bindButton('#toggleAllPanes', 'toggle', 'north')
		//	.bindButton('#toggleAllPanes', 'toggle', 'south')
		//	.bindButton('#toggleAllPanes', 'toggle', 'west')
		//	.bindButton('#toggleAllPanes', 'toggle', 'east')

        //;


        ///*
		// *	DISABLE TEXT-SELECTION WHEN DRAGGING (or even _trying_ to drag!)
		// *	this functionality will be included in RC30.80
		// */
        //$.layout.disableTextSelection = function () {
        //    var $d = $(document)
		//	, s = 'textSelectionDisabled'
		//	, x = 'textSelectionInitialized'
        //    ;
        //    if ($.fn.disableSelection) {
        //        if (!$d.data(x)) // document hasn't been initialized yet
        //            $d.on('mouseup', $.layout.enableTextSelection).data(x, true);
        //        if (!$d.data(s))
        //            $d.disableSelection().data(s, true);
        //    }
        //    //console.log('$.layout.disableTextSelection');
        //};
        //$.layout.enableTextSelection = function () {
        //    var $d = $(document)
		//	, s = 'textSelectionDisabled';
        //    if ($.fn.enableSelection && $d.data(s))
        //        $d.enableSelection().data(s, false);
        //    //console.log('$.layout.enableTextSelection');
        //};
        //$(".ui-layout-resizer")
		//	.disableSelection() // affects only the resizer element
		//	.on('mousedown', $.layout.disableTextSelection); // affects entire document


    }
    



}










