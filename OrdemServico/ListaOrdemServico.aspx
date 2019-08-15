<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ListaOrdemServico.aspx.cs" Inherits="CentralTask.OrdemServico.ListaOrdemServico" %>


<asp:Content ID="Content1" ContentPlaceHolderID="MainContent" runat="server">



<script src="https://www.gstatic.com/firebasejs/5.0.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.0.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.0.1/firebase-firestore.js"></script>

<script>

var firebase;
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBCLaAPVlPQfhIM4BD-aSIaq8psbYTEePA",
    authDomain: "tasking-management.firebaseapp.com",
    databaseURL: "https://tasking-management.firebaseio.com",
    projectId: "tasking-management",
    storageBucket: "tasking-management.appspot.com",
    messagingSenderId: "902403607931",
    appId: "1:902403607931:web:28d9bb28216f811e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

</script>


<script type="text/javascript">

    var db;

    $(document).ready(function () {

        db = firebase.firestore();
        var docRef = db.collection("solicitacao");
        CarregarPagina(docRef);
    });

    function AbrirModal(pNomeClass) {
        $('.' + pNomeClass).click();
    }
    function FecharModal(pNomeButton) {
        $("#" + pNomeButton).click();
    }



    function LayoutTabela() {
        tableLayout = $("#tbResult").DataTable({
            "sPaginationType": "full_numbers",
            "bPaginate": true,
            "bAutoWidth": false,
            "bProcessing": false,
            "bServerSide": false,
            "bSort": false,
            "bFilter": true,
            "bLengthChange": true,
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
            },
        });
    }

    function CarregarPagina(docRef) {

        $("#tBodyConsulta").empty();
        var html = "";

        var allCities = docRef
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());

                    var style = "";
                    html += "<tr>";
                    html += "    <td style='text-align:center;'>" + doc.data().id + "</td>";
                    html += "    <td style='text-align:center;'>" + doc.data().contrato + "</td>";
                    html += "</tr>";
                });
                $("#tBodyConsulta").html(html);
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    function Limpar() {


    }


</script>

    <!--Filtros-->
    <div class="container">
        <div class="well">
            <div class="row">
                
                    <asp:HiddenField ID="txtIDProduto" ClientIDMode="Static" runat="server" Value="" />
                    <div class="col-md-1 col-xs-12">
                        <div class="form-group">
                            <label>Código</label>
                            <asp:TextBox runat="server" class="form-control" ID="txtCodigo" AutoPostBack="false" MaxLength="20"></asp:TextBox>
                        </div>
                    </div>

                    <div class="col-md-2 col-xs-12">
                        <div class="form-group" style="margin-top: 10px">
                            <asp:Button ID="btnNovo" runat="server" Text="Novo" class="btn btn-primary btn-bottom" OnClientClick="Limpar();return false;" />
                        </div>
                    </div>
                </div>
        </div>

        <!--Grid-->
      
            <table id="tbResult" class="table table-striped table-condensed table-bordered table-hover" style="width:100%" border="1" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th style="width: 18%;">Id</th>
                        <th style="width: 18%;">Contrato</th>
                   </tr>
                </thead>
                <tbody id="tBodyConsulta">
                </tbody>
            </table>
       
    </div>



</asp:Content>
