//Mostra PNG Transparente
function correctPNG() {
  if (navigator.appName.indexOf('Internet Explorer') > 0) {
    for (var i = 0; i < document.images.length; i++) {
      var img = document.images[i]
      var imgName = img.src.toUpperCase()
      if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
        var imgID = (img.id) ? "id='" + img.id + "' " : ""
        var imgClass = (img.className) ? "class='" + img.className + "' " : ""
        var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
        var imgStyle = "display:inline-block;" + img.style.cssText
        if (img.align == "left") imgStyle = "float:left;" + imgStyle
        if (img.align == "right") imgStyle = "float:right;" + imgStyle
        if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
        var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>"
        img.outerHTML = strNewHTML
        i = i - 1
      }
    }
  }
}

//Limpa o campo de busca
function showText(o, text) {
  if (o.value == '')
    o.value = text;
}

function hideText(o, text) {
  if (o.value == text)
    o.value = '';
}

//Ajusta a altura das divs
function alturasiguais() {
  var div1 = document.getElementById('leftColumn');
  var div2 = document.getElementById('content');
  var tela = screen.height;
  if (navigator.appName.indexOf('Internet Explorer') > 0) {
    tela = (tela - 366)
  }
  else {
    tela = (tela - 375)
  }
  if (div1 && div2) {
    var alturadiv1 = div1.offsetHeight;
    var alturadiv2 = div2.offsetHeight;
    if (alturadiv1 < alturadiv2) {
      if (alturadiv2 < tela) {
        div1.style.height = tela + "px";
        div2.style.height = tela + "px";
      }
      else {
        div1.style.height = alturadiv2 + "px";
      }

    } else {
      if (alturadiv1 < tela) {
        div1.style.height = tela + "px";
        div2.style.height = tela + "px";
      }
      else {
        div2.style.height = alturadiv1 + "px";
      }
    }
  }
}

//carrega funções
function addEvent(obj, evType, fn) {
  if (obj.addEventListener) obj.addEventListener(evType, fn, true)
  if (obj.attachEvent) obj.attachEvent("on" + evType, fn)
}

//inicia as funções
addEvent(window, "load", alturasiguais);
addEvent(window, "resize", alturasiguais);


//Valida Form Contato	
function validaFormContato() {
  if (document.getElementById('nome').value == "") {
    alert('Por favor, informe o seu nome');
    document.getElementById('nome').focus();
    return false;
  }
  else if (document.getElementById('mail').value.indexOf('@') < 1 || document.getElementById('mail').value.indexOf('.') < 3) {
    alert('Por favor, informe um e-mail válido');
    document.getElementById('mail').focus();
    return false;
  }
  else if (document.getElementById('mensagem').value == "") {
    alert('Por favor, escreva a sua mensagem');
    document.getElementById('mensagem').focus();
    return false;
  }
  else {
    return true;
  }
}

/********************* Máscara com REGEX ********************/

function Mascara(o, f) {
  v_obj = o
  v_fun = f
  setTimeout("execmascara()", 1)
}

/*Função que Executa os objetos*/
function execmascara() {
  v_obj.value = v_fun(v_obj.value)
}

/*Função que Determina as expressões regulares dos objetos*/
function leech(v) {
  v = v.replace(/o/gi, "0")
  v = v.replace(/i/gi, "1")
  v = v.replace(/z/gi, "2")
  v = v.replace(/e/gi, "3")
  v = v.replace(/a/gi, "4")
  v = v.replace(/s/gi, "5")
  v = v.replace(/t/gi, "7")
  return v
}

/*Função que permite apenas numeros*/
function fnInteger(v) {
  return v.replace(/\D/g, "")
}


/*Função que padroniza telefone (11) 4184-1241*/
function fnTelefone(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/^(\d\d)(\d)/g, "($1) $2")
  v = v.replace(/(\d{4})(\d)/, "$1-$2")
  return v
}


function fnCiclo(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/^(\d\d)(\d)/g, "$1/$2")
  return v
}

/*Função que padroniza telefone (11) 41841241*/
function fnTelefoneCall(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/^(\d\d)(\d)/g, "($1) $2")
  return v
}

/*Função que padroniza CPF*/
function fnCpf(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/(\d{3})(\d)/, "$1.$2")
  v = v.replace(/(\d{3})(\d)/, "$1.$2")

  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  return v
}

/*Função que padroniza CEP*/
function fnCep(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/^(\d{5})(\d)/, "$1-$2")
  
  return v
}

/*Função que padroniza CNPJ*/
function fnCnpj(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/^(\d{2})(\d)/, "$1.$2")
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
  v = v.replace(/(\d{4})(\d)/, "$1-$2")
  return v
}

/*Função que permite apenas numeros Romanos*/
function fnRomanos(v) {
  v = v.toUpperCase()
  v = v.replace(/[^IVXLCDM]/g, "")

  while (v.replace(/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/, "") != "")
    v = v.replace(/.$/, "")
  return v
}

/*Função que padroniza o Site*/
function fnSite(v) {
  v = v.replace(/^http:\/\/?/, "")
  dominio = v
  caminho = ""
  if (v.indexOf("/") > -1)
    dominio = v.split("/")[0]
  caminho = v.replace(/[^\/]*/, "")
  dominio = dominio.replace(/[^\w\.\+-:@]/g, "")
  caminho = caminho.replace(/[^\w\d\+-@:\?&=%\(\)\.]/g, "")
  caminho = caminho.replace(/([\?&])=/, "$1")
  if (caminho != "") dominio = dominio.replace(/\.+$/, "")
  v = "http://" + dominio + caminho
  return v
}

/*Função que padroniza DATA*/
function fnData(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/(\d{2})(\d)/, "$1/$2")
  v = v.replace(/(\d{2})(\d)/, "$1/$2")
  return v
}

function fnCategoria(v) {
    return v.replace(/[^\d+(\\d+?,)]?/g, "")
  
   
}


/*Função que padroniza hora*/
function fnHora(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/(\d{2})(\d)/, "$1:$2")
  return v
}

function fnValor(v) {
  //v = v.replace(/[^\d+(\.\,\d+)]?/g, "") //Remove tudo o que não é decimal
  v = v.replace(/[^\d+(\.\d+)]?/g, "") //Remove tudo o que não é decimal
  return v
}

function fnValorMilhar(v) {
  v = v.replace(/\D/g, "");//Remove tudo o que não é dígito
  v = v.replace(/(\d)(\d{12})$/, "$1.$2");//coloca o ponto dos milhões
  v = v.replace(/(\d)(\d{9})$/, "$1.$2");//coloca o ponto dos milhões
  v = v.replace(/(\d)(\d{6})$/, "$1.$2");//coloca o ponto dos milhares
  v = v.replace(/(\d)(\d{3})$/, "$1.$2");
  return v;
}

function fnValorPercent(v) {
  v = v.replace(/\D/g, ""); //Remove tudo o que não é dígito
  if (v != "") {
    v = v.replace(/[^0-9]/g, '');
    if (parseInt(v) > 100)  { v = 100; }
  } return v;
}

/*Função que padroniza valor monétario*/
function fnValorMonetario(v) {
  v = v.replace(/\D/g, "") //Remove tudo o que não é dígito
  v = v.replace(/^([0-9]{3}\.?){3}-[0-9]{2}$/, "$1.$2");
  //v=v.replace(/(\d{3})(\d)/g,"$1,$2")
  v = v.replace(/(\d)(\d{2})$/, "$1.$2") //Coloca ponto antes dos 2 últimos digitos
  return v
}

function mvalor(v) {
  v = v.replace(/\D/g, "");//Remove tudo o que não é dígito
  v = v.replace(/(\d)(\d{12})$/, "$1.$2");//coloca o ponto dos milhões
  v = v.replace(/(\d)(\d{9})$/, "$1.$2");//coloca o ponto dos milhões
  v = v.replace(/(\d)(\d{6})$/, "$1.$2");//coloca o ponto dos milhares
  v = v.replace(/(\d)(\d{3})$/, "$1.$2");//coloca a virgula antes dos 2 últimos dígitos
  return v;
}




/*Função que padroniza Area*/
function fnArea(v) {
  v = v.replace(/\D/g, "")
  v = v.replace(/(\d)(\d{2})$/, "$1.$2")
  return v

}



function Right(str, n) {
  if (n <= 0)
    return "";
  else if (n > String(str).length)
    return str;
  else {
    var iLen = String(str).length;
    return String(str).substring(iLen, iLen - n);
  }
}

function validaData(data) {
  var pData = data.split("/");
  var dia = pData[0];
  var mes = pData[1];
  var ano = pData[2];

  //Verifica se o ano está correto
  if (ano.length == 4 && ano > 1900 && ano < 2100) {
    // Verificando o intervalo permitido para os valores dos meses e dias
    if (dia > 0 && dia <= 31 && mes > 0 && mes <= 12) {
      // Verifica os meses que posuem dia 30 dias  
      if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia > 30) {

        return false;
      }
      // caso seja mês 2 verifica se o ano é bissexto
      if (mes == 2) {
        //se for bissexto
        if ((((ano % 4) == 0) && ((ano % 100) != 0)) || ((ano % 400) == 0)) {


          // Se for bissexto pode o dia ser no máximo 29   
          if (dia > 29)
            return false;
          // se não for bisexto o dia pode ser no máximo 28                  
        } else if (dia > 28) {

          return false;
        }
      }
    } else {

      return false;
    }
    // Data válida
    return true;
  }
  else {
    return false;
  }
}


function ValidaCPF(cpf) {
  var Soma;
  var Resto;
  Soma = 0;
  if (cpf == "00000000000") return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(cpf.substring(10, 11))) {
    return false;
  }
  return true;
}

function ValidaCNPJ(cnpj) {

  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14)
    return false;

  // Elimina CNPJs invalidos conhecidos
  if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
    return false;

  // Valida DVs
  tamanho = cnpj.length - 2
  numeros = cnpj.substring(0, tamanho);
  digitos = cnpj.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(0))
    return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2)
      pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado != digitos.charAt(1))
    return false;

  return true;

}

