(function($) {
    // jQuery plugin states
    $.fn.salesdriver_state = function(parameters) {
        //Parameters
        parameters = $.extend({},
        parameters);
        //Reference of the target of the animation
        var $target = $(this);

		//Methods
        jQuery.fn.extend({
			//Set a state and store it.
            setStates: function(parameters) {
				if(jQuery.mercury==undefined)jQuery.mercury={}
				if(jQuery.mercury.state==undefined) jQuery.mercury.state={}
				if(jQuery.mercury.state.currentStates==undefined) jQuery.mercury.state.currentStates=[];
				
				var check=false;
				for (i=0;i<jQuery.mercury.state.currentStates.length;i++){
					if(jQuery.mercury.state.currentStates[i].id==parameters.id) check=true;
				}
				if(check==true) alert("The id "+parameters.id+" is already used");
				else jQuery.mercury.state.currentStates.push(parameters); 
					
            },
            getStates: function(parameters) {
				for (i=0;i<jQuery.mercury.state.currentStates.length;i++){
					if(jQuery.mercury.state.currentStates[i].id==parameters.id) return jQuery.mercury.state.currentStates[i]
				}
            },
            displayStates: function(parameters) {
				var state;
				for (i=0;i<jQuery.mercury.state.currentStates.length;i++){
					if(jQuery.mercury.state.currentStates[i].id==parameters.id) state=jQuery.mercury.state.currentStates[i]
				}
				if (state==undefined)alert("This state id is empty");
				else {
					eval(state.linkage+"(state.parameters)");	
				}
            },
          	getStatesLength: function() {
				if(jQuery.mercury.state.currentStates==undefined) return 0;
				else return jQuery.mercury.state.currentStates.length;
            },
          	cleanStates: function() {
				jQuery.mercury.state.currentStates=[];	
            }
        });

        //Return Jquery Object
        return this;
    };
})(jQuery);