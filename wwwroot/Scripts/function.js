$(document).ready(function () {

    // Simula a tecla TAB ao pressionar ENTER
    $("input").keydown(function (e) {
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        if (key == 13) {
            e.preventDefault();
            var inputs = $(this).closest("form").find("input");
            inputs.eq(inputs.index(this) + 1).focus();

        }
    });
    
    $("#mws-wizard-form").mwsWizard();

    $(document).on("change", ".canalHierarquiaRequired", function (data) {
        var element = $(this);
        $.post(controller + "ValidaCanal", { canalID: element.val() }, function (data) {
            element.attr("data-hasHierarchy", data);
            element.valid();
        });
    });
    // Controle para manter o menu aberto ao clicar em uma função
    $("#funcaoGrupo > li").each(function () {
        var itemId = $(this).attr("id");
        var dataId = $(this).attr("data-id");

        if (itemId == controllerName) {
            $("ul").find("[data-id='" + dataId + "']").attr("class", "active");
            return;
        }
    });


    //MANTÉM APENAS O MENU CLICADO ABERTO
    $(document).on('click', '.LinkGrupoMenu',function () {
        var objetoclick = $(this).closest('li'); //Pega o Objeto li PAI do linque clicado
        var idGrupoClicado = $(this).closest('li').children("ul").attr("data-id");

        //Varre todos os grupos para Fechar o que não foi clicado
        $(".GrupoMenu").each(function () {
            var idGrupoAux = $(this).children("ul").attr("data-id");
            if (idGrupoClicado != idGrupoAux) {
                //SENÃO encontrar a classe
                if (!$(this).children("ul").hasClass("closed"))
                {
                    //Comando para forçar o fechamento do Grupo que está aberto e não é o clicado
                    $(this).children("ul").slideToggle("fast");
                    //Adiciona a classe "closed" após forçar o fechamento do Grupo de menu
                    $(this).children("ul").attr("class", "closed");
                }
            }
        });
        
        //Função ara manter visível o GrupoMenu clicado ( retirada do menu.cshtml)
        var interval =
            setInterval(function () {
                if ($(objetoclick).find("li:last").is(':visible')) {
                    $('html,body').animate({
                        scrollTop: $(objetoclick).offset().top
                    });
                } else {
                    $('html,body').animate({
                        scrollTop: $(objetoclick).find("li:last").offset().top
                    });
                }
                clearInterval(interval);
            }, 190);
    });


   
    if ($.validator) {
        $.extend($.validator.messages, {
            required: "Este campo é obrigatório",
            email: "Email inválido",
            number: "O campo deve ser um número."
        });

        $.validator.addMethod('decimal', function (value, element) {
            return this.optional(element) || /^\d+(\.\d{0,3})?$/.test(value);
        }, "Formato decimal inválido");

        $.validator.addMethod('canalHierarquiaRequired', function (value, element) {
            var hasHierarchy = false;
            if (value != "") {
                hasHierarchy = $(element).attr("data-hasHierarchy") == "true" ? true : false;
            }
            return hasHierarchy;
        }, "Este canal não possui permissão de Alçada de Aprovação");


        $.validator.methods.number = function (value, element) {
            return parseFloat(value).toString() !== "NaN";
        };



        $.validator.methods.date = function (value, element) {
            return value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/);
        };

        $.validator.methods.range = function (value, element, param) {
            var globalizedValue = value.replace(",", ".");
            return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
        };

        $.validator.addMethod("dateRange", function (value, element, param) {
            var params = param.split(" ");
            var initial_date = new Date(convertDateFormat($(params[0]).val()));
            var final_date = new Date(convertDateFormat($(params[1]).val()));
            console.log(initial_date + " - " + final_date);
            labelError0 = params[0].slice(1, params[0].length);
            labelError1 = params[1].slice(1, params[1].length);
            if (initial_date > final_date) {
                $("[data-valmsg-for=" + labelError0 + "], [data-valmsg-for=" + labelError1 + "]").show();
                $("[data-valmsg-for=" + labelError0 + "], [data-valmsg-for=" + labelError1 + "]").css('display', 'block');
                return false;
            }
            $("[data-valmsg-for=" + labelError0 + "], [data-valmsg-for=" + labelError1 + "]").hide();
            $("[data-valmsg-for=" + labelError0 + "], [data-valmsg-for=" + labelError1 + "]").css('display', 'none');
            return true;
        }, "A data inicial não pode ser maior que a final");

    }

    $(".mws-tabs").tabs();
    $(".mws-accordion").accordion();

    $(".mws-form").submit(function () {
        if (!$(this).valid()) {
            return false;
        }
    });
    var displayLength = !$(".mws-datatable-fn").hasClass("highQuantityItems") ? 10 : 50;
    displayLength = !$(".mws-datatable-fn").hasClass("lowQuantityItems") ? displayLength : 1;
    var paginate = !$(".mws-datatable-fn").hasClass("no-paginate");

    var columnsToSort = new Array;
    
    $(".data-sort-asc").each(function() {
        columnsToSort.push([ $(this).index() , "asc" ]);
    });
    
    $(".data-sort-desc").each(function () {
        columnsToSort.push([$(this).index(), "desc"]);
    });


    $(".mws-datatable-fn").dataTable({
        aaSorting: columnsToSort.length > 0 ? columnsToSort : [[0, "asc"]],
        sPaginationType: "full_numbers",
        //bPaginate: paginate,
        iDisplayLength: displayLength,
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

    $(".dataTables_filter", $(".no-filter").parents(".dataTables_wrapper")).hide();
    $(".dataTables_length", $(".no-length").parents(".dataTables_wrapper")).hide();
    $(".delete-item-list").click(function () {
        var form_item = $(this).attr("form-item");
        var labelAction = $(this).attr("label-action");
        var buttonAction = $(this).attr("button-action");
        var action = $(this).attr("action");
        var data_description = $(this).attr("data-description");
        $(form_item).dialog({
            autoOpen: true,
            title: "Deseja realmente executar essa ação?",
            modal: true,
            width: "auto",
            resizable: false,
            buttons: [{
                text: "Cancelar",
                "class": "mws-button gray",
                click: function () {
                    $(this).dialog("close");
                }
            }]
        })
            .parent()
            .find('.ui-dialog-buttonset')
            .prepend('<a href="' + action + '" class="mws-button ' + buttonAction + '">' + labelAction + '</a>');
        $(form_item + " strong").text(data_description);
    });
});

var explodeString = function (text, key) {
    return text.split(key);
};

var hideElements = function (aElements) {
    $.each(aElements, function (index, item) {
        $(item).hide();
    });
};

var convertDateFormat = function(date_value) {
    return date_value.replace(/^(\d{1,2}\/)(\d{1,2}\/)(\d{4})$/, "$2$1$3");
};

var resetMultiSelect = function (selector, multiselect) {
    selector.find('option').removeAttr('selected');
    multiselect.trigger('loadValues');
};

var disableChzn = function (items) {
    if (typeof items == 'object') {
        $.each(items, function (index, item) {
            var itemDisable = $('<div style="position: absolute; width: 100%; height: 100%; background: #CCC; z-index: 1000; opacity: 0.3; top: 0;"></div>');
            itemDisable.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(this).parent().find('.chzn-drop').remove();
            });
            $(item).find('input').prop('disabled', true);
            $(item).find('.chzn-drop').remove();
            $(item).find('.search-choice-close').remove();
            $(item).find('*').live('focus', function () { $(item).next().focus(); });

            $(item).append(itemDisable);
        });
    }
}