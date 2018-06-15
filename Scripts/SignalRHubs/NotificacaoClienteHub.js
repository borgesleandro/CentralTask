// depende de toastr.min.js
$(function () {
    // Reference the auto-generated proxy for the hub.  
    var notificacaoHub = $.connection.notificacaoClienteHub;
    // Create a function that the hub can call back to display messages.
    notificacaoHub.client.ContagemRegressivaParaDesconexao =
        function (hIni, hFim, tempoRestante) {
            console.log(hIni, hFim, tempoRestante);
            if($('#sssSec').length) return;
            //toastr.remove();
            var spTime = tempoRestante.split(":");
            spTime[0] = Number(spTime[0]);
            spTime[1] = Number(spTime[1]);
            toastr.options.timeOut = 0;
            toastr.options.positionClass = "toast-bottom-right";
            toastr.options.closeButton = true;
            toastr.warning(
                'A restrição de horário de utilização será aplicada em <span id="sssMinutes">' + spTime[0] + '</span> minutos e <span id="sssSec">' + spTime[1] + "</span> segundos. Prepare-se para ser desconectado."
            );
            var interval = setInterval(function () {
                if (spTime[1] == 0) { 
                    spTime[1] = 59;
                    spTime[0]--;
                }
                else 
                {
                    spTime[1]--;
                }
                if (spTime[0] < 0) {
                    clearInterval(interval);
                    return;
                }
                if ($('#sssSec').length){
                    $('#sssSec').html(spTime[1]);
                    $('#sssMinutes').html(spTime[0]);
                }
                else
                {
                    clearInterval(interval);
                }
            }, 1000);
        };
    var chamou = false;
    notificacaoHub.client.Desconectar = function (hIni, hFim)
    {
       if (chamou) return;
        chamou = true;
        alert(
                "Sua empresa aplicou uma restrição no horário de utilização do Sistema Salesfarma." +
                " Autorizado a utilizar o sistema diariamente no intervalo compreendido entre: "+ hIni + " e " + hFim +
                ".Nesse momento você será desconectado. Retorne novamente dentro do horário permitido."
        );

        window.open( window.SalesFarmaAppNS.LogoffActionUrl, "_top");
    }
    // Get the user name and store it to prepend to messages.

    // Start the connection.
    $.connection.hub.start().done(function () {

        var codRestricao = window.SalesFarmaAppNS.CodRestricao;
        if (codRestricao == 2) {
            notificacaoHub.server.joinGroup(window.SalesFarmaAppNS.IdCliente, window.SalesFarmaAppNS.Perfil);
        }
    });
});