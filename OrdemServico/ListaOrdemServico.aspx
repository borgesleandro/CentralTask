<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ListaOrdemServico.aspx.cs" Inherits="CentralTask.OrdemServico.ListaOrdemServico" %>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">

    <script src="https://www.gstatic.com/firebasejs/5.0.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.0.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.0.1/firebase-firestore.js"></script>


    <script src='<%= ResolveUrl("~/Scripts/funcoes.js")%>'></script>
    <script src='<%= ResolveUrl("~/Scripts/jquery-ui-1.11.4.min.js")%>'></script>
    <script src='<%= ResolveUrl("~/Scripts/datatable/jquery.dataTables.min.js")%>'></script>
    <script src='<%= ResolveUrl("~/Scripts/datatable/jquery.dataTables.defaults.js")%>'></script>
    <link rel="stylesheet" href="<%= ResolveUrl("~/Content/themes/Bootstrap_RNN/css/estilos.css?cache=" + DateTime.Now.ToString("yyyyMMddHHmmss") )%>" />



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
        var table;
        var docSolicitacao;
        var docMedicao;
        var docContrato;
        var docEmpreendimento;
        var docUnidades;

        const firestore = firebase.firestore();
        const settings = {/* your settings... */ timestampsInSnapshots: true };
        firestore.settings(settings);

        $(document).ready(function () {
            docSolicitacao = firestore.collection("solicitacao");
            docMedicao     = firestore.collection("medicao");
            docContrato = firestore.collection("contratos");
            docEmpreendimento = firestore.collection("empreendimento_obra");
            carregarComboUnidades();
         //   carregarComboContrato();
          //  carregarComboObra();

            CarregarPagina(docSolicitacao);
 
            LayoutTabela();
        });

        function AbrirModal(pNomeClass) {
            $('.' + pNomeClass).click();
        }
        function FecharModal(pNomeButton) {
            $("#" + pNomeButton).click();
        }
        function limitaTextarea(textBox, tam) {
            quantidade = tam;
            total = textBox.value.length;
            if (total > quantidade) {
                document.getElementById(textBox.id).value = textBox.value.substr(0, quantidade);
            }
        }
        function checkTextAreaMaxLength(textBox, e, length) {
            var mLen = textBox["MaxLength"];
            if (null == mLen)
                mLen = length;

            var maxLength = parseInt(mLen);
            if (!checkSpecialKeys(e)) {
                if (textBox.value.length > maxLength - 1) {
                    if (window.event)//IE
                        e.returnValue = false;
                    else//Firefox
                        e.preventDefault();
                }
            }
        }

        function checkSpecialKeys(e) {
            if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
                return false;
            else
                return true;
        }


        function LayoutTabela() {
            table = $("#tbResult").DataTable({
                "sPaginationType": "full_numbers",
                "bPaginate": true,
                "bAutoWidth": false,
                "bProcessing": false,
                "bServerSide": false,
                "bSort": true,
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
 //                       console.log(doc.id, '=>', doc.data());

                        var style = "";
                        html += "<tr>";
                        html += "    <td style='text-align:center;width: 5%;'>" + doc.data().id + "</td>";
                        html += "    <td style='text-align:center;width: 30%;'>" + doc.data().contrato + "</td>";
                        html += "    <td style='text-align:left;width: 30%;'>" + doc.data().cliente + "</td>";
                        html += "    <td style='text-align:left;width: 5%;'>" + doc.data().numos + "</td>";
                        html += "    <td style='text-align:left;width: 10%;'>" + doc.data().dt_emissao + "</td>";
                        html += "    <td style='text-align:left;width: 5%;'>" + doc.data().dt_recepcao + "</td>";
                        html += "    <td style='text-align:left;width: 10%;'>" + doc.data().operador + "</td>";
                        html += "    <td style='text-align:left;width: 5%;'>" + doc.data().situacao + "</td>";
                        html += "</tr>";
                    });
                    $("#tBodyConsulta").html(html);
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });


        }

        function NovaOS() {
            AbrirModal('AbreModalAddPerg');
        }

        function Limpar() {
        }

        function carregarComboContrato() {
            //CONTRATO
            var combo = $("#<%=ddlContrato.ClientID %>");
            combo.empty();
            combo.append("<option value=''></option>")

            var allContratos = docContrato
                .get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        console.log(doc.id, '=>', doc.data());
                        combo.append("<option value='" + doc.data().number + "'>" + "CT/" + doc.data().number + "</option>")
                    });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        }

        function carregarComboObra() {
            //EMPREENDIMENTO
            var comboObra = $("#<%=ddlEmpreendimentoObra.ClientID %>");
            comboObra.empty();
            comboObra.append("<option value=''></option>")

            var allObra = docEmpreendimento
                .get()
                .then(snapshot => {
                    snapshot.forEach(docObra => {
                        console.log(docObra.id, '=>', docObra.data());
                        comboObra.append("<option value='" + docObra.data().id + "'>" + docObra.data().name + "</option>")
                    });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        }

        function carregarComboUnidades() {

            var teste = firebase.firestore().collection('contratos').doc('documentID')
            console.log(teste);

        }


    </script>

    <!--Filtros-->
    <div class="container" style="margin-top: 20px">

       <div class="col-md-12 col-xs-12" style="text-align: right">
            <div class="form-group">
                <label for="">&nbsp;</label>
                <input type="button" onclick="NovaOS();" value="Nova O.S" />
            </div>
        </div>

        <!--Grid-->
        <div class="col-md-12 col-xs-12" id="divrolagem">
            <table id="tbResult" class="table table-striped table-condensed table-bordered table-hover" style="width: 100%" border="1">
                <thead>
                    <tr>
                        <th style="width: 10%; text-align: center;">Id</th>
                        <th style="width: 30%; text-align: center;">Contrato</th>
                        <th style="width: 30%; text-align: center;">Cliente</th>
                        <th style="width: 5%; text-align: center;">O.S</th>
                        <th style="width: 5%; text-align: center;">Emitida</th>
                        <th style="width: 5%; text-align: center;">Recebida</th>
                        <th style="width: 10%; text-align: center;">Operador</th>
                        <th style="width: 5%; text-align: center;">Situacao</th>
                    </tr>
                </thead>
                <tbody id="tBodyConsulta">
                </tbody>
            </table>
        </div>

        <a id="A2" href="#mAddPergunta" data-toggle="modal" data-backdrop="static" aria-expanded="false" aria-controls="collapseDados" runat="server" class="AbreModalAddPerg" />
        <div class="modal modal2 fade bs-example-modal-lg " id="mAddPergunta" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <asp:Button type="button" ID="btnFechaAddQuest" class="close" data-dismiss="modal" aria-label="Close" runat="server" Text="&times;"></asp:Button>
                        <h4 class="modal-title" id="H2">Cadastro de Ordem de Serviço</h4>
                    </div>
                    <div class="modal-body row">
                        <div class="col-md-12">
                            <div class="row">
                                <div class="col-md-2">
                                    <div class="form-group">
                                        <label for="">Sequencial</label>
                                        <asp:Label CssClass="form-control" ID="lblSequencial" ClientIDMode="Static" runat="server"></asp:Label>
                                    </div>
                                </div>
                                <div class="col-md-10">
                                    <div class="form-group">
                                        <label for="">Contrato</label>
                                        <asp:DropDownList ID="ddlContrato" CssClass="form-control" ClientIDMode="Static" runat="server">
                                        </asp:DropDownList>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 col-xs-12">
                                    <div class="form-group">
                                        <label for="">Obra</label>
                                         <asp:DropDownList ID="ddlEmpreendimentoObra" CssClass="form-control" ClientIDMode="Static" runat="server">
                                        </asp:DropDownList>                                    

                                    </div>
                                </div>
                                <div class="col-md-6 col-xs-12">
                                    <div class="form-group">
                                        <label for="">O.S</label>
                                        <asp:Label CssClass="form-control" ID="lblOs" ClientIDMode="Static" placeholder="O.S" runat="server"></asp:Label>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 col-xs-12">
                                    <div class="form-group">
                                        <label for="">Unidade</label>
                                        <asp:TextBox CssClass="form-control" ID="txtUnidade" ClientIDMode="Static" placeholder="Unidade" runat="server"></asp:TextBox>
                                    </div>
                                </div>
                                <div class="col-md-6 col-xs-12">
                                    <div class="form-group">
                                        <label for="">Local/Setor</label>
                                        <asp:TextBox CssClass="form-control" ID="txtLocalsetor" ClientIDMode="Static" placeholder="Local/Setor" runat="server"></asp:TextBox>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 col-xs-12">
                                    <div class="form-group">
                                        <label for="">Solicitante</label>
                                        <asp:TextBox CssClass="form-control" ID="txtSolicitante" ClientIDMode="Static" placeholder="Solicitante" runat="server"></asp:TextBox>
                                    </div>
                                </div>
                                <div class="col-md-6 col-xs-12">
                                    <div class="form-group">
                                        <label for="">Telefone</label>
                                        <asp:TextBox CssClass="form-control" ID="txtTelefone" ClientIDMode="Static" placeholder="Telefone" runat="server"></asp:TextBox>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                    <div class="col-md-6 col-xs-12">
                                        <div class="form-group">
                                            <label for="">Data</label>
                                            <asp:TextBox CssClass="form-control" ID="txtData" ClientIDMode="Static" placeholder="Data" runat="server"></asp:TextBox>
                                        </div>
                                    </div>
                                <div class="col-md-6 col-xs-12">
                                    <div class="form-group">
                                        <label for="">Hora </label>
                                        <asp:TextBox CssClass="form-control" ID="txtHora" ClientIDMode="Static" placeholder="Hora" runat="server"></asp:TextBox>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12 col-xs-12" style="text-align: right">
                                    <div class="form-group">
                                        <label for="">&nbsp;</label>
                                        <input id="btnSalvar" type="button" value="Salvar" class="btn btn-primary" onclick="$('#arquivo').click()" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>
