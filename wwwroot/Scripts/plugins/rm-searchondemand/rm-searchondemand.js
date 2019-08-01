(function ($) {
    $.rmSearchOnDemand = function (selector, settings) {
        var config = {
            url: '',
            params: {},
            value: 'Value',
            text: 'Text',
            type: 'get',
            keyLimit: 3,
            limit: 1500,
            textKeyAsParam: '',
            height: 120,
            width: null,
            name: '',
            classes: ''
        };
        if (settings) { $.extend(config, settings); }

        var statusSearch = true;
        var lastString = '';

        var select = $(selector);
        var nameSelect = select.attr('name');

        select.attr('name', nameSelect + "_INPUT");
        var div = select.parents("div:first");
        if (div != undefined && div.length > 0) {
            $(".field-validation-valid", div).attr("data-valmsg-for", nameSelect + "_INPUT");
        }

        var nameValueSelect = nameSelect;

        if (select.attr('labelValueName'))
            nameValueSelect = select.attr('labelValueName');

        var selectHidden = $('<input type="hidden" class="' + config.classes + '" name="' + nameValueSelect + '" value=""/>');

        


        

        var obj = $('<div class="rm-search-on-demand">'
                    + '<ul class="rm-search-on-demand-items"></ul>'
					+ '<div style="clear: both"></div>'
					);
        obj.offset().top = select.offset().top;
        obj.offset().left = select.offset().left;
        obj.width(select.width());
        if (config.width != null)
            obj.width(config.width);

        obj.css('max-height', (config.height) + 'px');
        obj.css('z-index', '9999');


        selectHidden.insertBefore(select);

        obj.insertAfter(select);

        select.attr('autocomplete', 'off');
        select.css('position', 'relative');
        select.css("z-index", 1);

        var objLoading = $('<li class="item-loading"></li>');

        select.focus(function (e) {
            if ($(this).val().length > config.keyLimit) {
                obj.show();
            }
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        });

        select.click(function (e) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        });

        $('body').click(function () {
            obj.hide();
        });

        select.keyup(function () {
            if ($(this).val().length > config.keyLimit) {
                if (config.textKeyAsParam != null) {
                    config.params[config.textKeyAsParam] = select.val();
                }
                obj.show();
                if (statusSearch == true) {
                    lastString = select.val();
                    getItems();
                }
            } else {
                obj.hide();
            }
        });

        var enableNewSearch = function () {
            statusSearch = true;
            if (lastString != select.val()) {
                lastString = select.val();
                getItems();
            }
        };

        var getItems = function () {
            statusSearch = false;
            //console.log(config.params);
            $(obj).find('.rm-search-on-demand-items').prepend($(objLoading));
            $.ajax({
                url: config.url,
                type: config.type,
                dataType: "json",
                data: config.params,
                success: function (data) {
                    setTimeout(enableNewSearch, config.limit);
                    $(obj).find('.rm-search-on-demand-items').empty();
                    if (data.length > 0) {
                        $.each(data, function (index, item) {
                            $('<li class="rm-search-on-demand-item" data-val="' + item[config.value] + '">'
                            + item[config.text]
                            + '</li>').appendTo($(obj).find('.rm-search-on-demand-items')).click(setItem);
                        });
                    }
                }
            });
        };

        var setItem = function (event) {
            selectHidden.val($(event.target).attr('data-val'));
            select.val($(event.target).text());
            obj.hide();
        };

        var setParams = function (event, params) {
            config.params = params;
        };

        obj.bind("setParams", setParams);

        selectHidden.val(select.val());

        if (select.attr('defaultvalue'))
            selectHidden.val(select.attr('defaultvalue'));



        return obj;
    };
})(jQuery);

