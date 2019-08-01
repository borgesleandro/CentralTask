
$(document).ready(function () {
    //ajusta o tamanho da div de acordo com a table
    $('#consulta').width($('.tamanhofieldset').width());
    $("select").multiselect().multiselectfilter();
    $("#EQUI_EQUIPE").multiselect("disable");
    $("#CODPROD").multiselect("disable");
    $("#CODDIV").multiselect("destroy");
    $("#CODDIV").chosen();
    $("#CAMPANHA").multiselect("destroy");
    $("#CAMPANHA").chosen();

    $("#TIPOLOG").multiselect("destroy");
    $("#TIPOLOG").chosen();
     
    $(window).resize(function () {
        //ajusta o tamanho da div de acordo com a table
        $('#consulta').width($('.mws-panel').width()-2);

        $('.ajusta_tabela').width($('#consulta').width());
        $('.grid_tabela').width($('#consulta').width());
    });

    $("#TIPOLOG").change(function () {
        //new { Id = 1, Name = "Desconto de entrada" },
        //new { Id = 2, Name = "Preço por produto" },
        //new { Id = 3, Name = "Condição por produto" },
        $("#consulta").html('');
        //se tipo Id = 3, Name = "Condição por produto" }, não tem filtro de cia, equipe e distribuidor
      if ($("#TIPOLOG").val() == "3" || $("#TIPOLOG").val() == "5")
        {
            $("#linhacia").hide();
            $("#linhadistribuidor").hide();
        }
        else if ($("#TIPOLOG").val() == "2") //se tipo 2, não tem cia e equipe
        {
            $("#linhacia").hide();
        }
        else
        {
            $("#linhacia").show();
            $("#linhadistribuidor").show();
            $("#divequipe").show();
        }
    });

    //#################################################################
    //QUANDO SELECIONAR A COMPANHIA VAI CARREGAR O COMBO EQUIPE
    //#################################################################
    $("#CODDIV").change(function () {
        if ($('#CODDIV').val() != "") {
            $.ajax({
                type: "POST",
                url: controller + "ObterEquipesPorCia",
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
        }
        else {
            $("#EQUI_EQUIPE").multiselect("uncheckAll");
            $("#EQUI_EQUIPE").multiselect("disable");
        }
    });

    $("#PK_CODLINHA").change(function () {
        if ($('#PK_CODLINHA').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "ObterProdutosPorLinha",
                contentType: 'application/json',
                data: JSON.stringify({ linhas: $('#PK_CODLINHA').val() }),
                success: function (data) {
                    $("#CODPROD").multiselect("enable");
                    $("#CODPROD").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CODPROD").append(option);
                    });

                    $("#CODPROD").multiselect("refresh");
                }
            });
        }
        else {
            $("#CODPROD").multiselect("uncheckAll");
            $("#CODPROD").multiselect("disable");
        }
    });

    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisar").on("click", function () {

        $("#exportarLinkDiv").html("");
        //###############################################
        //          VERIFICAÇÃO DE TIPO DE CONSULTA
        //###############################################
        if ($("#TIPOLOG").val()=="")
        {
            alert("É necessário selecionar o tipo de log.");
            return;
        }

        //###############################################
        //          VERIFICAÇÃO DE DATA
        //###############################################
        var ssmsgDataInvalida = "";
        if ($("#txtPeriodoINI").val() == "" || $("#txtPeriodoINI").val() == "null" || $("#txtPeriodoINI").val() == null) {
            ssmsgDataInvalida = "É necessário informar o período inicial.\n";
        }
        if ($("#txtPeriodoFIM").val() == "" || $("#txtPeriodoFIM").val() == "null" || $("#txtPeriodoFIM").val() == null) {
            ssmsgDataInvalida += "É necessário informar o período final.\n";
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

        //Habilita imagem de LOAD
        $(".loading-save").show();

        var model = {
            PeriodoIni: $("#txtPeriodoINI").val(),
            PeriodoFim: $("#txtPeriodoFIM").val(),
            TipoLog: $("#TIPOLOG").val() , 
            Companhia: $("#CODDIV").val(), //cia
            Equipe: $("#EQUI_EQUIPE").val(),
            Linha: $("#PK_CODLINHA").val(),
            Produto: $("#CODPROD").val(),
            Distribuidor: $("#CNPJ_OL").val(),
            UF: $("#CODEST").val()            
        };

        xhr = $.ajax(
        {
            type: 'POST',
            contentType: 'application/json',
            url: "ConsultaLogs/List",
            async: true,
            data: JSON.stringify(model),
            success: function (response)
            {
                if (response.success == false) {
                    alert(response.data);
                }
                else {
                    //Tabela
                    $("#consulta").html(response);
                    $("#consulta").show();

                    $("#tbpesquisa").dataTable({
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
            error: function (response)
            {
                $(".loading-save").hide();
            }
        });
    });
});