$(document).ready(function () {

    $('.matricula').mask("9?999999", { placeholder: " " });
    $('.setor').mask("9?999999", { placeholder: " " });
    $('.cpf').mask("999.999.999-99", { placeholder: " " });
    $('.cnpj').mask("99.999.999/9999-99", { placeholder: " " });
    $("#CANAL_IDMULT").multiselect().multiselectfilter();
    $("#areaDeAtuacao").multiselect().multiselectfilter();
    $("#PERFIL_ID").chosen();

    var cnpjDiv = $(".cnpjDiv");
    var cpfDiv = $(".cpfDiv");
    var loginDiv = $(".loginDiv");

    $(document).on("change", "#PERFIL_ID", function () {
        //div
        //linhaTipoTabPreco  
        //cbo
        //CARGO_ID_PRECO
        if ($("#MOSTRA_CARGO_ID_PRECO").val()=="SIM")
        {
          if($("#PERFIL_ID").val() == "3")
          {
            $("#CARGO_ID_PRECO").removeAttr("disabled");
            $("#CARGO_ID_PRECO").css("background-color", "");
          }
          else {
            $("#CARGO_ID_PRECO").val(' ');
            $("#CARGO_ID_PRECO").attr("disabled", "disabled");
            $("#CARGO_ID_PRECO").css("background-color", "lightgray");            
          }
        }
    });

    
    $(document).on("change", "#CARGO_IDaux", function () {
        var cargoID = $(this).val();
        $("#CARGO_ID").val(cargoID);
    });

    if ($(".cargo").val() != "") {

        $.post(controller + "GetRegNumberType", { cargoID: $(".cargo").val() }, function (data) {
            if (data) {
                cnpjDiv.show();
                cpfDiv.hide();
                loginDiv.hide();
            }
            else {
                cnpjDiv.hide();
                cpfDiv.show();
                loginDiv.show();
            };
        });
    }

    $(document).on("change", ".cargo", function () {
        var cargoID = $(this).val();
        $(":input", cpfDiv).val("");
        $(":input", cnpjDiv).val("");                                       
        $(":input", loginDiv).val("");

        if (cargoID != "") {
            $.post(controller + "GetRegNumberType", { cargoID: cargoID }, function (data) {
                if (data) {
                    cnpjDiv.show();
                    cpfDiv.hide();
                    loginDiv.hide();
                }
                else {
                    cnpjDiv.hide();
                    cpfDiv.show();
                    loginDiv.show();
                };
            });
        }
    });


    $(document).on("change", "#CARGO_ID_PRECO", function () {
        if ($("#MOSTRA_CARGO_ID_PRECO").val() == "SIM" && $("#PERFIL_ID").val() == 3) //PERFIL = 3  REPRESENTANTE
        {
          if ($("#CARGO_ID_PRECO").val() == "") {
            $(".CARGO_ID_PRECOErro").show();
          }
          else {
            $(".CARGO_ID_PRECOErro").hide();
          }
        }
    });
    
    if ($("#MOSTRA_CARGO_ID_PRECO").val() != "SIM" || $("#PERFIL_ID").val() != 3) //PERFIL = 3  REPRESENTANTE
    {
      $("#CARGO_ID_PRECO").attr("disabled", "disabled");
      $("#CARGO_ID_PRECO").css("background-color","lightgray");
    }
});



function ValidaEmail(desc_email) {

    if (desc_email.length > 0) {
        if (desc_email.length > 255) {
            //alert('E-mail excede o tamanho máximo de 255 caracteres');
            //return false;
            return "E-mail excede o tamanho máximo de 255 caracteres";
        }
        else {
            //var emails = desc_email.split(/;/);
            var emails = desc_email.split(";");
            var pattern = new RegExp(/^[+a-za-z0-9._-]+@[a-za-z0-9.-]+\.[a-za-z]{2,4}$/i);
            for (var i = 0; i < emails.length; i++) {
                if (emails[i].trim() != "") {
                    if (pattern.test(emails[i].trim()) == false) {
                        //alert('e-mail ' + emails[i].trim() + ' inválido.');
                        //return false;
                        return "Email inválido";
                    }
                }
            }
        }
    }
    return "";
}




function Salvar()
{
    var sair = false;
    $(".EMAILErro").hide();

    if ($("#MOSTRA_CARGO_ID_PRECO").val() == "SIM" && $("#PERFIL_ID").val() == 3) //PERFIL = 3  REPRESENTANTE
    {
        if ($("#CARGO_ID_PRECO").val() == "") {
            $(".CARGO_ID_PRECOErro").show();
            //return false;
            sair = true;
        }
        else {
            $(".CARGO_ID_PRECOErro").hide();
        }
    }


    if ($("#CANAL_IDMULT").val() == "" || $("#CANAL_IDMULT").val() == null)
    {
        $(".CANAL_IDMULTErro").show();
        //return false;
        sair = true;
    }


    //só valida o campo se ele não for READONLY
    if (!$("#EMAIL").attr('readonly')) {
        if ($("#EMAIL").val().trim() == "" || $("#EMAIL").val() == null) {
            $(".EMAILErro").text("Este campo é obrigatírio");
            $(".EMAILErro").show();
            sair = true;
        }
        else {
            var erro = ValidaEmail($("#EMAIL").val().trim());
            if (erro != "") {
                $(".EMAILErro").text(erro);
                $(".EMAILErro").show();
                sair = true;
            }
        }
    }
    
    if (sair == true) {
        return false;
    }
    
    $(".mws-form").submit();
}