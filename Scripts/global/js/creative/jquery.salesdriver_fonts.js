(function($) {
    // jQuery plugin data
    $.fn.salesdriver_fonts = function(parameters) {
        //Parameters
        parameters = $.extend({},
        parameters);

        //Reference of the target of the animation
		var $this = $(this);

		//Methods
     	$('body').append("<style type='text/css'>@font-face { font-family: "+parameters.name+"; src: url('"+parameters.path+".eot'); src: local('☺'), url('"+parameters.path+".woff') format('woff'), url('"+parameters.path+".ttf') format('truetype'), url('"+parameters.path+".svg#webfont9ZJynFkB') format('svg');}</style>");

        //Return Jquery Object
        return null;
    };
})(jQuery);