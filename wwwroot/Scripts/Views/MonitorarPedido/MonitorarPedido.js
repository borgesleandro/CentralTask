var oTable = null;



function ValidaTela()
{
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
        return false; 
    }

    return true;
        //###############################################
        //          FIM VERIFICAÇÃO DE DATA
        //###############################################
}

$(document).ready(function () {

    //ajusta o tamanho da div de acordo com a table
    $('#consulta').width($('.tamanhofieldset').width());

    $("#TextStatus").multiselect().multiselectfilter();

    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisarMONITORA").on("click", function () {

        $("#exportarLinkDiv").html("");

        //Verifica a data
        if (!ValidaTela()) {
            return false;
        }
        
        ////Habilita imagem de LOAD
        $(".loading-save").show();
        
        var model = {
            PeriodoIni: $("#txtPeriodoINI").val(),
            PeriodoFim: $("#txtPeriodoFIM").val(),
            Distribuidor: $("#CNPJ_OL").val(),
            StatusMonitoramento: $("#TextStatus").val()
        };
        
        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "MonitorarPedido/List",
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

                    otable = $("#tbpesquisa").dataTable({
                        "sPaginationType": "full_numbers",
                        "bPaginate": true,
                        "bAutoWidth": false,
                        "bProcessing": false,
                        "bServerSide": false,
                        "bSort": true,
                        //"sScrollX": "100%",
                        "sScrollX": "100%",
                        "oLanguage":
                        {
                            "sZeroRecords": "Não foram encontrados resultados",
                            "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                            "sInfoFiltered": "(Total de _MAX_ registros)"
                        },
                    });

                    $('.dataTables_scrollBody').width('100%');
                }
                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });
         
    });
    //#############################################
     

    $(window).resize(function () {
    //    //para ajustar o cabeçalho no Firefox do DATATABLE
    //    setTimeout(function () {
    //        otable.fnAdjustColumnSizing(true);
    //    }, 1);
        //ajusta o tamanho do grid de acordo com o tamanho da janela
        $('#consulta').width($('.tamanhofieldset').width());
        
    });
            

    
    $(".checkMonitorado").live("click", function () {
        //if ($(this).hasClass("ic-accept")) {
        //    $(this).removeClass("ic-accept").addClass("ic-delete");
        //} else {
        //    $(this).removeClass("ic-delete").addClass("ic-accept");
        //}

        var sendData = {};
        //sendData.type = $(this).parents("table:first").attr(attributeType);
        sendData.SEQPEDIDO = $(this).val();
        sendData.iniciar = $(this).is(":checked");

        //Guarda o objeto
        var obj = $(this);
                

        //var operacao = "";
        //var operacaorealizada = "";
        //var ini = false;
        ////var checked = $(":checked", $(".table-items").dataTable().fnGetNodes());
        //if ($(this).is(":checked")) {
        //    operacao = "iniciar";
        //    operacaorealizada = "iniciado";
        //    ini = true;
        //}
        //else {
        //    operacao = "interromper";
        //    operacaorealizada = "interrompido";
        //}

        ////MARCAR A LINHA COMO ALTERADA
        //tr = $(this).parents("tr:first");
        //$("#FLG_ALTERADA", tr).val(true);

        alert("Deseja encerrar este monitoramento?", "Monitoramento pedido", null, function () {
             
            //PARAMETROS                 
            var sSEQPEDIDO = $(obj).val();
            var sgrupoPedidoID = null;
            var sEmailCopia = null;
            var sOSHD = null;
            
            $.post("MonitorarPedido/IniFimMONITORAR", { SEQPEDIDO: sSEQPEDIDO, grupoPedidoID: sgrupoPedidoID, iniciar: false, EmailCopia: sEmailCopia, OSHD: sOSHD}, function (data) {
                //alert(data.message);
                if (data.ok) {
                    if (data.message != '') {
                        alert(data.message);
                    }
                    else {
                        alert("Monitoramento encerrado com sucesso!");
                    }

                    $(obj).attr("disabled", "disabled");
                    //Seta os valores do encerramento caso tenha encerrado com sucesso                    
                    $(obj).parents("tr:first").find('.tdUSUFim').html(data.usuFim);

                    var dateNow = new Date();
                    var dataHoje = ("0" + dateNow.getDate()).slice(-2) + "/" + ("0" + (dateNow.getMonth() + 1)).slice(-2)   + "/" +  dateNow.getFullYear().toString()   ;

                    $(obj).parents("tr:first").find('.tdDataFim').html(dataHoje);

                    //otable.fnAdjustColumnSizing(true);
                    //$("#btnPesquisarMONITORA").click();
                }
                else {
                    alert('Falha ao encerrar o monitoramento: ' + data.message);
                }
            });
            
        },
            function () {
                //Se clicar no não, volta o CHK PARA o status anterior ao do clique
                $(obj).attr("checked", !$(obj).is(":checked"));
            }
        );
        
    });








    $("#btnExportar").live("click", function () {


        //Verifica a data
        if (!ValidaTela()) {
            return false;
        }

        ////Habilita imagem de LOAD
        $(".loading-save").show();
        
        var model = {
            PeriodoIni: $("#txtPeriodoINI").val(),
            PeriodoFim: $("#txtPeriodoFIM").val(),
            Distribuidor: $("#CNPJ_OL").val(),
            StatusMonitoramento: $("#TextStatus").val()
        };


        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "MonitorarPedido/ModelToSession",
            async: false,
            data: JSON.stringify(model),
            success: function (response) {

                if (response.success) {

                    $("#exportarLinkDiv").append("<a id='anchorLayout' href='MonitorarPedido/ExportarExcelCriadoEmMemoria' class=''></a>");
                    $("#anchorLayout").get(0).click();

                    var interval =
                        setInterval(function () {
                            if ($.cookie('DownloadMonitorarPedidos')) {
                                $(".loading-save").hide();
                                $.removeCookie('DownloadMonitorarPedidos', { path: '/' });
                                clearInterval(interval);
                            }
                        }, 1000);
                }
                else {

                    alert("Erro ao tentar exportar o Excel. Entre em contato com o adminstrador do sistema.");
                    $(".loading-save").hide();
                }
            }
        });
    });










    //VAOLOR MÍNIMO DO PEDIDO POR TIPO DE ESTABELECIMENTO ( LOTR_CODIGO)
    $(".emailcopia").live("click", function () {
        $(".emailcopiaInput").each(function () {
            var valueRestore = $(this).val();
            var spanRestore = $(this).parents(".emailcopia:first");
            spanRestore.html(valueRestore);
        });

                
        var value = $(this).html();
                
        var input = "<input type ='text' maxlength='100' value='" + value.trim() + "' class='emailcopiaInput' />";
        $(this).html(input);

        $('.emailcopiaInput').css('width', '100%');

        $(".emailcopiaInput").on('focusout', function () {
            var spanRestore = $(this).parents(".emailcopia:first");

            var stremail = $(this).val();
            spanRestore.html(stremail);
            //spanRestore.parents("tr:first").find('.VALOR').val($(this).val());
            ////MARCA A LINHA COMO ALTERAÇÃO DO código
            //if (spanRestore.parents("tr:first").find(':input[id="ACAO"]').val() == '') {
            //    spanRestore.parents("tr:first").find(':input[id="ACAO"]').val('A');
            //}


            var EMAILori = spanRestore.parents("tr:first").find(':input[id="EMAILCOPIAOLD"]').val();
            
            if (stremail != EMAILori) {
                
                var sIDmonitora = spanRestore.parents("tr:first").find(':input[id="IDMONITORA"]').val();
                
                $.post("MonitorarPedido/AlteraEmilcopia", { IDmonitora: sIDmonitora, emailcopia: stremail }, function (data) {
                    ////alert(data.message);

                    if (!data.ok) {
                        alert('Falha ao alterar a cópia do email: ' + data.message);
                    }
                    //if (data.ok) {
                    //    if (data.message != '') {
                    //        alert(data.message);
                    //    }
                    //    else {
                    //        alert("Monitoramento encerrado com sucesso!");
                    //    }

                    //    $(obj).attr("disabled", "disabled");
                    //    //Seta os valores do encerramento caso tenha encerrado com sucesso                    
                    //    $(obj).parents("tr:first").find('.tdUSUFim').html(data.usuFim);

                    //    var dateNow = new Date();
                    //    var dataHoje = ("0" + dateNow.getDate()).slice(-2) + "/" + ("0" + (dateNow.getMonth() + 1)).slice(-2) + "/" + dateNow.getFullYear().toString();

                    //    $(obj).parents("tr:first").find('.tdDataFim').html(dataHoje);

                    //    otable.fnAdjustColumnSizing(true);
                    //    //$("#btnPesquisarMONITORA").click();
                    //}
                    //else {
                    //    alert('Falha ao encerrar o monitoramento: ' + data.message);
                    //}
                });
                
                //otable.fnAdjustColumnSizing(true);
            }
        });


        $(".emailcopiaInput").focus();
    });

    



    

});


