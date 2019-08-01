$(document).ready(function () {

    $("#CICLO_ATUAL.mws-textinput").mask("?99/9999");
    $("#CAGD_GD.mws-textinput").mask("999999");
    $("#REGIONAL.mws-textinput").mask("99");
    $("#REPR_EQUIPE.mws-textinput").mask("99");

    $("#btnPesquisar").on("click", function () {

        $("#exportarLinkDiv").html("");

        $(".loading-save").show();


        var model = {

            CIA: $("#REPR_CIA").val(),
            EQUIPE: $("#REPR_EQUIPE").val(),
            REGIONAL: $("#REGIONAL").val(),
            DISTRITAL: $("#CAGD_GD").val(),
            EQZ: $("#REPR_REP").val(),
            CICLO: $("#CICLO_ATUAL").val()

        };

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "RepresentantesNFecharamCiclo/List",
            async: false,
            data: JSON.stringify(model),
            success: function (response) {

                //Tabela
                $("#consulta").html(response);
                $("#consulta").show();
                $("#btnVoltar").show();

                $("#representantes").dataTable({
                    "bPaginate": false,
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

                $("#btnExportar").on("click", function () {

                    $("#exportarLinkDiv").html("");

                    $(".loading-save").show();

                    var model = {

                        CIA: $("#REPR_CIA").val(),
                        EQUIPE: $("#REPR_EQUIPE").val(),
                        REGIONAL: $("#REGIONAL").val(),
                        DISTRITAL: $("#CAGD_GD").val(),
                        EQZ: $("#REPR_REP").val(),
                        CICLO: $("#CICLO_ATUAL").val()

                    };

                    xhr = $.ajax({
                        type: 'POST',
                        contentType: 'application/json',
                        url: "RepresentantesNFecharamCiclo/ExportarExcel",
                        async: false,
                        data: JSON.stringify(model),
                        success: function (response, status, request) {

                            var type = request.getResponseHeader('Content-Type');
                            var blob = new Blob(["\ufeff", response], { type: type });
                            var downloadUrl = URL.createObjectURL(blob);

                            setTimeout(function () { $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='RepresentantesNaoFecharamCiclo.xls' class=''><img src='Content/botao-salvar-download.png'/></a>") }, 2000);

                            $(".loading-save").hide();
                        },
                        error: function (response) {
                            alert("Houve um erro ao exportar os dados. Por favor tente novamente mais tarde.");
                            $(".loading-save").hide();
                        }
                    });

                });

                $("#btnExportar").show();

                $("#btnVoltar").on("click", function () {

                    $("#primeiroFiltro").show();
                    $("#consulta").hide();
                    $("#btnVoltar").hide();
                    $("#btnExportar").hide();

                });

                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });

    });
});



