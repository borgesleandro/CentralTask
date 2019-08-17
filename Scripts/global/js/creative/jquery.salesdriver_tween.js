(function($) {
    // jQuery plugin tween
    $.fn.salesdriver_tween = function(parameters) {
		//Global
        const NONE = "None";
		var timer;
		
		//Default mandatory parameters
		var defaultName=NONE;
        var defaultEasing = "linear";
		var defaultDelay = 0;
        var defaultDuration = 1;
        var defaultStartMethod = NONE;
        var defaultEndMethod = NONE;

		//Parameters
        parameters = $.extend({
			name: defaultName,
            easing: defaultEasing,
			delay:defaultDelay,
            duration: defaultDuration,
            startMethod: defaultStartMethod,
            endMethod: defaultEndMethod
        },
        parameters);
		
        //Reference of the target of the animation
        var $target = $(this);
			
		//Animate the target with the correct parameters
		//Forcing the reference due to setTimeout loose focus
		playAnimation = function(target,parameters){
			clearTimeout(timer);
			//Call the startMethod if it was request by the user
	        if (parameters.startMethod != defaultStartMethod) eval(parameters.startMethod);
		
	        //Animate using the merged parameters
			$(target).animate(parameters, {
	            duration: parameters.duration * 1000,
	            easing: parameters.easing,
	            complete: function() {
	                //Call the endMethod if it was request by the user
	                if (parameters.endMethod != defaultEndMethod) eval(parameters.endMethod);
	            }
	        });
		};
		
		//Delay
		var delay=setTimeout(function(){playAnimation($target,parameters)},parameters.delay*1000);
	
        //Return Jquery Object
        return this;
    };
})(jQuery);