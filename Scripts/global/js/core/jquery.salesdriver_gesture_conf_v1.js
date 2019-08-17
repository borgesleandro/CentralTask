function onSwipeLeft() {
    $.salesdriver_core.send('navigate', 'GetNextAsset');
}

function onSwipeRight() {
    $.salesdriver_core.send('navigate', 'GetPreviousAsset');
}

function onSwipeUp() {
    $.salesdriver_core.showFlowPreview();
}

function onSwipeDown() {}

function onTwoTouchSwipeLeft() {
    $.salesdriver_core.send('navigate', 'NextFlow');
}

function onTwoTouchSwipeRight() {
    $.salesdriver_core.send('navigate', 'PreviousFlow');
}

function onTwoTouchSwipeUp() {
    $.salesdriver_core.showScriptPreview();
}

function onTwoTouchSwipeDown() {
    $.salesdriver_core.send('navigate', 'GetQuickView');
}

function onThreeTouchSwipeLeft()
{
	$.salesdriver_core.send('navigate', 'NextPresentation');
}

function onThreeTouchSwipeRight()
{
	$.salesdriver_core.send('navigate', 'PreviousPresentation');
}

// function onThreeTouchSwipeLeft() {}

// function onThreeTouchSwipeRight() {}

function onThreeTouchSwipeUp() {}

function onThreeTouchSwipeDown() {}
jQuery(document).ready(function () {
	jQuery("body").salesdriver_gesture({
        threshold: 100,
        swipeLeft: onSwipeLeft,
        swipeRight: onSwipeRight,
        swipeUp: onSwipeUp,
        swipeDown: onSwipeDown,
        twoTouchesSwipeLeft: onTwoTouchSwipeLeft,
        twoTouchesSwipeRight: onTwoTouchSwipeRight,
        twoTouchesSwipeUp: onTwoTouchSwipeUp,
        twoTouchesSwipeDown: onTwoTouchSwipeDown,
        threeTouchesSwipeLeft: onThreeTouchSwipeLeft,
        threeTouchesSwipeRight: onThreeTouchSwipeRight,
        threeTouchesSwipeUp: onThreeTouchSwipeUp,
        threeTouchesSwipeDown: onThreeTouchSwipeDown
    });
  var lastTap = new Date().getTime();
  var tapCt = 0;
  jQuery("body")
  .hammer({
    prevent_default: false,
    drag_vertical: false,
	interval:3000
  })
  .bind("tap", function (ev) { 
    if(ev.gesture){
		if(ev.gesture.tapCount === 1)
			$.salesdriver_core.send('contentTapped'); 
		else if(ev.gesture.tapCount === 2)
			$.salesdriver_core.send('navigate', 'DoubleTap');
	}
  });
	
	
});