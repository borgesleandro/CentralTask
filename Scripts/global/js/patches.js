(function ()
{

    window.patchesAtivos = [];

    var patches =
    {
        "14480": {
            // altera os comandos javascript registrados no atributo href dos links
            // para o atributo onclick de forma a aumentar a precisão e diminuir tempo de resposta 
            // http://projetos.running.com.br/issues/14480#change-105859
            avalia: function ()
            {
                var padraoUA = /chrome\/([\d]+)/gim;
                var matches = padraoUA.exec(window.navigator.userAgent);

                if (matches != null && matches.length == 2) {
                    var version = matches[1];
                    if (version > 70) {
                        return true;
                    }
                }
                return false;
            },
            aplica: function ()
            {
                $('a').each(function ()
                {
                    var $a = $(this);
                    var href = $a.attr('href');
                    var onclick = $a.attr('onclick');
                    var padrao = /^\s*javascript\s*\:/ig;
                    if (padrao.test(href)) {
                        $a.attr('onclick', href.replace(padrao, '') + ';' + onclick);
                    }
                });
            }
        },
        "15288": {
            // http://projetos.running.com.br/issues/15288
            // remove o evento global de erro pois o gesture deslizar com 2 dedos para baixo
            // gera um erro antes de funcionar.
            avalia: function ()
            {
                return true;
            },
            aplica: function ()
            {
                window.onerror = function () { };
            }
        },

    };
    for (var p in patches) {
        if (patches[p].avalia()) {
            window.addEventListener('load', patches[p].aplica);
            window.patchesAtivos.push(p);
        }
    }

})();