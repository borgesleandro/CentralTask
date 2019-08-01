$(document).ready(function () {

    //Scope
    var currentAjaxRequest = null;

    $("#CNPJ").chosen();
    //----


    //Troca CNPJ - Carrega UF
    $(document).on("change", "#CNPJ", function () {

       // $(".loadingCNPJ").show();

        var selectedValue = $(this).val();

        EsconderContainer(true);
        LimparContainer();


        if (selectedValue != "") {
            if (currentAjaxRequest != null) currentAjaxRequest.abort();


            currentAjaxRequest = PreencheContainer(1, function () {
                //$(".loadingCNPJ").hide();
                EsconderContainer(false);
            });


        }

    });

    //CheckAll DataTable
    $(document).on("click", ".check_all", function () {
        $(":checkbox", $(".table-items").dataTable().fnGetNodes()).attr("checked", $(this).is(":checked"));
    });

    //Adicionar Item
    $(document).on("click", ".adicionarItem", function () {
        $(".loading-save").show();
        //Remove antigos modais
        $(".mws-dialog-inner").dialog("destroy").remove();

        var container = $(this).parents(".segmentacao-container:first");

        var sendData = {};
        sendData.tipo = PegaTipoItem(container);

        switch (sendData.tipo) {
            case 2:
                sendData.parent_ID = $(".estado .item.selected").attr("data-id");
                break;
            case 3:
                sendData.parent_ID = $(".cidade .item.selected").attr("data-id");
                break;
        }
        if (sendData.parent_ID == undefined && sendData.tipo != 1) {
            $(".loading-save").hide();
            alert("Selecione " + (sendData.tipo == 2 ? "um Estado" : "uma Cidade"));
            return false;
        }

        var aSelectedItems = new Array();

        $(".item", container).each(function () {
            aSelectedItems.push($(this).attr("data-id"));
        });

        sendData.selectedItems = aSelectedItems;



        //Abrir Modal
        $.post(controller + "AbrirModal", $.toDictionary(sendData), function (data) {
            var buttonsModal = {};

            //Funcao Adicionar Items do Modal
            buttonsModal["Adicionar"] = function () {

                $(".loading-save").show();

                var checked = $(":checked", $(".table-items").dataTable().fnGetNodes());

                var selectedItems = new Array();
                $(checked).each(function () { selectedItems.push($(this).val()); });


                var sendSaveData = {};
                sendSaveData.selectedItems = selectedItems;
                sendSaveData.cnpj_dist = $("#CNPJ").val();
                sendSaveData.tipo = $(".modal-container").attr("data-type");
                var parentID = new Array();

                switch (parseInt(sendSaveData.tipo)) {
                    case 2:
                        parentID.push($(".estado .item.selected").attr("data-id"));
                        break;
                    case 3:
                        parentID.push($(".cidade .item.selected").attr("data-id"));
                        parentID.push($(".estado .item.selected").attr("data-id"));
                        break;

                }

                sendSaveData.parent_ID = parentID;

                $(this).dialog("destroy").remove();
                if (currentAjaxRequest != null) currentAjaxRequest.abort();

                currentAjaxRequest = $.post(controller + "SalvarSegmentacao", $.toDictionary(sendSaveData), function (data) {
                    if (data) {
                        PreencheContainer(sendSaveData.tipo);
                    }
                    else {
                        alert("Ocorreu um erro ao salvar a segmentação geográfica deste Distribuidor.");
                    }


                    $(".loading-save").hide();
                });






            };
            //Funcao Cancelar do Modal
            buttonsModal["Cancelar"] = function () {
                $(this).dialog("destroy").remove();
            };

            $(data).dialog({
                resizable: false,
                draggable: false,
                width: "500px",
                position: ['center', 100],
                modal: true,
                buttons: buttonsModal
            });



            $(".table-items").dataTable({
                aaSorting: [[0, "asc"]],
                sPaginationType: "full_numbers",
                iDisplayLength: 10,
                bLengthChange: false,
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
            $(".loading-save").hide();

        }, "html");

    });

    //Selecionar Item
    $(document).on("click", ".item-info", function () {

        var eContainer = $(this).parents(".segmentacao-container:first");
        var eItem = $(this).parents(".item:first");
        var tipo = PegaTipoItem(eContainer);
        if (tipo < 3) {
            $(".loading-save").show();


            switch (tipo) {
                case 1:
                    LimparContainer("brick");
                    LimparContainer("cidade");
                    break;
                case 2:
                    LimparContainer("brick");
                    break;
            }

            if (eItem.hasClass("selected")) {
                eItem.removeClass("selected");

                $(".loading-save").hide();
            } else {

                $(".item", eContainer).removeClass("selected");
                eItem.addClass("selected");

                PreencheContainer(tipo + 1);




            }
        }
    });

    //Deletar Item
    $(document).on("click", ".item-delete", function () {
        var eItem = $(this).parents(".item:first");
        var iTipo = PegaTipoItem(eItem.parents(".segmentacao-container:first"));

        var sMensagemComplemento = "";

        var sTipo = PegaTipoItemValue(iTipo);
        var parentID = new Array();
        switch (iTipo) {
            case 1:
                LimparContainer("cidade");
                LimparContainer("brick");
                sMensagemComplemento = "Essa operação irá excluir as Cidades e Bricks associados.";
                break;
            case 2:
                LimparContainer("brick");
                sMensagemComplemento = "Essa operação irá excluir os Bricks associados.";
                parentID.push($(".estado .item.selected").attr("data-id"));
                break;
            case 3:
                parentID.push($(".cidade .item.selected").attr("data-id"));
                parentID.push($(".estado .item.selected").attr("data-id"));
                break;
        }

        var hMensagemComplemento = "<br/><span style='font-size: smaller;color:#FF3D3D;'>" + sMensagemComplemento + "</span>";

        alert("Deseja realmente excluir " + (iTipo == 2 ? " esta " : " este ")  + sTipo + "?" + hMensagemComplemento, "Excluir " + PegaTipoItemValue(iTipo), null, function () {
            $(".loading-save").show();
            var sendData = {};
            sendData.tipo = iTipo;
            sendData.id = eItem.attr("data-id");
            sendData.cnpj_dist = $("#CNPJ").val();
            
           

           

            sendData.parent_ID = parentID;
            

            $.post(controller + "DeletarSegmentacao", $.toDictionary(sendData), function (data) {


                if (data) {

                    PreencheContainer(iTipo);

                    alert((iTipo == 2 ? "A " : "O ") + sTipo + " foi excluído com sucesso!");
                    
                }
                else {
                    alert("Ocorreu um erro ao excluir " + (iTipo == 2 ? "a " : "o ") + sTipo + ".");
                }

                $(".loading-save").hide();
            });
        });

    });

});



var PreencheContainer = function (iTipo, successFunction, errorFunction) {
    $(".loading-save").show();
    var sendData = {};
    sendData.tipo = iTipo;
    sendData.cnpj_dist = $("#CNPJ").val();

    if (typeof iTipo == "string")
        iTipo = parseInt(iTipo);

    var parentItem = "";
    switch (iTipo) {
        case 2:
            parentItem = $(".estado .item.selected");
            break;
        case 3:
            parentItem = $(".cidade .item.selected");
            break;
    }

    if (parentItem != "")
        sendData.parent_ID = $(parentItem).attr("data-id");

    $.post(controller + "GetItems", sendData, function (data) {
        if (!data.ok) {
            alert("Ocorreu um erro ao carregar a segmentação geográfica deste Distribuidor.");
            if (errorFunction != undefined) errorFunction();
        }
        else {

            var sTipo = PegaTipoItemValue(iTipo);

            var eContainer = $(".container-data", ".segmentacao-container." + sTipo);

            var hContainer = "";



            var sComplementoParent = PegaComplementoDescricao(iTipo - 1);

            if (parentItem != "") {
                var iQuantidadeAntiga = $(".quantidade", parentItem).html();
                if (iQuantidadeAntiga == "")
                    iQuantidadeAntiga = 0;
                
                var iQuantidadeNova = $(data.items).length;
                var complemento = "";
                if (parseInt(iQuantidadeAntiga) != iQuantidadeNova && iQuantidadeNova != 0) {
                    complemento = "<span class='quantidade'>" + iQuantidadeNova + "</span> " + sComplementoParent;
                    $(".item-complemento", parentItem).html(complemento);
                }
                if(iQuantidadeNova == 0 ) {
                    $(".item-complemento", parentItem).html("");
                }
            }

            $(data.items).each(function () {
                var oObj = {};
                oObj.id = this.ID;
                oObj.descricao = this.Descricao;
                oObj.quantidade_filhos = this.Quantidade_Filhos;

                oObj.complemento_descricao = oObj.quantidade_filhos > 0 ? PegaComplementoDescricao(iTipo) : "";

                hContainer += HtmlItem(oObj);
            });

            eContainer.html(hContainer);

            if (successFunction != undefined) successFunction();

        }

        $(".loading-save").hide();

    }, "json");



};

var HtmlItem = function (oObj) {
    var html = "<div class='item' data-id='" + oObj.id + "' >";
    html += "<span class='item-info'>";
    html += "<span class='item-descricao'>" + oObj.descricao + "</span>";
    html += "<span class='item-complemento'>";
    html += "<span class='quantidade'>" + (oObj.quantidade_filhos > 0 ? oObj.quantidade_filhos : "") + "</span> ";
    html += oObj.complemento_descricao + "</span>";
    html += "</span>";
    html += "<span class='item-delete'>X</span>";
    html += "</div>";

    return html;

};

var LimparContainer = function (sTipo) {
    var eContainers = arguments.length > 0 ? $(".container-data", ".segmentacao-container." + sTipo) : $(".container-data");
    eContainers.html("");


};

var EsconderContainer = function (bEsconder) {
    bEsconder ? $(".segmentacao-container-dados").hide() : $(".segmentacao-container-dados").show();
};

var PegaTipoItem = function (eContainer) {
    if (eContainer.hasClass("estado")) {
        return 1;
    } else if (eContainer.hasClass("cidade")) {
        return 2;
    } else if (eContainer.hasClass("brick")) {
        return 3;
    }
    return 0;
};

var PegaTipoItemValue = function (oTipo) {
    if (typeof oTipo === "string") {
        switch (oTipo) {
            case "estado":
                return 1;
            case "cidade":
                return 2;
            case "brick":
                return 3;
        }
    }
    else if (typeof oTipo === "number") {
        switch (parseInt(oTipo)) {
            case 1:
                return "estado";
            case 2:
                return "cidade";
            case 3:
                return "brick";
        }

    }
};

var PegaComplementoDescricao = function (iTipo) {
    if (typeof iTipo == "string")
        iTipo = parseInt(iTipo);
    switch (iTipo) {
        case 1:
            return "Cidades selecionadas";
        case 2:
            return "Bricks selecionados";
    }

};