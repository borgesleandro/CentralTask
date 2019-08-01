var multiselectCondicao = null;
var currentAjaxSearchRequestDistribuidor = null;
var currentAjaxSearchRequestPrazo = null;
$(document).ready(function () {
      
  

    //Controle para alterar o label do botão quando o checkbox de desconto por faixa estiver marcado
    $(document).on("click", "#FLG_DESCONTO_POR_QTD", function () {

        if ($("#FLG_DESCONTO_POR_QTD").is(":checked") == true ) {            
            $("#btnSalvarCadastrar").val("Ativar Condição Comercial");
            $("#btnSalvarCadastrar").removeClass("blue").addClass("orange");
        } else {            
            $("#btnSalvarCadastrar").val("Salvar / Cadastrar Descontos");
            $("#btnSalvarCadastrar").removeClass("");
            $("#btnSalvarCadastrar").removeClass("orange").addClass("blue");
        }
        
    });

    var PreenchePrazo = function () {

        var sendData = {};

        var cnpjs = new Array();

        $("#CNPJ_DIST").multiselect("getChecked").each(function () {
            cnpjs.push($(this).val());
        });

        sendData.canalID = $("#CANAL_ID").val();


        if ($("#CONDCOM_ID").length > 0) {
            sendData.condicaoID = $("#CONDCOM_ID").val();
        }


        sendData.cnpjs = cnpjs;

        $("option", "#PRAZO_ID").each(function () {
            if ($(this).val() != "") $(this).remove();
        });
        $("#PRAZO_ID").multiselect('refresh');

        if (currentAjaxSearchRequestPrazo != null) currentAjaxSearchRequestPrazo.abort();


        currentAjaxSearchRequestPrazo = $.post(controller + "GetPrazo", $.toDictionary(sendData), function (data) {
            $(data).each(function () {
                var text = $(this).prop("Text");
                var value = $(this).prop("Value");
                var checked = $(this).prop("Checked");
                $("#PRAZO_ID").append("<option value='" + value + "' " + (checked ? "selected" : "") + "> " + text + "</option>");


            });
            $("#PRAZO_ID").multiselect('refresh');
        });
    };

    var PreencheDistribuidor = function () {
        var selectedCanal = $(".canal").val();
        if (selectedCanal != "") {
            var administrativo = false;
            $("option", "#CNPJ_DIST").each(function () {
                if ($(this).val() != "") $(this).remove();
            });
            $(canaisAdministrativos).each(function () {
                if (this == selectedCanal) administrativo = true;
            });
            if (administrativo) {

                var sendData = $("#CONDCOM_ID").length > 0 ? { condicaoID: $("#CONDCOM_ID").val() } : null;

                if (currentAjaxSearchRequestDistribuidor != null) currentAjaxSearchRequestDistribuidor.abort();

                currentAjaxSearchRequestDistribuidor = $.post(controller + "GetDistribuidor", sendData, function (data) {
                    $(data).each(function () {
                        var text = $(this).prop("Text");
                        var value = $(this).prop("Value");
                        var checked = $(this).prop("Checked");
                        $("#CNPJ_DIST").append("<option value='" + value + "' " + (checked ? "selected" : "") + " > " + text + "</option>");


                    });
                    $(".distribuidor").show();
                    $("#CNPJ_DIST").multiselect('refresh');
                    PreenchePrazo();

                });
            } else {

                $(".distribuidor").hide();
                //lIMPA O CBO PRAZO
                $("option", "#PRAZO_ID").each(function () {
                    if ($(this).val() != "") $(this).remove();

                    $("#PRAZO_ID").multiselect('refresh');
                });

            }
        }
    };
    
    if ($("#CNPJ_DIST").length > 0) {
        $("#CNPJ_DIST").multiselect().multiselectfilter();
        //$("#CNPJ_DIST").multiselect($("#chkDistribuidor").is(":checked") ? 'enable' : 'disable');
        PreencheDistribuidor();
    }

    if ($("#PRAZO_ID").length > 0 ) {
        $("#PRAZO_ID").multiselect().multiselectfilter();
        if($("#CNPJ_DIST").length == 0 || !$("#CNPJ_DIST").is(":visible")) {
            PreenchePrazo();
        }

    }





    $(document).on("change", ".canal", function () {
        PreencheDistribuidor();

    });

    $(document).on("submit", ".createForm,.editForm", function () {
        var ok = true;
        var campoObrigatorio = '<label generated="true" class="error">Este campo é obrigatório</label>';



        //if ($("#radio").val() == "") {
        //    $(campoObrigatorio).width($("#rbtDesconto").next().width);
        //    $("#rbtDesconto").next().after(campoObrigatorio);
        //    ok = false;
        //}
        


        if ($("#PRAZO_ID").multiselect("getChecked").length == 0) {
            $(campoObrigatorio).width($("#PRAZO_ID").next().width);
            $("#PRAZO_ID").next().after(campoObrigatorio);
            ok = false;
        }
        //if ($("#chkDistribuidor").is(":checked") && $("#CNPJ_DIST").multiselect("getChecked").length == 0) {
        //    $(campoObrigatorio).width($("#CNPJ_DIST").next().width);
        //    $("#CNPJ_DIST").next().after(campoObrigatorio);
        //    ok = false;
        //}
        if ( $("#CNPJ_DIST").multiselect("getChecked").length == 0) {
            $(campoObrigatorio).width($("#CNPJ_DIST").next().width);
            $("#CNPJ_DIST").next().after(campoObrigatorio);
            ok = false;
        }

        return ok;

    });

    //$(document).on("click", "#chkDistribuidor", function () {
    //    var checked = $(this).is(":checked");

    //    if (!checked) {
    //        $("#CNPJ_DIST").multiselect('uncheckAll');
    //    }
    //    else {
    //        PreenchePrazo();
    //    }

    //    $("#CNPJ_DIST").multiselect(checked ? "enable" : "disable");

    //});

    $(document).on("multiselectcheckall multiselectuncheckall multiselectclick", "#CNPJ_DIST", function (event, ui) {
        PreenchePrazo();
    });



});

