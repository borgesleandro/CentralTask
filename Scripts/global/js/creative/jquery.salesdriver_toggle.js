(function($) {
    // jQuery plugin Toggletarget
    $.fn.salesdriver_toggle= function(parameters) {
        //Parameters
        parameters = $.extend({},
        parameters);

        //Reference of the target of the animation
        var $target = $(this);

        if (parameters.visibility=="true") {
            $target.show();
        }
        else if (parameters.visibility=="false") {
            $target.hide();
        }
        else if (parameters.visibility=="toggle") {
            $target.toggle();
        }

        //Return Jquery Object
        return this;
    };
})(jQuery);