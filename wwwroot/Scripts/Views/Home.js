$(document).ready(function () {
    var homeButtons = $(".homeButtons");



    $(".logoutButton", homeButtons).live("click", function () {
        $.post(hostPath + "Account/LogOff", null, function () {
            //window.location.href = hostPath + "/Account/Login";
        });
    });

    $(".perfilButton", homeButtons).live("click", function () {

    });

    $(".changePassword", homeButtons).live("click", function () {
        $.post(hostPath + "Home/GetChangePasswordModal", null, function (data) {
            var buttonsModal = {};

            buttonsModal["Alterar"] = function () {
                var form = $("#changePasswordForm");
                $(".alert-message").hide();
                $("#alert-message-content").removeClass("error").removeClass("sucess");
                if (form.valid()) {

                    $.post(hostPath + "Home/ChangePassword", form.serialize(), function (result) {
                        if (result.ok) {
                            $("#alert-message-content").addClass("success").text("A senha foi alterada com sucesso");
                            $(".alert-message").show();
                            $(".formInputs", form).fadeOut("fast");

                            setTimeout(function () { $(".modal").dialog("destroy").remove(); }, "2000");

                        }
                        else {
                            $("#alert-message-content").addClass("error").text(result.error);
                            $(".alert-message").show();
                        }

                    });
                }

            };

            buttonsModal["Cancelar"] = function () {
                $(this).dialog("destroy").remove();
            };

            $(data).dialog({
                resizable: false,
                draggable: false,
                width: "380px",
                modal: true,
                buttons: buttonsModal
            });
            $(".ui-dialog-title").text("Redefinir Senha");


            $("#changePasswordForm").validate({
                rules: {
                    OldPassword: "required",
                    NewPassword: { required: true },
                    ConfirmNewPassword: { equalTo: "#NewPassword" }
                },
                messages: {
                    ConfirmNewPassword: "As senhas devem ser iguais"
                }
            });


        }, "html");
    });
});