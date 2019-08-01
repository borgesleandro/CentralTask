$(document).ready(function () {
    $(document).keyup(function (key) {
        if (key.which == 13) {
            $(".mws-login-button").trigger("click");
        };
    });
    $(".mws-login-button").on("click", function () {
        $(".divError").html("").hide();
        var username = $("#UserName").val();
        var password = $("#Password").val();
        var keepPassword = $("#RememberMe").val() == "true";

        if (username != "" && password != "") {
            var returnUrl = $("#returnUrl").val();

            var sendData = {};
            sendData["returnURL"] = returnUrl;
            sendData["password"] = password;
            sendData["username"] = username;
            sendData["keepPassword"] = keepPassword;
            $.post(window.controller + "Login", sendData, function (data) {
                if (data.errorMessage != "") {
                    if ($.fn.effect) {
                        $("#mws-login").effect("shake", { distance: 6, times: 2 }, 35);
                    }
                    $(".divError").html(data.errorMessage).show();
                }
                else {
                    window.location.href = data.returnUrl != "" ? data.returnUrl : hostPath + "/Home";
                }
            }, "json");
        } else {
            if ($.fn.effect) {
                $("#mws-login").effect("shake", { distance: 6, times: 2 }, 35);
            }
        }

    });

});

