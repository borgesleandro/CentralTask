
var aprovacaoTableLayout;

$(document).ready(function () {

    //#############################################   
    //testar aprovação por fluxo em pedido ol
    //Variável criada na ConfirmaAprovacao.cshtml
    //#############################################   

    
    if (ssaordemAprovacoes != "") {

        if (aprovacaoTableLayout != null) {
            aprovacaoTableLayout.fnDestroy();
        }

        aprovacaoTableLayout = $("#id_aprovadores").dataTable({
            bFilter: false,
            bSort: false,
            bInfo: false,
            bPaginate: false,
            bDestroy: true,
            aSorting: [0, "asc"],
            sPaginationType: "full_numbers",
            aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
            { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
            oLanguage:
            {
                sZeroRecords: "Não foram encontrados resultados",
                sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
                sInfoFiltered: "(Total de _MAX_ registros)"
            }
        });




    }




    $("#id_produtos_aprovacao").dataTable({
        bFilter: false,
        aSorting: [0, "asc"],
        sPaginationType: "full_numbers",
        aoColumnDefs: [{ "bSearchable": false, "bSortable": false, "aTargets": ["dataTable-commands"] },
        { "bVisible": false, "aTargets": ["dataTable-hidden"] }],
        oLanguage:
        {
            sZeroRecords: "Não foram encontrados resultados",
            sInfo: "Exibindo de _START_ até _END_ de _TOTAL_ registros",
            sInfoEmpty: "Exibindo de 0 até 0 de 0 registros",
            sInfoFiltered: "(Total de _MAX_ registros)"
        }
    });




    $(".modal .distribuidores .dataTables_info").hide();
    $(".modal .distribuidores .dataTables_paginate").hide();

    $(".modal .dataTables_wrapper .dataTables_filter").hide();
    $(".modal .dataTables_wrapper .dataTables_length").hide();





    $(document).on("click", ".confirmaAprovacao", function () {

        $(".errorMessage").html("");
        $(".validMessage").html("");

        var sendData = {};
        sendData.Senha = $("#Senha").val();
        sendData.Parametros = $("#Parametros").val();
        sendData.Aprovar = $(this).attr("data-value") == "true";
        sendData.Justificativa = $("#JUSTIFICATIVA").val();

        sendData.emailCliente = $("#EMAILCLIENTE").val();

        var tituloAprovarReprovarDialog = "Reprovação";
        var textoAprovarReprovarDialog = "reprovar";

        if ($(this).attr("data-value") == "true") {
            tituloAprovarReprovarDialog = "Aprovação";
            textoAprovarReprovarDialog = "aprovar";
        }
        else {
            //para reprovar tem que validar a justificativa
            //obrigar o preenchimento da justificativa com mais de 5 caracteres em caso de reprovação
            var ssmsg = ""
            if ($("#JUSTIFICATIVA").val().trim() == "" || $("#JUSTIFICATIVA").val() == "null" || $("#JUSTIFICATIVA").val() == null) {
                alert("Atenção!<br />A justificativa para a reprovação é obrigatória.");
                return false;
            }
            else {
                if ($('#JUSTIFICATIVA').val().trim().length < 5) {
                    alert("Atenção!<br />Não são aceitas justificativas com menos de 5 caracteres.");
                    return false;
                }
            }
        }


               

        alert("Deseja " + textoAprovarReprovarDialog + " este item?", tituloAprovarReprovarDialog + " pedido", null, function () {
            $.post(controller + "Confirm", sendData, function (data) {
                if (data != "") {
                    alert(data);

                    if (data.indexOf("sucesso") >= 0) {
                        $(".validMessage").html(data);
                        $(".validMessage").show();

                        $("#aprovacaoCampos").hide();
                    }
                    else {
                        $(".errorMessage").html(data);
                        $(".errorMessage").show();
                    }
                } else {
                    alert(data);
                    $(".confirmacaoForm").remove();
                    alert("Solicitação concluída com sucesso");
                }
            });
        });
    });
});