$(document).ready(function () {



    $(document).on("change", "#PRODUTOS", function () {
        var selectedValue = $(this).val();
        $("#categorias").html("");
        $(".loading").hide();
        $(".mws-button-row").hide();
        $(".btn-add-categoria").hide();
        if (selectedValue != "") {

            LoadTabs(selectedValue);

        }

    });

    $(document).on("click", ".btn-excluir-categoria", function () {
        var sendData = {};

        sendData.produtoID = $("#PRODUTOS").val();
        sendData.categoriaID = $(this).attr("data-id");

        $(".loading-form").show();
        $.post(controller + "RemoveCategoria", sendData, function (data) {
            if(data == "")
            {
                LoadTabs(sendData.produtoID);
            }
            else {
                alert("Ocorreu um erro. Erro: '" + data + "'")
            }
            $(".loading-form").hide();
        });
    })

    $(document).on("click", ".btn-add-categoria", function () {
        var selectedValue = $("#PRODUTOS").val();

        $(".loading-form").show();
        $(".modal").dialog("destroy").remove();
        if (selectedValue != "") {
            $.post(controller + "AddCategoriasView", { produtoID: selectedValue }, function (data) {
                var buttonsModal = [];

                $(".modal").dialog("destroy").remove();

                buttonsModal.push({
                    text: "Adicionar",
                    click: function () {
                        $(".loading-form").show();
                        var categoriasID = new Array();
                        $("#categoriasID").multiselect("getChecked").each(function () {
                            categoriasID.push($(this).val());
                        });

                        $.post(controller + "AddCategorias", $.toDictionary({ produtoID: selectedValue, categoriasID: categoriasID }), function (data) {
                            if (data == "") {
                                $(".modal").dialog("destroy").remove();
                                LoadTabs(selectedValue);
                            }
                            else {
                                alert("Ocorreu um erro. Erro: '" + data + "'")
                            }
                            $(".loading-form").hide();
                        }, "json");
                    }
                });

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
                    title: "Adicionar Nova Categoria",
                    width: "600px",
                    modal: true,
                    buttons: buttonsModal,
                    open: function () {
                        $("#categoriasID").multiselect().multiselectfilter();
                    }
                });
                $(".loading-form").hide();
            }, "html");

        }
        else {
            alert("Selecione um produto");
        }
    });

    $(document).on("click", ".btn-salvar-configuracao", function () {
        $(".loading-form").show();
        var sendData = {};
        sendData.produtoID = $("#PRODUTOS").val();

        var detalhes = new Array();

        $(".detalhe").each(function () {
            var detalhe = {};
            detalhe.ID = $(this).attr("data-id");
            detalhe.VALOR = $("#DETALHE-VALOR", $(this)).val();

            detalhes.push(detalhe);

        });

        sendData.detalhes = detalhes;

        $.post(controller + "Save", $.toDictionary(sendData), function (data) {
            if (data == "") {
                alert("Detalhes salvos com sucesso!");
            }
            else {
                alert("Ocorreu um erro. Erro: '" + data + "'")
            }
            $(".loading-form").hide();
        }, "json");


    })
});

var LoadTabs = function (produtoID) {
    $("#categorias").html("");
    $(".loading").show();
    
    $.post(controller + "GetCategorias", { produtoID: produtoID }, function (data) {
        if (data != "") {



            $("#categorias").html(data);

            $("#tabs-detalhes").tabs();

        }
        $(".btn-add-categoria").show();
        $(".mws-button-row").show();
        $(".loading").hide();
    }, "html");
}