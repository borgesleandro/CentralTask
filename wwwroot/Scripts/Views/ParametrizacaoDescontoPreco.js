$(document).ready(function () {

    //COLOCA O LAYOUT dos combos
    $("select").multiselect().multiselectfilter();
    $("#PERMISSAO").multiselect("destroy");
    $("#PERMISSAO").chosen();


    //DESABILITA O COMBO
    $("#GERENTESDISTRITAIS").multiselect("disable");
    $("#REPRESENTANTES").multiselect("disable");
    

    //carrega o combo de GERENTES DISTRITAIS com os subordinados dos gerentes REGIONAIS SELECIONADOS
    //###########################################################
    $("#GERENTESREGIONAIS").change(function () {
        if ($('#GERENTESREGIONAIS').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "ObterSUBORDINADOS",
                contentType: 'application/json',
                data: JSON.stringify({ linhas: $('#GERENTESREGIONAIS').val() }),
                success: function (data) {
                    $("#GERENTESDISTRITAIS").multiselect("enable");
                    $("#GERENTESDISTRITAIS").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.usuid);
                        option.text(this.nome);

                        $("#GERENTESDISTRITAIS").append(option);
                    });

                    $("#GERENTESDISTRITAIS").multiselect("refresh");
                }
            });
        }
        else {
            $("#GERENTESDISTRITAIS").multiselect("uncheckAll");
            $("#GERENTESDISTRITAIS").multiselect("disable");
        }
    });
    //###########################################################
    

    //carrega o combo de REPRESENTANTES com os subordinados dos gerentes DISTRITAIS SELECIONADOS
    //###########################################################
    $("#GERENTESDISTRITAIS").change(function () {
        if ($('#GERENTESDISTRITAIS').val() != null) {
            $.ajax({
                type: "POST",
                url: controller + "ObterSUBORDINADOS",
                contentType: 'application/json',
                data: JSON.stringify({ linhas: $('#GERENTESDISTRITAIS').val() }),
                success: function (data) {
                    $("#REPRESENTANTES").multiselect("enable");
                    $("#REPRESENTANTES").empty();

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.usuid);
                        option.text(this.nome);

                        $("#REPRESENTANTES").append(option);
                    });

                    $("#REPRESENTANTES").multiselect("refresh");
                }
            });
        }
        else {
            $("#REPRESENTANTES").multiselect("uncheckAll");
            $("#REPRESENTANTES").multiselect("disable");
        }
    });
    //###########################################################
    

    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisar").on("click", function () {
        $("#exportarLinkDiv").html("");

        if ($("#REPRESENTANTES").val() == "" || $("#REPRESENTANTES").val() == null) {
            alert("É necessário selecionar um Representante."); //É necessário selecionar um Representante
            return;
        }

        ////Habilita imagem de LOAD
        $(".loading-save").show();

        $.get(controller + "List", null, function (response) {

            var gerregionais = $("#GERENTESREGIONAIS").val();
            var gerdistritais = $("#GERENTESDISTRITAIS").val();
            var representantes = $("#REPRESENTANTES").val();
            var permissao = $("#PERMISSAO").val();
            

            $("#consulta").html(response);

            //referencia a table permissao
            $("#tbpermissao").dataTable({
                "sPaginationType": "full_numbers",
                "bAutoWidth": false,
                "bProcessing": true,
                "bServerSide": true,
                "bSort": true,
                "sAjaxSource": controller + "SetDataTable",
                "fnServerData": function (sSource, aoData, fnCallback) {
                    aoData.push(
                        { "name": "GerRegional", "value": gerregionais },
                        { "name": "GerDistrital", "value": gerdistritais },
                        { "name": "Representante", "value": representantes },
                        { "name": "Permissao", "value": permissao });
                    $.post(sSource, aoData, function (json) {
                        fnCallback(json);
                        //desabilita imagem de LOAD
                        $(".loading-save").hide();
                    });
                },
                "aoColumns": [
                  { "mDataProp": "GerRegionais", "sWidth": "14%" },
                  { "mDataProp": "GerDistritais", "sWidth": "13%" },
                  { "mDataProp": "Representantes", "sWidth": "25%" },
                  { "mDataProp": "Permissao", "sWidth": "4%" }
                ]
            });
        });
    });
    //#############################################

    
    //########################################################
    //                  SALVAR
    //########################################################
    $(document).on("click", ".btn-salvar", function () {
        
        if ($("form").valid()) {
        
            var gerregionais = $("#GERENTESREGIONAIS").val();
            var gerdistritais = $("#GERENTESDISTRITAIS").val();
            var representantes = $("#REPRESENTANTES").val();
            var permissao = $("#PERMISSAO").val();
            var erros = [];

            if (!representantes) {
                erros.push("É obrigatória a seleção de um representante!");
            }
            if (!permissao) {
                erros.push("É obrigatória a seleção da permissão!");
            }

            if (erros.length > 0) {
                alert(erros.join('<br/>'));
                return;
            }

            $.ajax({
                type: "POST",
                url: controller + "Salvar",
                contentType: 'application/json',
                data: JSON.stringify({
                        Representantes: representantes,
                        Permissao: String(permissao)
                }),
                success: function (response) {
                    if (response.ok) {
                        alert("Dados salvos com sucesso!");
                        $("#btnPesquisar").click();
                    } else {
                        alert("Ocorreu um erro ao tentar salvar os dados: " + response.message);
                    }
                }
            });
        }
    });
    //#############################################
    
    
    //########################################################
    //                  EXPORTAR EXCEL
    //########################################################
    $("#btnExportar").on("click", function () {

        //Habilita imagem de LOAD
        $(".loading-save").show();


        $("#exportarLinkDiv").html("");

        if ($("#REPRESENTANTES").val() == "" || $("#REPRESENTANTES").val() == null) {
            //Dasabilita imagem de LOAD
            $(".loading-save").hide();
            alert("É obrigatória a seleção de um representante."); //É necessário selecionar um Representante
            return;
        }


        var gerregionais = $("#GERENTESREGIONAIS").val();
        var gerdistritais = $("#GERENTESDISTRITAIS").val();
        var representantes = $("#REPRESENTANTES").val();
        var permissao = $("#PERMISSAO").val();


        var model = { GerRegional: gerregionais, GerDistrital: gerdistritais, Representante: representantes, Permissao: permissao }

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "ParametrizacaoDescontoPreco/ExportarExcel",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () {
                    $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='ParametrizacaoDescontoPreco.xls' class=''><img src='Content/botao-salvar-download.png'/></a>");
                    //Dasabilita imagem de LOAD
                    $(".loading-save").hide();
                }, 2000);

                
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                //Dasabilita imagem de LOAD
                $(".loading-save").hide();
            }
        });

    });
    //#############################################

});