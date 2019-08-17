

    function ChangeLabelTipoArquivo(tipoDeCarregamento) {

        var label = $("#labelTipoArquivo");
        var fup = $("#file-apresentacao");

        if (tipoDeCarregamento === "D") {
            $("#labelTipoArquivo").html("(Arquivos ZIP somente)");
            fup.attr('accept', '.zip');
        }
        else if (tipoDeCarregamento === "I") {
            $("#labelTipoArquivo").html("(Arquivos ZIP ou  PDF)");
            fup.attr('accept', '.zip, .pdf');
        }
        else {
            console.log("Tem algo muito errado Sr. desenv");
        }
    }


    //$('#file-apresentacao').fileupload({
    //    url: 'UploadApresentacao.aspx?upload=start',
    //    add: function (e, data) {
    //        var files = data.files || data.fileInput.context.files;
    //        if (!OBriefingEValido(files)) {
    //            $("#lblCaminhoApresentacao").text("");
    //            fileUploadData = "";
    //            return false;
    //        }
    //        fileUploadData = data;
    //        $("#lblCaminhoApresentacao").text(files[0].name);

    //        //console.log('add', data);
    //        $('#progressbar').show();
    //        data.submit();
    //    },
    //    progress: function (e, data) {
    //        var progress = parseInt(data.loaded / data.total * 100, 10);
    //        $('#progressbar div').css('width', progress + '%');
    //    },
    //    success: function (response, status) {
    //        if (status == "success") {
    //            AtualizarPathArquivoBriefing($("#hdfID_APRESENTACAO_CENARO").val(), response);
    //        }
    //        else {
    //            alert(response);
    //        }
    //        //$("#progressbar").progressbar().hide();
    //        $('#progressbar').hide();
    //        $('#progressbar div').css('width', '0%');
    //        console.log('success', response);
    //    },
    //    error: function (error) {
    //        alert(error);
    //        $('#progressbar').hide();
    //        $('#progressbar div').css('width', '0%');
    //        console.log('error', error);
    //    }
    //});


    function ValidacaoArquivo() {
        var isValid = true;
        var arquivo = $('#file-apresentacao').val();
        var extRegex = /(pdf|zip)$/ig;
        if (!(extRegex.test(arquivo))) {
            if (arquivo.length === 0)
                Alert("Selecione um arquivo.", "fileUpload");
            else
                Alert("O arquivo de upload deve ser em formato ZIP ou PDF.", "fileUpload");
            isValid = false;
        }
        if (!isValid) {
            return;
        }
    }


