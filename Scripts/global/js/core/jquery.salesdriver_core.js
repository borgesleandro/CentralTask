jQuery.salesdriver_core = {
    toJSONString: function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            var n, v, json = [],
                arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = $.salesdriver_core.toJSONString(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    },
    send: function () {
        var INVOCATION_COMMAND = "invoke";
        var SEPERATOR = ":";
        var selector = arguments[0];
        var isDebug = self.location.hash === "#debug";
        var invocation = selector;
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                invocation = invocation + SEPERATOR + arguments[i];
            }
        }
        if (isDebug) {
            switch (selector) {
                case 'contentTapped':
                case 'navigate':
                    console.log(INVOCATION_COMMAND + SEPERATOR + invocation);
                    return;
                    break;
            }
        }
        window.location = INVOCATION_COMMAND + SEPERATOR + invocation;
        return;
    },
    gotoSlide: function (slide) {
        if (self.location.hash !== "#debug")
            $.salesdriver_core.send('gotoSlide', slide);
        else
            window.location.href = self.location.href.replace(/assets\/.+?\/[^\/]*$/, "assets/" + slide + "/index.html#debug");
    },
    changePresentation: function (name) {
        $.salesdriver_core.send('changePresentation', name);
    },
    showPageFlip: function (assetPackage) {
        $.salesdriver_core.send('showPageFlip', assetPackage);
    },
    showFullScreenMovie: function (assetPackage) {
        $.salesdriver_core.send('showFullScreenMovie', assetPackage);
    },
    hideFullScreenMovie: function () {
        $.salesdriver_core.send('hideFullScreenMovie');
    },
    showPDFViewer: function (assetPackage) {
        $.salesdriver_core.send('showPDFViewer', assetPackage);
    },
    sendDocument: function (assetPackage) {
        $.salesdriver_core.send('sendDocument', assetPackage);
    },
    showHTMLViewer: function (assetPackage) {
        $.salesdriver_core.send('showHTMLViewer', assetPackage);
    },
    showFunctionPopover: function (e, assetPackage) {
        var offset = e.offset();
        var xPos = offset.left
        var yPos = offset.top
        $.salesdriver_core.send('showFunctionPopover', assetPackage, "withX", xPos, "withY", yPos);
    },
    showFlowPreview: function () {
        $.salesdriver_core.send('initFlowPreview');
    },
    showScriptPreview: function () {
        $.salesdriver_core.send('initScriptPreview');
    },
    changeFlow: function (name) {
        $.salesdriver_core.send('changeFlow', name);
    },
    SalesOrderAdd: function (produto){
        $.salesdriver_core.send('SalesOrderAdd', produto);
    },
    SalesOrderEnd: function (){
        $.salesdriver_core.send('SalesOrderEnd');
    },
    openMail: function (email) {
        $.salesdriver_core.send('openMail', email);
    },
    openMailSendToFile: function (file) {
        $.salesdriver_core.send('openMailSendToFile', file);
    },
    openFile: function (file) {
        $.salesdriver_core.send('openFile', file);
    },
    openExternalLink: function (link) {
        $.salesdriver_core.send('openExternalLink', link);
    }
};