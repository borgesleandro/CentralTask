$(document).ready(function () {
   
    

    //aplica mascara para aceitar apenas números
    //$('#Opcao').maskMoney({ showSymbol: false, precision: 0, defaultZero:false ,  allowZero: true, thousands: "" });


    $('.sonumero').mask("?9", { placeholder: "" });

    $('.formatahora').mask("99:99", { placeholder: "" });



    //$("#COD_EQUIPE").prop('disabled', true);

    

    //seta o período com o promeiro dia do mes e a data corrente
    var hojedate = new Date();
    //var inimesstring = ('01').slice(-2) + '/'
    //        + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
    //        + hojedate.getFullYear();
    var hojestring = ('0' + hojedate.getDate()).slice(-2) + '/'
                     + ('0' + (hojedate.getMonth() + 1)).slice(-2) + '/'
                     + hojedate.getFullYear();

    //$("#txtDataPedido").val(hojestring);
    //$("#txtPeriodoFIM").val(hojestring);

    //$("#txtDataAprovacao").val(hojestring);


    //$('#txtHoraPedido').datetimepicker({
    //    timeFormat: ' hh:mm:ss'
    //});
    


    //$("select").multiselect().multiselectfilter();
    //$("#EQUI_EQUIPE").multiselect("disable");
    
    //$("#CODDIV").multiselect("destroy");
    //$("#CODDIV").chosen();

    // Regex validate hour
    var matchhora = new RegExp(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/gi);



    $("#btnSalvar").on("click", function () {
    
        var ssmsg = "";
        try {
            $.datepicker.parseDate('dd/mm/yy', $("#DT_INCLUSAO").val());
        }
        catch (err) {
            ssmsg += "Data pedido inválida.\n";
        }
        
        if ($("#HORA_INCLUSAO").val() != "") {
            if (!$("#HORA_INCLUSAO").val().match(matchhora)) {
                ssmsg += "Hora pedido inválido.\n";
            }
        }

        
        if ($("#DT_APROVACAO").val() != "") {
            try {
                $.datepicker.parseDate('dd/mm/yy', $("#DT_APROVACAO").val());
            }
            catch (err) {
                ssmsg += "Data aprovação inválido.\n";
            }
        }

        if ($("#DT_APROVACAO").val() == "" && $("#HORA_APROVACAO").val() != "") {
            ssmsg += "Data aprovação inválido.\n";
        }
        if ($("#DT_APROVACAO").val() != "" && $("#HORA_APROVACAO").val() == "") {
            ssmsg += "Hora aprovação inválido.\n";
        }        


        if ($("#HORA_APROVACAO").val() != "") {
            if (!$("#HORA_APROVACAO").val().match(matchhora)) {
                ssmsg += "Hora aprovação inválido.\n";
            }
        }



        if (ssmsg  != "") {
            alert(ssmsg);
            return false;
        }
    });

     


    $(document).on("click", ".deletarCancelAut", function () {
        var deactivateButton = $(this);
        var condicaoID = deactivateButton.attr("data-IDCANCEL");
        var tr = deactivateButton.parents("tr:first");

        alert("Deseja realmente excluir o cancelamento automático de pedido? Uma vez excluído, ele será perdido.", "Deletar cancelamento automácico de pedido", null,
            function () {

                $.post(controller + "DelRegistro", { id: condicaoID }, function (data) {
                    if (data) {
                        alert("O cancelamento automático de pedido foi excluído com sucesso.");
                        tr.remove();
                    }
                    else {
                        alert("Ocorreu um erro ao excluir o cancelamento automático do pedido. Por favor, tente novamente.");
                    }
                });
            }
        );
    });



    


    //#################################################################
    //QUANDO SELECIONAR A COMPANHIA VAI CARREGAR O COMBO EQUIPE
    //#################################################################
    $("#COD_CIA").change(function () {
        if ($('#COD_CIA').val() != "") {
           
            $.ajax({
                type: "POST",
                url: controller + "ObterEquipesPorCia",
                contentType: 'application/json',
                data: JSON.stringify({ cia: $('#COD_CIA').val() }),
                success: function (data) {
                    //$("#EQUI_EQUIPE").multiselect("enable");
                    $("#COD_EQUIPE").prop('disabled', false);
                    $("#COD_EQUIPE").empty();

                    var option1 = $('<option></option>');
                    option1.attr('value', '');
                    option1.text('Selecione uma opção');
                    $("#COD_EQUIPE").append(option1);


                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#COD_EQUIPE").append(option);
                    });

                    //$("#EQUI_EQUIPE").multiselect("refresh");
                }
            });


        }
        else {
            $("#COD_EQUIPE").empty();
        //    $("#COD_EQUIPE").prop('disabled', true);
        }
    });





});


  
