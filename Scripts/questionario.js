var tableResp;

function AbrirModal(pNomeClass) {
    $('.' + pNomeClass).click();
}

//Habilita ou desabilta os campos do PopUp
function alteraTipoQuestionario() {

    var tipo = $("#ddlTipoquest").val();

    //1 == Prova
    if (tipo == 1) {
        $("#ddlControleTempo").removeAttr("disabled");
        $("#txTempoMaxProva").removeAttr('disabled');
        $("#ddlEmbPergunta").removeAttr("disabled");
        $("#ddlEmbResposta").removeAttr("disabled");
        $("#ddlAmostraPergunta").removeAttr("disabled");
        $("#ddlConsSimulado").removeAttr("disabled");
        $("#txtMinAprov").removeAttr("disabled");
        $("#ddlTentExtra").removeAttr("disabled");
        $("#txtMensagemSucesso").removeAttr("disabled");
        $("#txtMensagemFalha").removeAttr("disabled");

        $("#divProva").css('display', 'block');
        $('#divProva').css('visibility', 'visible');

    }
    //2 == Pesquisa
    else {
        $("#ddlControleTempo").prop('disabled', 'disabled');
        $("#txTempoMaxResp").prop('disabled', 'disabled');
        $("#ddlEmbPergunta").prop('disabled', 'disabled');
        $("#ddlEmbResposta").prop('disabled', 'disabled');
        $("#ddlAmostraPergunta").prop('disabled', 'disabled');
        $("#ddlConsSimulado").prop('disabled', 'disabled');
        $("#txtMinAprov").prop('disabled', 'disabled');
        $("#ddlTentExtra").prop('disabled', 'disabled');
        $("#txtQtdExtra").prop('disabled', 'disabled');
        $("#txtMensagemSucesso").prop('disabled', 'disabled');
        $("#txtMensagemFalha").prop('disabled', 'disabled');
        $("#txtQtdPergunta").prop('disabled', 'disabled');
        $("#ddlDificuldade").prop('disabled', 'disabled');
        $("#ddlRefazerModulo").prop('disabled', 'disabled');
        $("#ddlControleTempo").val('1');
        $("#txTempoMaxProva").val('');
        $("#txTempoMaxResp").val('');
        $("#ddlEmbPergunta").val('1');
        $("#ddlEmbResposta").val('1');
        $("#ddlAmostraPergunta").val('0');
        $("#ddlConsSimulado").val('0');
        $("#txtMinAprov").val('');
        $("#ddlTentExtra").val('0');
        $("#txtQtdExtra").val('');
        $("#ddlDificuldade").val('');
        $("#txtQtdPergunta").val('');
        $("#btnAdicionarResposta").prop('disabled', 'disabled');
        $("#ddlRefazerModulo").val('0');

        //Escondendo a div de Prova 
        $('#divProva').css('visibility', 'hidden');
        $("#divProva").css('display', 'none');
    }
    LayoutTabelaResp();
}

function abrirProgress() {
    $('#progressMaster').css('display', 'block');
}

function fecharProgress() {
    $('#progressMaster').css('display', 'none');
}

var fixHelperModified = function (e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function (index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
};

function ignorarTudo() {
    $("input:checkbox").removeAttr('checked');
}

function aprovarTudo() {
    $("input:checkbox").prop("checked", true);
}

//Grid de dificuldade dentro do PopUp
function LayoutTabelaResp() {
    var cont = 0;
    tableResp = $("#tbResultDificuldade").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": false,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": false,
        "bLengthChange": true,
        "bstateSave": true,
        "bDestroy": true,
        "oLanguage": {
            "sZeroRecords": "Não foram encontrados resultados",
            "sInfo": "",
            "sInfoEmpty": "",
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
                "width": "10%",
                "targets": [cont++],
                "data": null,
                "title": "Ação",
                "className": "dt-center",
                "render": function (data, type, full, meta) {
                    var html = "";
                    html += "<a href='#' id='imgExcluir'><i class='fa fa-trash' data-toggle='tooltip' data-placement='right' title='Excluir'></i></a>";
                    return html;
                }
            },
            {
                "targets": [cont++],
                "data": "DESCRICAO",
                "title": "Dificuldade",
                "className": "dt-center",
            },
            {
                "targets": [cont++],
                "data": "QTD",
                "title": "Quantidade",
                "className": "dt-center",
            },
            {
                "targets": [cont++],
                "data": "CODIGO",
                "title": "ID_DIFICULDADE",
                "className": "hidden"
            }
        ]
    });

    $('#tbResultDificuldade tbody').on('click', '#imgExcluir', function () {
        tableResp.row($(this).parents('tr')).remove().draw();
        return false;
    });

}

//Salva Novo Questionario
function salvaPop(btnFecharPopupNovoQuest, validacao) {
    
    var idQuestionario = $("#hIdQuestionario").val();
    var tipoQuest = $("#ddlTipoquest").val();
    var descQuest = $("#txtDescricaoQuest").val();
    var ativoQuest = $("#ddlAtivoQuest").val();
    var briefingQuest = $("#txtBriefing").val();
    var controleTempo = $("#ddlControleTempo").val();
    var tempoMaxProva = ($("#ddlControleTempo").val() == "1" ? $("#txTempoMaxProva").val() : "");
    var tempoMaxResp = ($("#ddlControleTempo").val() == "2" ? $("#txTempoMaxResp").val() : "");
    var embaralharPerg = $("#ddlEmbPergunta").val();
    var embaralharResp = $("#ddlEmbResposta").val();
    var amostra = $("#ddlAmostraPergunta").val();
    var simulado = $("#ddlConsSimulado").val();
    var minAprov = $("#txtMinAprov").val() != "" ? $("#txtMinAprov").val().replace(",", ".") : "";
    var permitirTentExtra = $("#ddlTentExtra").val();
    var qtdTentExtra = ($("#ddlTentExtra").val() == "-2" ? $("#txtQtdExtra").val() : $("#ddlTentExtra").val());
    var msgSucesso = $("#txtMensagemSucesso").val();
    var msgErro = $("#txtMensagemFalha").val();
    var refazerReprov = $("#ddlRefazerModulo").val();

    if (descQuest == "") {

        bootbox.alert({ title: 'Atenção', message: "Nome obrigatório!" });
        return false;
    }
    if (tipoQuest == "") {
        bootbox.alert({ title: 'Atenção', message: "Tipo obrigatório!" });
        return false;
    }
    if (ativoQuest == "") {
        bootbox.alert({ title: 'Atenção', message: "Ativo (sim ou não) obrigatório!" });
        return false;
    }
    if (briefingQuest == "") {
        bootbox.alert({ title: 'Atenção', message: "Briefing obrigatório!" });
        return false;
    }

    if (tipoQuest == 1) {  // P R O V A

        if (controleTempo == "") {
            bootbox.alert({ title: 'Atenção', message: "Controle de tempo obrigatório!" });
            return false;
        }

        if (controleTempo == "1" && tempoMaxProva == "") {
            bootbox.alert({ title: 'Atenção', message: "Tempo máximo de prova não informado!" });
            return false;
        }

        if (controleTempo == "2" && tempoMaxResp == "") {
            bootbox.alert({ title: 'Atenção', message: "Tempo máximo de resposta não informado!" });

            return false;
        }

        if (tempoMaxProva != "" && tempoMaxResp != "") {
            bootbox.alert({ title: 'Atenção', message: "Somente uma opção de tempo pode ser informada!" });

            return false;
        }

        if (minAprov == "") {
            bootbox.alert({ title: 'Atenção', message: "Percentual mínimo de aprovação obrigatório!" });

            return false;
        }

        if (parseInt(minAprov) > 100) {
            bootbox.alert({ title: 'Atenção', message: "Percentual mínimo de aprovação deve ser no máximo 100%!" });

            return false;
        }

        if (permitirTentExtra == "") {
            bootbox.alert({ title: 'Atenção', message: "Permitir tentativas extras não informado!" });

            return false;
        }

        if (permitirTentExtra == "-2" && qtdTentExtra == "") {
            bootbox.alert({ title: 'Atenção', message: "Limite de tentativas extras não informado!" });

            return false;
        }

        if (permitirTentExtra == "-2" && parseInt(qtdTentExtra) == 0) {
            bootbox.alert({ title: 'Atenção', message: "Limite de tentativas extras deve ser maior que zero!" });

            return false;
        }

        if (refazerReprov == "") {
            bootbox.alert({ title: 'Atenção', message: "Refazer módulo se reprovado não informado!" });

            return false;
        }

        if (simulado == "") {
            bootbox.alert({ title: 'Atenção', message: "Simulado não informado!" });

            return false;
        }

        if (embaralharPerg == "") {
            bootbox.alert({ title: 'Atenção', message: "Embaralhar perguntas não informado!" });

            return false;
        }

        if (amostra == "") {
            bootbox.alert({ title: 'Atenção', message: "Selecionar dificuldade não informado!" });

            return false;
        }

        if (embaralharResp == "") {
            bootbox.alert({ title: 'Atenção', message: "Embaralhar respostas não informado!" });

            return false;
        }

        if (embaralharPerg == "0" && amostra == "1") {
            bootbox.alert({ title: 'Atenção', message: "Não é permitido Selecionar dificuldade sem Embaralhar pergunta!" });

            return false;
        }
    }

    var jsontableLayoutTableResp = [];

    if (tableResp != null) {
        tableResp.rows().eq(0).each(function (index) {
            var row = tableResp.row(index).data();
            jsontableLayoutTableResp.push(row);
        });
    }

    if ((amostra == 1) && (jsontableLayoutTableResp.length == 0)) {

        bootbox.alert({ title: 'Atenção', message: "Nenhum tipo de dificuldade de pergunta informado!" });

        return false;
    }

    //SÓ VAI ENTRAR AQUI SE NÃO FOR APENAS PARA VALIDAR OS DADOS -- QUANDO CLICA EM FINALIZAR CADASTRO ELE APENAS VALIDA E NÃO SALVA NADA
    if (validacao != 'V') {

        $.ajax(
            {
                type: "POST",
                url: "QuestionarioEditar.aspx/ValidaDescricao",
                data: JSON.stringify({ pID: idQuestionario, pDescricao: descQuest, dificuldade: jsontableLayoutTableResp }),
                timeout: 999999,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {

                    if (data.d.existe == "SIM") {
                        bootbox.alert({ title: 'Atenção', message: "Já existe um questionário cadastrado com essa descrição." });
                        $('#progress').css('display', 'none');
                        return false;
                    }
                    $.ajax(
                        {
                            type: "POST",
                            url: "QuestionarioEditar.aspx/salvarQuest",
                            data: JSON.stringify({ tipoQuest: tipoQuest, descQuest: descQuest, ativoQuest: ativoQuest, briefingQuest: briefingQuest, tempoMaxProva: tempoMaxProva, tempoMaxResp: tempoMaxResp, embaralharPerg: embaralharPerg, embaralharResp: embaralharResp, amostra: amostra, simulado: simulado, minAprov: minAprov, qtdTentExtra: qtdTentExtra, msgSucesso: msgSucesso, msgErro: msgErro, idQuestionario: idQuestionario, dificuldade: jsontableLayoutTableResp, refazerReprov: refazerReprov }),
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function (data) {
                                FechaModal(btnFecharPopupNovoQuest);
                                if (data.d.ID != 0) {
                                    var ID = data.d.ID;
                                    carregaGridPerguntas(ID);
                                } else {
                                    carregaCabecalho();
                                }
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                bootbox.alert({
                                    title: 'Erro',
                                    message: JSON.parse(xhr.responseText).Message,
                                });

                                $('#progress').css('display', 'none');
                                return false;
                            }
                        });

                },

                error: function (xhr, ajaxOptions, thrownError) {
                    bootbox.alert({
                        title: 'Erro',
                        message: JSON.parse(xhr.responseText).Message,
                    });
                }
            });
    }
    if (validacao == 'V') {
        var retorno = false;
        $.ajax({
            type: "POST",
            url: "QuestionarioEditar.aspx/ValidaDificuldade",
            data: JSON.stringify({ pID: idQuestionario, pAmostra: amostra }),
            timeout: 999999,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data) {
                    
                var msg = "";
                $.each(data.d, function (i, item) {
                    if (item.QTD < 0) {
                    
                        if (msg != "") {
                            msg += " <br>";
                        }
                        msg += "- Dificuldade " + item.DESCRICAO + ": disponíveis = " + item.QTD_PERGUNTASNABASE + ", selecionadas = " + item.QTD_DIFICULDADECADASTRADA + ".";
                    }
                });

                if (msg != "") {
                    bootbox.alert({
                        title: 'Atenção', message: "Não foram encontradas perguntas suficientes na base do questionário para atender à amostra de perguntas por dificuldade selecionada:<br><br>" + msg,
                    });

                    return false;
                }

                ret = true;

            },
            error: function (xhr, ajaxOptions, thrownError) {
                bootbox.alert({
                    title: 'Erro',
                    message: JSON.parse(xhr.responseText).Message,
                });
            }
        });

        return ret;
    }
  
}

//carrega a pagina de Perguntas
function carregaGridPerguntas(ID_QUEST, tableLayout) {
    $(location).attr('href', 'QuestionarioPergunta.aspx?ID_QUESTIONARIO=' + ID_QUEST);
}

//Validações ao incluir informação no Grid de Dificuldade
function ValidaSalvarResposta() {
    $('#progress').css('display', 'block');

    var dificuldade = $("#ddlDificuldade").val();
    if ($("#ddlDificuldade").val() == "") {
        bootbox.alert({ title: 'Atenção', message: "Informe a dificuldade das perguntas." });

        $("#ddlDificuldade").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    var qtd = $("#txtDescResposta").val();
    if ($("#txtQtdPergunta").val() == "") {
        bootbox.alert({ title: 'Atenção', message: "Informe a quantidade de perguntas." });

        $("#txtQtdPergunta").focus();
        $('#progress').css('display', 'none');
        return false;
    }

    var adicionar = true;

    //Verifica se a dificuldade já esta no grid
    tableResp.rows().eq(0).each(function (index) {
        var row = tableResp.row(index);
        var dataTela = row.data();

        if (dataTela.CODIGO == $("#ddlDificuldade").val()) {
            adicionar = false;
        }
    });

    if (adicionar) {
        var data = JSON.stringify({ DESCRICAO: $("#ddlDificuldade :selected").text(), QTD: $("#txtQtdPergunta").val(), CODIGO: $("#ddlDificuldade").val() });

        var retorno = $.parseJSON(data);
        tableResp.row.add(retorno);
        tableResp.draw();

        $("#ddlDificuldade").val('');
        $("#txtQtdPergunta").val('');
    } else {
        bootbox.alert({ title: 'Atenção', message: "Dificuldade já cadastrada!" });

    }
}

//Pega a mensagem do Parametro (Mensagem de erro) 
function msgErro() {
    $.ajax(
        {
            type: "POST",
            url: "QuestionarioEditar.aspx/mensagemParametroErro",
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $.each(data.d, function (i, item) {
                    if (item.VALOR_SUGESTAO != "") {
                        $("#txtMensagemFalha").val(item.VALOR_SUGESTAO);
                    }
                    else {
                        $("#txtMensagemFalha").val('');
                    }
                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                bootbox.alert({
                    title: 'Erro',
                    message: JSON.parse(xhr.responseText).Message,
                });
                $('#progress').css('display', 'none');
                return false;
            }
        });
}

//Pega a mensagem do Parametro (Mensagem de Sucesso)
function msgSucesso() {
    $.ajax(
        {
            type: "POST",
            url: "QuestionarioEditar.aspx/mensagemParametroSucesso",
            data: JSON.stringify({}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                $.each(data.d, function (i, item) {
                    if (item.VALOR_SUGESTAO != "") {
                        $("#txtMensagemSucesso").val(item.VALOR_SUGESTAO);
                    }
                    else {
                        $("#txtMensagemSucesso").val('');
                    }

                });
            },
            error: function (xhr, ajaxOptions, thrownError) {
                bootbox.alert({
                    title: 'Erro',
                    message: JSON.parse(xhr.responseText).Message,
                });
                $('#progress').css('display', 'none');
                return false;
            }
        });
    return false;
}

//habilita amostra de pergunta
function alteraAmostraPergunta() {
    
   
    if ($("#ddlAmostraPergunta").val() == "1") {
        $("#txtQtdPergunta").removeAttr("disabled");
        $("#ddlDificuldadeQuest").removeAttr("disabled");
        $("#btnAdicionarResposta").removeAttr("disabled");
    } else {
        $("#txtQtdPergunta").prop('disabled', 'disabled');
        $("#txtQtdPergunta").val('');
        $("#ddlDificuldadeQuest").prop('disabled', 'disabled');
        $("#ddlDificuldadeQuest").val('');
        $("#btnAdicionarResposta").prop("disabled", 'disabled');

        tableResp.clear().draw();
    }
    return false;
}

//habilita qtd tent extra se Permitir tent extra estiver como sim
function alteraPermiteTentExtra() {
    if ($("#ddlTentExtra").val() == "-2") { // SIM
        $("#txtQtdExtra").removeAttr("disabled");
        $("#txtQtdExtra").val('');
        $("#ddlRefazerModulo").removeAttr("disabled");
        $("#ddlRefazerModulo").val('0');
    } else if ($("#ddlTentExtra").val() == "-1") { // INFINITO
        $("#txtQtdExtra").prop('disabled', 'disabled');
        $("#txtQtdExtra").val('- -');
        $("#ddlRefazerModulo").removeAttr("disabled");
        $("#ddlRefazerModulo").val('0');
    } else if ($("#ddlTentExtra").val() == "0") { // NÃO
        $("#txtQtdExtra").prop('disabled', 'disabled');
        $("#txtQtdExtra").val('0');
        //$("#ddlRefazerModulo").prop('disabled', 'disabled');
        $("#ddlRefazerModulo").val('0');
    } else { // VAZIO
        $("#txtQtdExtra").prop('disabled', 'disabled');
        $("#txtQtdExtra").val('- -');
        $("#ddlRefazerModulo").prop('disabled', 'disabled');
        $("#ddlRefazerModulo").val('');
    }
    return false;
}

//habilita campo de tempo correspondente
function alteraControleTempo(loading) {
    $("#txTempoMaxProva").prop('disabled', 'disabled');
    $("#txTempoMaxResp").prop('disabled', 'disabled');

    if ($("#ddlControleTempo").val() == "1") { // PROVA
        $("#txTempoMaxProva").removeAttr("disabled");
        if (loading == null) {
            $("#txTempoMaxProva").val('');
        }
        $("#txTempoMaxResp").val('- -');
    } else if ($("#ddlControleTempo").val() == "2") { // RESPOSTA
        $("#txTempoMaxProva").val('- -');
        if (loading == null) {
            $("#txTempoMaxResp").val('');
        }
        $("#txTempoMaxResp").removeAttr("disabled");
    } else { // ITEM INVÁLIDO
        $("#txTempoMaxProva").val('');
        $("#txTempoMaxResp").val('');
    }
    return false;
}

//habilita sorteio por dificuldade
function alteraEmbPergunta() {
    if ($("#ddlEmbPergunta").val() == "1") { // SIM
        $("#ddlAmostraPergunta").removeAttr("disabled");
    } else { // NÃO
        $("#ddlAmostraPergunta").prop('disabled', 'disabled');
        $("#ddlAmostraPergunta").val('0');
    }
    alteraAmostraPergunta();
    return false;
}
