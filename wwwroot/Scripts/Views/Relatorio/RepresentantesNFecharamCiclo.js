$(document).ready(function () {

   $("#btnPesquisar").on("click", function () {

        $("#exportarLinkDiv").html("");

        $(".loading-save").show();

        if ($("#primeiroFiltro").is(":visible")) {

            var model = {

                CODDIV: $("#CODDIV").val(),
                EQUIPE: $("#EQUI_EQUIPE").val(),
                REGIONAL: $("#REGIONAL").val(),
                DISTRITAL: $("#CAGD_GD").val(),
                CICLO: $("#CICLO").val()

            };

        }
        
        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "RepresentantesNFecharamCiclo/List",
            async: false,
            data: JSON.stringify(model),
            success: function (response) {

                if (response.success == false) {
                    alert(response.data);
                }
                else {

                    //Tabela
                    $("#consulta").html(response);
                    $("#consulta").show();
                    $("#btnVoltar").show();

                    $("#FechamentoCiclo").dataTable({
                        "sPaginationType": "full_numbers",
                        "bAutoWidth": true,
                        "bProcessing": true,
                        "bServerSide": false,
                        "bSort": false,
                        "oLanguage": {
                            "sZeroRecords": "Nenhum dado encontrado."
                        }
                    });                    

                }

                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });

    });

    $("#btnExportar").on("click", function () {

        $("#exportarLinkDiv").html("");

        $(".loading-save").show();

        var model = {

            CODDIV: $("#CODDIV").val(),
            EQUIPE: $("#EQUI_EQUIPE").val(),
            REGIONAL: $("#REGIONAL").val(),
            DISTRITAL: $("#CAGD_GD").val(),
            CICLO: $("#CICLO").val()

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

    $("#btnVoltar").on("click", function () {

        $("#primeiroFiltro").show();
        $("#consulta").hide();
        $("#btnVoltar").hide();

    });

});


