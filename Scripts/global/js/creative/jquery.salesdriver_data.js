(function($) {
    // jQuery plugin data
    $.fn.salesdriver_data = function(parameters) {
        //Parameters
        parameters = $.extend({},
        parameters);

        //Reference of the target of the animation
        var $target = $(this);

		//Methods
        jQuery.fn.extend({
            setData: function(parameters) {
                if (typeof(localStorage) == 'undefined') {
                    alert('Your browser does not support HTML5 localStorage. Try upgrading.');
					return false;
                } else {
                    window.localStorage.setItem(parameters.name,parameters.content);
					return true;
                }
            },
            getData: function(parameters) {
				return window.localStorage.getItem(parameters.name);
            },
            dataExists: function(parameters) {
				alert((window.localStorage.getItem(parameters.name)));
				if(window.localStorage.getItem(parameters.name)==null)return false
				else return true
            },
            removeData: function(parameters) {
				window.localStorage.removeItem(parameters.name);
                return null;
            },
            clearData: function() {
                window.localStorage.clear()	
				return null;
            },
            dataLength: function() {
                return window.localStorage.length;
            }
        });

        //Return Jquery Object
        return this;
    };
})(jQuery);