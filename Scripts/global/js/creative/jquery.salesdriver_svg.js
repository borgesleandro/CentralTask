(function($) {
    // jQuery plugin vaudioideo
    $.fn.salesdriver_svg = function(parameters, svgparameters) {
        const NONE = "None";
        //Default mandatory parameters
        var defaultId = NONE;
        var defaultX = 0;
        var defaultY = 0;
        var defaultWidth = 500;
        var defaultHeigth = 500;

        //Parameters
        parameters = $.extend({
            id: defaultId,
            x: defaultX,
            y: defaultY,
            width: defaultWidth,
            height: defaultHeigth
        },
        parameters);

        var defaultContainerCss = {
            'position': 'absolute',
            'z-index': '500',
        }

        if (parameters.id == NONE) alert("The Id Attributes is mandatory the svg will not display");
        else if ($('#' + parameters.id + '').html() != null) alert("svg id already used")
        else {

            var containerHtml =
            "<div id='" + parameters.id + "'></div>";
            $("body").prepend(containerHtml);



            $('#' + parameters.id + '').css(defaultContainerCss);
            $('#' + parameters.id + '').css({
                'width': parameters.width,
                'height': parameters.height,
                'top': parameters.x,
                'left': parameters.y,
            });

            $('#' + parameters.id + '').svg(svgparameters);

        }

        //Return Jquery Object
        return this;
    };
})(jQuery);