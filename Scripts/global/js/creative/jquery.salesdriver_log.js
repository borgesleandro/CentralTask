(function($) {
    // jQuery plugin log
    $.fn.salesdriver_log = function(parameters) {
		
		if(parameters.message){
			//Message
			alert(parameters.level+" | "+parameters.message);	
		}

        //Return Jquery Object
        return this;
    };
})(jQuery);