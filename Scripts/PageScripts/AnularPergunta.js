var pagina = { dtPrincipal: null };

$(function (){

    pagina.dtPrincipal =
        LayoutTabela("");/*somente ativas*/

    $('#tbAssociacoes').on('click', "#chkMarcarTodos",
        function ()
        {
            $(".chkAssociacao",
                $("#tbAssociacoes").dataTable().fnGetNodes()
             ).prop("checked",
                $("#chkMarcarTodos").is(":checked")
            );
        }
    );

    $('body')
      .on('mousedown', '.popover', function (e)     // Evita que 
      {                                             // o popover
          console.log("clicked inside popover")     // feche quando
          e.preventDefault()                        // o click é dentro
      });                                           // dele

    $('#btnConfirmarAnular').on('click', ExecutarAnular);

});

function ExecutarAnular()
{
    if (OFormEValido()) 
    {
        $('#btnConfirmarAnular')
            .prop('disabled', true);
        var questionariosSelecionados = 
            $(".chkAssociacao:checked",
                $("#tbAssociacoes").dataTable().fnGetNodes()
             ).map((x, y) =>y.value).toArray();
        // aí vai mandar processar.
        // pIdPergunta,pMotivo,pInativar7,idQuestionarios,
        PageMethods.Anular(
            pagina.idPerguntaSelecionada,
            $('#txtMotivo').val(),
            $('#chkInativar').is(':checked'),
            questionariosSelecionados,
            function (resposta)
            {
                $('#btnConfirmarAnular')
                    .prop('disabled', false);
                bootbox.alert(
                    'Ação relizada com sucesso.',
                    function ()
                    {
                        $("#tbAssociacoes").DataTable().ajax.reload(null, true);
                        $('#txtMotivo').val('');
                        $("#tbResult").DataTable().ajax.reload(null, true);
                    }
                );
            },
            function ()
            {
                alert('Ocorreu um erro.');
                $('#btnConfirmarAnular')
                    .prop('disabled', false);
            }
        );

    }
}

function OFormEValido()
{
    var retorno = true;
    var arrMsg = [];
    var qtdMarcados = $(".chkAssociacao:checked", $("#tbAssociacoes").dataTable().fnGetNodes()).length;

    if (qtdMarcados === 0)
    {
        arrMsg.push('<li>Selecione ao menos uma associação com o questionário.');
        retorno =  false;
    }

    if ($('#txtMotivo').val().trim().length < 40)
    {
        arrMsg.push('<li>Informe um motivo com ao menos 40 carácteres.');
        setTimeout(function () { $('#txtMotivo').focus(); }, 300);
        retorno =  false;
    }

    if (!retorno)
    {
        bootbox.alert(arrMsg.join('<br/>'));
    }

    return retorno;
}

function FiltraDtPrincipal(val)
{
    pagina.dtPrincipal.columns(7).search(
        val == "" ? "" : val == "1" ? "SIM" : "NÃO"
    ).draw();
}


function PopAnularPergunta(row)
{
    abrirProgress();

    var dados = pagina.dtPrincipal.rows(row).data()[0];
    var id_pergunta = dados.ID_PERGUNTA;
    var ds_pergunta = dados.DS_PERGUNTA;

    $('#txtMotivo').val('');

    var fl_ativo = dados.ATIVO;
    LayoutTabelaAssociacoes(id_pergunta, ds_pergunta, fl_ativo)
        .then(function (dados)
        {
            fecharProgress();
            $('#modalAnular').modal('show');
        });


}


function LayoutTabelaAssociacoes(id_pergunta, ds_pergunta, fl_ativo)
{
    var def = $.Deferred();

    $('#ctIdPerguntaSelecionada').text(
        pagina.idPerguntaSelecionada = id_pergunta
    ); // Sim eu quero atribuir mesmo
    if ("SIM" === fl_ativo) {
        $('#chkInativar').prop('disabled', false).prop('checked', true);
    }
    else
    {
        $('#chkInativar').prop('disabled', true).prop('checked', true);
    }

    $('#txtDetalhePergunta').val(ds_pergunta);
    
    $('#tbAssociacoes').on( 'init.dt', function () {
        
        

        $(".chkAssociacao",
            $("#tbAssociacoes").dataTable().fnGetNodes()
        ).prop("checked",
            true
        );

        $('[data-toggle="popover"]',
            $("#tbAssociacoes").dataTable().fnGetNodes()
        ).popover({html:true});

        def.resolve();
        
    } );

    $("#tbAssociacoes").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bAutoWidth": false,
        "oLanguage": {
            "sEmptyTable": "A pergunta não está associada a nenhum questionário.",
        },
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": true,
        "bDestroy": true,
        "columnDefs": [
               {
                   "width": "18px",
                   "autoWidth": false,
                   "targets": [0],
                   "data": null,
                   "title": "<input type='checkbox' id='chkMarcarTodos' checked/>",
                   "className": "dt-center dt-middle",
                   "render": function (data, type, full, meta)
                   {
                       if (type === 'display' && !data.DT_HORA) {
                           return '<input class="chkAssociacao" value="'+data.ID_QUESTIONARIO+'" type="checkbox" />';
                       }
                       return '';
                   }
               },
               {
                   "autoWidth": true,
                   "targets": [1],
                   "data": "DS_QUESTIONARIO",
                   "title": "Questionário"
               },
               {
                   "autoWidth": true,
                   "targets": [2],
                   "data": "STATUS_QUESTIONARIO",
                   "title": "Situação Quest."
               },
                {
                    "autoWidth": true,
                    "targets": [3],
                    "data": "ACAO",
                    "title": "Ação"
                },
                {
                    "autoWidth": true,
                    "targets": [4],
                    "data": "DT_HORA",
                    "title": "Data"
                },
                {
                    "autoWidth": true,
                    "targets": [5],
                    "data": "USUARIO",
                    "title": "Usuário Ação"
                }
                ,
                {
                    "autoWidth": false,
                    width:'30%',
                    "targets": [6],
                    "data": "DS_MOTIVO",
                    "title": "Motivo",
                    "render": function (data)
                    {
                        if (data) {
                            return '<button type="button" data-trigger="focus" class="btn btn-block truncate"  data-placement="left" data-toggle="popover" href="javascript:void(0);" title="Motivo" data-content="<textarea class=txtMotivo>' + data + '</textarea>" >' + data + '</button>';
                        }
                        return '';
                    }
                }
        ],
        "ajax": {
            "type": "POST",
            "url": "AnularPergunta.aspx/CarregarAssociacaoPergunta",
            "data": function (d)
            {
                return JSON.stringify({ idPergunta: id_pergunta});
            },
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json)
            {
                return json.d;
            }
        },
    });
    

    //setTimeout(
    //    () =>def.resolve(),
    //    3000
    //);

    return def.promise();
}


function LayoutTabela(pStatus)
{
    $("#tbResult").one("draw.dt", function ()
    {

        var filtroStatus = $(
'<div class="form-inline" style="float:left;margin-left: 4px;font-weight: normal;"> \
  | <label style="font-weight: normal"> \
        Situação:\
        <select class="form-control"\
            onchange="FiltraDtPrincipal(this.value);"\
            id="ddlStatus">\
            <option selected value="">Todas</option>\
            <option selected value="1">Ativos</option>\
            <option value="2">Inativos</option>\
        </select>\
  </label>\
</div>');
        $("#tbResult_length").after(filtroStatus);
    });

    $('#tbResult').on('init.dt', function ()
    {
        FiltraDtPrincipal("1");
    });
    
    var pergunta = "";
    var retorno = $("#tbResult").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": true,
        "bDestroy": true,
        ordering: true,
        "order": [[ 1, "asc" ]],
        "columnDefs": [
               {
                   "width": "5%",
                   "autoWidth": false,
                   "targets": [0],
                   "data": null,
                   "title": "",
                   "orderable":false,
                   "className": "dt-center dt-middle",
                   "render": function (data, type, full, meta)
                   {
                       //console.log(meta);
                       var html = "<a href='javascript:void(0);' onclick='PopAnularPergunta(" + meta.row + ");'><i class='glyphicon glyphicon-ban-circle' data-toggle='tooltip' data-placement='right' title='Anular'></i></a>";
                       //html += "<a href='#' onclick='ExcluirRegistroPerg(" + data.ID_PERGUNTA + ");'><i class='fa fa-trash' data-toggle='tooltip' data-placement='right' title='Excluir'></i></a>";
                       return html;
                   }
               },
               {
                   "width": "5%",
                   "autoWidth": false,
                   "targets": [1],
                   "data": "ID_PERGUNTA",
                   "title": "Código"
               },
               {
                   "width": "25%",
                   "autoWidth": false,
                   "targets": [2],
                   "data": "DS_TOPICO",
                   "title": "Tópico"
               },
                {
                    "width": "45%",
                    "autoWidth": false,
                    "targets": [3],
                    "data": "DS_PERGUNTA",
                    "title": "Descrição"
                },
                {
                    "width": "10%",
                    "autoWidth": false,
                    "targets": [4],
                    "data": "DS_PERGUNTA_TIPO",
                    "title": "Tipo"
                },
                {
                    "width": "10%",
                    "autoWidth": false,
                    "targets": [5],
                    "data": "QTD_EM_USO",
                    "title": "Associações"
                },
                {
                    "width": "5%",
                    "autoWidth": false,
                    "targets": [6],
                    "data": "ATIVO",
                    "title": "Ativo"
                }
        ],
        "ajax": {
            "type": "POST",
            "url": "AnularPergunta.aspx/CarregarListaPergunta",
            "data": function (d)
            {
                return JSON.stringify({ pPergunta: pergunta, pAtivo: pStatus });
            },
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json)
            {
                return json.d.lista;
            }
        },
    });
    return retorno;
}