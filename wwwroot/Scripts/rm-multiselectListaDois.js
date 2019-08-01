$.extend($.expr[':'], {
    'containsi': function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase()
            .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});

(function ($) {
    $.rmMultiselectListaDois = function (selector, settings) {
        var config = {
            title: '',
            labelBotao: '',
            labelDeactive: ''
        };
        if (settings) { $.extend(config, settings); }

        var select = $(selector);
        select.hide();
        var obj = $('<div class="rm-multiselectListaDois">'
						+ '<div class="rm-column-lateralListaDois">'
							+ '<div class="label-deactive" style="padding: 5px;">' + config.labelDeactive + '</div>'
							//+ '<div class="rm-column-search"><input class="input-deactive" type="text"/></div>'
							+ '<div class="rm-columnListaDois deactive"></div>'
						+ '</div>'
						+ '<div style="clear: both"></div>'
					+ '</div>'
					+ '<div style="clear: both"></div>'
					);

        obj.insertAfter(select);

        var setActionColumnItemButton = function () {
            obj.find('.rm-bt-actionListaDois').click(function () {
                var thisParent = $(this).parent();
                var itemOption = select.children('option[value=' + thisParent.attr('data-value') + ']');
                if (thisParent.parent().hasClass('deactive')) {
                    itemOption.attr('selected', 'selected');
                    //alert(thisParent.attr('data-value'));
                    //carregaLista2(thisParent.attr('data-value'));
                    //obj.find('.rm-column.active').append(thisParent);
                    //$(this).text('-');
                }
                //else {
                //    alert(' xxxx ');
                //    itemOption.removeAttr('selected');
                //    obj.find('.rm-column.deactive').append(thisParent);
                //    alert(' yyyy ');
                //    //$(this).text('+');
                //}
            });
        };

        var loadValues = function () {
            //obj.children('.rm-column-lateralListaDois').children('.rm-column.active').empty();
            //select.children('option:selected').each(function () {
            //    obj.children('.rm-column-lateralListaDois').children('.rm-column.active').append('<div class="rm-column-item" data-value=' + $(this).val() + ' >' + $(this).text() + '<a class="rm-bt-action"><strong>-</strong></a></div>');
            //});

            obj.children('.rm-column-lateralListaDois').children('.rm-columnListaDois.deactive').empty();
            select.children('option').not(':selected').each(function () {
                //obj.children('.rm-column-lateralListaDois').children('.rm-column.deactive').append('<div class="rm-column-item" data-value=' + $(this).val() + ' >' + $(this).text() + '<a class="rm-bt-action"><strong>+</strong></a></div>');
                var append = '<div class="rm-column-itemListaDois" data-value=' + $(this).val() + ' >' + $(this).text()
                if (config.labelBotao == "SIM") {
                    append += '<a class="rm-bt-actionListaDois"><strong class="mws-ic-16 ic-arrow-right li_icon"></strong></a>'
                }
                append += '</div>'

                obj.children('.rm-column-lateralListaDois').children('.rm-columnListaDois.deactive').append(append);
            });
            setActionColumnItemButton();
        };

        obj.bind("loadValues", loadValues);

        var onReceive = function (event, ui) {

            var valueItem = ui.item.attr('data-value');
            var itemOption = select.children('option[value=' + valueItem + ']');
            //alert(valueItem);
            itemOption.attr('selected', 'selected');
            //if (ui.item.parent().hasClass('deactive')) {
            //    itemOption.removeAttr('selected');
            //    //$(this).find('.rm-bt-action').text('+');
            //}
            //else {
            //    itemOption.attr('selected', 'selected');
            //    //$(this).find('.rm-bt-action').text('-');
            //}
        };

        //obj.find('input').keyup(function () {
        //    var columnSet = 'deactive';
        //    if ($(this).hasClass('input-active')) {
        //        columnSet = "active";
        //    }

        //    if ($(this).val() != "") {
        //        obj.children('.rm-column-lateralListaDois').find('.rm-column.' + columnSet + ' .rm-column-item').hide();
        //        obj.children('.rm-column-lateralListaDois').find('.rm-column.' + columnSet + ' .rm-column-item:containsi("' + $(this).val() + '")').show();
        //        return;
        //    }
        //    obj.children('.rm-column-lateralListaDois').find('.rm-column.' + columnSet + ' .rm-column-item').show();
        //});

        //obj.find('.rm-column-menu li').click(function () {
        //    var items;
        //    if ($(this).hasClass('rm-column-menu-add-all')) {
        //        items = obj.children('.rm-column-lateralListaDois').find('.rm-column.deactive .rm-column-item:visible').each(function () {
        //            select.children('option[value=' + $(this).attr('data-value') + ']').attr('selected', 'selected');
        //        });

        //        obj.children('.rm-column-lateralListaDois').find('.rm-column.active').append(
        //			items
        //		);

        //        items.find('.rm-bt-action').text('-');
        //    }
        //    else {
        //        items = obj.children('.rm-column-lateralListaDois').find('.rm-column.active .rm-column-item:visible').each(function () {
        //            select.children('option[value=' + $(this).attr('data-value') + ']').removeAttr('selected');
        //        });
        //        obj.children('.rm-column-lateralListaDois').find('.rm-column.deactive').append(
        //			items
        //		);
        //        items.find('.rm-bt-action').text('+');
        //    }
        //});

        obj.children('.rm-column-lateralListaDois').children('.rm-columnListaDois').sortable({
            containment: $('.rm-multiselectListaDois'),
            connectWith: ['.rm-columnListaDois'],
            cursor: 'move',
            scroll: false,
            receive: onReceive
        });

        loadValues();

        return obj;
    };
})(jQuery);
