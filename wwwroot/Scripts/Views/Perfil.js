$(document).ready(function () {
    var currentAjaxRequest = null;

    $(".salvarPerfil").live("click", function () {
        if ($(".mws-form").valid()) {
            var trdPerfilFuncoes = [];
            $(".funcaoRow").each(function () {
                var tr = $(this);
                var trdPerfilFuncao = {};

                trdPerfilFuncao.FUNCAOSIST_ID = $("input[name='Funcao_ID']", tr).val();
                trdPerfilFuncao.FLG_CONSULTAR = $("#FLG_CONSULTAR", tr).hasClass("ic-accept");
                trdPerfilFuncao.FLG_INCLUIR = $("#FLG_INCLUIR", tr).hasClass("ic-accept");
                trdPerfilFuncao.FLG_ATIVAR = $("#FLG_ATIVAR", tr).hasClass("ic-accept");
                trdPerfilFuncao.FLG_ALTERAR = $("#FLG_ALTERAR", tr).hasClass("ic-accept");

                if (trdPerfilFuncao.FLG_ALTERAR ||
                    trdPerfilFuncao.FLG_ATIVAR ||
                    trdPerfilFuncao.FLG_CONSULTAR ||
                    trdPerfilFuncao.FLG_INCLUIR) {

                    trdPerfilFuncoes.push(trdPerfilFuncao);
                }


            });

            var trd_perfil = {};
            trd_perfil.DESCRICAO = $("#DESCRICAO").val();
            trd_perfil.PERFIL_ID = $("#PERFIL_ID").length > 0 ? $("#PERFIL_ID").val() : 0;


            var sendData = {};
            sendData.trdPerfilFuncoes = trdPerfilFuncoes;
            sendData.trd_perfil = trd_perfil;

            var action = "AddPerfil";

            if (trd_perfil.PERFIL_ID > 0)
                action = "UpdatePerfil";

            $.post(controller + action, $.toDictionary(sendData), function (data) {
                if (data) {
                    window.location.href = controller + "Index";
                }

            }, "json");
        }



    });

    $(".expand").live("click", function () {
        var tr = $(this).parents("tr:first");
        var itemID = $(".itemID", tr).val();
        var itemType = $(".itemID", tr).attr("name").replace("_ID", "");
        var child = $(".child" + itemType + itemID);

        if ($(this).hasClass("ui-icon-plus")) {
            child.show();
            $(this).removeClass("ui-icon-plus").addClass("ui-icon-minus");
        }
        else {
            child.hide();
            $(this).removeClass("ui-icon-minus").addClass("ui-icon-plus");
        }


    });



    $(".editar").live("click", function () {
        if ($(this).hasClass("ic-accept")) {
            $(this).removeClass("ic-accept").addClass("ic-delete");
        } else {
            $(this).removeClass("ic-delete").addClass("ic-accept");
        }
    });





});
