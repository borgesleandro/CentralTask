//*****************************************************************************************************************************
//   ************************************************     ALERTA          *****************************************************
//     SE FOR ALTERAR ALGUMA FUNÇÃO ABAIXO POR FAVOR REPLICAR A FUNÇÃO E COLOCAR UM NOVO NOME POIS EXISTEM MAIS DE UMA      ***
//                                            PÁGINA UTILIZANDO A MESMA FUNÇÃO                                              ***
//*****************************************************************************************************************************


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

//function LayoutTabela2() {
//    tableLayout = $("#tbResult").DataTable({
//        "sPaginationType": "full_numbers",

//        "bPaginate": false,
//        "orderCellsTop": true,
//        "bAutoWidth": false,
//        "bProcessing": false,
//        "bServerSide": false,
//        "bSort": false,
//        "bFilter": true,
//        "bLengthChange": true,
//        "bstateSave": true,
//        "scroller": true,
//        "scrollx": "100%",
//        "scrollY": "39vh",
//        "paging": false,
//        "scrollCollapse": true,
//        "oLanguage":
//            {
//                "sZeroRecords": "Não foram encontrados resultados",
//                "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
//                "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
//                "sInfoFiltered": "(Total de _MAX_ registros)",
//                "sSearch": "Pesquisar",
//                "sLengthMenu": "Mostrar _MENU_ registros",
//                "oPaginate": {
//                    "sFirst": "«",
//                    "sLast": "»",
//                    "sNext": "›",
//                    "sPrevious": "‹"
//                }
//            }
//    });


//}





function LayoutTabela2() {
    tableLayout = $("#tbResult").DataTable({
        "sPaginationType": "full_numbers",

        "bPaginate": false,
        "orderCellsTop": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": true,
        "bstateSave": true,
        "scroller": true,
        //"scrollx": "100%",
        "scrollY": "39vh",
        "paging": false,
        "scrollCollapse": true,
        //"scrollResize": true,
        "oLanguage":
            {
                "sZeroRecords": "Não foram encontrados resultados",
                "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
                "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
                "sInfoFiltered": "(Total de _MAX_ registros)",
                "sSearch": "Pesquisar",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "oPaginate": {
                    "sFirst": "«",
                    "sLast": "»",
                    "sNext": "›",
                    "sPrevious": "‹"
                }
            }
    });


}






//function LayoutTabela2() {

//    tableLayout = $("#tbResult").DataTable({
//        "sPaginationType": "full_numbers",
//        "bPaginate": false,
//        "bAutoWidth": false,
//        "bProcessing": false,
//        "bServerSide": false,
//        "bSort": false,
//        "bFilter": false,
//        "bLengthChange": false,
//        "bstateSave": true,
//        //                    "scrollY": "500px",
//        "oLanguage":
//            {
//                "sZeroRecords": "Não foram encontrados resultados",
//                "sInfo": "Exibindo de _START_ até _END_ de _TOTAL_ registros",
//                "sInfoEmpty": "Exibindo de 0 até 0 de 0 registros",
//                "sInfoFiltered": "(Total de _MAX_ registros)",
//                "sSearch": "Pesquisar:",
//                "sLengthMenu": "Mostrar _MENU_ registros",
//                "oPaginate": {
//                    "sFirst": "«",
//                    "sLast": "»",
//                    "sNext": "›",
//                    "sPrevious": "‹"
//                }
//            }
//    });


//}

/*Função que permite apenas numeros*/
function fnInteger(v) {
    return v.replace(/\D/g, "")
}
function fnCiclo(v) {
    v = v.replace(/\D/g, "")
    v = v.replace(/^(\d\d)(\d)/g, "$1/$2")
    return v
}

/*Função que padroniza valor monétario*/
function fnValorMonetario(v) {
    v = v.replace(/\D/g, "") //Remove tudo o que não é dígito
    v = v.replace(/^([0-9]{3}\.?){3}-[0-9]{2}$/, "$1.$2");
    //v=v.replace(/(\d{3})(\d)/g,"$1,$2")
    v = v.replace(/(\d)(\d{2})$/, "$1.$2") //Coloca ponto antes dos 2 últimos digitos
    return v
}

function Mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}
/*Função que Executa os objetos*/
function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}


//----------------------------------------------------
var Patologia = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
    }
};

function SalvarPatologia(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var patologia = new Patologia(tipoOperacao, codigo, descricao, flg_ativo)

    salvarPopUpEditar(patologia, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtDataAtualizacao").val("");
    });
}

function ValidarPatologia(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarPatologia(vTipoOperacao);
}

function ValidarHobby(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    return SalvarPatologia(vTipoOperacao);
}

//----------------------------------------------------
var Departamento = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
    }
};

function SalvarDepartamento(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();

    var departamento = new Departamento(tipoOperacao, codigo, descricao, flg_ativo, cia)

    salvarPopUpEditar(departamento, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtDataAtualizacao").val("");
        $("#ddlCia").val("");

    });
}

function ValidarDepartamento(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var cia = $("#ddlCia :selected").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarDepartamento(vTipoOperacao);
}

//----------------------------------------------------------
var Importancia = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;

    }
};

function SalvarImportancia(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();

    var importancia = new Importancia(tipoOperacao, codigo, descricao, flg_ativo, cia)

    salvarPopUpEditar(importancia, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtDataAtualizacao").val("");
        $("#ddlCia").val("");
    });
}


function ValidarImportancia(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var descricao = $("#txtDescricao").val();
    var cia = $("#ddlCia :selected").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }

    return SalvarImportancia(vTipoOperacao);
}

//----------------------------------------------------------

var Produto = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, especialidade) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;
        this.especialidade = especialidade;

    }
};

function SalvarProduto(tipoOperacao) {
    //alert($("#txtEspecialidade").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var especialidade = $("#ddlEspecialidade :selected").val();

    var produto = new Produto(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, especialidade)

    salvarPopUpEditar(produto, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");
        $("#ddlEspecialidade").val("");
    });
}


function ValidarProduto(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var especialidade = $("#ddlEspecialidade :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        return false;
    }

    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (flg_ativo == "") {
        alert("É necessário informar uma situação (ativo / inativo).");
        $("#ddlFlagativo").focus();
        return false;
    }

    if (equipe == "") {
        alert("É necessário informar a equipe.");
        $("#ddlEquipe").focus();
        return false;
    }
    if (especialidade == "") {
        alert("É necessário informar uma especialidade.");
        $("#ddlEspecialidade").focus();
        return false;
    }

    return SalvarProduto(vTipoOperacao);
}

//----------------------------------------------------------
//**Acima só possuiam codigo, descricao, flg_ativo , cia , equipe , especialidade 
//----------------------------------------------------------


var Especialidade = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, flg_equipe) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;
        this.flg_equipe = flg_equipe;

    }
};

function SalvarEspecialidade(tipoOperacao) {
    //alert($("#txtEspecialidade").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var flg_equipe = $("#ddl_flg_equipe :selected").val();

    var especialidade = new Especialidade(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, flg_equipe)

    salvarPopUpEditar(especialidade, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");
        $("#ddl_flg_equipe").val("");

    });
}


function ValidarEspecialidade(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var flg_equipe = $("#ddl_flg_equipe :selected").val();

    if (codigo == "") {
        alert("É necessário informar um código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (codigo.toUpperCase().trim() == "N/D") {
        alert("Código não pode ser cadastrado pois é utilizado pelo SF, em relatórios e consultas, como classificação de profissionais cadastrados sem especialidade.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (flg_ativo == "") {
        alert("É necessário informar uma situação (ativo / inativo).");
        $("#ddlFlagativo").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar a Cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (equipe == "") {
        alert("É necessário informar a Equipe.");
        $("#ddlEquipe").focus();
        return false;
    }
    if (flg_equipe == "") {
        alert("É necessário informar se deseja que a especialidade apareça em primeiro.");
        $("#ddl_flg_equipe").focus();
        return false;
    }

    return SalvarEspecialidade(vTipoOperacao);
}

//----------------------------------------------------------
var FreqVisita = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, qtd_dias) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.qtd_dias = qtd_dias;

    }
};

function SalvarFreqVisita(tipoOperacao) {
    //alert($("#txtEspecialidade").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var qtd_dias = $("#txtQtd_dias").val();

    var freqVisita = new FreqVisita(tipoOperacao, codigo, descricao, flg_ativo, qtd_dias)

    salvarPopUpEditar(freqVisita, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtDataAtualizacao").val("");
        $("#ddlCia").val("");
        $("#txtQtd_dias").val("");
    });
}


function ValidarfreqVisita(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var qtd_dias = $("#txtQtd_dias").val();

    if (codigo == "") {
        alert("É necessário informar um código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (flg_ativo == "") {
        alert("É necessário informar uma situação (ativo / inativo).");
        $("#ddlFlagativo").focus();
        return false;
    }
    if (qtd_dias == "") {
        alert("É necessário a quantidade de dias.");
        $("#txtQtd_dias").focus();
        return false;
    }


    return SalvarFreqVisita(vTipoOperacao);
}

//---------------------------------------------------------------------------
var Categoria = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, codProf, especialidade, especialidade02, sistema) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.codProf = codProf;
        this.especialidade = especialidade;
        this.especialidade02 = especialidade02;
        this.sistema = sistema;
    }
};

function SalvarCategoria(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var codProf = $("#ddlTipoProf :selected").val();
    var especialidade = $("#ddlObrigaEspec :selected").val();
    var especialidade02 = $("#ddlObrigaEspec02 :selected").val();
    var sistema = $("#ddlFlagSist :selected").val();


    var categoria = new Categoria(tipoOperacao, codigo, descricao, flg_ativo, cia, codProf, especialidade, especialidade02, sistema)

    salvarPopUpEditar(categoria, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlTipoProf").val("");
        $("#ddlCia").val("");
        $("#ddlObrigaEspec").val("");
        $("#ddlObrigaEspec02").val("");
        $("#ddlFlagSist").val("");
    });
}


function ValidarCategoria(tipoOperacao) {
    //alert("Rafaela");
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var codProf = $("#ddlTipoProf :selected").val();
    var especialidade = $("#ddlObrigaEspec :selected").val();
    var especialidade02 = $("#ddlObrigaEspec02 :selected").val();
    var sistema = $("#ddlFlagSist :selected").val();

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (flg_ativo == "") {
        alert("É necessário informar uma situação (ativo / inativo).");
        $("#ddlFlagativo").focus();
        return false;
    }
    if (codProf == "") {
        alert("É necessário informar o código do tipo de profissional.");
        $("#ddlTipoProf").focus();
        return false;
    }
    if (especialidade == "") {
        alert("É necessário informar se obriga a especialidade.");
        $("#ddlObrigEspec").focus();
        return false;
    }
    if (especialidade == "") {
        alert("É necessário informar se obriga a especialidade2.");
        $("#ddlObrigEspec02").focus();
        return false;
    }

    return SalvarCategoria(vTipoOperacao);
}

//---------------------------------------------------------------------------
var PatologiaEquipe = class {
    constructor(tipoOperacao, codigo, flg_ativo, cia, equipe) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;
    }
};

function SalvarPatologiaEquipe(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#ddlPatolgia :selected").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();

    var patologiaequipe = new PatologiaEquipe(tipoOperacao, codigo, flg_ativo, cia, equipe)

    salvarPopUpEditar(patologiaequipe, tipoOperacao, function () {
        $("#ddlPatolgia").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");
    });
}


function ValidarPatologiaEquipe(tipoOperacao) {
    //alert("Rafaela");
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#ddlPatolgia :selected").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (equipe == "") {
        alert("É necessário informar a equipe.");
        $("#ddlEquipe").focus();
        return false;
    }


    return SalvarPatologiaEquipe(vTipoOperacao);
}

//---------------------------------------------------------------------------
var TipoEstabelecimento = class {
    constructor(tipoOperacao, codigo, cod_tipo_estab, flg_ativo, descricao, flg_faceamento, flg_LiberarpedidoOL) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.cod_tipo_estab = cod_tipo_estab;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;
        this.flg_faceamento = flg_faceamento;
        this.flg_LiberarpedidoOL = flg_LiberarpedidoOL;

    }
};

function SalvarTipoEstabelecimento(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var cod_tipo_estab = $("#ddlLocalTrabalho :selected").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var flg_faceamento = $("#ddlFlagFaceamento :selected").val();

    var flg_LiberarpedidoOL = $("#ddlLiberarPedidoOL :selected").val();

    var tipoestabelecimento = new TipoEstabelecimento(tipoOperacao, codigo, cod_tipo_estab, flg_ativo, descricao, flg_faceamento, flg_LiberarpedidoOL);

    salvarPopUpEditar(tipoestabelecimento, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlLocalTrabalho").val("");
    });
}


function ValidarTipoEstabelecimento(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cod_tipo_estab = $("#ddlLocalTrabalho :selected").val();
    var flg_faceamento = $("#ddlFlagFaceamento :selected").val();

    var flg_LiberarpedidoOL = $("#ddlLiberarPedidoOL :selected").val();
    

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (cod_tipo_estab == "") {
        alert("É necessário o tipo do local de trabalho.");
        $("#ddlLocalTrabalho").focus();
        return false;
    }
    if (isNaN(codigo)) {
        alert("É necessário informar um código numérico.");
        return false;
    }
    return SalvarTipoEstabelecimento(vTipoOperacao);
}

//---------------------------------------------------------------------------
var Cargo = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;

    }
};

function SalvarCargo(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var cargo = new Cargo(tipoOperacao, codigo, flg_ativo, descricao)

    salvarPopUpEditar(cargo, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
    });
}


function ValidarCargo(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    if (isNaN(codigo)) {
        alert("É necessário informar um código numérico.");
        return false;
    }

    return SalvarCargo(vTipoOperacao);
}

//---------------------------------------------------------------------------
var MotivoNaoVisita = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;

    }
};

function SalvarMotivoNaoVisita(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var motivonaovisita = new MotivoNaoVisita(tipoOperacao, codigo, flg_ativo, descricao)

    salvarPopUpEditar(motivonaovisita, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");

    });
}


function ValidarMotivoNaoVisita(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarMotivoNaoVisita(vTipoOperacao);
}


//---------------------------------------------------------------------------
var MaterialPromocional = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;

    }
};

function SalvarMaterialPromocional(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var materialpromocional = new MaterialPromocional(tipoOperacao, codigo, flg_ativo, descricao)

    salvarPopUpEditar(materialpromocional, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");

    });
}


function ValidarMaterialPromocional(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarMaterialPromocional(vTipoOperacao);
}

//---------------------------------------------------------------------------
var Periodo = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao, cia) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;
        this.cia = cia;

    }
};

function SalvarPeriodo(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();

    var periodo = new Periodo(tipoOperacao, codigo, flg_ativo, descricao, cia)

    salvarPopUpEditar(periodo, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlCia").val("");

    });
}

function ValidarPeriodo(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar o cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarPeriodo(vTipoOperacao);
}


//---------------------------------------------------------------------------
var CategoriaEstab = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao, cia) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;
        this.cia = cia;

    }
};

function SalvarCategoriaEstab(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();

    var categoriaestab = new CategoriaEstab(tipoOperacao, codigo, flg_ativo, descricao, cia)

    salvarPopUpEditar(categoriaestab, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlCia").val("");

    });
}


function ValidarCategoriaEstab(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar o cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarCategoriaEstab(vTipoOperacao);
}


//---------------------------------------------------------------------------

var ComentarioPadrao = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, flg_exibe_prof, flg_exibe_pdv, flg_exibe_estab) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;
        this.flg_exibe_prof = flg_exibe_prof;
        this.flg_exibe_pdv = flg_exibe_pdv;
        this.flg_exibe_estab = flg_exibe_estab;

    }
};

function SalvarComentarioPadrao(tipoOperacao) {
    //alert($("#txtEspecialidade").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var flg_exibe_prof = $("#ddlVisitaProf :selected").val();
    var flg_exibe_pdv = $("#ddlVisitaPdv :selected").val();
    var flg_exibe_estab = $("#ddlVisitaEstab :selected").val();

    var comentariopadrao = new ComentarioPadrao(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, flg_exibe_prof, flg_exibe_pdv, flg_exibe_estab)

    salvarPopUpEditar(comentariopadrao, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");

    });
}


function ValidarComentarioPadrao(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var flg_exibe_prof = $("#ddlVisitaProf :selected").val();
    var flg_exibe_pdv = $("#ddlVisitaPdv :selected").val();
    var flg_exibe_estab = $("#ddlVisitaEstab :selected").val();

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    //if (codigo == "") {
    //    alert("É necessário informar o código.");
    //    $("#txtCodigo").focus();
    //    return false;
    //}
    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }

    if (equipe == "") {
        alert("É necessário informar a equipe.");
        $("#ddlEquipe").focus();
        return false;
    }
    if (flg_exibe_prof == "") {
        alert("É necessário informar se exibe na visita Profissional.");
        $("#ddlVisitaProf").focus();
        return false;
    }
    if (flg_exibe_pdv == "") {
        alert("É necessário informar se exibe na visita Pdv.");
        $("#ddlVisitaPdv").focus();
        return false;
    }
    if (flg_exibe_estab == "") {
        alert("É necessário informar se exibe na visita Estabelecimento.");
        $("#ddlVisitaEstab").focus();
        return false;
    }


    return SalvarComentarioPadrao(vTipoOperacao);
}

//----------------------------------------------------------


var ProdutoEstab = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, cod_classe, origem) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.cod_classe = cod_classe;
        this.origem = origem;

    }
};

function SalvarProdutoEstab(tipoOperacao) {
    //alert($("#ddlOrigem :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var cod_classe = $("#ddlClasse :selected").val();
    var origem = $("#ddlOrigem :selected").val();

    var produtoestab = new ProdutoEstab(tipoOperacao, codigo, descricao, flg_ativo, cia, cod_classe, origem)

    salvarPopUpEditar(produtoestab, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlCia").val("");
        $("#ddlOrigem").val("");
        $("#ddlClasse").val("");

    });
}


function ValidarProdutoEstab(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var cod_classe = $("#ddlClasse :selected").val();
    var origem = $("#ddlOrigem :selected").val();

    if (codigo == "") {
        alert("É necessário informar um código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    if (cia == "") {
        alert("É necessário informar a Cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (origem == "") {
        alert("É necessário informar a origem.");
        $("#ddlOrigem").focus();
        return false;
    }
    if (cod_classe == "") {
        alert("É necessário informar a classe.");
        $("#ddlClasse").focus();
        return false;
    }

    return SalvarProdutoEstab(vTipoOperacao);
}

//---------------------------------------

var ClassePdv = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;

    }
};

function SalvarClassePdv(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();

    var classepdv = new ClassePdv(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe)

    salvarPopUpEditar(classepdv, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtDataAtualizacao").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");

    });
}


function ValidarClassePdv(tipoOperacao) {
    //alert('RFFFF');
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (equipe == "") {
        alert("É necessário informar a equipe.");
        $("#ddlEquipe").focus();
        return false;
    }
    return SalvarClassePdv(vTipoOperacao);
}


//---------------------------------------

var Tag = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, tag) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;
        this.tag = tag;

    }
};

function SalvarTag(tipoOperacao) {

    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var tag = $("#ddlTag :selected").val();

    var tag = new Tag(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe, tag)

    salvarPopUpEditar(tag, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtDataAtualizacao").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");
        $("#ddlTag").val("");

    });
}


function ValidarTag(tipoOperacao) {

    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var tag = $("#ddlTag :selected").val();

    //if (codigo == "") {
    //  alert("É necessário informar o código.");
    //  $("#txtCodigo").focus();
    //  return false;
    //}

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (equipe == "") {
        alert("É necessário informar a equipe.");
        $("#ddlEquipe").focus();
        return false;
    }
    if (tag == "") {
        alert("É necessário informar a tag.");
        $("#ddlTag").focus();
        return false;
    }
    return SalvarTag(vTipoOperacao);
}


//---------------------------------------------------------------------------

var TipodeEstoque = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;

    }
};

function SalvarTipodeEstoque(tipoOperacao) {
    //alert($("#txtEspecialidade").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();

    var tipodeestoque = new TipodeEstoque(tipoOperacao, codigo, descricao, flg_ativo, cia, equipe)

    salvarPopUpEditar(tipodeestoque, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");

    });
}

function ValidarTipodeEstoque(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }

    if (equipe == "") {
        alert("É necessário informar a equipe.");
        $("#ddlEquipe").focus();
        return false;
    }

    return SalvarTipodeEstoque(vTipoOperacao);
}


//---------------------------------------------------------------------------

var ProdutosPdv = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, classe, produto_proprio, preco) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.classe = classe;
        this.produto_proprio = produto_proprio;
        this.preco = preco;

    }
};

function SalvarProdutosPdv(tipoOperacao) {
    //alert($("#txtEspecialidade").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var classe = $("#ddlClasse :selected").val();
    var produto_proprio = $("#ddlProduto_Proprio :selected").val();
    var preco = $("#txtPreco").val();

    var produtospdv = new ProdutosPdv(tipoOperacao, codigo, descricao, flg_ativo, classe, produto_proprio, preco)

    salvarPopUpEditar(produtospdv, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlClasse").val("");
        $("#ddlProduto_Proprio").val("S");
        $("#txtPreco").val("");

    });
}

function ValidarProdutosPdv(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var classe = $("#ddlClasse :selected").val();
    var produto_proprio = $("#ddlProduto_Proprio :selected").val();
    var preco = $("#txtPreco").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }


    if (classe == "") {
        alert("É necessário informar a classe.");
        $("#ddlClasse").focus();
        return false;
    }
    if (produto_proprio == "") {
        alert("É necessário informar se é um produto próprio.");
        $("#ddlProdutoProprio").focus();
        return false;
    }
    //if (preco == "") {
    //  alert("É necessário informar um preço.");
    //  $("#txtPreco").focus();
    //  return false;
    //}


    return SalvarProdutosPdv(vTipoOperacao);
}


//---------------------------------------------------------------------------
var ProdutoPdv = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao, tipo_estoque, ean) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;
        this.tipo_estoque = tipo_estoque;
        this.ean = ean;
    }
};

function SalvarProdutoPdv(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var tipo_estoque = $("#ddlTipoEstoque :selected").val();
    var ean = $("#txtEan").val();


    var produtopdv = new ProdutoPdv(tipoOperacao, codigo, flg_ativo, descricao, tipo_estoque, ean)

    salvarPopUpEditar(produtopdv, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlTipoEstoque :selected").val("");
        $("#txtEan").val("");

    });
}


function ValidarProdutoPdv(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var tipo_estoque = $("#ddlTipoEstoque :selected").val();
    var ean = $("#txtEan").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (isNaN(codigo)) {
        alert("É necessário informar um código numérico.");
        return false;
    }
    if (tipo_estoque == "") {
        alert("É necessário informar o tipo de estoque.");
        return false;
    }
    if (ean != "") {
        if (ValidaEan(ean) == false) {
            return false;
        }
    }

    return SalvarProdutoPdv(vTipoOperacao);

}

function ValidaEan(numero) {
    factor = 3;
    sum = 0;
    numlen = numero.length;
    if (numlen == 13) {
        for (index = numero.length; index > 0; --index) {
            if (index != 13) {
                sum = sum + numero.substring(index - 1, index) * factor;
                factor = 4 - factor;
            }
        }
        cc = ((1000 - sum) % 10);
        ca = numero.substring(12);
        if (cc == ca) {
            return true;

        }
        else {
            alert("Digite um código EAN válido");
            return false;
        }
    }


    if (numlen != 13) {
        alert("Digite um código EAN com 13 digítos");
        return false;
    }
}



//-----------------------------------------------Classificacao Equipe----------------------------
var ClassificacaoEquipe = class {
    constructor(tipoOperacao, codigo, classificacao, desc_classificacao, flg_ativo, cia, equipe, frequencia, ciclo, flg_default, ordem) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.cia = cia;
        this.equipe = equipe;
        this.frequencia = frequencia;
        this.ciclo = ciclo;
        this.flg_default = flg_default;
        this.ordem = ordem;
        this.classificacao = classificacao;
        this.desc_classificacao = desc_classificacao;
    }
};


function SalvarClassificacaoEquipe(tipoOperacao) {

    var classificacao = $("#ddlClassificacao :selected").val();
    var desc_classificacao = $("#ddlClassificacao :selected").text();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var frequencia = $("#ddlFrequencia :selected").val();
    var flg_default = $("#ddlDefault :selected").val();
    var ordem = $("#txtOrdem").val();
    var ciclo = $("#txtCiclo").val();
    var codigo = $("#txtCodigo").val();

    var classificacaoEquipe = new ClassificacaoEquipe(tipoOperacao, codigo, classificacao, desc_classificacao, flg_ativo, cia, equipe, frequencia, ciclo, flg_default, ordem)

    salvarPopUpEditar(classificacaoEquipe, tipoOperacao, function () {
        $("#ddlClassificacao").val("");
        $("#ddlCia").val("");
        $("#ddlEquipe").val("");
        $("#txtCodigo").val("");
        $("#txtCiclo").val("");
        $("#txtOrdem").val("");
        $("#ddlDefault").val("N");
        $("#ddlFrequencia").prop('selectedIndex', -1);
    });
}


function ValidarClassificacaoEquipe(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;

    var codigo = $("#txtCodigo").val();
    var classificacao = $("#ddlClassificacao :selected").val();
    var desc_classificacao = $("#ddlClassificacao :selected").text();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();
    var cia = $("#ddlCia :selected").val();
    var equipe = $("#ddlEquipe :selected").val();
    var flg_default = $("#ddlDefault :selected").val();
    var ordem = $("#txtOrdem").val();
    var frequencia = $("#ddlFrequencia :selected").val();


    if (cia == "") {
        alert("É necessário informar a cia.");
        $("#ddlCia").focus();
        return false;
    }
    if (equipe == "") {
        alert("É necessário informar a equipe.");
        $("#ddlEquipe").focus();
        return false;
    }
    if ($("#txtCiclo").val().trim().length < 7) {
     
            alert('Ciclo inválido.Informe no formato MMYYYY.');
            $("#txtCiclo").focus();
            return false;
     

    }
    if ($("#txtCiclo").val().trim() != "") {
        if (!validaData('01/' + $("#txtCiclo").val().trim())) {
            alert('Ciclo inválido.');
            $("#txtCiclo").focus();
            return false;
        }

    }
    if (classificacao == "") {
        alert("É necessário informar a classificação.");
        $("#txtCodigo").focus();
        return false;
    }

    if (flg_default == "") {
        alert("É necessário informar o default.");
        $("#ddlDefault").focus();
        return false;
    }
    if (frequencia == "") {
        alert("É necessário informar a frequencia.");
        $("#ddlFrequencia").focus();
        return false;
    }
    if (ordem == "") {
        alert("É necessário informar a ordem.");
        $("#txtOrdem").focus();
        return false;
    }


    return SalvarClassificacaoEquipe(vTipoOperacao);
}

//---------------------------------------------------------------------------

//-------------bandeira--------------------------------------------------------------
var Bandeira = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;

    }
};

function SalvarBandeira(tipoOperacao) {
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var bandeira = new Bandeira(tipoOperacao, codigo, flg_ativo, descricao)

    salvarPopUpEditar(bandeira, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
    });
}


function ValidarBandeira(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarBandeira(vTipoOperacao);
}

//---------------------------------------------------------------------------



//---------------------------------------------------------------------------
var ProdutoRuptura = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao, tipo_estoque, ean) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;
        this.tipo_estoque = tipo_estoque;
        this.ean = ean;
    }
};

function SalvarProdutoRuptura(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var tipo_estoque = $("#ddlTipoEstoque :selected").val();
    var ean = $("#txtEan").val();


    var produtoruptura = new ProdutoRuptura(tipoOperacao, codigo, flg_ativo, descricao, tipo_estoque, ean)

    salvarPopUpEditar(produtoruptura, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlTipoEstoque :selected").val("");
        $("#txtEan").val("");

    });
}


function ValidarProdutoRuptura(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var tipo_estoque = $("#ddlTipoEstoque :selected").val();
    var ean = $("#txtEan").val();

    //if (codigo == "") {
    //  alert("É necessário informar o código.");
    //  $("#txtCodigo").focus();
    //  return false;
    //}
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (isNaN(codigo)) {
        alert("É necessário informar um código numérico.");
        return false;
    }
    if (tipo_estoque == "") {
        alert("É necessário informar o tipo de estoque.");
        return false;
    }
    if (ean != "") {
        if (ValidaEan(ean) == false) {
            return false;
        }
    }

    return SalvarProdutoRuptura(vTipoOperacao);

}

//---------------------------------------------------------------------------
var MotivoAgenda = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;

    }
};

function SalvarMotivoAgenda(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var motivoagenda = new MotivoAgenda(tipoOperacao, codigo, flg_ativo, descricao)

    salvarPopUpEditar(motivoagenda, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");

    });
}


function ValidarMotivoAgenda(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();


    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarMotivoAgenda(vTipoOperacao);

}


//---------------------------------------------------------------------------
var JustificativaAgenda = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao, obs, abater) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;
        this.obs = obs;
        this.abater = abater;
    }
};

function SalvarJustificativaAgenda(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var obs = $("#txtObs").val();
    var abater = $("#ddlAbater :selected").val();

    var justificativaagenda = new JustificativaAgenda(tipoOperacao, codigo, flg_ativo, descricao, obs, abater)

    salvarPopUpEditar(justificativaagenda, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");

    });
}


function ValidarJustificativaAgenda(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();


    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarJustificativaAgenda(vTipoOperacao);

}




var ClassProd = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao ,  importancia) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;
        this.importancia = importancia;

    }
};

function SalvarClassProd(tipoOperacao) {
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var importancia = $("#txtImportancia").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var classprod = new ClassProd(tipoOperacao, codigo, flg_ativo, descricao , importancia)

    salvarPopUpEditar(classprod, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtImportancia").val("");
    });
}


function ValidarClassProd(tipoOperacao) {

    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();
    var importancia = $("#txtImportancia").val();
    
    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }
    if (importancia == "") {
        alert("É necessário informar a importância.");
        $("#txtImportancia").focus();
        return false;
    }


    return SalvarClassProd(vTipoOperacao);
}




//-----------------------------------------------ESPECIALIDADE X CATEGORIA----------------------------
var EspecialidadeCategoria = class {
    constructor(tipoOperacao, codigo, flg_ativo, cod_categ, cod_espec) {

        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.flg_ativo = flg_ativo;
        this.cod_categ = cod_categ;
        this.cod_espec = cod_espec;

    }
};


function SalvarEspecialidadeCategoria(tipoOperacao) {

    var codigo = $("#hddcodigo").val();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();
    var cod_categ = $("#ddlCategoria :selected").val();
    var cod_espec = $("#ddlEspecialidade :selected").val();

    var especialidadeCategoria = new EspecialidadeCategoria(tipoOperacao, codigo, flg_ativo, cod_categ, cod_espec)

    salvarPopUpEditar(especialidadeCategoria, tipoOperacao, function () {
        $("#ddlCategoria").val("");
        $("#ddlEspecialidade").val("");
        $("#ddlFlgAtivo").val("1");
        $("#hddcodigo").val("");
    });
}


function ValidarEspecialidadeCategoria(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;

    var codigo = $("#hddcodigo").val();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();
    var cod_categ = $("#ddlCategoria :selected").val();
    var cod_espec = $("#ddlEspecialidade :selected").val();


    if (cod_espec == "") {
        alert("É necessário informar a especialidade.");
        $("#ddlEspecialidade").focus();
        return false;
    }
    if (cod_categ == "") {
        alert("É necessário informar a categoria.");
        $("#ddlCategoria").focus();
        return false;
    }
    
    return SalvarEspecialidadeCategoria(vTipoOperacao);
}

//---------------------------------------------------------------------------


//-----------------------------------------------Local de Esposição----------------------------
var LocalExposicao = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, flg_sistema) {

        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
        this.flg_sistema = flg_sistema;

    }
};


function SalvarLocalExposicao(tipoOperacao) {

    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();
    var flg_sistema = $("#ddlSistema :selected").val();

    var localExposicao = new LocalExposicao(tipoOperacao, codigo, descricao, flg_ativo, flg_sistema)

    salvarPopUpEditar(localExposicao, tipoOperacao, function () {
        $("#txtCodigo").val("");
        //$("#hddcodigo").val("");
        $("#txtDescricao").val("");

        $("#ddlFlgAtivo").prop('selectedIndex', 1);
        $("#ddlSistema :selected").val("0");
    });
}


function ValidarLocalExposicao(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;

    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();
    var flg_sistema = $("#ddlSistema :selected").val();


    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descricao.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarLocalExposicao(vTipoOperacao);
}

//---------------------------------------------------------------------------

//-----------------------------------------------Motivo de Ruputura de Faceamento----------------------------
var MotivoRupturaFaceamento = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo, codigoMotivo) {

        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.codigoMotivo = codigoMotivo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;

    }
};


function SalvarMotivoRupturaFaceamento(tipoOperacao) {

    var codigo = $("#hddcodigo").val();
    var codigoMotivo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();

    var motivoRupturaFaceamento = new MotivoRupturaFaceamento(tipoOperacao, codigo, descricao, flg_ativo, codigoMotivo)

    salvarPopUpEditar(motivoRupturaFaceamento, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#hddcodigo").val("");
        $("#txtDescricao").val("");
        $("#ddlFlgAtivo").val(1);
    });
}


function ValidarMotivoRupturaFaceamento(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;

    var codigoMotivo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlgAtivo :selected").val();


    if (codigoMotivo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }
    if (descricao == "") {
        alert("É necessário informar a descricao.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarMotivoRupturaFaceamento(vTipoOperacao);
}

//---------------------------------------------------------------------------



//----------------------------------------------------
var AusenciaCampanha = class {
    constructor(tipoOperacao, codigo, descricao, flg_ativo) {
        this.tipoOperacao = tipoOperacao;
        this.codigo = codigo;
        this.descricao = descricao;
        this.flg_ativo = flg_ativo;
    }
};

function SalvarAusenciaCampanha(tipoOperacao) {
    //alert($("#ddlFlagativo :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var ausenciacampanha = new AusenciaCampanha(tipoOperacao, codigo, descricao, flg_ativo)

    salvarPopUpEditar(ausenciacampanha, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");
        $("#txtDataAtualizacao").val("");
    });
}

function ValidarAusenciaCampanha(tipoOperacao) {
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();

    if (codigo == "") {
        alert("É necessário informar o código.");
        $("#txtCodigo").focus();
        return false;
    }

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarAusenciaCampanha(vTipoOperacao);
}

function alteraCiaProf() {
    //alert("rafa");
    //$("#hdCia").val($("#ddlCia :selected").val());
           
    var cia = $("#ddlCia :selected").val();
        
        $('#progress').css('display', 'block');
        $.ajax(
            {
                type: "POST",
                url: "TipologiaCategoriadeProfissional.aspx/carregarTipoProfissional",

                data: JSON.stringify({ pCia: cia }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    
                    var combo = $("#ddlTipoProf");
                    combo.empty();
                    combo.append("<option value=''></option>")
                    $.each(data.d, function (i, item) {
                        combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
                    });

                    
                }
            });
    
    return false;
}


//---------------------------------------------------------------------------
var MotivoNaoAderente = class {
    constructor(tipoOperacao, codigo, flg_ativo, descricao) {
        this.codigo = codigo;
        this.tipoOperacao = tipoOperacao;
        this.flg_ativo = flg_ativo;
        this.descricao = descricao;

    }
};

function SalvarMotivoNaoAderente(tipoOperacao) {
    //alert( $("#ddlEspecialidade :selected").val());
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    var motivonaoaderente = new MotivoNaoAderente(tipoOperacao, codigo, flg_ativo, descricao)

    salvarPopUpEditar(motivonaoaderente, tipoOperacao, function () {
        $("#txtCodigo").val("");
        $("#txtDescricao").val("");

    });
}


function ValidarMotivoNaoAderente(tipoOperacao) {
    // alert($("#txtDescricao").val());
    var vTipoOperacao = tipoOperacao;
    var codigo = $("#txtCodigo").val();
    var descricao = $("#txtDescricao").val();
    var flg_ativo = $("#ddlFlagativo :selected").val();

    if (descricao == "") {
        alert("É necessário informar a descrição.");
        $("#txtDescricao").focus();
        return false;
    }

    return SalvarMotivoNaoAderente(vTipoOperacao);
}


//---------------------------------------------------------------------------


