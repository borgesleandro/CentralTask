$(document).ready(function () {

    $('#txtPedidos').val('');
    $(".loading-save").hide();

    $("#txtPedidos").on('keypress', function () {

       Mascara(this, fnValor)();   
   });
   


    $("#txtPedidos").on('keyup', function () {

         Mascara(this, fnValor)();
      
    });


    $("#txtPedidos").on("keydown", function () {

       Mascara(this, fnValor)();
   });

    
    $("#btnCancelarPedido").on("click", function () {

        var ssmsg = "";


        if ($("#txtPedidos").val() == "") {
            ssmsg += "Informe os pedidos a serem cancelados.";

        } else {

            var pedidos = $("#txtPedidos").val();
            if (pedidos.substring(pedidos.length, pedidos.length - 1) == ",") {
                $("#txtPedidos").val(pedidos.substring(0, pedidos.length - 1));
            }

        }

        if (ssmsg != "") {
            alert(ssmsg);
            return false;
        } else {
            $(".loading-save").show();
        }
    });



});




function Mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

/*Função que Executa os objetos*/
function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}

function fnValor(v) {
    //v = v.replace(/[^\d+(\.\,\d+)]?/g, "") //Remove tudo o que não é decimal
    v = v.replace(/[^\,\d]|(,{2})|((^,).*)?/g, "") //Remove tudo o que não é decimal, deixa apenas caracter (,) e retira a primeira (,) da string se estiver na primeira posicao.


    return v
}