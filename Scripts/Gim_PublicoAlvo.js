function AbrirPublico(idevento, tipopublico,descevento, tipo) {

    $("#hIdEvento").val(idevento);
    $("#lbldescEvento").text(descevento);

   
    
    
    abrirPopPublicoAlvo(idevento, tipopublico)

   
      

    }

function loadEspecialidadePublico(idevento, tipopublico) {

    $("#hIdEvento").val(idevento);

    var json = JSON.stringify({ idEvento: idevento });


    tableEspecialidade = $("#tblEspecialidade").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bDestroy": true,
        "bAutoWidth": false,
        "lengthMenu": [5, 5],
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "bFilter": true,
        "bLengthChange": false,
        "bstateSave": true,
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
                "width": "3%",
                "autoWidth": false,
                "orderable": false,
                "targets": [0],
                "data": null,
                "title": "<input type='checkbox' class='chkSelectAllEspec'/>",
                "className": "dt-center",
                "render": function (data, type, full, meta) {
                    var html = ""
                    html = " <input id='chkTipo' type='checkbox' class='marcarEspec' " + (data.CADASTRADO == '0' ? "" : "Checked") + ($("#hTipoConsulta").val() == "GP" ? "" : " disabled") + "/>";
                    return html;
                },

            },

            {
                "width": "97%",
                "autoWidth": false,
                "targets": [1],
                "data": "DESC_ESPEC",
                "title": "Especialidade",
                "orderable": false
            },
            {

                "targets": [2],
                "data": "COD_ESPEC",
                "visible": false

            },


        ],


        "ajax": {
            "type": "POST",
            "url": "Gim_PublicoAlvo.aspx/loadEspecialidadePublico ",
            "data": function (d) {
                return json;
            },
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json) {
                var parse = JSON.stringify(json.d);
                var retorno = $.parseJSON(parse);
                ValidaTipoPublico();
                return retorno;
               
            }
        },
    });


    AddClick_PesquisaChkAllEspecialidade();    
    loadMercadoPublico(idevento, tipopublico);
   

   }

function AddClick_PesquisaChkAllEspecialidade() {
       $(".chkSelectAllEspec").on('click', function () {
           $(".marcarEspec", $('#tblEspecialidade').dataTable().fnGetNodes()).prop("checked", $(".chkSelectAllEspec").is(":checked"));
       });
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


function fnCategoria(v) {
    return v.replace(/[^\d+(\\d+?,)]?/g, "")
  
}



function loadMercadoPublico(idevento, tipopublico) {

    $("#hIdEvento").val(idevento);

    var json = JSON.stringify({ idEvento: idevento });


    tableMercado = $("#tblMercado").DataTable({
        "sPaginationType": "full_numbers",
        "bPaginate": true,
        "bDestroy": true,
        "bAutoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "bSort": false,
        "lengthMenu": [5, 5],
        "bFilter": true,
        "bLengthChange": false,
        "bstateSave": true,
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
                "width": "3%",
                "autoWidth": false,
                "orderable": false,
                "targets": [0],
                "data": null,
                "title": "<input type='checkbox' class='chkSelectAllMercado'/>",
                "className": "dt-center",
                "render": function (data, type, full, meta) {
                    var html = ""
                    html = " <input id='chkTipo' type='checkbox' class='marcarMercado' " + (data.CADASTRADO == '0' ? "" : "Checked") + ($("#hTipoConsulta").val() == "GP" && tipopublico == "E" ? "" : " disabled") + "/>";
                    return html;
                },

            },

            {
                "width": "50%",
                "autoWidth": false,
                "targets": [1],
                "data": "DESC_MERCADO",
                "title": "Mercado",
                "orderable": false
            },

            {
                "width": "47%",
                "autoWidth": false,
                "targets": [2],
                "data": null,
                "title": "Categoria",
                "className": "dt-left",
                "render": function (data, type, full, meta) {
                    var html = ""
                    html = " <input id='txtCategoria' style='width:100%' class='form-control-grid clsCategoria' onkeypress='Mascara(this,fnCategoria)' value='" + data.CATEGORIA + "' " + ($("#hTipoConsulta").val() == "GP" && tipopublico == "E" ? "" : " disabled") + " type='text'/>";
                    return html;
                },
            },

            {

                "targets": [3],
                "data": "COD_MERCADO",
                "visible": false

            },


        ],


        "ajax": {
            "type": "POST",
            "url": "Gim_PublicoAlvo.aspx/loadMercadoPublico ",
            "data": function (d) {
                return json;
            },
            "timeout": 999999,
            "contentType": "application/json; charset=utf-8",
            "dataSrc": function (json) {
                var parse = JSON.stringify(json.d);
                var retorno = $.parseJSON(parse);
                ValidaTipoPublico();
                return retorno;
            }
        },
    });

    AddClick_PesquisaChkAllMercado();
    ValidaTipoPublico();
   
  
}

function AddClick_PesquisaChkAllMercado() {
    $(".chkSelectAllMercado").on('click', function () {     
        $(".marcarMercado", $('#tblMercado').dataTable().fnGetNodes()).prop("checked", $(".chkSelectAllMercado").is(":checked"));
    });
}

function AbrirModal(pNomeClass) {
    $('.' + pNomeClass).click();
}

function abrirPopPublicoAlvo(idevento, tipopublico) {
    $("#divConteudoPublicoAlvo").html("");  


    $("#divConteudoPublicoAlvo").load("Gim_PublicoAlvo.aspx?idevento=" + idevento + " #popupPublico", function () {       
        $("#ddlTipoPublico").val(tipopublico);
        loadEspecialidadePublico(idevento, tipopublico);
        ValidaTipoPublico();
        if ($("#hTipoConsulta").val() == "GP") {
            $("#lblTipoPublico").css("display", "")
        }
       
        AbrirModal('AbreModalPublicoAlvo');
        return false;
    });


}


function VALIDARCATEGORIA() {

    var idEvento = $("#hIdEvento").val();
    var blValidou;

    var lstRET = [];
    var allRows = $("#tblMercado").dataTable().fnGetNodes();
    // Varrendo todas as linhas da TABLE PESQUISA
    $(allRows).each(function (i) {
        var chkCheck = $(this).find(".marcarMercado")
        if ($(this).find(".clsCategoria").val() != "") {
            var data = tableMercado.row($(this)).data();
          
            var categoria = $(this).find(".clsCategoria").val();

            
            var valido = /^[\d,?!]+$/.test(categoria);

            if (valido) {
                blValidou = true;
            } else {
                blValidou = false;
            }

        }
    });

    return blValidou;
  
}

function SalvarPublicoAlvo() {

    var idEvento = $("#hIdEvento").val();

    if ($("#ddlTipoPublico").val() == "") {
        alert("Informe o tipo do público alvo.");
        $('#progress').css('display', 'none');
        return false;

    }

    var blvalidou = VALIDARCATEGORIA()
    if (blvalidou == false) {
        alert("Categoria informada não pode ter caracteres diferente de números e virgula.");
        $('#progress').css('display', 'none');
        return false;

    }
      
 




    var arrayMercadosSelecionados = ListaMercadosSelecionados();
    var arrayEspecSelecionados = ListaEspecialidadeSelecionados();

    if (arrayMercadosSelecionados.length == 0 && arrayEspecSelecionados == 0 && $("#ddlTipoPublico").val() == "E") {
        alert("Selecione um mercado ou uma especialidade para adicionar ao público alvo");
        $('#progress').css('display', 'none');
        return false;
    }  


    $.ajax({
        type: "POST",
        url: "Gim_PublicoAlvo.aspx/SalvarPublicoAlvo",
        data: JSON.stringify({
            pListaMercado: arrayMercadosSelecionados,
            pListaEspec: arrayEspecSelecionados,      
            pTipopublico: $("#ddlTipoPublico").val(),
            pIdEvento: $("#hIdEvento").val()
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {         
            $('#progress').css('display', 'none');
            $("#hTipoPublico").val($("#ddlTipoPublico").val());
            FechaTelaPublico(); // para atualizar a tela anterior da onde for chamada
            
            FecharModal('btnFechaPublico');

        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(JSON.parse(xhr.responseText).Message);
            $('#progress').css('display', 'none');

        }
    });


 
}
function ListaEspecialidadeSelecionados() {

    var idEvento = $("#hIdEvento").val();

    var lstRET = [];
    var allRows = $("#tblEspecialidade").dataTable().fnGetNodes();
    // Varrendo todas as linhas da TABLE PESQUISA
    $(allRows).each(function (i) {
        var chkCheck = $(this).find(".marcarEspec")
        if (chkCheck.is(':checked')) {
            var data = tableEspecialidade.row($(this)).data();
            // Dados do datatable
            var espec = data.COD_ESPEC;            
            lstRET.push({ COD_ESPEC: espec, ID_EVENTO: idEvento });

        }
    });
    return lstRET;
}

function ListaMercadosSelecionados() {

    var idEvento = $("#hIdEvento").val();

    var lstRET = [];
    var allRows = $("#tblMercado").dataTable().fnGetNodes();
    // Varrendo todas as linhas da TABLE PESQUISA
    $(allRows).each(function (i) {
        var chkCheck = $(this).find(".marcarMercado")
        if (chkCheck.is(':checked') || $(this).find(".clsCategoria").val() != "") {
            var data = tableMercado.row($(this)).data();
            // Dados do datatable
            var mercado = data.COD_MERCADO;
            var categoria = $(this).find(".clsCategoria").val();
            lstRET.push({ COD_MERCADO: mercado, CATEGORIA: categoria, ID_EVENTO: idEvento  });

        }
    });
    return lstRET;
}


function ValidaTipoPublico() {

   

    if ($("#hTipoConsulta").val() == "GP") {

        if ($("#ddlTipoPublico").val() == "L") {

            $(".marcarMercado", $('#tblMercado').dataTable().fnGetNodes()).prop("checked", false);
            $(".marcarMercado", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", true);
            $(".chkSelectAllMercado").prop("disabled", true);
            $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).val("");
            $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", true);
          



            $(".marcarEspec", $('#tblEspecialidade').dataTable().fnGetNodes()).prop("checked", false);
            $(".marcarEspec", $('#tblEspecialidade').dataTable().fnGetNodes()).prop("disabled", true);
            $(".chkSelectAllEspec").prop("disabled", true);


        }
        else if ($("#ddlTipoPublico").val() == "E") {
            $(".marcarMercado", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", false);
            $(".marcarEspec", $('#tblEspecialidade').dataTable().fnGetNodes()).prop("disabled", false);
            $(".chkSelectAllMercado").prop("disabled", false);
            $(".chkSelectAllEspec").prop("disabled", false);
            $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).val("");
            $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", false);

        } else {

            $(".marcarEspec", $('#tblEspecialidade').dataTable().fnGetNodes()).prop("checked", false);
            $(".marcarMercado", $('#tblMercado').dataTable().fnGetNodes()).prop("checked", false);
            $(".marcarMercado", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", true);
            $(".marcarEspec", $('#tblEspecialidade').dataTable().fnGetNodes()).prop("disabled", true);
            $(".chkSelectAllMercado").prop("disabled", true);
            $(".chkSelectAllEspec").prop("disabled", true);
            $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).val("");
            $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", true);

        }

    } else {

        $("#ddlTipoPublico").prop("disabled", true);
        $(".marcarMercado", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", true);
        $(".marcarEspec", $('#tblEspecialidade').dataTable().fnGetNodes()).prop("disabled", true);
        $(".chkSelectAllMercado").prop("disabled", true);
        $(".chkSelectAllEspec").prop("disabled", true);
        $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).val("");
        $(".clsCategoria", $('#tblMercado').dataTable().fnGetNodes()).prop("disabled", true);
        $("#btnSalvarPublico").css("display", "none");
    }


}

function FecharModal(pNomeButton) {
    $("#" + pNomeButton).click();
}
