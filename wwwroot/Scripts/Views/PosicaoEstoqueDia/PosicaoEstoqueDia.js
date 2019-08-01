$(document).ready(function () {


    //ajusta o tamanho da div de acordo com a table
    $('#consulta').width($('.tamanhofieldset').width());
    $('.ajusta_tabela').width($('.tamanholinha').width());
    
    $("select[multiple]").multiselect().multiselectfilter();
    $("select:not([multiple])").chosen();


    $(window).resize(function () {
        //ajusta o tamanho da div de acordo com a table
        $('#consulta').width($('.mws-panel').width() - 2);

        $('.ajusta_tabela').width($('#consulta').width());
        $('.grid_tabela').width($('#consulta').width());
    });


    $("#CNPJ_OL").on("change", function () {
        $("#exportarLinkDiv").html("");
    });

    $("#CODPROD").on("change", function () {
        $("#exportarLinkDiv").html("");
    });


    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisar").on("click", function () {


        ////Habilita imagem de LOAD
        $(".loading-save").show();

        $("#exportarLinkDiv").html("");

        var model = {
            Distribuidores: $("#CNPJ_OL").val(),
            Produtos: $("#CODPROD").val()
        };


        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "PosicaoEstoqueDia/List",
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

                    //table = $("#tbpesquisa").dataTable({
                    //    "sPaginationType": "full_numbers",
                    //    //"bstateSave": true,
                    //    "bPaginate": true,
                    //    "bAutoWidth": true,
                    //    "bProcessing": false,
                    //    "bServerSide": false,
                    //    //"aaSorting": [[1, "desc"]],
                    //    "aoColumnDefs": [{ "bSortable": false, "aTargets": ["dataTable-commands"] }],
                    //    "fnDrawCallback": function (oSettings) {
                    //        oSettings.aoColumns[1].nTh.style.minWidth = "350px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);
                    //        oSettings.aoColumns[1].nTh.style.width = "350px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);
                    //    },

                    //    //aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
                    //    //           { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
                    //    "sScrollX": "100%",
                    //    "oLanguage":
                    //    {
                    //        "sZeroRecords": "Não foram encontrados resultados",
                    //        "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                    //        "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                    //        "sInfoFiltered": "(Total de _MAX_ registros)"
                    //    },
                    //});


                    //new $.fn.dataTable.FixedColumns(table, { "leftColumns": 2 }  );



                    table = $("#tbpesquisa").dataTable({
                        "sPaginationType": "full_numbers",
                        //"bstateSave": true,
                        "bPaginate": true,
                        "bAutoWidth": false,
                        "bProcessing": false,
                        "bServerSide": false,
                        "bstateSave": true,
                        "bLengthChange": true,
                        "fnInitComplete": function () {
                            this.fnAdjustColumnSizing(true);
                        },
                        "fnDrawCallback": function (oSettings) {
                            this.fnAdjustColumnSizing(false);
                        },
                        //"aaSorting": [[1, "desc"]],
                        "aoColumnDefs": [{ "bSortable": false, "aTargets": ["dataTable-commands"] }],
                        "fnDrawCallback": function (oSettings) {
                            oSettings.aoColumns[1].nTh.style.minWidth = "400px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);

                            oSettings.aoColumns[0].nTh.style.minWidth = "50px";//_fnStringToCss(oSettings.aoColumns[i].sWidth);


                        },

                        //aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
                        //           { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
                        "sScrollX": "100%",
                        "oLanguage":
                        {
                            "sZeroRecords": "Não foram encontrados resultados",
                            "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                            "sInfoFiltered": "(Total de _MAX_ registros)"
                        }          
                    });

                    //new $.fn.dataTable.FixedColumns(table, { "leftColumns": 2 }, {
                    //    "iLeftWidth": "450px"
                    //});


                }
                $(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });



    });
    //###################    FIM PESQUISAR   ##########################





    //#############################################
    //          EXPORTAR
    //#############################################
    $("#btnExportar").on("click", function () {

        $(".loading-save").show();


        $("#exportarLinkDiv").html("");


        var model = {
            Distribuidores: $("#CNPJ_OL").val(),
            Produtos: $("#CODPROD").val()
        };
         
        
        //var listaEquipes = [];
        //$.each($("#EQUI_EQUIPE :selected"), function (i, selected) {
        //    listaEquipes.push($(selected).val());
        //})
        //var outrosDistribuidores = [];
        //$("#CNPJ_DIST option").each(function () {
        //    if ($(this).val() != "")
        //        outrosDistribuidores.push("'" + $(this).val() + "'");
        //})


        
        //var model = {


        //    //CARLOS 03/06/2015 POIS NÃO TRAZIA OS DADOS
        //    chkRetorno: $("#chkRetornoAntesDe").attr("checked") ? true : false,
        //    chkEspelho: $("#chkEspelhoAntesDe").attr("checked") ? true : false,
        //    Grupo: $("#ID_GRUPO_OL").val() == "" ? null : $("#ID_GRUPO_OL").val(),

        //    DataRetornoAntesDe: $("#chkRetornoAntesDe").attr("checked") ? $("#dtRetornoAntesDe").val() : null,
        //    HoraRetornoAntesDe: $("#chkRetornoAntesDe").attr("checked") ? $("#tmRetornoAntesDe").val() : null,
        //    DataEspelhoAntesDe: $("#chkEspelhoAntesDe").attr("checked") ? $("#dtEspelhoAntesDe").val() : null,
        //    HoraEspelhoAntesDe: $("#chkEspelhoAntesDe").attr("checked") ? $("#tmEspelhoAntesDe").val() : null,
        //    DistribuidorSelecionado: ("'" + $("#CNPJ_DIST").val() + "'"),
        //    OutrosDistribuidores: outrosDistribuidores,
        //    ListaEquipes: listaEquipes,
        //    Exportar: true

        //};

        xhr = $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: "PosicaoEstoqueDia/Exportar",
            async: false,
            data: JSON.stringify(model),
            success: function (response, status, request) {

                var type = request.getResponseHeader('Content-Type');
                var blob = new Blob(["\ufeff", response], { type: type });
                var downloadUrl = URL.createObjectURL(blob);

                setTimeout(function () {
                    $("#exportarLinkDiv").html("<a href='" + downloadUrl + "' download='PosicaoEstoque.xls' class=''><img src='Content/botao-salvar-download.png'/></a>")
                    $(".loading-save").hide();
                }, 2000);

                //$(".loading-save").hide();
            },
            error: function (response) {
                $(".loading-save").hide();
            }
        });
    });
    //###################    FIM EXPORTAR   ##########################






});
