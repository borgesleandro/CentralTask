


//********************************************************************getCategoria ******************************************************************************     

function getCategoria() {

    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/getCategoria",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var combo = $("#ddlCategoriaProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });
        }

    });

}

//********************************************************************getCategoria ******************************************************************************     

function getEspecialidade() {
    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/getEspecialidade",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var combo = $("#ddlEspecialidadeProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });
        }

    });

}


//********************************************************************getUF ******************************************************************************     

function getUF() {
    var combo;
    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/getUF",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            combo = $("#ddlUFProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });


            combo = $("#ddlUFCRM");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });


            combo = $("#ddlEstadoProf");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });

        }

    });

}




//********************************************************************getCategoria PDV ******************************************************************************     

function getCategoriaPDV() {
    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/getCategoriaPDV",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var combo = $("#ddlCategoriaPDV");
            combo.empty();
            combo.append("<option value=''></option>")
            $.each(data.d, function (i, item) {
                combo.append("<option value='" + item.codigo + "'>" + item.descricao + "</option>")
            });
        }

    });

}



//********************************************************************Carrega publico ******************************************************************************      

function CarregaTipoPublico() {


    //var combo = $("#<%=ddlTipoPublico.ClientID %>");
    var combo = $("#ddlTipoPublico");
    combo.empty();
    combo.append("<option value=''></option>")

    if ($("#hPainelProf").val() == "1") {
        combo.append("<option value='P'   Selected='True'>Profissional - Apenas Cliente</option>")
    } else if ($("#hPainelProf").val() == "2") {
        combo.append("<option value='P'   Selected='True'>Profissional - Cliente e outros</option>")
    } else if ($("#hPainelProf").val() == "3") {
        combo.append("<option value='P'   Selected='True'>Profissional - Não aceita painel</option>")
    }

    if ($("#hPainelPDV").val() == "1") {
        combo.append("<option value='E'>PDV - Apenas Cliente</option>")
    } else if ($("#hPainelPDV").val() == "2") {
        combo.append("<option value='E'>PDV - Cliente e outros</option>")
    } else if ($("#hPainelPDV").val() == "3") {
        combo.append("<option value='E'>PDV - Não aceita painel</option>")
    }

    $("#ddlTipoPublico").val($("#htipopublicoant").val());


}



function AbrePublico() {

    AbrirModal('AbreModalPublicoAlvo');

    $("#ddlTipoPublico").val("P");
    $("#PublicoProfissional").attr("style", "display:block");
    $("#PublicoPDV").attr("style", "display:none");
    $("#ddlCategoriaProf").val("");
    $("#ddlUFProf").val("");
    $("#txtCRMProf").val("");
    $("#txtNomeProf").val("");
    $("#ddlEspecialidadeProf").val("");
    $("#txtEmailProf").val("");
    $("#txtCelularProf").val("");
    $("#txtCPFProf").val("");
    $("#txtDataNascProf").val("");
    $("#txtAnoFormaturaProf").val("");
    $("#txtCepProf").val("");
    $("#txtEnderecoProf").val("");
    $("#txtNumeroProf").val("");
    $("#txtComplementoProf").val("");
    $("#txtBairroProf").val("");
    $("#ddlEstadoProf").val("");
    $("#txtCidadeProf").val("");
    $("#txtDDDTelProf").val("");
    $("#txtTelefoneProf").val("");
    $("#txtNomeProf").removeAttr("disabled");
    $("#btnPesqCRM").removeAttr("disabled");
    $("#txtNomeCrachaProf").val("");
    $("#txtRGProf").val("");
    $("#txtAssociadoProf").val("");
    $("#txtPassaporteProf").val("");
    $("#txthospedagemEntradaProf").val("");
    $("#txthospedagemSaidaProf").val("");
    $("#txtPassagemIdaProf").val("");
    $("#txtPassagemHoraIdaProf").val("");
    $("#txtPassagemVoltaProf").val("");
    $("#txtPassagemHoraVoltaProf").val("");
    $("#txtAcompanhanteProf").val("");
    $("#txtObsProf").val("");
    $("#txtCNPJPDV").val("");
    $("#txtRazaoSocialPDV").val("");
    $("#txtFantasiaPDV").val("");
    $("#txtEmailPDV").val("");
    $("#txtDDDPDV").val("");
    $("#txtTelPDV").val("");
    $("#hOperacaoPublico").val("INC");
    $("#hIDPublico").val("");
    $("#SemPublico").attr("style", "display:none");

    CarregaPublico();

}

function EditarPublico(id, tipo) {
    
    var numReq = $("#hNumReq").val();
    $("#SemPublico").attr("style", "display:none");
    abrirPopPublicoAlvo();
    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/EditarPublico",
        data: JSON.stringify({ pNumReq: numReq, pID: id, pTipo: tipo }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            

            if (($("#hTipoPlano").val() == "1" && $("#hStatusReq").val() == "10") || ($("#hTipoPlano").val() == "2" && $("#hStatusReq").val() == "7")) {
                $("#divParticiouEvento").attr("style", "display:block");
            } else {
                $("#divParticiouEvento").attr("style", "display:none");
            }


            if (tipo == "E") {

                $("#PublicoProfissional").attr("style", "display:none");
                $("#PublicoPDV").attr("style", "display:block");
                $("#txtCNPJPDV").attr("disabled", "disabled")
                $("#txtRazaoSocialPDV").attr("disabled", "disabled")
                $("#txtFantasiaPDV").attr("disabled", "disabled")
                $("#hOperacaoPublico").val("ALT");
                $("#MainContent_btnPesqCNPJ").attr("disabled", "disabled")


                $.each(data.d, function (i, item) {

                    $("#hIDPublico").val(item.ID);
                    $("#ddlTipoPublico").val(tipo);
                    $("#txtCNPJPDV").val(item.CNPJ);
                    $("#txtRazaoSocialPDV").val(item.RAZAOSOCIAL);
                    $("#txtFantasiaPDV").val(item.NOMEFANTASIA);
                    $("#txtContatoPDV").val(item.CONTATO);
                    $("#txtEmailPDV").val(item.EMAIL);
                    $("#txtDDDPDV").val(item.DDD);
                    $("#txtTelPDV").val(item.TELEFONE);
                    $("#txtObsPDV").val(item.OBS);
                    $("#ddlCategoriaPDV").val(item.CATEGORIA);
                    $("#ddlParticipouEvento").val(item.FLG_PART_EVENTO);
                });


            } else if (tipo == "P") {

                $.each(data.d, function (i, item) {
                    $("#hIDPublico").val(item.ID);
                    $("#ddlTipoPublico").val(tipo);
                    $("#ddlCategoriaProf").val(item.CATEGORIA);
                    $("#ddlUFProf").val(item.UF);
                    $("#txtCRMProf").val(item.CODIGO);
                    $("#txtNomeProf").val(item.NOME);
                    $("#ddlEspecialidadeProf").val(item.COD_ESPEC);
                    $("#txtEmailProf").val(item.EMAIL);
                    $("#txtCelularProf").val(item.CELULAR);
                    $("#txtCPFProf").val(item.CPF);
                    $("#txtRGProf").val(item.RG);
                    $("#txtDataNascProf").val(item.DATA_NASC);
                    $("#txtAnoFormaturaProf").val(item.FORMATURA);
                    $("#txtCepProf").val(item.CEP);
                    $("#txtEnderecoProf").val(item.ENDERECO);
                    $("#txtNumeroProf").val(item.NUMERO);
                    $("#txtComplementoProf").val(item.COMPL);
                    $("#txtBairroProf").val(item.BAIRRO);
                    $("#ddlEstadoProf").val(item.ESTADO);
                    $("#txtCidadeProf").val(item.CIDADE);
                    $("#txtDDDTelProf").val(item.DDD);
                    $("#txtTelefoneProf").val(item.TELEFONE);
                    $("#txtNomeCrachaProf").val(item.NOME_CRACHA);
                    $("#txtAssociadoProf").val(item.ASSOCIADO_LUGAR);
                    $("#txtPassaporteProf").val(item.PASSAPORTE);
                    $("#txthospedagemEntradaProf").val(item.CHECK_IN_HOSPEDAGEM);
                    $("#txthospedagemSaidaProf").val(item.CHECK_OUT_HOSPEDAGEM);
                    $("#txtPassagemIdaProf").val(item.DT_PASSAGEM_IDA);
                    $("#txtPassagemHoraIdaProf").val(item.HORA_PASSAGEM_IDA);
                    $("#txtPassagemVoltaProf").val(item.DT_PASSAGEM_VOLTA);
                    $("#txtPassagemHoraVoltaProf").val(item.HORA_PASSAGEM_VOLTA);
                    $("#txtAcompanhanteProf").val(item.ACOMPANHANTE);
                    $("#txtObsProf").val(item.OBSERVACAO);
                    $("#ddlParticipouEvento").val(item.FLG_PART_EVENTO);
                });


                $("#PublicoProfissional").attr("style", "display:block");
                $("#PublicoPDV").attr("style", "display:none");
                $("#ddlCategoriaProf").attr("disabled", "disabled");
                $("#ddlUFProf").attr("disabled", "disabled");
                $("#txtCRMProf").attr("disabled", "disabled");
                $("#txtNomeProf").attr("disabled", "disabled");
                $("#hOperacaoPublico").val("ALT");
                $("#btnPesqCRM").attr("disabled", "disabled")


            }

           // AbrirModal('AbreModalPublicoAlvo');


        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });

}


function ValidarPublico() {

    if ($("#ddlTipoPublico").val() == "P") //profissional
    {

        if ($("#ddlCategoriaProf").val() == "") {
            alert('Informe a categoria');
            $("#ddlCategoriaProf").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#ddlUFProf").val() == "") {
            alert('Informe a UF do profissional.');
            $("#ddlUFProf").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#txtCRMProf").val() == "") {
            alert('Informe o código do profissional.');
            $("#txtCRMProf").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#txtNomeProf").val() == "") {
            alert('Informe o nome do profissional.');
            $("#txtNomeProf").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#ddlEspecialidadeProf").val() == "") {
            alert('Informe a especialidade.');
            $("#ddlEspecialidadeProf").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#txtEmailProf").val() == "") {
            alert('Informe o email.');
            $("#txtEmailProf").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#txtCelularProf").val() == "") {
            alert('Informe o celular.');
            $("#txtCelularProf").focus();
            $('#progress').css('display', 'none');
            return false;
        }


        if ($("#hAcao").val() == "10") {           //se acao igual a congresso valida outros campos

            if ($("#txtNomeCrachaProf").val() == "") {

                alert('Informe o nome do crachá.');
                $("#txtNomeCrachaProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtNomeCrachaProf").val() == "") {

                alert('Informe o nome do crachá.');
                $("#txtNomeCrachaProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtCPFProf").val() == "") {

                alert('Informe o CPF.');
                $("#txtCPFProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if (ValidaCPF($("#txtCPFProf").val()) == false) {
                alert('CPF inválido');
                $("#txtCPFProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtRGProf").val() == "") {

                alert('Informe o RG.');
                $("#txtRGProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#ddlEvento").val() == "I") {
                if ($("#txtPassaporteProf").val() == "") {
                    alert('Informe o passaporte.');
                    $("#txtPassaporteProf").focus();
                    $('#progress').css('display', 'none');
                    return false;
                }
            }

            if ($("#txtDataNascProf").val() == "") {
                alert('Informe data de nascimento.');
                $("#txtDataNascProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtDataNascProf").val().length < 10) {
                alert("Data de nascimento inválida.");
                $("#txtDataNascProf").focus();
                return false;
            }

            if (!validaData($("#txtDataNascProf").val())) {
                alert('Data de nascimento inválida.');
                $("#txtDataNascProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtAnoFormaturaProf").val() == "") {
                alert('Informe a formatura.');
                $("#txtAnoFormaturaProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            //if ($("#txtDDDTelProf").val() == "") {
            //    alert('Informe o DDD do telefone.');
            //    $("#txtDDDTelProf").focus();
            //    $('#progress').css('display', 'none');
            //    return false;
            //}

            //if ($("#txtTelefoneProf").val() == "") {
            //    alert('Informe o  telefone.');
            //    $("#txtTelefoneProf").focus();
            //    $('#progress').css('display', 'none');
            //    return false;
            //}


            if ($("#txtCepProf").val() == "") {
                alert('Informe o cep.');
                $("#txtCepProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtEnderecoProf").val() == "") {
                alert('Informe o endereço.');
                $("#txtEnderecoProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtNumeroProf").val() == "") {
                alert('Informe o número do endereço.');
                $("#txtNumeroProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#txtBairroProf").val() == "") {
                alert('Informe o bairro.');
                $("#txtBairroProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }

            if ($("#ddlEstadoProf").val() == "") {
                alert('Informe o estado.');
                $("#ddlEstadoProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }
            if ($("#txtCidadeProf").val() == "") {
                alert('Informe a cidade.');
                $("#txtCidadeProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }
            if ($("#txtCidadeProf").val() == "") {
                alert('Informe a cidade.');
                $("#txtCidadeProf").focus();
                $('#progress').css('display', 'none');
                return false;
            }
        }

        SalvaPublicoProf();


    }

    else { //pdv

        if ($("#txtCNPJPDV").val() == "") {
            alert('Informe o CNPJ.');
            $("#txtCNPJPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if (!ValidaCNPJ($("#txtCNPJPDV").val())) {
            alert('CNPJ inválido.');
            $("#txtCNPJPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }
        if ($("#txtRazaoSocialPDV").val() == "") {
            alert('Informe a Razão Social.');
            $("#txtRazaoSocialPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }
        if ($("#txtFantasiaPDV").val() == "") {
            alert('Informe o nome Fantasia.');
            $("#txtFantasiaPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }
        if ($("#ddlCategoriaPDV").val() == "") {
            alert('Informe a categoria do PDV.');
            $("#ddlCategoriaPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#txtContatoPDV").val() == "") {
            alert('Informe o contato.');
            $("#txtContatoPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        if ($("#txtEmailPDV").val() == "") {
            alert('Informe o email.');
            $("#txtEmailPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }


        if ($("#txtDDDPDV").val() == "") {
            alert('Informe o DDD do telefone.');
            $("#txtDDDPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }
        if ($("#txtTelPDV").val() == "") {
            alert('Informe o telefone.');
            $("#txtTelPDV").focus();
            $('#progress').css('display', 'none');
            return false;
        }

        SalvaPublicoPDV();
    }


}


function ExcluirPublico(id, codigo, descricao, tipo) {

    if (window.confirm("Confirma excluir o público  " + descricao + " ? ")) {
        $("#hOperacaoPublico").val("EXC");
        $("#hIDPublico").val(id);
        if (tipo == "E") {
            SalvaPublicoPDV();
        } else {
            SalvaPublicoProf();
        }
    }

}


function NovoPublico() {


    CarregaPublico();

}

function CarregaPublico() {

    $("#hOperacaoPublico").val("INC");
    $("#hIDPublico").val("");

    $("#htipopublicoant").val($("#ddlTipoPublico").val());



    if ($("#ddlTipoPublico").val() == "P") {

        $("#PublicoProfissional").attr("style", "display:none");
        $("#PublicoPDV").attr("style", "display:none");
        $("#SemPublico").attr("style", "display:none");


        if ($("#hPainelProf").val() == 1 || $("#hPainelProf").val() == 2) {
            $("#btnPesqCRM").removeAttr("disabled");
            $("#btnSalvarPublico").removeAttr("disabled");
            $("#PublicoProfissional").attr("style", "display:block");
        } else {
            $("#btnPesqCRM").attr("disabled", "disabled");
            $("#btnSalvarPublico").attr("disabled", "disabled");
            $("#SemPublico").attr("style", "display:block");
            $("#lblpublico").text("Está parametrizado que " + $("#txtTipoAcao").val() + " não permite a participação de profissional.");

        }


    } else if ($("#ddlTipoPublico").val() == "E") {



        $("#PublicoProfissional").attr("style", "display:none");
        $("#PublicoPDV").attr("style", "display:none");
        $("#SemPublico").attr("style", "display:none");



        if ($("#hPainelPDV").val() == 1 || $("#hPainelPDV").val() == 2) {
            $("#MainContent_btnPesqCNPJ").removeAttr("disabled");
            $("#btnSalvarPublico").removeAttr("disabled");
            $("#PublicoPDV").attr("style", "display:block");
        } else {
            $("#MainContent_btnPesqCNPJ").attr("disabled", "disabled");
            $("#btnSalvarPublico").attr("disabled", "disabled");
            $("#SemPublico").attr("style", "display:block");
            $("#lblpublico").text("Está parametrizado que " + $("#txtTipoAcao").val() + " não permite a participação de PDV.");
        }


    }

    // $("#ddlCategoriaProf").val("");
    $("#ddlUFProf").val("");
    $("#txtCRMProf").val("");
    $("#txtNomeProf").val("");
    $("#ddlEspecialidadeProf").val("");
    $("#txtEmailProf").val("");
    $("#txtCelularProf").val("");
    $("#txtCPFProf").val("");
    $("#txtDataNascProf").val("");
    $("#txtAnoFormaturaProf").val("");
    $("#txtCepProf").val("");
    $("#txtEnderecoProf").val("");
    $("#txtNumeroProf").val("");
    $("#txtComplementoProf").val("");
    $("#txtBairroProf").val("");
    $("#ddlEstadoProf").val("");
    $("#txtCidadeProf").val("");
    $("#txtDDDTelProf").val("");
    $("#txtTelefoneProf").val("");
    $("#txtNomeProf").removeAttr("disabled");
    $("#ddlUFProf").removeAttr("disabled");
    $("#ddlCategoriaProf").removeAttr("disabled");
    $("#txtCRMProf").removeAttr("disabled");
    $("#btnPesqCRM").removeAttr("disabled");
    $("#txtNomeCrachaProf").val("");
    $("#txtRGProf").val("");
    $("#txtAssociadoProf").val("");
    $("#txtPassaporteProf").val("");
    $("#txthospedagemEntradaProf").val("");
    $("#txthospedagemSaidaProf").val("");
    $("#txtPassagemIdaProf").val("");
    $("#txtPassagemHoraIdaProf").val("");
    $("#txtPassagemVoltaProf").val("");
    $("#txtPassagemHoraVoltaProf").val("");
    $("#txtAcompanhanteProf").val("");
    $("#txtObsProf").val("");


    // $("#ddlCategoriaPDV").val("");
    $("#txtCNPJPDV").removeAttr("disabled");
    $("#txtRazaoSocialPDV").removeAttr("disabled");
    $("#txtFantasiaPDV").removeAttr("disabled");
    $("#txtCNPJPDV").val("");
    $("#txtRazaoSocialPDV").val("");
    $("#txtFantasiaPDV").val("");
    $("#txtEmailPDV").val("");
    $("#txtDDDPDV").val("");
    $("#txtTelPDV").val("");
    $("#txtContatoPDV").val("");
    $("#txtObsPDV").val("");

}


function CarregaCep() {



    if ($("#txtCepProf").val() != "") {
        $.ajax({
            type: "POST",
            url: "RequisicaoAcaoMKTPublicoAlvo.aspx/getCep",
            data: JSON.stringify({ pCep: $("#txtCepProf").val() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                $.each(data.d, function (i, item) {

                    $("#txtEnderecoProf").val(item.endereco);
                    $("#ddlEstadoProf").val(item.uf);
                    $("#txtBairroProf").val(item.bairro);
                    $("#txtCidadeProf").val(item.cidade);

                });
            }

        });
    }
}





function SalvaPublicoPDV() {

    var num_req = $("#hNumReq").val();
    var cnpj = $("#txtCNPJPDV").val();
    var operacao = $("#hOperacaoPublico").val();
    var categoria = $("#ddlCategoriaPDV").val();
    var razaosocial = $("#txtRazaoSocialPDV").val();
    var fantasia = $("#txtFantasiaPDV").val();
    var contato = $("#txtContatoPDV").val();
    var email = $("#txtEmailPDV").val();
    var ddd = $("#txtDDDPDV").val();
    var tel = $("#txtTelPDV").val();
    var obs = $("#txtObsPDV").val();
    var IDPublico = $("#hIDPublico").val();
    var painel = $("#hPainelCadastro").val();
    var participou = $("#ddlParticipouEvento").val();


    var PublicoPDV = [];
    const dadospublico = new DadosPublicoPDV(num_req, operacao, categoria, cnpj, razaosocial, fantasia, contato, email, ddd, tel, obs, IDPublico, painel, participou)
    PublicoPDV.push(dadospublico);

    //var matricula = '<%=System.Web.HttpContext.Current.Session["matricula"].ToString() %>';
    var matricula = $("#hUsuario").val();
    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/SalvarPublicoPdv",
        data: JSON.stringify({ pLista: PublicoPDV, sMatricula: matricula }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //CarregaRequisicao($("#hNumReq").val());
            CarregaPublicoRequisicao($("#hNumReq").val());
            carregaDadosPresenca();
            NovoPublico();
            //  FecharModal('btnFecharpopupPesq');

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });


    $('#progress').css('display', 'none');

}


function DadosPublicoPDV(pNUMREQ, pOPERACAO, pCATEGORIA, pCNPJ, pRAZAOSOCIAL, pNOMEFANTASIA, pCONTATO, pEMAIL, pDDD, pTELEFONE, pOBS, pID, pPainel, pParticipou) {
    this.ID = pID;
    this.ID_NUM_REQ = pNUMREQ;
    this.OPERACAO = pOPERACAO;
    this.CATEGORIA = pCATEGORIA;
    this.CNPJ = pCNPJ;
    this.RAZAOSOCIAL = pRAZAOSOCIAL;
    this.NOMEFANTASIA = pNOMEFANTASIA;
    this.CONTATO = pCONTATO;
    this.EMAIL = pEMAIL;
    this.DDD = pDDD;
    this.TELEFONE = pTELEFONE;
    this.OBS = pOBS;
    this.PAINEL = pPainel;
    this.FLG_PART_EVENTO = pParticipou;

}

function AbrePesquisaCNPJ(tipoconsulta) {

    $("#hTipoConsultaCNPJ").val(tipoconsulta);

    $("#txtPesqCNPJ").val("");
    $("#txtPesqRazaoSocial").val("");
    $("#txtPesqNomeFantasia").val("");

    
    abrirPopCnpj();
    //AbrirModal('AbreModalPesquisaCNPJ')
}

function LayoutTabelaPesquisaCNPJ() {

    var cnpj = $("#txtPesqCNPJ").val();
    var razaosocial = $("#txtPesqRazaoSocial").val();
    var nomefantasia = $("#txtPesqNomeFantasia").val();
    var painel = $("#hPainelPDV").val();

    var json = JSON.stringify({ pCNPJ: cnpj, pRazaoSocial: razaosocial, pFantasia: nomefantasia, pTipoConsulta: "1", pPainel: painel });

    tableLayoutPDV = $("#tablePesquisaCNPJ").DataTable({
        "sPaginationType": "full_numbers",
        "bDestroy": true,
        "bPaginate": true,
        "iDisplayLength": 10,
        "orderCellsTop": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": true,
        "bFilter": true,
        "bLengthChange": false,
        "bstateSave": true,
        "fixedHeader": true,
        "scrollX": true,
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
            },
        "columnDefs": [
            {
                "width": "15%",
                "autoWidth": false,
                "orderable": false,
                "targets": [0],
                "data": null,
                "title": "CNPJ",
                "className": "dt-left",
                "render": function (data, type, full, meta) {
                    var html;

                    html = "<a href=\"#\" onclick=\"javascript:CarregaPublicoPDV('" + data.CNPJ + "','" + data.RAZAOSOCIAL + "');FecharModal('btnFecharPopupCNPJ');\">" + data.CNPJ + "</a>&nbsp;&nbsp;";

                    return html;
                },
            },

            {

                "width": "55%",
                "autoWidth": false,
                "targets": [1],
                "data": "RAZAOSOCIAL",
                "title": "Razão Social",
                "orderable": false
            },
            {
                "width": "30%",
                "autoWidth": false,
                "targets": [2],
                "data": "NOMEFANTASIA",
                "title": "Nome fantasia",
                "orderable": false
            },
        ],

        "ajax": {
            "type": "POST",
            "url": "RequisicaoAcaoMKTPublicoAlvo.aspx/PesquisarCNPJ",
            "data": function (d) {
                return json;
            },
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json) {
                var parse = JSON.stringify(json.d);
                var retorno = $.parseJSON(parse);
                return retorno;
            }
        },
    });
}



function CarregaPublicoPDV(CNPJ, RAZAO) {

    LimpaPublicoPDV();

    if ($("#hPainelPDV").val() == 1) {
        $("#txtRazaoSocialPDV").attr("disabled", "disabled");
        $("#txtFantasiaPDV").attr("disabled", "disabled");
    } else {
        // $("#MainContent_btnPesqCNPJ").attr("disabled", "disabled");
        $("#txtRazaoSocialPDV").removeAttr("disabled");
        $("#txtFantasiaPDV").removeAttr("disabled");
    }

    var numreq = $("#hNumReq").val()
    $("#txtCNPJPDV").val(CNPJ);
    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/ValidaPublicoCadastrado",
        data: JSON.stringify({ pNumReq: numreq, pCodigo: CNPJ, pTipo: $("#ddlTipoPublico").val() }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            $.ajax({
                type: "POST",
                url: "RequisicaoAcaoMKTPublicoAlvo.aspx/CarregaPublicoPDV",
                data: JSON.stringify({ pCNPJ: CNPJ, pRazao: RAZAO }),
                timeout: 999999,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    $.each(data.d, function (i, item) {


                        $("#hCategoriaPDV").val(item.CATEGORIA);
                        $("#ddlCategoriaPDV").val(item.CATEGORIA);
                        $("#txtCNPJPDV").val(item.CNPJ);
                        $("#txtRazaoSocialPDV").val(item.RAZAOSOCIAL);
                        $("#txtFantasiaPDV").val(item.NOMEFANTASIA);
                        $("#txtEmailPDV").val(item.EMAIL);
                        $("#txtDDDPDV").val(item.DDD);
                        $("#txtTelPDV").val(item.TELEF1);
                        $("#hPainelCadastro").val(item.PAINEL);
                    });

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(JSON.parse(xhr.responseText).Message);
                }
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
            $("#txtRazaoSocialPDV").attr("disabled", "disabled");
            $("#txtFantasiaPDV").attr("disabled", "disabled");
        }
    });






}

function CarregaCNPJ() {

    LimpaPublicoPDV();

    if ($("#txtCNPJPDV").val() != "") {
        if (!ValidaCNPJ($("#txtCNPJPDV").val())) {
            alert('CNPJ inválido.');
            return false;

        } else {

            LimpaPublicoPDV();

            if ($("#hPainelPDV").val() == 1) {
                $("#txtRazaoSocialPDV").attr("disabled", "disabled");
                $("#txtFantasiaPDV").attr("disabled", "disabled");
            } else {
                // $("#MainContent_btnPesqCNPJ").attr("disabled", "disabled");
                $("#txtRazaoSocialPDV").removeAttr("disabled");
                $("#txtFantasiaPDV").removeAttr("disabled");
            }

            var numreq = $("#hNumReq").val()

            //Verifica se cnpj está cadastrado na base do publico da requisicao

            $.ajax({
                type: "POST",
                url: "RequisicaoAcaoMKTPublicoAlvo.aspx/ValidaPublicoCadastrado",
                data: JSON.stringify({ pNumReq: numreq, pCodigo: $("#txtCNPJPDV").val(), pTipo: $("#ddlTipoPublico").val() }),
                timeout: 999999,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    // se existir dá mensagem

                    if ($("#txtCNPJPDV").val() != "" && ($("#hPainelPDV").val() == 1 || $("#hPainelPDV").val() == 2)) {
                        $.ajax({
                            type: "POST",
                            url: "RequisicaoAcaoMKTPublicoAlvo.aspx/PesquisarCNPJ",
                            data: JSON.stringify({ pCNPJ: $("#txtCNPJPDV").val(), pRazaoSocial: "", pFantasia: "", pTipoConsulta: 2, pPainel: $("#hPainelPDV").val() }),
                            timeout: 999999,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                var existe = false;

                                $.each(data.d, function (i, item) {
                                    existe = true;
                                    CarregaPublicoPDV($("#txtCNPJPDV").val())
                                });

                                if (existe == false && $("#hPainelPDV").val() == 1) {

                                    alert('Este CNPJ não existe no painel do cliente.');
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                alert(JSON.parse(xhr.responseText).Message);

                            }
                        });

                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(JSON.parse(xhr.responseText).Message);
                }
            });
        }
    }
}

function LimpaPublicoPDV() {

    $("#txtContatoPDV").val("");
    $("#hCategoriaPDV").val("");
    $("#txtRazaoSocialPDV").val("");
    $("#txtFantasiaPDV").val("");
    $("#txtEmailPDV").val("");
    $("#txtDDDPDV").val("");
    $("#txtTelPDV").val("");
    $("#txtObsPDV").val("");
    $("#hPainelCadastro").val("");

}

//********************************************************************Publico Alvo  Profissional******************************************************************************      




function SalvaPublicoProf() {

    var num_req = $("#hNumReq").val();
    var Categoria = $("#ddlCategoriaProf").val();
    var DescCateg = $("#ddlCategoriaProf option:selected").text();
    var CRMProf = $("#txtCRMProf").val();
    var UFProf = $("#ddlUFProf").val();
    var NomeProf = $("#txtNomeProf").val();
    var EspecialidadeProf = $("#ddlEspecialidadeProf").val();
    var EmailProf = $("#txtEmailProf").val();
    var CelularProf = $("#txtCelularProf").val();
    var CPFProf = $("#txtCPFProf").val();
    var DataNascProf = $("#txtDataNascProf").val();
    var AnoFormaturaProf = $("#txtAnoFormaturaProf").val();
    var CepProf = $("#txtCepProf").val();
    var EnderecoProf = $("#txtEnderecoProf").val();
    var NumeroProf = $("#txtNumeroProf").val();
    var ComplementoProf = $("#txtComplementoProf").val();
    var BairroProf = $("#txtBairroProf").val();
    var EstadoProf = $("#ddlEstadoProf").val();
    var CidadeProf = $("#txtCidadeProf").val();
    var DDDTelProf = $("#txtDDDTelProf").val();
    var TelefoneProf = $("#txtTelefoneProf").val();
    var NomeCrachaProf = $("#txtNomeCrachaProf").val();
    var RGProf = $("#txtRGProf").val();
    var AssociadoProf = $("#txtAssociadoProf").val();
    var PassaporteProf = $("#txtPassaporteProf").val();
    var hospedagemEntradaProf = $("#txthospedagemEntradaProf").val();
    var hospedagemSaidaProf = $("#txthospedagemSaidaProf").val();
    var PassagemIdaProf = $("#txtPassagemIdaProf").val();
    var PassagemHoraIdaProf = $("#txtPassagemHoraIdaProf").val();
    var PassagemVoltaProf = $("#txtPassagemVoltaProf").val();
    var PassagemHoraVoltaProf = $("#txtPassagemHoraVoltaProf").val();
    var AcompanhanteProf = $("#txtAcompanhanteProf").val();
    var ObsProf = $("#txtObsProf").val();
    var IDPublico = $("#hIDPublico").val();
    var operacao = $("#hOperacaoPublico").val();
    var painelcadastro = $("#hPainelCadastro").val();
    var participou = $("#ddlParticipouEvento").val();

    var PublicoProf = [];
    const dadospublico = new DadosPublicoProf(num_req, operacao,
        Categoria, DescCateg, CRMProf, UFProf, NomeProf,
        EspecialidadeProf, EmailProf, CelularProf,
        CPFProf, DataNascProf,
        AnoFormaturaProf, CepProf,
        EnderecoProf, NumeroProf, ComplementoProf,
        BairroProf, EstadoProf, CidadeProf,
        DDDTelProf, TelefoneProf, NomeCrachaProf,
        RGProf, AssociadoProf, PassaporteProf,
        hospedagemEntradaProf, hospedagemSaidaProf,
        PassagemIdaProf, PassagemHoraIdaProf,
        PassagemVoltaProf, PassagemHoraVoltaProf,
        AcompanhanteProf, ObsProf, IDPublico, painelcadastro, participou)
    PublicoProf.push(dadospublico);

    //var matricula = '<%=System.Web.HttpContext.Current.Session["matricula"].ToString() %>';
    var matricula = $("#hUsuario").val();
    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/SalvarPublicoProf",
        data: JSON.stringify({ pLista: PublicoProf, sMatricula: matricula }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            CarregaPublicoRequisicao($("#hNumReq").val());
           // aqui
            carregaDadosPresenca();
            NovoPublico();

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });


    $('#progress').css('display', 'none');

}

function DadosPublicoProf(pNum_req, pOperacao, pCategoria, pDescCateg, pCRMProf, pUFProf, pNomeProf, pEspecialidadeProf, pEmailProf, pCelularProf,
    pCPFProf, pDataNascProf, pAnoFormaturaProf, pCepProf, pEnderecoProf, pNumeroProf, pComplementoProf, pBairroProf, pEstadoProf, pCidadeProf,
    pDDDTelProf, pTelefoneProf, pNomeCrachaProf, pRGProf, pAssociadoProf, pPassaporteProf, pHospedagemEntradaProf, pHospedagemSaidaProf,
    pPassagemIdaProf, pPassagemHoraIdaProf, pPassagemVoltaProf, pPassagemHoraVoltaProf, pAcompanhanteProf, pObsProf, pID, pPainelCadastro, pParticipou) {


    this.ID = pID;
    this.OPERACAO = pOperacao;
    this.ID_NUM_REQ = pNum_req;
    this.CATEGORIA = pCategoria;
    this.DESC_CATEG = pDescCateg;
    this.CODIGO = pCRMProf;
    this.UF = pUFProf;
    this.NOME = pNomeProf;
    this.COD_ESPEC = pEspecialidadeProf;
    this.EMAIL = pEmailProf;
    this.DDD = pDDDTelProf;
    this.TELEFONE = pTelefoneProf;
    this.CELULAR = pCelularProf;
    this.NOME_CRACHA = pNomeCrachaProf;
    this.CPF = pCPFProf;
    this.PASSAPORTE = pPassaporteProf;
    this.DATA_NASC = pDataNascProf;
    this.RG = pRGProf;
    this.FORMATURA = pAnoFormaturaProf;
    this.ENDERECO = pEnderecoProf;
    this.NUMERO = pNumeroProf;
    this.COMPL = pComplementoProf;
    this.CEP = pCepProf;
    this.BAIRRO = pBairroProf;
    this.CIDADE = pCidadeProf;
    this.ESTADO = pEstadoProf;
    this.ASSOCIADO_LUGAR = pAssociadoProf;
    this.CHECK_IN_HOSPEDAGEM = pHospedagemEntradaProf;
    this.CHECK_OUT_HOSPEDAGEM = pHospedagemSaidaProf;
    this.DT_PASSAGEM_IDA = pPassagemIdaProf;
    this.DT_PASSAGEM_VOLTA = pPassagemVoltaProf;
    this.HORA_PASSAGEM_IDA = pPassagemHoraIdaProf;
    this.HORA_PASSAGEM_VOLTA = pPassagemHoraVoltaProf;
    this.ACOMPANHANTE = pAcompanhanteProf
    this.OBSERVACAO = pObsProf;
    this.PAINEL = pPainelCadastro;
    this.FLG_PART_EVENTO = pParticipou;

}

function ValidaCategoria() {


    if ($("#ddlCategoriaProf").val() != "") {
        if ($("#ddlCategoriaProf").val() != "M") {
            $("#txtCRMProf").val("");
            $("#txtNomeProf").val("");
            $("#ddlUFProf").val("");
            $("#ddlUFProf").removeAttr("disabled");
            $("#txtNomeProf").removeAttr("disabled");
            $("#txtCRMProf").removeAttr("disabled");
            //$("#MainContent_btnPesqCRM").attr("disabled", "disabled");

        }
        else if ($("#ddlCategoriaProf").val() == "M") {

            $("#txtCRMProf").val("");
            $("#txtNomeProf").val("");
            $("#ddlUFProf").val("");
            $("#ddlUFProf").removeAttr("disabled");
            $("#txtCRMProf").removeAttr("disabled");
            $("#txtNomeProf").attr("disabled", "disabled");
            //  $("#MainContent_btnPesqCRM").removeAttr("disabled");
        }


    } else {

        $("#txtCRMProf").val("");
        $("#txtNomeProf").val("");
        $("#ddlUFProf").val("");
        $("#txtCRMProf").attr("disabled", "disabled");
        $("#txtNomeProf").attr("disabled", "disabled");
        //  $("#MainContent_btnPesqCRM").attr("disabled", "disabled");


    }
}

function ValidaUFCategoria() {

    //if ($("#ddlCategoriaProf").val() == "M") {
    //    $("#MainContent_btnPesqCRM").removeAttr("disabled");
    //}
    //else {
    //    $("#MainContent_btnPesqCRM").attr("disabled", "disabled");
    //}

    //if ($("#txtCRMProf").val() != "" && $("#ddlUFProf").val() != "" && $("#ddlCategoriaProf").val() == "M") {
    if ($("#txtCRMProf").val() != "" && $("#ddlUFProf").val() != "") {

        $.ajax({
            type: "POST",
            url: "RequisicaoAcaoMKTPublicoAlvo.aspx/PesquisarCRM",
            data: JSON.stringify({ pCRM: $("#txtCRMProf").val(), pUF: $("#ddlUFProf").val(), pNome: "", pTipoPublico: $("#hPainelProf").val(), pTipoConsulta: 2, pCategoria: $("#ddlCategoriaProf").val() }),
            timeout: 999999,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $("#txtNomeProf").val("");
                LimpaDadosPublicoProf();

                $.each(data.d, function (i, item) {
                    CarregaPublicoProf($("#ddlUFProf").val(), $("#txtCRMProf").val(), item.NOME_CFM)
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.parse(xhr.responseText).Message);
            }
        });
    }
}

function CarregaCRM() {

    var numreq = $("#hNumReq").val()

    if ($("#txtCRMProf").val() != "" && $("#ddlUFProf").val() != "") {

        $.ajax({
            type: "POST",
            url: "RequisicaoAcaoMKTPublicoAlvo.aspx/ValidaPublicoCadastrado",
            data: JSON.stringify({ pNumReq: numreq, pCodigo: $("#ddlUFProf").val() + $("#txtCRMProf").val(), pTipo: $("#ddlTipoPublico").val() }),
            timeout: 999999,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                // se existir dá mensagem

                //  if ($("#ddlCategoriaProf").val() == "M") {
                $.ajax({
                    type: "POST",
                    url: "RequisicaoAcaoMKTPublicoAlvo.aspx/PesquisarCRM",
                    data: JSON.stringify({ pCRM: $("#txtCRMProf").val(), pUF: $("#ddlUFProf").val(), pNome: "", pTipoPublico: $("#hPainelProf").val(), pTipoConsulta: 2, pCategoria: $("#ddlCategoriaProf").val() }),
                    timeout: 999999,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {

                        $("#txtNomeProf").val("");
                        LimpaDadosPublicoProf();

                        $.each(data.d, function (i, item) {
                            CarregaPublicoProf($("#ddlUFProf").val(), $("#txtCRMProf").val(), item.NOME_CFM)
                        });
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(JSON.parse(xhr.responseText).Message);
                        if ($("#hPainelProf").val() == "1") $("#txtNomeProf").attr("disabled", "disabled");
                    }
                });
                //  }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(JSON.parse(xhr.responseText).Message);
                return false;

            }
        });

    }

}

function AbrePesquisaCRM() {



    if ($("#ddlCategoriaProf").val() == "") {
        alert('Informe a categoria do profissional.');
        $("#ddlCategoriaProf").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    $("#txtPesqCodigo").val("");
    $("#ddlUFCRM").val("");
    $("#txtPesqNome").val("");

    //AbrirModal('AbreModalPopCrm')

    abrirPopCrm();
}

function LayoutTabelaPesquisaCRM() {



    var CRM = $("#txtPesqCodigo").val();
    var UF = $("#ddlUFCRM").val();
    var Nome = $("#txtPesqNome").val();
    var categoria = $("#ddlCategoriaProf").val();


    tableLayout = $("#tablePesquisaCRM").DataTable({
        "sPaginationType": "full_numbers",
        "bDestroy": true,
        "bPaginate": true,
        "iDisplayLength": 10,
        "orderCellsTop": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": true,
        "bFilter": true,
        "bLengthChange": false,
        "bstateSave": true,
        "fixedHeader": true,
        "scrollX": true,
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
            },
        "columnDefs": [
            {
                "width": "15%",
                "autoWidth": false,
                "orderable": false,
                "targets": [0],
                "data": null,
                "title": "Código",
                "className": "dt-left",
                "render": function (data, type, full, meta) {
                    var html;
                    html = "<a href=\"#\" onclick=\"javascript:CarregaPublicoProf('" + data.UF_CFM + "','" + data.CRM_CFM + "','" + data.NOME_CFM + "');FecharModal('btnFecharPopupCRM');\">" + data.CRM_CFM + "</a>&nbsp;&nbsp;";

                    return html;
                },

            },

            {

                "width": "10%",
                "autoWidth": false,
                "targets": [1],
                "data": "UF_CFM",
                "title": "UF",
                "orderable": false
            },
            {
                "width": "65%",
                "autoWidth": false,
                "targets": [2],
                "data": "NOME_CFM",
                "title": "Nome",
                "orderable": false
            },
        ],

        "ajax": {
            "type": "POST",
            "url": "RequisicaoAcaoMKTPublicoAlvo.aspx/PesquisarCRM",
            "data": function (d) {
                return JSON.stringify({ pCRM: CRM, pUF: UF, pNome: Nome, pTipoPublico: $("#hPainelProf").val(), pTipoConsulta: 1, pCategoria: categoria });
            },
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json) {
                var parse = JSON.stringify(json.d);
                var retorno = $.parseJSON(parse);
                return retorno;
            }
        },
    });
}

function CarregaPublicoProf(UF_CRM, CRM, NOME) {




    $("#ddlUFProf").val(UF_CRM);
    $("#txtCRMProf").val(CRM);
    $("#txtNomeProf").val(NOME);



    var numreq = $("#hNumReq").val()

    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKTPublicoAlvo.aspx/ValidaPublicoCadastrado",
        data: JSON.stringify({ pNumReq: numreq, pCodigo: UF_CRM, CRM, pTipo: $("#ddlTipoPublico").val() }),
        timeout: 999999,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {


            $.ajax({
                type: "POST",
                url: "RequisicaoAcaoMKTPublicoAlvo.aspx/CarregaPublicoProf",
                data: JSON.stringify({ pUF: UF_CRM, pCRM: CRM }),
                timeout: 999999,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    LimpaDadosPublicoProf();

                    $.each(data.d, function (i, item) {

                        $("#ddlUFProf").val(item.MERE_UF_CRM);
                        $("#txtCRMProf").val(item.MERE_CRM);
                        $("#txtNomeProf").val(item.NOME);
                        $("#ddlEspecialidadeProf").val(item.MERE_ESP1);
                        $("#txtEmailProf").val(item.MERE_EMAIL);
                        $("#txtCelularProf").val(item.CELULAR);
                        $("#txtCPFProf").val(item.CPF);
                        // $("#txtDataNascProf").val(item.DTNASC.substr(2, 2) + '/' + item.DTNASC.substr(0, 2));
                        $("#txtAnoFormaturaProf").val(item.FORMAT);
                        if (item.CEP != undefined && item.CEP != null) {
                            $("#txtCepProf").val(item.CEP.substr(0, 5) + '-' + item.CEP.substr(5, 3));
                        }
                        $("#txtEnderecoProf").val(item.ENDERECO);
                        $("#txtNumeroProf").val(item.NUMERO);
                        $("#txtComplementoProf").val(item.COMPL);
                        $("#txtBairroProf").val(item.BAIRRO);
                        $("#ddlEstadoProf").val(item.UF);
                        $("#txtCidadeProf").val(item.CIDADE);
                        $("#txtDDDTelProf").val(item.DDD);
                        $("#txtTelefoneProf").val(item.TELEF1);
                        $("#ddlCategoriaProf").val(item.MERE_LETRA);
                        $("#hPainelCadastro").val(item.PAINEL);


                        $("#ddlUFProf").attr("disabled", "disabled");
                        $("#txtCRMProf").attr("disabled", "disabled");
                        $("#txtNomeProf").attr("disabled", "disabled");


                    });

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(JSON.parse(xhr.responseText).Message);
                    if ($("#hPainelProf").val() == "1") $("#txtNomeProf").attr("disabled", "disabled");
                }
            });

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });

}

function LimpaDadosPublicoProf() {

    $("#ddlEspecialidadeProf").val("");
    $("#txtEmailProf").val("");
    $("#txtCelularProf").val("");
    $("#txtCPFProf").val("");
    $("#txtDataNascProf").val("");
    $("#txtAnoFormaturaProf").val("");
    $("#txtCepProf").val("");
    $("#txtEnderecoProf").val("");
    $("#txtNumeroProf").val("");
    $("#txtComplementoProf").val("");
    $("#txtBairroProf").val("");
    $("#ddlEstadoProf").val("");
    $("#txtCidadeProf").val("");
    $("#txtDDDTelProf").val("");
    $("#txtTelefoneProf").val("");
    $("#txtNomeCrachaProf").val("");
    $("#txtRGProf").val("");
    $("#txtAssociadoProf").val("");
    $("#txtPassaporteProf").val("");
    $("#txthospedagemEntradaProf").val("");
    $("#txthospedagemSaidaProf").val("");
    $("#txtPassagemIdaProf").val("");
    $("#txtPassagemHoraIdaProf").val("");
    $("#txtPassagemVoltaProf").val("");
    $("#txtPassagemHoraVoltaProf").val("");
    $("#txtAcompanhanteProf").val("");
    $("#txtObsProf").val("");
    $("#hPainelCadastro").val("");
}



function FecharModal(pNomeButton) {
    $("#" + pNomeButton).click();
}


function abrirPopPublicoAlvo() {
    $("#divConteudoPublicoAlvo").html("");

    $("#divConteudoPublicoAlvo").load("RequisicaoAcaoMKTPublicoAlvo.aspx" + " #popupPublico", function () {
        getEspecialidade();
        CarregaTipoPublico();
        AbrePublico();
        getCategoria();
        getUF();
        getCategoriaPDV();



        //AbrirModal('AbreModalPublicoAlvo');
        return false;
    });


}



function abrirPopCrm() {
    $("#divConteudoCrm").html("");

    $("#divConteudoCrm").load("RequisicaoAcaoMKTPublicoAlvo.aspx" + " #popProf", function () {
        getUF();
        AbrirModal('AbreModalPopCrm');
        return false;
    });
}

function abrirPopCnpj() {
    
    $("#divConteudoCnpj").html("");
    $("#divConteudoCnpj").load("RequisicaoAcaoMKTPublicoAlvo.aspx" + " #popCnpj", function () {
        
        AbrirModal('AbreModalPopCnpj');
        return false;
    });


}



function AbrirModal(pNomeClass) {
    $('.' + pNomeClass).click();
}

function FecharModal(pNomeButton) {
    $("#" + pNomeButton).click();
}



function FechaPopCrm() {

    $('#mPopCrm').modal('toggle');

    return false;
}
function FechaPopCnpj() {

    $('#mPopCnpj').modal('toggle');

    return false;
}

function FecharPopupReq() {

    $('#mPopReq').modal('toggle');

    return false;
}


function carregaDadosPresenca() {
    $("#hIdReq").val($("#txtCodigoRequisicao").val());

    $("#hNumReq").val($("#txtCodigoRequisicao").val());
    $("#hNumReq").val();
    $("#hIdReq").val();
    var codReq = $("#txtCodigoRequisicao").val();
    $.ajax(
        {
            type: "POST",
            url: "ListaPresencaRequisicaoAcaoMKT.aspx/CarregarListaPresenca",
            data: JSON.stringify({ codReq: codReq }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                table.clear();
                $.each(data.d, function (i, item) {
                    table.row.add(item);

                    $("#hPainelPDV").val(item.TIPO_PAINEL_ESTAB);
                    $("#hPainelProf").val(item.TIPO_PAINEL_PROF);
                });
                table.draw();


            }
        });
}


function CarregaPublicoRequisicao(NumReq) {

    $('#progress').css('display', 'block');

    $.ajax({
        type: "POST",
        url: "RequisicaoAcaoMKT.aspx/CarregaPublicoRequisicao",
        data: JSON.stringify({
            pNumReq: NumReq
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            tablePublico.destroy();
            $("#tBodyPublico").empty();

            var html = "";
            var style = "";

            $.each(data.d, function (i, item) {

                if (item.PAINEL == "N") {
                    style = ";color:red;"
                } else {

                    style = "";
                }



                html += "<tr  >";
                html += " <td  style='text-align:center;width:6%'>";
                html += " <a href=\"#\" onclick=\"javascript:EditarPublico('" + item.ID + "','" + item.TIPO + "')\"><i class='fa fa-pencil' data-toggle='tooltip' data-placement='right' title='Editar público'></i></a>&nbsp;&nbsp;";

                if (($("#hTipoPlano").val() == "1" && $("#hStatusReq").val() != "10") || ($("#hTipoPlano").val() == "2" && $("#hStatusReq").val() != "7")) {

                    html += " <a href=\"#\" onclick=\"javascript:ExcluirPublico('" + item.ID + "','" + item.CODIGO + "','" + item.NOME + "','" + item.TIPO + "')\"><i class='fa fa-trash' data-toggle='tooltip' data-placement='right' title='Excluir público'></i></a>";
                }
                html += " </td>";
                html += "  <td  style=width:22%" + style + ">" + item.CATEGORIA + "</td>";
                html += "  <td style=width:18%" + style + ">" + item.CODIGO + "</td>";
                html += "  <td nowrap style=width:52%" + style + ">" + item.NOME + "</td>";
                html += "</tr>";

            });

            $("#tBodyPublico").html(html);
            LayoutTabelaPublico();



        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
        }
    });

    $('#progress').css('display', 'none');

}

function LayoutTabelaPublico() {
    tablePublico = $("#tblPublicoRequisicao").DataTable({
        "sPaginationType": "full_numbers",
        "dom": '<"toolbarPublico">frtip',
        "bPaginate": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": false,
        "lengthMenu": [3, 3],
        "bstateSave": true,
        "oLanguage": {
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

    $("div.toolbarPublico").html('<a href="javascript:void(0);"  onclick="abrirPopPublicoAlvo();return false;" class="clsAbreModal btn-drop pull-left"><i class="fa fa-pencil-square-o"></i>Público Alvo</a>');
}









