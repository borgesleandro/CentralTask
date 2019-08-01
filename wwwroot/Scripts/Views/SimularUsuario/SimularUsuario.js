
var oTable = null;

$(document).ready(function () {
    
    $(document).on("change", "#CARGO_ID", function () {

        
        //var usuarios_container = $("#consulta");
        //usuarios_container.html("");
        $("#consulta").html("");


        if ($('#CARGO_ID').val() != "") {
            
            ////Habilita imagem de LOAD
            $(".loading-save").show();


            xhr = $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: "SimularUsuario/List",
                async: true,
                data: JSON.stringify({ CARGOID: $('#CARGO_ID').val() }),
                success: function (response) {
                    
                    //Tabela
                    $("#consulta").html(response);
                    $("#consulta").show();
                    
                    otable = $(".tableListaUsuarios").dataTable({
                        aaSorting: [[1, "asc"]],
                        "bDestroy": true,
                        "sPaginationType": "full_numbers",
                        "bPaginate": true,
                        "bAutoWidth": true,
                        "bProcessing": false,
                        "bServerSide": false,
                        //"bSort": true,
                        "sScrollX": "100%",
                        "oLanguage":
                        {
                            "sZeroRecords": "Não foram encontrados resultados",
                            "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                            "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                            "sInfoFiltered": "(Total de _MAX_ registros)"
                        },
                        "fnInitComplete": function () {
                            this.fnAdjustColumnSizing(true);
                        },
                    });
                    
                    $(".loading-save").hide();
                },
                error: function (response) {
                    $(".loading-save").hide();
                }
            });

        }


    });


    $(".salvarSimularUsuario").live("click", function () {
        if ($(".mws-form").valid()) {

            $(".loading-save").show();
            
            var colAlterada = false;

            var ListaUsuarios = [];
            //$(".funcaoRow").each(function () {
            //$(".tableListaUsuarios").dataTable().fnGetNodes().each(function () {

            //var nNodes = otable.fnGetNodes();

            //alert(nNodes.length);

            //alert('yyyyy');
            //return false;

            //var newOrdem = $(".tableListaUsuarios").dataTable().fnGetNodes().length;

            //alert(newOrdem);


            //return false;

            $(otable.fnGetNodes()).each(function () {
                var tr = $(this);
                colAlterada = $("#FLG_ALTERADA", tr).val().toString().toUpperCase();
                if (colAlterada == "TRUE") {
                    var UsuarioFLGPodeSimular = {};

                    UsuarioFLGPodeSimular.USUARIO_ID = $("input[name='USUARIO_ID']", tr).val();
                    UsuarioFLGPodeSimular.FLG_PODE_SIMULAR = $("#FLG_PODE_SIMULAR", tr).hasClass("ic-accept");
                
                    ListaUsuarios.push(UsuarioFLGPodeSimular);
                }
            });

                       
            if (ListaUsuarios.length == 0) {
                alert('Informações não alteradas');
                $(".loading-save").hide();
            }
            else {
                
                $.ajax({
                    type: "POST",
                    url: controller + "UpdateSimularUsuario",
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({ ListaUsuarios: ListaUsuarios }),
                    success: function (data) {

                        if (data) {
                            alert('Dados salvos com sucesso');
                            //window.location.href = controller + "Index";
                        }
                        else {
                            alert("Erro ao salvar dados");
                        }
                        $(".loading-save").hide();
                    },
                    error: function (data) {
                        
                        alert("Houve um erro ao obter a lista UF's.");
                    }
                });



            }
        }

    });



    $(window).resize(function () {
        //para ajustar o cabeçalho no Firefox do DATATABLE
        setTimeout(function () {
            otable.fnAdjustColumnSizing(true);
        }, 1);
    });



    ////#############################################
    ////          PESQUISAR
    ////#############################################
    //$("#btnPesquisar").on("click", function () {

    //    $("#consulta").html("");

    //    //###############################################
    //    //          VERIFICAÇÃO DE DATA
    //    //###############################################
    //    var ssmsgDataInvalida = "";
    //    if ($("#txtPeriodoINI").val() == "" || $("#txtPeriodoINI").val() == "null" || $("#txtPeriodoINI").val() == null) {
    //        ssmsgDataInvalida = "É necessário informar o período.\n";
    //    }
    //    if ($("#txtPeriodoFIM").val() == "" || $("#txtPeriodoFIM").val() == "null" || $("#txtPeriodoFIM").val() == null) {
    //        ssmsgDataInvalida += "É necessário informar o período.\n";
    //    }
    //    try {
    //        $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoINI").val());
    //    }
    //    catch (err) {
    //        ssmsgDataInvalida += "Período inicial inválido.\n";
    //    }
    //    try {
    //        $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoFIM").val());
    //    }
    //    catch (err) {
    //        ssmsgDataInvalida += "Período fim inválido.\n";
    //    }
    //    if (ssmsgDataInvalida == "") {
    //        if ($.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoFIM").val()) < $.datepicker.parseDate('dd/mm/yy', $("#txtPeriodoINI").val())) {
    //            ssmsgDataInvalida += "Período inicial não pode ser maior que o final\n";
    //        }
    //    }
    //    if (ssmsgDataInvalida != "") {
    //        alert(ssmsgDataInvalida);
    //        return;
    //    }
    //    //###############################################
    //    //          FIM VERIFICAÇÃO DE DATA
    //    //###############################################



    //    ////Habilita imagem de LOAD
    //    $(".loading-save").show();


    //    var model = {
    //        Companhia: $("#CODDIV").val(),
    //        Equipe: $("#EQUI_EQUIPE").val(),
    //        Distribuidor: $("#CNPJ_OL").val(),
    //        Representantes: $("#REPRESENTANTES").val(),
    //        NumeroPedidos: $("#NumeroPedido").val(),
    //        NumeroPedidosTablet: $("#NumeroPedidoTablet").val(),
    //        PeriodoIni: $("#txtPeriodoINI").val(),
    //        PeriodoFim: $("#txtPeriodoFIM").val(),
    //        Campanha: $("#CAMPANHA").val(),
    //        CnpjFarmacia: $("#CNPJFARMACIA").val(),
    //        RazaoSocialFarmacia: $("#RAZAOSOCIALFARMACIA").val(),
    //        Origem: $("#ORIGEM").val(),
    //        Status: $("#STATUS").val()
    //    };




    //    xhr = $.ajax({
    //        type: 'POST',
    //        contentType: 'application/json',
    //        url: "PedidosCosulta/List",
    //        async: true,
    //        data: JSON.stringify(model),
    //        success: function (response) {

    //            if (response.success == false) {
    //                alert(response.data);
    //            }
    //            else {

    //                //Tabela
    //                $("#consulta").html(response);
    //                $("#consulta").show();

    //                $("#tbpesquisa").dataTable({
    //                    "sPaginationType": "full_numbers",
    //                    "bPaginate": true,
    //                    "bAutoWidth": false,
    //                    "bProcessing": false,
    //                    "bServerSide": false,
    //                    "bSort": true,
    //                    "sScrollX": "100%",
    //                    "oLanguage":
    //                    {
    //                        "sZeroRecords": "Não foram encontrados resultados",
    //                        "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
    //                        "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
    //                        "sInfoFiltered": "(Total de _MAX_ registros)"
    //                    },
    //                });

    //                //$('.dataTables_scrollHead').css('float', 'left');
    //                //$('.dataTables_scrollBody').css('float', 'left');
    //                //$('.tabprodutos_info').css('float', 'left');
    //                //$('.tabprodutos_paginate').css('float', 'left');


    //            }
    //            $(".loading-save").hide();
    //        },
    //        error: function (response) {
    //            $(".loading-save").hide();
    //        }
    //    });



    //});
    ////#############################################





    //ALTERA A IMAGEM DA COLUAN "PODE SIMULAR"
    $(".editar").live("click", function () {
        if ($(this).hasClass("ic-accept")) {
            $(this).removeClass("ic-accept").addClass("ic-delete");
        } else {
            $(this).removeClass("ic-delete").addClass("ic-accept");
        }

        //MARCAR A LINHA COMO ALTERADA
        tr = $(this).parents("tr:first");        
        $("#FLG_ALTERADA", tr).val(true);
        
    });




    //$(document).on("click", ".btn-salvar", function () {

    //    var items = $(".rm-column.active .rm-column-item");
    //    var data = {
    //        linhas: [],
    //        equipe: $("#Equipes").val()
    //    };

    //    $.each(items, function (i, item) {
    //        var obj = {};
    //        obj.PKFK_CODLINHA = $(item).attr("data-value");
    //        data.linhas.push(obj);
    //    });


    //    $(".loading-save").show();


    //    alert('salvar');
    //    //$.ajax({
    //    //    url: controller + "Salvar",
    //    //    data: JSON.stringify(data),
    //    //    contentType: 'application/json',
    //    //    type: 'POST',
    //    //    success: function (response) {
    //    //        if (response.ok) {
    //    //            $(".loading-save").hide();
    //    //            alert("Registros salvos com sucesso");
    //    //        } else {
    //    //            $(".loading-save").hide();
    //    //            alert(response.erros.join("<br />"));
    //    //        }
    //    //    }
    //    //});
    //});










});