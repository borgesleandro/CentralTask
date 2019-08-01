




$(document).ready(function () {

    //ajusta o tamanho da div de acordo com a table
    $('#consulta').width($('.tamanhofieldset').width());



    $("select").multiselect().multiselectfilter();
    $("#CNPJ_OL").multiselect("destroy");
    $("#CNPJ_OL").chosen();




    //14/12/2015
    $("#CNPJ_OL").on("change", function (evt) {

        $("#exportarLinkDiv").html("");
        $("#consulta").html('');
        
        $("#UF").multiselect("enable");
        $("#UF").empty();


        //alert($('#CNPJ_OL').val());

        if ($('#CNPJ_OL').val() != null && $('#CNPJ_OL').val() != "") {
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
                        //traz todos marcados
                        //$(".ui-multiselect-all").click();
                        $("#UF").multiselect("checkAll");
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



    $("#UF").on("change", function (evt) {

        $("#exportarLinkDiv").html("");
        $("#consulta").html('');

    });


    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisar").on("click", function () {

        //###############################################
        //          VERIFICAÇÃO DE TIPO DE CONSULTA
        //###############################################
        if ($("#CNPJ_OL").val() == "") {
            alert("É necessário selecionar o distribuidor.");
            return;
        }
        if ($("#UF").val() == "" || $("#UF").val() == null) {
            alert("É necessário selecionar ao menos uma UF.");
            return;
        }


        ////Habilita imagem de LOAD
        $(".loading-save").show();


        //aligntoright = classe criada no Index.cshtml
        var columns = [];
        var obj = { "mDataProp": "CODPROD",  sTitle: "Código Produto" };
        columns.push(obj);
        var obj = { "mDataProp": "DESCRICAO", sTitle: "Descrição Produto" };
        columns.push(obj);
        var UFs = $("#UF").val();
        for (var i = 0 ; i < UFs.length ; i++) {
            var obj = { "mDataProp": UFs[i] + "_PRECO", sTitle: UFs[i] + " preço", "sClass": "aligntoright" };
            columns.push(obj);
            var obj = { "mDataProp": UFs[i] + "_DESCONTO", sTitle: UFs[i] + " desconto", "sClass": "aligntoright", };
            columns.push(obj);
        }


        $.get(controller + "List", null, function (response) {

            $("#consulta").html(response);

            $("#tbpesquisa").dataTable({
                "sPaginationType": "full_numbers",
                "bAutoWidth": true,
                "bProcessing": true,
                "bServerSide": false,
                "bSort": true,
                "sScrollX": "100%",
                "sAjaxSource": controller + "SetDataTable",
                "fnServerData": function (sSource, aoData, fnCallback) {
                    aoData.push(
                           { "name": "Distribuidor", "value": $("#CNPJ_OL").val() },
                           { "name": "UF", "value": $("#UF").val() });

                    $.post(sSource, aoData, function (json) {
                        fnCallback(json);
                        $(".loading-save").hide();
                    });
                },
                //colunas do minha view de parametros PARA SEREM EXIBIDOS
                "aoColumns": columns
            });
        });
    });
    //#############################################






    //#############################################
    //          EXPORTAR EXCEL
    //#############################################
    $("#btnExportar").on("click", function () {

        
        $("#exportarLinkDiv").html("");
        

        //###############################################
        //          VERIFICAÇÃO DE TIPO DE CONSULTA
        //###############################################
        if ($("#CNPJ_OL").val() == "") {
            alert("É necessário selecionar o distribuidor.");
            return;
        }
        if ($("#UF").val() == "" || $("#UF").val() == null) {
            alert("É necessário selecionar ao menos uma UF.");
            return;
        }


        ////Habilita imagem de LOAD
        $(".loading-save").show();
         


        var model = { Distribuidor: $("#CNPJ_OL").val(), UF: $("#UF").val()}


        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: controller + "ExportarExcel",
            async: true,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                var dateNow = new Date();
                var dataHoje = dateNow.getFullYear().toString() + ("0" + (dateNow.getMonth() + 1)).slice(-2) + ("0" + dateNow.getDate()).slice(-2);
                
                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='Precos_" + dataHoje + ".xls' class=''><img src='Content/botao-salvar-download.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                $(".loading-save").hide();
            }
        });
    });
    //#############################################

   


});
//######################################
//          fim do READY
//######################################
