$(document).ready(function () {

    $("#USUARIOORIG_ID").chosen();
    $("#USUARIODELEG_ID").chosen();

    $("#Status").multiselect().multiselectfilter();
    
    //#############################################
    //          PESQUISAR
    //#############################################
    $("#btnPesquisar").on("click", function () {

      $(".div-loading").show();

       var model = {
          StatusDelegacao: $("#Status").val()
       }
        
       xhr = $.ajax({
          type: 'POST',
          contentType: 'application/json',
          url: controller + "Pesquisar",
          async: true,
          data: JSON.stringify(model),
          success: function (response) {
             $(".containerDelegacao").text("");
             $(".containerDelegacao").append(response);


             $(".tabelaIndex").dataTable({
                aaSorting: [[8, "asc"], [7, "desc"], [0, "asc"]],
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
             $(".div-loading").hide();
          },
       });


    });
    //#############################################




   
    $(document).on("click", ".inativarDelegacao", function () {
       var deactivateButton = $(this);
       var delegacaoID = deactivateButton.attr("data-delegacao");
       var tr = deactivateButton.parents("tr:first");

       alert("Deseja realmente inativar essa delegação?", "Inativar Delegação", null,
          function () {
             $.post(controller + "Deactivate", { id: delegacaoID  }, function (data) {
                if (data.ok) {
                   alert("Delegação inativada com sucesso.");
                   $("#btnPesquisar").click();
                }
                else {
                   alert(data.msgErro);
                }
             });
          }
       );
    });


});
 

function SubmitForm(acao) {

   if (ValidaData(acao))
      $('.formSubmit').submit();
}


function ValidaData(acao) {
    var ok = true;
    var ssmsgDataInvalida = "";
    try {
        $.datepicker.parseDate('dd/mm/yy', $("#DTINI").val());
    }
    catch (err) {
        ssmsgDataInvalida += "Data inicial inválida.\n<br/>";
    }
    try {
        $.datepicker.parseDate('dd/mm/yy', $("#DTFIM").val());
    }
    catch (err) {
        ssmsgDataInvalida += "Data fim inválida.\n<br/>";
    }

    if (ssmsgDataInvalida == "") {
        if ($("#DTINI").val() != "") {
            //data INICIO Não pode ser menor que data atual
            if ($.datepicker.parseDate('dd/mm/yy', $("#DTINI").val()) < $.datepicker.parseDate('dd/mm/yy', $("#DTCORRENTE").val()))
                ssmsgDataInvalida += "Data início não pode ser menor que a data atual.\n<br/>";
        }

        //data FIM Não pode ser menor que data atual
        if ($("#DTFIM").val() != "") {
            if ($.datepicker.parseDate('dd/mm/yy', $("#DTFIM").val()) < $.datepicker.parseDate('dd/mm/yy', $("#DTCORRENTE").val()))
                ssmsgDataInvalida += "Data fim não pode ser menor que a data atual.\n<br/>";
        }
    }
    
    if (ssmsgDataInvalida != "") {
        alert(ssmsgDataInvalida);
        ok = false;
    }

    return ok;
}
