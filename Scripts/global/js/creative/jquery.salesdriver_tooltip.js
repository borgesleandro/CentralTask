(function($) {
    // jQuery plugin tooltip
    $.fn.salesdriver_tooltip = function(parameters, tooltipParamsCss, maskParamsCss, arrowParamsCss) {
        //State
        var display = false;

        //Default mandatory parameters
        var defaultX = 0;
        var defaultY = 0;
        var defaultWidth = 250;
        var defaultContent = "";
        var defaultFadeDuration = 0.2;
        var defaultPadding = 10;

        //Arrows
        var defaultArrowSize = 20;
        var defaultArrowPosition = 20;
        var defaultArrowMargin = 10;
		var defaultArrowColor='#a9a8a9';
		
		//Background
		var defaultBackgroundOpacity=0.4;

        //Parameters
        parameters = $.extend({
            x: defaultX,
            y: defaultY,
            width: defaultWidth,
            content: defaultContent,
            fadeduration: defaultFadeDuration,
            padding: defaultPadding,
            arrowsize: defaultArrowSize,
            arrowpositon: defaultArrowPosition,
            arrowmargin: defaultArrowMargin,
			arrowcolor:defaultArrowColor,
			backgroundopacity:defaultBackgroundOpacity,
        },
        parameters);

        var tooltipDefaultCss = {
            'z-index': '2001',
            'display': 'none',
            'border-width': '0',
			'font-family': 'HelveticaNeueRoman',
            'position': 'absolute',
            'border-style': 'solid',
            'background-color': '#545454',
            'padding': '' + parameters.padding + 'px ' + parameters.padding + 'px ' + parameters.padding + 'px ' + parameters.padding + 'px',
        }
        var maskDefaultCss = {
            'z-index': '2000',
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'display': 'none',
            'background-color': '#ffffff',
        }
        var arrowDefaultCss = {
            'top': '0',
            'left': '230px',
            'margin-left': '-0px',
            'border-style': 'solid',
            'position': 'absolute',
            'height': '0',
            'width': '0',
        }

        var tooltipCss = $.extend(tooltipDefaultCss, tooltipParamsCss);
        var maskCss = $.extend(maskDefaultCss, maskParamsCss);
        var arrowCss = $.extend(arrowDefaultCss, arrowParamsCss);

        var tooltip = $('<div/>', { id: "" + parameters.id + "" });
        var mask = $('<div/>', { id: "mask" });
        var arrow = $('<div/>', { id: "arrow" });
        var content = $('<div/>', { id: "text" });

        mask.css(maskCss);
        mask.appendTo('body');
        content.appendTo(tooltip);
        arrow.css(arrowCss);
        arrow.appendTo(tooltip);


        var maskHeight = $(document).height();
        var maskWidth = $(window).width();
        mask.css({
            'width': maskWidth,
            'height': maskHeight,
            'opacity': parameters.backgroundopacity,
        });


        content.html(parameters.content);

        tooltip.css(tooltipCss);
        tooltip.appendTo('body');


        //Objects
        var $this = $(this);

        $this.mouseup(toggle);
        mask.click(function() {
            toggle();
        });

        function toggle() {
            if (display == false) {
                var offset = $(this).offset();

                var documentHeight = $(document).height();
                var documentWidth = $(window).width();

                var hPos;
                var vPos;
			
                //check position
                if (offset.top > documentHeight / 2) vPos = "bottom";
                else vPos = "top";

                if (offset.left > documentWidth / 2) hPos = "right";
                else hPos = "left";

                if (vPos == "top" && hPos == "left") {
					tooltip.css({
						'width': parameters.width
	                });
                    arrow.css({
                        'border-color': 'transparent transparent '+parameters.arrowcolor+'',
                        'left': parameters.arrowpositon,
                        'margin-top': - parameters.arrowsize,
                        'border-width': '0 ' + parameters.arrowsize + 'px ' + parameters.arrowsize + 'px',
                    });

                    tooltip.css({
                        'top': offset.top + parameters.arrowsize + $(this).height() + parameters.arrowmargin + parameters.x,
						'left': offset.left-parameters.arrowpositon + parameters.y-(parameters.arrowsize/2)
                    });
                }
                if (vPos == "top" && hPos == "right") {
					tooltip.css({
						'width': parameters.width
	                });
                    arrow.css({
                        'border-color': 'transparent transparent '+parameters.arrowcolor+'',
                        'left': (tooltip.width() + (parameters.padding * 2)) - (parameters.arrowsize * 2) - parameters.arrowpositon,
                        'margin-top': -parameters.arrowsize,
                        'border-width': '0 ' + parameters.arrowsize + 'px ' + parameters.arrowsize + 'px',
                    });
                    tooltip.css({
                        'top': offset.top + parameters.arrowsize + $(this).height() + parameters.arrowmargin + parameters.x,
                        'left': offset.left- tooltip.width()+(parameters.arrowsize/2)+parameters.arrowpositon
                    });
                }
                if (vPos == "bottom" && hPos == "left") {
					tooltip.css({
						'width': parameters.width
	                });
                    arrow.css({
						'border-color':parameters.arrowcolor+' transparent transparent ',
                        'left': parameters.arrowpositon,
                        'margin-top': tooltip.height() + (parameters.padding * 2),
                        'border-width': '' + parameters.arrowsize + 'px ' + parameters.arrowsize + 'px 0',
                    });
                    tooltip.css({
                        'top': offset.top - tooltip.height()-parameters.arrowsize - $(this).height() - parameters.padding,
                        'left': offset.left-parameters.arrowpositon + parameters.y-(parameters.arrowsize/2)
                    });
                }
                if (vPos == "bottom" && hPos == "right") {
					tooltip.css({
						'width': parameters.width
	                });
                    arrow.css({
                        'border-color':parameters.arrowcolor+' transparent transparent ',
                        'left': (tooltip.width() + (parameters.padding * 2)) - (parameters.arrowsize * 2) - parameters.arrowpositon,
                        'margin-top': tooltip.height() + (parameters.padding * 2),
                        'border-width': '' + parameters.arrowsize + 'px ' + parameters.arrowsize + 'px 0',
                    });
                    tooltip.css({
                        'top': offset.top - tooltip.height()-parameters.arrowsize - $(this).height() - parameters.padding,
						'left': offset.left- tooltip.width()+(parameters.arrowsize/2)+parameters.arrowpositon
                    });
                }
                mask.animate({ 'opacity': "toggle" }, parameters.fadeduration * 1000);
                tooltip.animate({ 'opacity': "toggle" }, parameters.fadeduration * 1000);
                display = true;
            }
            else {
               	mask.animate({ 'opacity': "toggle" }, parameters.fadeduration * 1000);
                tooltip.animate({ 'opacity': "toggle" }, parameters.fadeduration * 1000);
                display = false;
            }

        }

        //Return Jquery Object
        return this;
    };
})(jQuery);