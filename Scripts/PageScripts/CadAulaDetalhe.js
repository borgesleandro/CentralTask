$(document).ready(function () {

    $('#fileUpload').on("change", function () {
        var arquivo = $('#fileUpload')[0];
        if (arquivo.files.length > 0) {
            $('#txtNomeArquivo').val(arquivo.files[0].name);
        }
    });

});

function SetTipo(fUP) {
    var nomeArquivo = fUP.files[0].name;
    var parts = nomeArquivo.split('.');
    var extensao = parts[parts.length - 1].toLocaleLowerCase();

    var ddlTipo = $('#ddlTipo');

    switch (extensao) {
        case 'jpg':
        case 'jpeg':
            ddlTipo.val(7);
            break;
        case 'png':
            ddlTipo.val(8);
            break;
        case 'doc':
        case 'docx':
            ddlTipo.val(2);
            break;
        case 'xls':
        case 'xlsx':
            ddlTipo.val(3);
            break;
        case 'mp4':
            ddlTipo.val(5);
            break;
        case 'pdf':
            ddlTipo.val(1);
            break;
        case 'ppt':
        case 'pptx':
            ddlTipo.val(4);
            break;
        case 'zip':
        case 'htm':
        case 'html':
            ddlTipo.val(6);
            break;
        default:
            ddlTipo.val("");
            break;
    }
    ddlTipo.trigger('change');
}



function OpenDialogForCrop(fileUpload) {
    GetImageFromInputFile(fileUpload).then(
        function (imgData) {
            OpenBootboxWithCroppedCanvas(imgData).then(
                function (dataUrl) {
                    capaSelecionada =
                        dataURItoBlob(
                            dataUrl
                        );

                    $('#imgCapa').attr('src', dataUrl);
                    $('#msgCapa').text(
                        'Capa selecionada pelo usuário'
                    ).fadeOut(500).fadeIn(500).fadeOut(500)
                        .fadeIn(500).fadeOut(500).fadeIn(500);


                }
            );
        },
        function (erro) {

        }
    );
}

function GetImageFromInputFile(fileUpload) {
    var dfd = $.Deferred();

    //   var tgt = evt.target || window.event.srcElement,
    var files = fileUpload.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            //document.getElementById('imgCropCanvas').src =;
            dfd.resolve(fr.result);
        }
        fr.readAsDataURL(files[0]);
    }
    else {
        dfd.reject("Não suportado");
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }

    return dfd.promise();
}


function OpenBootboxWithCroppedCanvas(data) {
    var $image;
    var dfd = $.Deferred();
    //var cropper;
    var dialog = bootbox.dialog({
        title: 'Ajuste a imagem',
        message: "<img id='imgCanvas'    src='" + data + "'/>",
        size:'large',
        buttons: {
            cancel: {
                label: "Cancelar",
                className: 'btn-danger',
                callback: function () {
                    dfd.reject();
                }
            },
            ok: {
                label: "Confirmar",
                className: 'btn-info',
                callback: function () {
                    window.cpCanvas = $image.cropper('getCroppedCanvas');
                    dfd.resolve(
                        $image.cropper('getCroppedCanvas').toDataURL('image/png')
                    );
                }
            }
        }
    });

    dialog.init(

      function () {
          setTimeout(function () {
              $image = $('#imgCanvas');

              $image.cropper({
                  aspectRatio: 4 / 3.0,
                  crop: function (event) {
                  },
                  ready: function () {

                      $image.cropper('setCropBoxData', { width: 400, height: 300 });

                  }

              });
          }, 250);

      }
    );

    return dfd.promise();

}


function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;

}   