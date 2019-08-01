$(document).ready(function () {

    $("#EQUI_EQUIPE").multiselect().multiselectfilter();
    //$("#EQUI_EQUIPE").multiselect();
    $("#EQUI_EQUIPE").multiselect("disable");

    $("#CODDIV").change(function (e) {

        if ($("#CODDIV").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterEquipesPorCia",
                contentType: "application/json",
                data: JSON.stringify({ cia: $("#CODDIV").val() }),
                success: function (data) {

                    $("#EQUI_EQUIPE").empty();

                    //var option = $('<option></option>');
                    //option.attr('value', "");
                    //option.text("Todas");
                    //$("#EQUI_EQUIPE").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#EQUI_EQUIPE").append(option);
                    });


                    $("#EQUI_EQUIPE").multiselect("enable");
                    $("#EQUI_EQUIPE").multiselect("refresh");
                    $("#EQUI_EQUIPE").multiselect("uncheckAll");

                },
                error: function (data) {
                    alert("Não foi possível obter as equipes.");
                    $("#EQUI_EQUIPE").empty();
                    $("#EQUI_EQUIPE").attr("disabled", "disabled");
                }
            });

        }
        else {
            $("#EQUI_EQUIPE").empty();
            $("#EQUI_EQUIPE").attr("disabled", "disabled");
        }

    });

    $("#EQUI_EQUIPE").change(function (e) {

        if ($("#EQUI_EQUIPE").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterGRsPorEquipe",
                contentType: "application/json",
                data: JSON.stringify({ equipe: $("#EQUI_EQUIPE").val() }),
                success: function (data) {

                    $("#CAGR_GR").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Todos");
                    $("#CAGR_GR").append(option);

                    if (data != null)
                    {
                        $.each(data, function () {
                            var option = $('<option></option>');

                            option.attr('value', this.codigo);
                            option.text(this.codigo + " - " + this.descricao);

                            $("#CAGR_GR").append(option);
                        });
                    }

                    $("#CAGR_GR").removeAttr("disabled");

                },
                error: function (data) {
                    alert("Não foi possível obter os Gerentes Regionais.");
                    $("#CAGR_GR").empty();
                    $("#CAGR_GR").attr("disabled", "disabled");
                }
            });

        }
        else {
            $("#CAGR_GR").empty();
            $("#CAGR_GR").attr("disabled", "disabled");
        }

    });

    $("#CAGR_GR").change(function (e) {

        if ($("#CAGR_GR").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterGDsPorGR",
                contentType: "application/json",
                data: JSON.stringify({ GR: $("#CAGR_GR").val() }),
                success: function (data) {

                    $("#CAGD_GD").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Todos");
                    $("#CAGD_GD").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.codigo + " - " + this.descricao);

                        $("#CAGD_GD").append(option);
                    });

                    $("#CAGD_GD").removeAttr("disabled");

                },
                error: function (data) {
                    alert("Não foi possível obter os Gerentes Distritais.");
                    $("#CAGD_GD").empty();
                    $("#CAGD_GD").attr("disabled", "disabled");
                }
            });

        }
        else {
            $("#CAGD_GD").empty();
            $("#CAGD_GD").attr("disabled", "disabled");
        }

    });

    $("#UF").change(function (e) {

        if ($("#UF").val() != "") {

            $.ajax({
                type: "POST",
                url: controller + "ObterCidadesPorUF",
                contentType: "application/json",
                data: JSON.stringify({ uf: $("#UF").val() }),
                success: function (data) {

                    $("#CIDADE").empty();

                    var option = $('<option></option>');
                    option.attr('value', "");
                    option.text("Todos");
                    $("#CIDADE").append(option);

                    $.each(data, function () {
                        var option = $('<option></option>');

                        option.attr('value', this.codigo);
                        option.text(this.descricao);

                        $("#CIDADE").append(option);
                    });

                    $("#CIDADE").removeAttr("disabled");

                },
                error: function (data) {
                    alert("Não foi possível obter os Gerentes Distritais.");
                    $("#CIDADE").empty();
                    $("#CIDADE").attr("disabled", "disabled");
                }
            });

        }
        else {
            $("#CIDADE").empty();
            $("#CIDADE").attr("disabled", "disabled");
        }

    });

    $("#btnPesquisar").on("click", function () {

        $(".loading-save").show();

        if ($("#CODDIV").val() != "") {

            var model = {

                CODDIV: $("#CODDIV").val(),
                EQUI_EQUIPE: $("#EQUI_EQUIPE").val(),
                UF: $("#UF").val(),
                CAGD_GD: $("#CAGD_GD").val(),
                CAGR_GR: $("#CAGR_GR").val(),
                CIDADE: $("#CIDADE").val(),
                MODOVISUALIZACAO: $("#MODOVISUALIZACAO").val()
            };

            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "ForcaVendas/List",
                async: true,
                data: JSON.stringify(model),
                success: function (response) {

                    if (response.success == false) {
                        alert(response.data);
                    }
                    else {

                        //Tabela
                        $("#consulta").html(response);

                        $("#forcavendas").dataTable({
                            "sPaginationType": "full_numbers",
                            "bAutoWidth": true,
                            "bProcessing": true,
                            "bServerSide": false,
                            "bSort": false,
                            "oLanguage":
                            {
                                "sZeroRecords": "Não foram encontrados resultados",
                                "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                                "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                                "sInfoFiltered": "(Total de _MAX_ registros)"
                            }
                        });

                    }

                    $("#btnExportar").show();

                    $(".loading-save").hide();
                },
                error: function (response) {
                    $(".loading-save").hide();
                }
            });
        }
        else {
            alert("Companhia é de seleção obrigatória para efetuar a pesquisa.");
            $(".loading-save").hide();
        }
    });

    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        $(".loading-save").show();

        var model = {

            CODDIV: $("#CODDIV").val(),
            EQUI_EQUIPE: $("#EQUI_EQUIPE").val(),
            UF: $("#UF").val(),
            CAGD_GD: $("#CAGD_GD").val(),
            CAGR_GR: $("#CAGR_GR").val(),
            CIDADE: $("#CIDADE").val(),
            MODOVISUALIZACAO: $("#MODOVISUALIZACAO").val()
        };

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "ForcaVendas/ExportarExcel",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='ForcaVendas.xls' class=''><img src='Content/botao-salvar-download-vertical.png'/></a>") }, 2000);

                $(".loading-save").hide();
            },
            error: function (response) {
                alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                $(".loading-save").hide();
            }
        });

    });

});