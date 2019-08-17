(function($) {
    // jQuery plugin data
    $.fn.salesdriver = function(parameters) {
        //Parameters
        parameters = $.extend({},
        parameters);

        //Reference of the target of the animation
		selector = $(this);
        var $target = $(this);

		//Methods
        jQuery.fn.extend({
			/**
			* Display a box with the message.
			* @return The text of the message.
	        */
            log: function(parameters) {
				return $(document).salesdriver_log(parameters);
            },
			/**
			* Go to the specify slide using an Id.
			* @return true/false.
	        */
            goToSlideId: function(parameters) {
				alert("salesdriver.goToSlideId");
            },
			/**
			* Go to the next slide in navigation.
			* @return true/false.
	        */
            gotoNextSlide: function(parameters) {
				alert("salesdriver.gotoNextSlide");
            },
			/**
			* Go to the previous slide in navigation.
			* @return true/false.
	        */
            gotoPreviousSlide: function(parameters) {
				alert("salesdriver.gotoPreviousSlide");
            },
			/**
			* Go to the specify call and slide.
			* @return true/false.
	        */
            gotoCallId: function(parameters) {
				alert("salesdriver.gotoCallId");
            },
			/**
			* Save a persistent data on the computer.
			* @return A boolean to confirm the save.
	        */
            setData: function(parameters) {
				return $(document).salesdriver_data().setData(parameters);
            },
			/**
			* Get a previously saved data on the computer.
			* @return The saved data , null if the object was not previously created.
	        */
            getData: function(parameters) {
				return $(document).salesdriver_data().getData(parameters);
            },
			/**
			* Remove a specific data previously saved
			* @return Null
	        */
            removeData: function(parameters) {
				return $(document).salesdriver_data().removeData(parameters);
            },
			/**
			* Remove all previously saved datas.
			* @return Null
	        */
            clearData: function(parameters) {
				return $(document).salesdriver_data().setData();
            },
			/**
			* Provide informations about the number of available saved datas.
			* @return Number of datas.
	        */
            dataLength: function(parameters) {
				return $(document).salesdriver_data().dataLength();
            },
			/**
			* Create a popup with the specified parameters and css.
			* @return The targeted div object.
	        */
 			popup: function(parameters,containercss,contentcss,maskcss) {
				return $(this).salesdriver_popup(parameters,containercss,contentcss,maskcss);
	        },
			/**
			* Create a movie player with controls.
			* @return The targeted div object.
	        */
			video: function(parameters) {
				return $(document).salesdriver_video(parameters);
	        },
			/**
			* Create a mp3 player with controls.
			* @return The targeted div object.
	        */
			audio: function(parameters) {
				return $(document).salesdriver_audio(parameters);
	        },
			/**
			* Create a tooltip display on rollover.
			* @return The targeted div object.
	        */
			tooltip: function(parameters,css) {
				return $(this).salesdriver_tooltip(parameters,css);
	        },
			/**
			* Zoom on the target.
			* @return The targeted div object.
	        */
			zoom: function(parameters,containercss,contentcss) {
				return $(this).salesdriver_zoom(parameters,containercss,contentcss);
	        },
			/**
			* Animate the target with the specify parameters
			* @return The targeted div object.
	        */
			tween: function(parameters) {
				return $(this).salesdriver_tween(parameters);
	        },	
			/**
			* Create a new Embeded SVG
			* @return Null
	        */		
			svgImage: function(parameters,svgparameters) {
				return $(this).salesdriver_svg(parameters,svgparameters);
			},
			/**
			* Toggle a specific target
			* @return the target
	        */
			toggletarget: function(parameters) {
				return $(this).salesdriver_toggletarget(parameters);
			},
			/**
			* Set a specific linkage between a state and a Js method
			* @return the target
	        */
			setstate: function(parameters) {
				return $(document).salesdriver_state().setStates(parameters);
			},
			/**
			* Get a specific linkage between a state and a Js method
			* @return the target
	        */
			getstate: function(parameters) {
				return $(document).salesdriver_state().getStates(parameters);
			},
			/**
			* Execute a specific linkage between a state and a Js method
			* @return the target
	        */
			displaystate: function(parameters) {
				return $(document).salesdriver_state().displayStates(parameters);
			},	
			/**
			* Get the number of states
			* @return the target
	        */
			getstatelength: function() {
				return $(document).salesdriver_state().getStatesLength();
			},
			/**
			* Clean the states
			* @return the target
	        */
			cleanstates: function() {
				return $(document).salesdriver_state().cleanStates();
			}
        });

        //Return Jquery Object
        return this;
    };
})(jQuery);