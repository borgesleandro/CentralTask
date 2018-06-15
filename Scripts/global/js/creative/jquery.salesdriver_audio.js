(function($) {
    // jQuery plugin vaudioideo
    $.fn.salesdriver_audio = function(parameters) {

        const NONE = "None";
        //Default mandatory parameters
        var defaultId = NONE;
        var defaultSourceOgg = NONE;
        var defaultSourceMp3 = NONE;
        var defaultSourceWav = NONE;

        var defaultX = 0;
        var defaultY = 0;

        var defaultAutoplay = false;
        var defaultControls = true;
        var defaultLoop = false;
        var defaultPreload = "auto";

        //Parameters
        parameters = $.extend({
            id: defaultId,
            sourceOgg: defaultSourceOgg,
            sourceMp3: defaultSourceMp3,
            sourceWav: defaultSourceWav,
            x: defaultX,
            y: defaultY,
            autoplay: defaultAutoplay,
            controls: defaultControls,
            loop: defaultLoop,
            preload: defaultPreload,
        },
        parameters);

        var audioCss = {
            'position': 'absolute',
            'z-index': '500',
            'top': parameters.x,
            'left': parameters.y,
        }

        if (parameters.id == NONE) alert("The Id Attributes is mandatory the sound will not display");
        else if ($('#' + parameters.id + '').html() != null) alert("Audio id already used")
        else if (parameters.source == NONE) alert("The source Attributes is mandatory the sound will not display");
        else {


            var audio = $('<audio/>', {
                id: "" + parameters.id + ""
            });

            if (parameters.sourceOgg != NONE) $('<source />').attr('src', parameters.sourceOgg).appendTo(audio);
            if (parameters.sourceMp3 != NONE) $('<source />').attr('src', parameters.sourceMp3).appendTo(audio);
            if (parameters.sourceWav != NONE) $('<source />').attr('src', parameters.sourceWav).appendTo(audio);

            if (parameters.autoplay) audio.attr('autoplay', 'autoplay');
            if (parameters.controls) audio.attr('controls', 'controls')
            if (parameters.loop) audio.attr('loop', 'loop');
            audio.attr('preload', parameters.preload);

            audio.css(audioCss);
            audio.appendTo("body");

            if (parameters.autoplay) {
                var pElement = document.getElementById(parameters.id);
                pElement.load();
                pElement.play();
            }
        }
        //Return Jquery Object
        return audio;
    };
})(jQuery);