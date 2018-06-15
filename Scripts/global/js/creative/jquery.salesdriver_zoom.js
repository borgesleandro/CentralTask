(function($) {
    // jQuery plugin zoom
    $.fn.salesdriver_zoom = function(parameters, popupParamsCss, maskParamsCss) {
        //Events
        const PRESS = "CLICK";
        const RELEASE = "RELEASE";
        const ROLLOVER = "ROLLOVER";
        const ROLLOUT = "ROLLOUT";
        const DOUBLECLICK = "DOUBLECLICK";

        //Default mandatory parameters
        var defaultEvent = PRESS;
        var defaultX = 0;
        var defaultY = 0;
        var defaultWidth = 250;
        var defaultHeight = 100;
        var defaultContent = "";
        var defaultFadeInAnimation = 1;
        var defaultFadeOutAnimation = 1;
        var defaultBackgroundOpacity = 0.5;

        //Parameters
        parameters = $.extend({
            event: defaultEvent,
            width: defaultWidth,
            height: defaultHeight,
            content: defaultContent,
            fadeInAnimation: defaultFadeInAnimation,
            fadeOutAnimation: defaultFadeInAnimation,
            opacity: defaultBackgroundOpacity
        },
        parameters);

        var maskDefaultCss = {
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'z-index': '500',
            'background-color': '#000',
            'display': 'none'
        }

        var popupDefaultCss = {
            'width': '250px',
            'height': '100px',
            'overflow': 'hidden',
            'display': 'none',
            'position': 'absolute',
            'z-index': '501',
            'background-color': '#8CA3AF'
        }
        var zoomCss = $.extend(popupDefaultCss, popupParamsCss);
        var maskCss = $.extend(maskDefaultCss, maskParamsCss);

        var mask = $('<div/>', {
            id: "" + parameters.id + ""
        });
        mask.css(maskCss);
        mask.appendTo("body");

        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
        mask.css({
            'width': maskWidth,
            'height': maskHeight,
        });

        var zoom = $('<div/>', {
            html: parameters.content
        });
        zoom.css(zoomCss)
        zoom.appendTo("body");

        //Object
        var $this = $(this);

        //Behavior
        switch (parameters.event) {
        case PRESS:
            $this.mouseup(show);
            break;
        case RELEASE:
            $this.mousedown(show);
            break;
        case ROLLOVER:
            $this.mouseover(show);
            break;
        case ROLLOUT:
            $this.mouseout(show);
            break;
        case DOUBLECLICK:
            $this.dblclick(show);
            break;
        default:
            alert("EVENT SYNTAX IS WRONG");
        }
        mask.click(hide);
        $(window).resize(resize);

        function show(e) {
	        var maskHeight = $(document).height();
            var maskWidth = $(window).width();
            mask.css({
                'width': maskWidth,
                'height': maskHeight,
                'display': 'inline',
                'opacity': 0
            });
            mask.animate({
                'opacity': parameters.opacity
            },
            parameters.fadeInAnimation * 1000);

            var temporaryTop = e.pageY;
            var temporaryLeft = e.pageX;
            zoom.attr('temporaryTop', temporaryTop);
            zoom.attr('temporaryLeft', temporaryLeft);
            var containerX = ($(window).height() / 2) - (parameters.height / 2);
            var containerY = ($(window).width() / 2) - (parameters.width / 2);
            zoom.css({
                top: temporaryTop + 'px',
                left: temporaryLeft + 'px',
            });
            zoom.animate({
                'width': parameters.width,
                'height': parameters.height - 10,
                'top': containerX,
                'left': containerY,
            },
            parameters.fadeInAnimation * 1000);

        }

        function hide(e) {
            zoom.animate({
                'width': 1,
                'height': 1,
                'top': zoom.attr('temporaryTop') + 'px',
                'left': zoom.attr('temporaryLeft') + 'px',
            },
            parameters.fadeOutAnimation * 1000);
            mask.animate({
                opacity: 0,
            },
            parameters.fadeOutAnimation * 1000,
            function() {
                mask.css({
                    'display': 'none',
                    'opacity': parameters.opacity
                });
            });
        }

        function resize() {
            var containerX = ($(window).height() / 2) - (parameters.height / 2);
            var containerY = ($(window).width() / 2) - (parameters.width / 2);
            zoom.css({
                'top': containerX,
                'left': containerY
            });
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();
            mask.css({
                'width': maskWidth,
                'height': maskHeight
            });
        }

        //Return Jquery Object
        return this;
    };
})(jQuery);