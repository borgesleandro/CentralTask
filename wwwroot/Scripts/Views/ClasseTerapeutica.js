$(document).ready(function () {

    _LoadTreeView();
    $(document).on("click", ".classe-link-item", function () {
        var item = $(this).parents(".classe-item:first");
        var item_icon = $(".classe-description-item .ui-icon", item);
        var active = item_icon.hasClass("ui-icon-triangle-1-s");

        $(".classe-children", item).html("");
        if (!active) {

            item_icon.removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
            item.addClass("active");
            _LoadClassChild(item.attr("data-id"));
        }
        else {
            item_icon.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
            item.removeClass("active");
        }

    });

    $(document).on("click", ".adicionar-classe-primaria", function () {
        _OpenNovaClasseModal(null, "GetNovaClasseView", false);
    });

    $(document).on("click", ".adicionar-classe", function () {
        _OpenNovaClasseModal($(this).parents(".classe-item:first"), "GetNovaClasseView", false);
    });

    $(document).on("click", ".editar-classe", function () {
        _OpenNovaClasseModal($(this).parents(".classe-item:first"), "EditClasseView", true);
    });

    $(document).on("click", ".remover-classe", function () {
        var mensagem = "";
        var classe = $(this).parents(".classe-item:first");
        if (classe.attr("data-ordem") == "4") {
            mensagem = "Deseja realmente excluir essa classe terapêutica?";
        }
        else {
            mensagem = "Deseja realmente excluir essa classe terapêutica e as respectivas abaixo dela?";
        }
        alert(mensagem, "Excluir Classe Terapêutica", null,
           function () {
               $.post(controller + "DeleteClasse", { classeID: classe.attr("data-id") }, function (data) {
                   if (data == "") {
                       alert("Classe Terapêutica excluída com sucesso!");
                       _LoadTreeView();
                   }
                   else {
                       alert("Ocorreu um erro. Erro: '" + data + "'");
                   }
               });
           });
    });

});

var _LoadClassChild = function (classeID) {


    var classe = $(".classe-item[data-id='" + classeID + "']");
    var loading = $(".classe-loading", classe);

    loading.show();

    $.post(controller + "GetClasseTerapeuticaChildren", { classeID: classeID }, function (data) {
        $(".classe-children", classe).html(data);
        loading.hide();
    }, "html");
};

var _LoadTreeView = function () {
    var treeView = $(".treeview");

    treeView.html('<img src="' + loadingURL + '" class="treeview-loading" />"');

    $.post(controller + "LoadTreeView", null, function (data) {
        if (data != "") {
            treeView.html(data);
        }
        else {
            treeView.html("<span class='classe-clear'>Nenhuma classe terapêutica cadastrada.</span>");
        }
    }, "html");
};

var _OpenNovaClasseModal = function (element, action, edit) {

    var isPrimary = element == null;

    
    var classeID = !isPrimary ? element.attr("data-id") : null;
    


    $.post(controller + action, { classeID: classeID }, function (data) {
        if (data != "") {


            var buttonsModal = [];

            $(".novaClasseForm").dialog("destroy").remove();

            //Botao Adicionar
            buttonsModal.push({
                text: "Salvar",
                click: function () {
                    if (!isPrimary) $(".classe-loading", element).show();
                    $.post(controller + "SaveNovaClasse", $(".novaClasseForm").serialize(), function (data) {
                        if (data == "") {
                            $(".novaClasseForm").dialog("destroy").remove();

                            if (isPrimary || (element.attr("data-ordem") == "1" && edit)) {
                                _LoadTreeView();
                            }
                            else if(edit) {
                                _LoadClassChild(element.attr("data-parent"));
                            }
                            else {
                                if (element.hasClass("active")) _LoadClassChild(classeID);
                            }


                            alert("A Classe Terapêutica foi " + (edit ? "alterada." : "adicionada."));

                        } else {
                            alert("Ocorreu um erro. <br> Erro: '" + data + "'");
                        }
                        if (!isPrimary) $(".classe-loading", element).hide();
                    }, "json");
                }
            });

            //Botao Cancelar
            buttonsModal.push({
                text: "Cancelar",
                "class": "mws-button gray",
                click: function () {
                    $(this).dialog("destroy").remove();
                }
            });

            $(data).dialog({
                resizable: false,
                draggable: false,
                title: "Classe Terapêutica",
                width: "500px",
                modal: true,
                buttons: buttonsModal
            });

        } else {
            alert("Ocorreu um erro, tente novamente.");
        }
    }, "html");
};