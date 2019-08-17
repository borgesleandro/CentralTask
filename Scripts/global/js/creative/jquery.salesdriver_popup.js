(function($) {
    // jQuery plugin popup
    $.fn.salesdriver_popup = function(parameters, popupParamsCss, closeParamsCss) {
        const NONE = "None";

        //Default mandatory parameters
        var defaultId = NONE;
        var defaultX = 0;
        var defaultY = 0;
        var defaultWidth = 250;
        var defaultHeight = 100;
        var defaultContent = NONE;
		var defaultCallBack = NONE;

        //Parameters
        parameters = $.extend({
            id: defaultId,
            x: defaultX,
            y: defaultY,
            width: defaultWidth,
            height: defaultHeight,
            content: defaultContent,
			callback:defaultCallBack,
        },
        parameters);

        var popupDefaultCss = {
            'width': '250px',
            'height': '100px',
            'position': 'absolute',
            'background-color': '#ddeecc',
            'z-index': '1001',
            'padding': '2px 2px 2px 2px',
            'display': 'none'
        }


        var popupCss = $.extend(popupDefaultCss, popupParamsCss);

        var popup = $('<div/>', {
            id: "" + parameters.id + ""
        });
        $.get(parameters.content,
        function(data) {

            popup.html(data)
            popup.css(popupCss)
            popup.appendTo("body");

            var popupX = ($(window).height() / 2) - (parameters.height / 2);
            var popupY = ($(window).width() / 2) - (parameters.width / 2);

            popup.css({
                'top': popupX,
                'left': popupY,
                'height': parameters.height,
                'width': parameters.width,
            });
			if (parameters.callback != NONE) eval(parameters.callback);

        });

        $(window).resize(function() {
            //Mask
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();
            //Container
            var contX = ($(window).height() / 2) - (popup.height() / 2);
            var contY = ($(window).width() / 2) - (popup.width() / 2);


            popup.css({
                'top': contX,
                'left': contY,
            });
        });

        //Return Jquery Object
        return popup;
    };
})(jQuery);