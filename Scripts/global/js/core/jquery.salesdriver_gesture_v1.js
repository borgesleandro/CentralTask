(function ($) {
    $.fn.salesdriver_gesture = function (options) {
        var defaults = {
            threshold: 100,
            durationThreshold: 350,
            swipeLeft: function () {
                alert('swiped left');
            },
            swipeRight: function () {
                alert('swiped right');
            },
            swipeUp: function () {
                alert('swiped up');
            },
            swipeDown: function () {
                alert('swiped down');
            },
            twoTouchesSwipeLeft: function () {
                alert('two fingers swiped left');
            },
            twoTouchesSwipeRight: function () {
                alert('two fingers swiped right');
            },
            twoTouchesSwipeUp: function () {
                alert('two fingers swiped up');
            },
            twoTouchesSwipeDown: function () {
                alert('two fingers swiped down');
            },
            threeTouchesSwipeLeft: function () {
                alert('three fingers swiped left');
            },
            threeTouchesSwipeRight: function () {
                alert('three fingers swiped right');
            },
            threeTouchesSwipeUp: function () {
                alert('three fingers swiped up');
            },
            threeTouchesSwipeDown: function () {
                alert('three fingers swiped down');
            },
            overrideClass: '.override',
            preventDefaultEvents: true
        };
        var options = $.extend(defaults, options);
        if (!this) return false;
        return this.each(function () {
            var originalCoord = [];
            var finalCoord = [];
            var startTime;
            var endTime;
            var numTouches;

            function touchStart(event) {
                var event = event.originalEvent;
                if ($(event.target).parents(defaults.overrideClass).length > 0) return;
                originalCoord = [];
                finalCoord = [];
                startTime = (new Date()).getTime();
                numTouches = event.touches ? event.touches.length : 1;
                for (var i = 0; i < numTouches; i++) {
                    var evt = event.touches ? event.touches[i] : event;
                    originalCoord[i] = {
                        x: 0,
                        y: 0
                    };
                    finalCoord[i] = {
                        x: 0,
                        y: 0
                    };
                    originalCoord[i].x = evt.pageX;
                    originalCoord[i].y = evt.pageY;
                    finalCoord[i].x = evt.pageX;
                    finalCoord[i].y = evt.pageY;
                }
                //$.salesdriver_core.send('contentTapped');
            }

            function touchMove(event) {
                var event = event.originalEvent;
                if (defaults.preventDefaultEvents) {
                    event.preventDefault();
                }
                for (var i = 0; i < numTouches; i++) {
                    try {
                        var evt = event.touches ? event.touches[i] : event;
                        finalCoord[i].x = evt.pageX;
                        finalCoord[i].y = evt.pageY;
                    } catch (e) { }
                }
            }

            function touchEnd(event) {
                var event = event.originalEvent;
                if ($(event.target).parents(defaults.overrideClass).length > 0) return;
                endTime = (new Date()).getTime();
                var origX = 0;
                var origY = 0;
                var finalX = 0;
                var finalY = 0;
                for (var i = 0; i < numTouches; i++) {
                    origX += originalCoord[i].x;
                    finalX += finalCoord[i].x;
                    origY += originalCoord[i].y;
                    finalY += finalCoord[i].y;
                }
                origX /= numTouches;
                origY /= numTouches;
                finalX /= numTouches;
                finalY /= numTouches;
                var width = Math.abs(origX - finalX);
                var height = Math.abs(origY - finalY);
                var distance = Math.sqrt((width * width) + (height * height));
                if (distance > defaults.threshold && (endTime - startTime) < defaults.durationThreshold) {
                    if (width < height) {
                        if (origY > finalY) {
                            switch (numTouches) {
                                case 1:
                                    defaults.swipeUp();
                                    break;
                                case 2:
                                    defaults.twoTouchesSwipeUp();
                                    break;
                                case 3:
                                    defaults.threeTouchesSwipeUp();
                                    break;
                            }
                        } else {
                            switch (numTouches) {
                                case 1:
                                    defaults.swipeDown();
                                    break;
                                case 2:
                                    defaults.twoTouchesSwipeDown();
                                    break;
                                case 3:
                                    defaults.threeTouchesSwipeDown();
                                    break;
                            }
                        }
                    } else {
                        if (origX > finalX) {
                            switch (numTouches) {
                                case 1:
                                    defaults.swipeLeft();
                                    break;
                                case 2:
                                    defaults.twoTouchesSwipeLeft();
                                    break;
                                case 3:
                                    defaults.threeTouchesSwipeLeft();
                                    break;
                            }
                        } else {
                            switch (numTouches) {
                                case 1:
                                    defaults.swipeRight();
                                    break;
                                case 2:
                                    defaults.twoTouchesSwipeRight();
                                    break;
                                case 3:
                                    defaults.threeTouchesSwipeRight();
                                    break;
                            }
                        }
                    }
                }
            }

            function touchCancel(event) { }

            function gestureStart(event) { }

            function gestureChange(event) { }

            function gestureEnd(event) { }
            $(this).bind('mousedown touchstart MozTouchDown', touchStart);
            $(this).bind('mouseup touchend MozTouchUp', touchEnd);
            $(this).bind('mousemove touchmove MozTouchMove', touchMove);
            $(this).bind('touchcancel', touchCancel);
            $(this).bind('gesturestart', gestureStart);
            $(this).bind('gesturechange', gestureChange);
            $(this).bind('gestureend', gestureEnd);
        });
    };
})(jQuery);