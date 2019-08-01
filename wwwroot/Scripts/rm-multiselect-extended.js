$.extend($.expr[':'], {
    'containsi': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase()
            .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});

(function ($) {
    $.rmMultiselectExtended = function (selector, settings) {
        var config = {
            title: '',
            labelActive: '',
            labelDeactive: '',
            extraColumns: null,
            extraColumnsCallback: null,
            ajaxFilter: false,
            ajaxMethod: ''
        };
        if (settings) { $.extend(config, settings); }

        var select = $(selector);
        select.hide();
        var obj = $('<div class="rm-multiselect">'
						+ '<div class="rm-column-lateral">'
							+ '<div class="label-deactive" style="padding: 5px;">' + config.labelActive + '</div>'
                            + (config.ajaxFilter == true
                            ? '<div><div class="rm-column-search" style="width: calc(85% - 20px); display:inline-block;"><input placeholder="Digite parte da razão social ou CNPJ e clique na lupa ao lado" class="input-deactive" type="text"/></div><input type="button" style="float: right; margin: 0 10px;" class="mws-ic-16 ic-find li_icon input-filter-inactive"/></div>'
                            : '<div class="rm-column-search"><input class="input-deactive" type="text"/></div>')
							//+ '<div class="rm-column-search" ' + (config.ajaxFilter == true ? 'style="width: 80%; display:inline-block;"' : '') + '><input class="input-deactive" type="text"/></div>' + (config.ajaxFilter == true ? '<div style="display:inline-block;"><input type="button" class="input-filter-inactive" value="..." /></div>' : '')
							+ '<div class="rm-column deactive"></div>'
						+ '</div>'
						+ '<div class="rm-column-menu">'
							+ '<li class="rm-column-menu-add-all" title="adicionar todos"><i class="rm-icon-add-all"></i></li>'
							+ '<li class="rm-column-menu-remove-all" title="remover todos"><i class="rm-icon-remove-all"></i></li>'
						+ '</div>'
						+ '<div class="rm-column-lateral">'
							+ '<div class="label-active" style="padding: 5px;">' + config.labelDeactive + '</div>'
							+ '<div class="rm-column-search"><input class="input-active" type="text"/></div>'
							+ '<div class="rm-column active"></div>'
						+ '</div>'
						+ '<div style="clear: both"></div>'
					+ '</div>'
					+ '<div style="clear: both"></div>'
					);

        obj.insertAfter(select);

        var addExtraColumns = function (element) {
            if (config.extraColumns) {
                $.each(config.extraColumns, function (i, item) {
                    var width = (100 / (config.extraColumns.length + 1)) - 1 + "%";

                    element.find('.rm-bt-action').before('<div class="option-column" style="display: inline-block; width: ' + width + ';">' + item + '</div>');
                    element.find('.content').css({
                        display: "inline-block",
                        width: width
                    });

                    if (config.extraColumnsCallback) {
                        $.each($(".option-column").parent(), function (rowIndex, row) {
                            config.extraColumnsCallback(row, $(row).find(".option-column").children());
                        });
                    }
                });
            }
        };

        var removeExtraColumns = function (element) {
            if (config.extraColumns) {
                element.find(".option-column").remove();
                element.find('.content').removeAttr('style').css({
                    display: "inline-block",
                    width: "95%"
                });
            }
        };

        var setActionColumnItemButton = function () {
            obj.find('.rm-bt-action').click(function () {
                var thisParent = $(this).parent();
                var itemOption = select.children('option[value=' + thisParent.attr('data-value') + ']');
                if (thisParent.parent().hasClass('deactive')) {
                    itemOption.attr('selected', 'selected');
                    obj.find('.rm-column.active').append(thisParent);

                    if (config.extraColumns)
                        addExtraColumns(thisParent);

                    $(this).text('-');
                }
                else {
                    itemOption.removeAttr('selected');
                    obj.find('.rm-column.deactive').append(thisParent);
                    $(this).text('+');

                    if (config.extraColumns)
                        removeExtraColumns(thisParent);
                }
            });
        };

        var loadValues = function () {
            if (config.extraColumns) {
                var width = (100 / (config.extraColumns.length + 1)) - 1 + "%";

                obj.children('.rm-column-lateral').children('.rm-column.active').empty();

                select.children('option:selected').each(function () {

                    obj.children('.rm-column-lateral').children('.rm-column.active').append(
                        '<div class="rm-column-item" data-value=' + $(this).val() + ' >' +
                        '<div style="display: inline-block; width: ' + width + ';">' + $(this).text() + '</div>' +
                        '<a class="rm-bt-action"><strong>-</strong></a></div>');
                });

                obj.children('.rm-column-lateral').children('.rm-column.deactive').empty();
                select.children('option').not(':selected').each(function () {
                    obj.children('.rm-column-lateral').children('.rm-column.deactive').append(
                        '<div class="rm-column-item" data-value=' + $(this).val() + ' >' +
                        '<div class="content" style="display: inline-block; width: 95%">' + $(this).text() + '</div>' +
                        '<a class="rm-bt-action"><strong>+</strong></a></div>');
                });

                addExtraColumns($('.rm-column.active .rm-column-item'));
                setActionColumnItemButton();
            }
            else {
                obj.children('.rm-column-lateral').children('.rm-column.active').empty();

                select.children('option:selected').each(function () {

                    obj.children('.rm-column-lateral').children('.rm-column.active').append('<div class="rm-column-item" data-value=' + $(this).val() + ' >' + $(this).text() + '<a class="rm-bt-action"><strong>-</strong></a></div>');
                });

                obj.children('.rm-column-lateral').children('.rm-column.deactive').empty();
                select.children('option').not(':selected').each(function () {
                    obj.children('.rm-column-lateral').children('.rm-column.deactive').append('<div class="rm-column-item" data-value=' + $(this).val() + ' >' + $(this).text() + '<a class="rm-bt-action"><strong>+</strong></a></div>');
                });
                setActionColumnItemButton();
            }
        };

        obj.bind("loadValues", loadValues);

        var onReceive = function (event, ui) {
            if (config.extraColumns) {
                var valueItem = ui.item.attr('data-value');
                var itemOption = select.children('option[value=' + valueItem + ']');
                if (ui.item.parent().hasClass('deactive')) {

                    removeExtraColumns(ui.item);

                    itemOption.removeAttr('selected');
                    $(this).find('.rm-bt-action').text('+');
                }
                else {

                    addExtraColumns(ui.item);

                    itemOption.attr('selected', 'selected');
                    $(this).find('.rm-bt-action').text('-');
                }
            }
            else {
                var valueItem = ui.item.attr('data-value');
                var itemOption = select.children('option[value=' + valueItem + ']');
                if (ui.item.parent().hasClass('deactive')) {
                    itemOption.removeAttr('selected');
                    $(this).find('.rm-bt-action').text('+');
                }
                else {
                    itemOption.attr('selected', 'selected');
                    $(this).find('.rm-bt-action').text('-');
                }
            }
        };

        obj.find('input').keyup(function () {
            if (config.ajaxFilter != true) {
                var columnSet = 'deactive';
                if ($(this).hasClass('input-active')) {
                    columnSet = "active";
                }

                if ($(this).val() != "") {
                    obj.children('.rm-column-lateral').find('.rm-column.' + columnSet + ' .rm-column-item').hide();
                    obj.children('.rm-column-lateral').find('.rm-column.' + columnSet + ' .rm-column-item:containsi("' + $(this).val() + '")').show();
                    return;
                }
                obj.children('.rm-column-lateral').find('.rm-column.' + columnSet + ' .rm-column-item').show();
            }
        });

        obj.find('.rm-column-menu li').click(function () {
            var items;
            if ($(this).hasClass('rm-column-menu-add-all')) {
                items = obj.children('.rm-column-lateral').find('.rm-column.deactive .rm-column-item:visible').each(function () {
                    select.children('option[value=' + $(this).attr('data-value') + ']').attr('selected', 'selected');
                });

                obj.children('.rm-column-lateral').find('.rm-column.active').append(
					items
				);

                items.find('.rm-bt-action').text('-');

                if (config.extraColumns)
                    addExtraColumns(items);
            }
            else {
                items = obj.children('.rm-column-lateral').find('.rm-column.active .rm-column-item:visible').each(function () {
                    select.children('option[value=' + $(this).attr('data-value') + ']').removeAttr('selected');
                });
                obj.children('.rm-column-lateral').find('.rm-column.deactive').append(
					items
				);
                items.find('.rm-bt-action').text('+');

                if (config.extraColumns)
                    removeExtraColumns(items);
            }
        });

        obj.children('.rm-column-lateral').children('.rm-column').sortable({
            containment: $('.rm-multiselect'),
            connectWith: ['.rm-column'],
            cursor: 'move',
            scroll: false,
            receive: onReceive
        });

        obj.find('.input-filter-inactive').click(function () {

            if ($('.input-deactive').val().length >= 4 && $('.input-deactive').val() != "DROGARIA") {

                $(".loading-save").show();

                $.ajax({
                    type: "POST",
                    url: controller + "GetDisponiveisFiltrados",
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({ filtro: $('.input-deactive').val(), bandeiraId: $("#Bandeiras").val() }),
                    success: function (data) {

                        select.empty();

                        $.each(data, function () {
                            var option = $('<option></option>');

                            option.attr('value', this.codigo);
                            option.text(this.descricao);
                            if (this.selecionado)
                                option.attr('selected', 'true');

                            select.append(option);
                        });

                        loadValues();
                        $(".loading-save").hide();
                    },
                    error: function (data) {
                        alert("Houve um erro ao obter a lista de distribuidores.");
                        $(".loading-save").hide();
                    }
                });
            }
            else {
                alert("Sua pesquisa resultará em resultados demais. Tente um nome mais completo");
                $(".loading-save").hide();
            }

        });

        loadValues();

        return obj;
    };
})(jQuery);
