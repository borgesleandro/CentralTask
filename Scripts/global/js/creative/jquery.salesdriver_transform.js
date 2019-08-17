(function($) {
    // jQuery plugin data
    $.fn.salesdriver_transform = function(parameters) {
        //Parameters
        parameters = $.extend({},
        parameters);

        //Reference of the target of the animation
        var $target = $(this);

		//Methods
        jQuery.fn.extend({
            translate: function(parameters) {
				if ($.browser.webkit) {
				    var elem = document.getElementById($(this).attr('id'));
					var matrix = new WebKitCSSMatrix(window.getComputedStyle(elem).webkitTransform);
					elem.style.webkitTransitionDuration = parameters.speed+"s";
					elem.style.webkitTransform=matrix.translate(parameters.x,parameters.y,parameters.z);
				 }
				else{
					var $anim = $('#'+$(this).attr('id')+'');
					$anim.animate({"translateY": parameters.y, "translateX": parameters.x},parameters.speed*1000);
				}
            },
            translateScale: function(parameters) {
            },
            translateRotate: function(parameters) {
            },
            translateScaleRotate: function(parameters) {
            },
            scale: function(parameters) {
				if ($.browser.webkit) {
				    var elem = document.getElementById($(this).attr('id'));
					var matrix = new WebKitCSSMatrix(window.getComputedStyle(elem).webkitTransform);
					elem.style.webkitTransitionDuration = parameters.speed+"s";
					elem.style.webkitTransform = matrix.scale(parameters.scaleX/100,parameters.scaleY/100,parameters.scaleZ/100);
				 }
				else{
					var $anim = $('#'+$(this).attr('id')+'');
					$anim.animate({scale: ''+parameters.scaleX/100+' '+parameters.scaleY/100+''});
				}
            },
			scaleRotate: function(parameters) {
		    },
            rotate: function(parameters) {
				if ($.browser.webkit) {
				    var elem = document.getElementById($(this).attr('id'));
					var matrix = new WebKitCSSMatrix(window.getComputedStyle(elem).webkitTransform);
					elem.style.webkitTransitionDuration = parameters.speed+"s";
					elem.style.webkitTransform=matrix.rotate(parameters.rotX,parameters.rotY,parameters.rotZ);
				 }
				else{
					var $anim = $('#'+$(this).attr('id')+'');
					$anim.animate({"rotate": parameters.rotX},parameters.speed*1000);
				}
            }
        });

        //Return Jquery Object
        return this;
    };
})(jQuery);