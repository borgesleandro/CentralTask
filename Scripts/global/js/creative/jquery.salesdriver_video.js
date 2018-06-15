(function($) {
    // jQuery plugin video
    $.fn.salesdriver_video = function(parameters) {
        const NONE = "None";
        
		//Default mandatory parameters
        var defaultId = NONE;
        var defaultSourceOgv = NONE;
		var defaultSourceMp4 = NONE;
		var defaultSourceWebm = NONE;
        var defaultPoster = NONE;
        var defaultX = 0;
        var defaultY = 0;
        var defaultWidth = 250;
        var defaultHeight = 250;
        var defaultAutoplay = false;
        var defaultControls = true;
        var defaultLoop = false;
       	var defaultPreload = "auto";

        //Parameters
        parameters = $.extend({
            id: defaultId,
            sourceOgv : defaultSourceOgv,
			sourceMp4 :defaultSourceMp4,
			sourceWebm :defaultSourceWebm,
            poster: defaultPoster,
            x: defaultX,
            y: defaultY,
            width: defaultWidth,
            height: defaultHeight,
            autoplay: defaultAutoplay,
            controls: defaultControls,
            loop: defaultLoop,
            preload: defaultPreload,
        },
        parameters);

	 	var videoCss = {
            'position': 'absolute',
            'z-index': '500',
			'top': parameters.x,
	        'left': parameters.y,
        }

        if (parameters.id == NONE) alert("The Id Attributes is mandatory the movie will not display");
        else if ($('#' + parameters.id + '').html()!=null) alert("Video id already used")
		else if (parameters.sourceOgv == NONE && parameters.sourceMp4 == NONE && parameters.sourceWebm == NONE) alert("The source Attributes is mandatory the movie will not display");
        else {

		    	var video = $('<video/>', {id:""+parameters.id+""});

				if(parameters.sourceOgv!=NONE)$('<source />').attr('src', parameters.sourceOgv).appendTo(video);
				if(parameters.sourceMp4!=NONE)$('<source />').attr('src', parameters.sourceMp4).appendTo(video);
				if(parameters.sourceWebm!=NONE)$('<source />').attr('src', parameters.sourceWebm).appendTo(video);
				if(parameters.poster!=NONE) video.attr('poster', parameters.poster);

				if(parameters.autoplay) video.attr('autoplay', 'autoplay');
				if(parameters.controls)	video.attr('controls', 'controls')
				if(parameters.loop) video.attr('loop', 'loop');
				
				video.attr('preload', parameters.preload);
				video.attr('width', parameters.width);
				video.attr('height', parameters.height);

				video.css(videoCss);
	 			video.appendTo("body");
	
				if(parameters.autoplay){
					var pElement = document.getElementById(parameters.id);	
					pElement.load();
					pElement.play();
				}
			
        }
			//Methods
	        jQuery.fn.extend({
	            fullscreen: function(parameters) {
	   				$.salesdriver_core.showFullScreenMovie(parameters.source);
	            }
	        });
         //Return Jquery Object
        return video;
    };
})(jQuery);