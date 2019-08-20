<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="ListaOrdemServico.aspx.cs" Inherits="CentralTask.OrdemServico.ListaOrdemServico" %>

<asp:Content ID="Content3" ContentPlaceHolderID="MainContent" runat="server">

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
            docMedicao = firestore.collection("medicao");
            docContrato = firestore.collection("contratos");
            docEmpreendimento = firestore.collection("empreendimento_obra");
            //carregarComboContrato();
            //carregarComboUnidades();
            //carregarComboObra();
            CarregarPagina(docSolicitacao);
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
                        html += "    <td>" + doc.data().id + "</td>";
                        html += "    <td>" + doc.data().contrato + "</td>";
                        html += "    <td>" + doc.data().cliente + "</td>";
                        html += "    <td>" + doc.data().numos + "</td>";
                        html += "    <td>" + doc.data().dt_emissao + "</td>";
                        html += "    <td>" + doc.data().dt_recepcao + "</td>";
                        html += "    <td>" + doc.data().operador + "</td>";
                        html += "    <td>" + doc.data().situacao + "</td>";
                        html += "    <td>" + doc.data().cod_medicao + "</td>";
                        html += "</tr>";
                    });
                    $("#tBodyConsulta").html(html);
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
        }

        function NovaOS() {
            $('.ui.modal')
                .modal('show', true)
             ;
        }

        function Limpar() {
        }


     <%--   function carregarComboContrato() {
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
        }--%>

        function carregarComboUnidades() {
        }


    </script>

    <!--Filtros-->

    <div class="ui container">
        <p>
            <button id="btnNovo" onclick="NovaOS();" class="ui blue button">Nova O.S</button>
        </p>
        <table class="ui very compact table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Contrato</th>
                    <th>Cliente</th>
                    <th>O.S</th>
                    <th>Emitida</th>
                    <th>Recebida</th>
                    <th>Operador</th>
                    <th>Situacao</th>
                    <th>Medicão</th>
                </tr>
            </thead>
            <tbody id="tBodyConsulta">
            </tbody>
        </table>

        <div class="ui modal">
            <i class="close icon"></i>
            <div class="header">
                Profile Picture
            </div>
            <div class="image content">
                <div class="description">
                    <div class="ui header">We've auto-chosen a profile image for you.</div>
                    <p>We've grabbed the following image from the <a href="https://www.gravatar.com" target="_blank">gravatar</a> image associated with your registered e-mail address.</p>
                    <p>Is it okay to use this photo?</p>
                </div>
            </div>
            <div class="actions">
                <div class="ui black deny button">
                    Nope
                </div>
                <div class="ui positive right labeled icon button">
                    Yep, that's me
                     <i class="checkmark icon"></i>
                </div>
            </div>
        </div>


    </div>



</asp:Content>
