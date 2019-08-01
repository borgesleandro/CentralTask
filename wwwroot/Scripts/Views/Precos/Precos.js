$(document).ready(function () {

    $("select[multiple]").multiselect().multiselectfilter();
    $("select:not([multiple])").chosen();

    $("#CODDIV").change(function (e) {

        $("#Produtos").multiselect("uncheckAll");
        $("#Produtos").multiselect("disable");

        if ($("#CODDIV").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterLinhasPorDivisao",
                contentType: "application/json",
                data: JSON.stringify({ divisao: $("#CODDIV").val() }),
                success: function (data) {
                    $("#PK_CODLINHA").multiselect("enable");
                    $("#PK_CODLINHA").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#PK_CODLINHA").append(option);
                    });

                    $("#PK_CODLINHA").multiselect("refresh");
                }
            });

        }
        else {
            $("#PK_CODLINHA").multiselect("uncheckAll");
            $("#PK_CODLINHA").multiselect("disable");
        }


    });




    //14/12/2015
    $("#CNPJ_OL").on("change", function (evt) {

        if ($('#CNPJ_OL').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "GetUfsAreaAtuacao",
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({ CNPJ_OL: $('#CNPJ_OL').val() }),
                success: function (data) {
                    $("#UF").multiselect("enable");
                    $("#UF").empty();

                    if (data.length == 0) {
                        $("#UF").multiselect("disable");
                        alert("Não existe área de atuação cadastrada para o(s) distribuidore(s) selecionado(s).");
                    }
                    else {

                        $.each(data, function () {
                            var option = $('<option></option>');

                            option.attr('value', this.codigo);
                            option.text(this.descricao);

                            $("#UF").append(option);
                        });
                        $("#UF").multiselect("refresh");
                    }

                },
                error: function (data) {
                    $("#UF").multiselect("uncheckAll");
                    $("#UF").multiselect("disable");
                    alert("Houve um erro ao obter a lista UF's.");
                }
            });

        }
        else {

            $("#UF").multiselect("uncheckAll");
            $("#UF").multiselect("disable");
        }

    });




    $("#PK_CODLINHA").change(function (e) {

        if ($('#PK_CODLINHA').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "ObterProdutosPorLinha",
                contentType: 'application/json',
                data: JSON.stringify({ linhas: $('#PK_CODLINHA').val() }),
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

    $("#btnPesquisar").on("click",function () {

        $("#exportarLinkDiv").html("");

        if ($("#CODDIV").val() == "") {
            alert("É necessário selecionar a Companhia.");
            return;
        }


        if ($("#precopordistrib").val() == "S") {
            if ($("#CNPJ_OL").val() == "" || $("#CNPJ_OL").val() == null) {
                alert("É necessário selecionar o distribuidor.");
                return;
            }
        }
        

        if ($("#UF").val() == "" || $("#UF").val() == null) {
            alert("É necessário selecionar a UF.");
            return;
        }


        $.get(controller + "List", null, function (response) {


           
            var coddiv = $("#CODDIV").val();
            var cnpjol = "";
            if ($("#precopordistrib").val() == "S") {
                cnpjol = $("#CNPJ_OL").val();
            }

            var uf = $("#UF").val();
            var pk_codlinha = $("#PK_CODLINHA").val();
            var produtos = $("#Produtos").val();
             

            $("#consulta").html(response);
            
            
            if ($("#precopordistrib").val() == "S") {
                $("#precos").dataTable({
                    "sPaginationType": "full_numbers",
                    "bAutoWidth": false,
                    "bProcessing": true,
                    "bServerSide": true,
                    "bSort": true   ,
                    "sAjaxSource": controller + "SetDataTable",
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        aoData.push(
                            { "name": "CODDIV", "value": coddiv },
                            { "name": "CNPJ_OL", "value": cnpjol },
                            { "name": "UF", "value": uf },
                            { "name": "PK_CODLINHA", "value": pk_codlinha },
                            { "name": "PRODUTOS", "value": produtos });
                        $.post(sSource, aoData, function (json) {
                            fnCallback(json);
                        });
                    },
                    "aoColumns": [
                      { "mDataProp": "DESCLINHA", "sWidth": "10%" },
                      { "mDataProp": "CODPROD", "sWidth": "10%" },
                      { "mDataProp": "DESCPROD", "sWidth": "20%" },
                      { "mDataProp": "CNPJ_OL", "sWidth": "35%" },
                      { "mDataProp": "UF", "sWidth": "5%" },
                      { "mDataProp": "PRC_FABRICA", "sWidth": "5%" },
                      { "mDataProp": "PRC_LIQ", "sWidth": "5%" },
                      { "mDataProp": "PMC", "sWidth": "5%" }
                    ]
                });
            }
            else {
                $("#precos").dataTable({
                    "sPaginationType": "full_numbers",
                    "bAutoWidth": false,
                    "bProcessing": true,
                    "bServerSide": true,
                    "bSort": true,
                    "sAjaxSource": controller + "SetDataTable",
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        aoData.push(
                            { "name": "CODDIV", "value": coddiv },
                            { "name": "CNPJ_OL", "value": cnpjol },
                            { "name": "UF", "value": uf },
                            { "name": "PK_CODLINHA", "value": pk_codlinha },
                            { "name": "PRODUTOS", "value": produtos });
                        $.post(sSource, aoData, function (json) {
                            fnCallback(json);
                        });
                    },

                    "aoColumns": [
                      { "mDataProp": "DESCLINHA", "sWidth": "15%" },
                      { "mDataProp": "CODPROD", "sWidth": "15%" },
                      { "mDataProp": "DESCPROD", "sWidth": "50%" },
                      { "mDataProp": "UF", "sWidth": "5%" },
                      { "mDataProp": "PRC_FABRICA", "sWidth": "5%" },
                      { "mDataProp": "PRC_LIQ", "sWidth": "5%" },
                      { "mDataProp": "PMC", "sWidth": "5%" }
                    ]
                });
            }





            if ($("#Produtos").val() != null) {
                if ($("#Produtos").val().length == 1) {

                    $("#novosPrecosRow").show();

                    $("#btnAlterarPrecos").on("click", function () {


                        //vERIFICA SE O Preço fábrica esta zerado 
                        //OS 4371 dia 09/11/2015
                        if ($("#txtPrecoFabrica").val() == "") {
                            alert("É necessário informar o preço fábrica.");
                            return;
                        }
                        else {
                            if (parseFloat($("#txtPrecoFabrica").val()) == 0) {
                                alert("O preço fábrica não pode ser zero.");
                                return;
                            }
                        }


                        $(".loading-save").show();

                        var coddiv = $("#CODDIV").val();
                        var uf = $("#UF").val();
                        var codprod = $("#Produtos").val();
                        var precoFab = $("#txtPrecoFabrica").val();
                        var precoLiq = $("#txtPrecoLiquido").val();
                        var pmc = $("#txtPMC").val();

                        var cnpjol = "";
                        if ($("#precopordistrib").val() == "S") {
                            cnpjol = $("#CNPJ_OL").val();
                        }

                        var precos = [
                            { "name": "CodDiv", "value": coddiv },
                            { "name": "UF", "value": uf },
                            { "name": "CNPJ_OL", "value": cnpjol },
                            { "name": "CodProd", "value": codprod },
                            { "name": "precoFab", "value": precoFab },
                            { "name": "precoLiq", "value": precoLiq },
                            { "name": "pmc", "value": pmc }
                        ];

                        $.post(controller + "AlterarPrecos", precos, function (response) {

                            if (response.success) {
                                alert("Preços alterados com sucesso.");
                                $("#btnPesquisar").trigger("click");
                            }
                            else
                                alert(response.message);

                            $(".loading-save").hide();

                        });
                    });

                    $("#txtPrecoFabrica").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
                    $("#txtPrecoLiquido").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
                    $("#txtPMC").maskMoney({ showSymbol: false, decimal: ",", thousands: "" });
                }
                else {
                    $("#novosPrecosRow").hide();
                }
            }

        });

    });

    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        if ($("#CODDIV").val() == "") {
            alert("É necessário selecionar a Companhia.");
            return;
        }

        $(".loading-save").show();

        var coddiv = $("#CODDIV").val();
        var uf = $("#UF").val();
        var pk_codlinha = $("#PK_CODLINHA").val();
        var produtos = $("#Produtos").val();

        var cnpjol = "";
        if ($("#precopordistrib").val() == "S") {
            cnpjol = $("#CNPJ_OL").val();
        }

        var model = { CODDIV: coddiv, UF: uf,  CNPJ_OL : cnpjol , PK_CODLINHA: pk_codlinha, PRODUTOS: produtos }

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "Precos/ExportarExcel",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='Precos.xls' class=''><img src='Content/botao-salvar-download.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                $(".loading-save").hide();
            }
        });

    });

});