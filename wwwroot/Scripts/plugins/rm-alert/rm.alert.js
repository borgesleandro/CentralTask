function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var alert = function (message, title, type, functionYes, functionNo, settings)
{
    var config = {
        width: null,
        height: null,
        onShow: null,
        callBack: null
    };

    if (settings) { $.extend(config, settings); }            

    title = title == null ? $(document).attr('title') : title;
    message = message == null ? "" : message;

    var result;
    
    var backdrop = $('<div class="rm-alert-backdrop"></div>');
    
	var obj = $(
			'<div class="rm-alert ' + type + '">'+
				'<div class="title ' + type + '">' + title + '</div>' +
				'<div class="message">' + message + '</div>' +
				'<div class="bar-buttons"></div>' +
			'</div>'
			);
				
	if( isFunction(functionYes) )
	{
		var buttons = $(
						'<button class="btn btn-success btn-yes">Sim</button>'+
						'<button class="btn btn-danger btn-no">Não</button>'
						);
		
		obj.find('.bar-buttons').append(buttons);
		
		obj.find('.btn-yes').click( function(){
			result = true;
			if ( isFunction(functionYes) )
				functionYes();
			removeThis();
		    backdrop.remove();
		});
		
		obj.find('.btn-no').click( function(){
			result = false;
			if ( isFunction(functionNo) )
				functionNo();
			removeThis();
			backdrop.remove();
		});
	}
	else{
		var buttons = $('<button class="btn btn-success btn-ok">OK</button>');
		obj.find('.bar-buttons').append(buttons);
	}					
	
	obj.find('.btn-ok').click( function(){
		result = true;
		removeThis();
		backdrop.remove();

	    if (config.callBack) {
	        config.callBack();
	    }
	});

	backdrop.click(function () {
	    result = false;
        removeThis();
        backdrop.remove();
    });
	
	$("body").append(backdrop);
	$("body").append( obj );

	if (config.width != null)
	    obj.width(config.width);

	if (config.height != null)
	    obj.find('.message').css('min-height', config.height);

	var left = - (obj.width() / 2);
	var top = - (obj.height() / 2);
    //obj.offset({ left: left, top: top });
	obj.css("margin-left", left);
	obj.css("margin-top", top);

	var focusDocument = function(e) {
		var code = e.keyCode || e.which;
		if (code == '9') {
			if ($(document.activeElement).closest('.rm-alert').length < 1) {
				//$("*").blur();
				obj.find('input, a, button').first().focus();
			}
			e.preventDefault();
			e.stopPropagation();
		}
		
		if (code == 27) {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	var escapePress = function(e){
		var code = e.keyCode || e.which;
		if (code == 27) {
			e.preventDefault();
			e.stopPropagation();
		}	
	};
	
	$('body').keyup(escapePress);

	$('body').keypress(escapePress);
	
	$('body').keydown(focusDocument);	
	
	//$('body').find("*").bind('focus', focusDocument);

    var removeThis = function() {
        //$("body *").unbind('focus', focusDocument);
		$('body').unbind('keydown', focusDocument);	
		$('body').unbind('keyup', escapePress);	
		$('body').unbind('keypress', escapePress);	
        obj.remove();
    };
    
    obj.find('input, a, button').first().focus();
    
    if (config.onShow != null)
        config.onShow();
	//return result;
}