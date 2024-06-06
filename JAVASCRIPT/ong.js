document.addEventListener("DOMContentLoaded", function() {
    // Mostra o carregamento por 2 segundos
    document.getElementById("conteudo").style.display="none";
    setTimeout(function() {
        document.getElementById("loading").style.display = "none";
        document.getElementById("conteudo").style.display = "block";
    }, 1000);
});



document
    .getElementById("btn-open-side-bar")
    .addEventListener("click", function () {
        document
            .getElementById("side-bar")
            .classList.toggle("open-sidebar");
    });

function sair(event) {
    event.preventDefault();

    Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Quer mesmo sair do Sistema!?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "../HTML/apresentacao.html";
        }
    });
}

const problemaApiUrl = 'https://664d0a0cede9a2b556527d60.mockapi.io/api/v1/problema';
const ongApiUrl = 'https://664f28a4fafad45dfae29755.mockapi.io/api/v1/ong';
const projetoApiUrl = 'https://664f32d7fafad45dfae2c56d.mockapi.io/api/v1/projeto';

// Função para carregar dados dos problemas
function carregaDados() {
    fetch(problemaApiUrl)
        .then(response => response.json())
        .then(dados => {
            console.log('Problemas carregados:', dados); // Log dos dados carregados
            montaTela(dados);
            carregaProjetos(); // Chama a função para carregar projetos
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

// Função para montar os cards na tela
function montaTela(problemas) {
    let cardContainer = document.querySelector(".card-container");
    cardContainer.textContent = ''; // Limpa o container antes de adicionar os novos cards
    let selecionadoConteiner = document.querySelector('.select-container');
    selecionadoConteiner.textContent = '';

    problemas.forEach(element => {

        if (element.solicitado == true && element.selecionado == true && element.aceito == false) {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.innerHTML = `
                <div>
                    <div class="titulo-card">
                        <h4>${element.titulo}</h4>
                        
                    </div>
                    <p><b>Causa:</b> ${element.causa}</p>
                    <p><b>Descrição:</b> ${element.descricao}</p>
                </div>
                <div class="botoes">
                    <button class="btn-aceite" onclick="aceitarProjeto('${element.id}')"></button>
                    <button class="btn-rejeite" onclick="rejeitarProjeto('${element.id}')"></button>
                    <button class="btn-chat" onclick='abrirChat()'>
                        Chat
                     </button>
                </div> 
            `;

            selecionadoConteiner.appendChild(newCard);
        } else if (element.selecionado && element.aceito == false) {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.innerHTML = `
                <div>
                    <div class="titulo-card">
                        <h4>${element.titulo}</h4>
                        <button onclick='mensagemSelecionado()'>
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <p><b>Causa:</b> ${element.causa}</p>
                    <p><b>Descrição:</b> ${element.descricao}</p>
                </div>
                <button class="btn-detalhes" onclick='mostrarDetalhes(${element.id}, "${element.ongId}")'>
                    Detalhes
                </button>
            `;


            cardContainer.appendChild(newCard);
        } else if (element.selecionado == false && element.solicitado == false && element.aceito == false) {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.innerHTML = `
                <div>
                    <div class="titulo-card">
                        <h4>${element.titulo}</h4>
                        <button onclick='excluirCard(${element.id})'>
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <p><b>Causa:</b> ${element.causa}</p>
                    <p><b>Descrição:</b> ${element.descricao}</p>
                </div>
                <button class="btn-detalhes" onclick='mostrarDetalhes(${element.id}, "${element.ongId}")'>
                    Detalhes
                </button>
            `;
            cardContainer.appendChild(newCard);
        } 
        else{

        }
    });
}

function aceitarProjeto(problemaId) {
    // Busca os dados do problema correspondente na API de problemas
    fetch(`${problemaApiUrl}/${problemaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aceito: true })
    })
        .then(response => {
            if (response.ok) {

            } else {
                throw new Error('Erro ao selecionar problema.');
            }
        })
        .catch(error => console.error('Erro:', error));

    fetch(`${problemaApiUrl}/${problemaId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar os dados do problema.');
            }
            return response.json();
        })
        .then(problema => {
            // Cria um objeto 'projeto' e carrega os dados do problema nele
            const projeto = {
                titulo: problema.titulo,
                causa: problema.causa,
                descricao: problema.descricao,
                ongId: problema.ongId
                // Adicione mais campos conforme necessário
            };

            const url = 'https://664f32d7fafad45dfae2c56d.mockapi.io/api/v1/projeto';

            // Envia os dados para a API usando fetch
            fetch(url, {
                method: 'POST', // Define o método como POST
                headers: {
                    'Content-Type': 'application/json' // Define o cabeçalho como JSON
                },
                body: JSON.stringify(projeto) // Converte o objeto problema para uma string JSON
            })  .then(response => response.json())
                .then(data => {
                    Swal.fire({
                        icon: 'warning',
                        title: "Deseja aceitar a proposta?",
                        text: "Ao clicar em Sim você estará aceitando a proposta de projeto da equipe. Gostaria de fazer isso?",
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        cancelButtonText: "Cancelar",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Solicitação aceita com sucesso!',
                                text: 'A equipe foi notificada da sua ação.'
                            }).then(() => {
                                window.location.href = 'telaInicialONG.html';
                            });
                        }
                    });
                })
            .catch((error) => {

                // Aqui você pode adicionar código para exibir uma mensagem de erro ao usuário
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Não foi possível realizar essa ação!.'
                })
                return
            });
        })
        .catch(error => {
            console.error('Erro ao buscar os dados do problema:', error);
            alert('Erro ao buscar os dados do problema. Por favor, tente novamente mais tarde.');
        });
}

function rejeitarProjeto(problemaId) {
    Swal.fire({
        icon: "warning",
        title: "Deseja recusar proposta?",
        text: "Ao clicar em Sim você estará recusando a proposta de projeto da equipe. Gostaria de fazer isso?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "Recusa realizada com sucesso e a equipe foi notificada, aguarde outra equipe manifestar interesse!",
            }).then(() => {
                fetch(`${problemaApiUrl}/${problemaId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        selecionado: false,
                        solicitado: false,
                        recusado: true
                    })
                })
                    .then(response => {
                        if (response.ok) {

                        } else {
                            throw new Error('Erro ao selecionar problema.');
                        }
                    })
                    .catch(error => console.error('Erro:', error));
            });
        }
    });
}


function mensagemSelecionado() {
    Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível excluir esse problema pois ele está selecionado!'
    })
    return
}

// Função para carregar dados dos projetos
function carregaProjetos() {
    fetch(projetoApiUrl)
        .then(response => response.json())
        .then(dados => {
            console.log('Projetos carregados:', dados); // Log dos dados carregados
            montaProjetos(dados);
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
}

// Função para montar os cards de projetos na tela
function montaProjetos(projetos) {
    let projectContainer = document.querySelector(".projeto-container");
    projectContainer.textContent = ''; // Limpa o container antes de adicionar os novos cards

    projetos.forEach(element => {
        if (element.entregue == true) {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            const emDesenvolvimentoDiv = element.iniciado ? `<div class="em-desenvolvimento">A equipe finalizou o projeto!</div>` : `<div class="aindaNao">A equipe ainda não iniciou o desenvolvimento!</div>`;

            newCard.innerHTML = `
                    <div class="receber">
                        <div class="img-container" id="img-container">
                            ${emDesenvolvimentoDiv}
                        </div>
                        <div class="titulo-card">
                            <h4>${element.titulo}</h4>
                        </div>
                        <p><b>Causa:</b> ${element.causa}</p>
                        <p><b>Descrição:</b> ${element.descricao}</p>
                    </div>
                    <button class="btn-detalhes" onclick="receberArquivos(${element.id})">
                        Receber Arquivos
                    </button>
        `;

            projectContainer.appendChild(newCard);
        } else {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            const emDesenvolvimentoDiv = element.iniciado ? `<div class="em-desenvolvimento">Em desenvolvimento pela equipe!</div>` : `<div class="aindaNao">A equipe ainda não iniciou o desenvolvimento!</div>`;;

            newCard.innerHTML = `
                    <div>
                        <div class="img-container" id="img-container">
                            ${emDesenvolvimentoDiv}
                        </div>
                        <div class="titulo-card">
                            <h4>${element.titulo}</h4>
                        </div>
                        <p><b>Causa:</b> ${element.causa}</p>
                        <p><b>Descrição:</b> ${element.descricao}</p>
                    </div>
                    <div class="botoes">
                        <button class="btn-aguardando">
                            Aguarde a entrega!
                        </button>
                    </div>
                    
        `;

            projectContainer.appendChild(newCard);
        }

    });
}

// Função para buscar dados da ONG
async function fetchOng(ongId) {
    try {
        const response = await fetch(`https://664f28a4fafad45dfae29755.mockapi.io/api/v1/ong/${ongId}`);
        const data = await response.json();
        console.log('ONG carregada:', data); // Log dos dados da ONG
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados da ONG:', error);
        throw error;
    }
}

// Função para mostrar os detalhes do problema e da ONG
async function mostrarDetalhes(problemaId, ongId) {
    try {
        const overlay = document.createElement("div");
        overlay.classList.add("modal-overlay");

        // Criar o container do modal
        const modalContainer = document.createElement("div");
        modalContainer.classList.add("modal-container");

        // Fetch dados do problema e da ONG
        const [problema, ong] = await Promise.all([
            fetch(`${problemaApiUrl}/${problemaId}`).then(res => res.json()),
            fetchOng(ongId)
        ]);

        if (problema.selecionado == true) {
            console.log('Detalhes do problema:', problema); // Log dos dados do problema
            console.log('Detalhes da ONG:', ong); // Log dos dados da ONG

            detalhesContainer.innerHTML = `
                <div class="detalhes">
                    <br>
                    <br>
                    <br>
                    <h2>Detalhes do Problema</h2>
                    <p><b>Título:</b> ${problema.titulo}</p>
                    <p><b>Causa:</b> ${problema.causa}</p>
                    <p><b>Descrição:</b> ${problema.descricao}</p>
                    <br>
                    <h2>Detalhes da ONG</h2>
                    <p><b>Nome:</b> ${ong.nomeONg}</p>
                    <p><b>Descrição:</b> ${ong.sobre}</p>
                    <p><b>Endereço:</b> ${ong.endereco}</p>
                    <br>
                    <p>Contato:</p>
                    <p><b>Telefone:</b> ${ong.telefone}</p>
                    <p><b>E-mail:</b> ${ong.email}</p>
                    <p><b>Site:</b> ${ong.urlSite}</p>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <div class="button-detalhe">
                        <button onclick="aceitarProjeto(${problemaId})">Aceitar Projeto</button>
                        <button onclick="fecharDetalhes()">Fechar</button>
                    </div>
                    
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(modalContainer);
            detalhesContainer.style.display = 'block';
        } else {
            console.log('Detalhes do problema:', problema); // Log dos dados do problema
            console.log('Detalhes da ONG:', ong); // Log dos dados da ONG

            modalContainer.innerHTML = `
                <div class="detalhes">
                    <br>
                    <br>
                    <br>
                    <h2>Detalhes do Problema</h2>
                    <p><b>Título:</b> ${problema.titulo}</p>
                    <p><b>Causa:</b> ${problema.causa}</p>
                    <p><b>Descrição:</b> ${problema.descricao}</p>
                    <br>
                    <h2>Detalhes da ONG</h2>
                    <p><b>Nome:</b> ${ong.nomeONg}</p>
                    <p><b>Descrição:</b> ${ong.sobre}</p>
                    <p><b>Endereço:</b> ${ong.endereco}</p>
                    <br>
                    <p>Contato:</p>
                    <p><b>Telefone:</b> ${ong.telefone}</p>
                    <p><b>E-mail:</b> ${ong.email}</p>
                    <p><b>Site:</b> ${ong.urlSite}</p>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <div class="button-detalhe">
                        <button onclick="fecharDetalhes()">Fechar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(modalContainer);
            detalhesContainer.style.display = 'block';
        }

    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
    }
}

function fecharDetalhes() {
    const overlay = document.querySelector(".modal-overlay");
    const modalContainer = document.querySelector(".modal-container");
    overlay.remove();
    modalContainer.remove();
    detalhesContainer.innerHTML = '';
    detalhesContainer.style.display = 'none';
}

function removerProblema(id) {

    fetch(`${problemaApiUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    }).then(response => {
        carregaDados();

    }).catch(error => console.error('Erro ao excluir problema:', error));
}

function excluirCard(id) {
    
    Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Quer mesmo excluir esse problema?",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${problemaApiUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(response => {
                carregaDados();
                Swal.fire({
                    icon: 'success',
                    title: 'Excluido',
                    text: 'Problema excluido com sucesso!'
                });
            });
        }

    });
}

function receberArquivos(projetoId){
    fetch(`${projetoApiUrl}/${projetoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do mock');
            }
            return response.json();
        })
        .then(projeto => {
            const overlay = document.createElement("div");
            overlay.classList.add("modal-overlay");

            const modalContainer = document.createElement("div");
            modalContainer.classList.add("modal-container");

            modalContainer.innerHTML = `
                <h3>A equipe entregou o projeto!</h3>
                <div class="insira">Aqui estão os arquivos que foram enviados:</div>
                <div id="file-upload">
                    <button class="baixar-arquivos" onclick="baixarZip()">
                        <img src="../CSS/imagens/para-download.png" alt="baixar" class="baixar" />
                        Baixe os arquivos aqui
                    </button>
                </div>
                <label for="ajuda">E aqui tem o passo a passo que a equipe deixou para vocês poderem utilizar e executar:</label>
                <textarea name="ajuda" id="ajuda">${projeto.mensagem} </textarea>
                <div class="buttons">
                    <button class="btn-fechar" onclick="fecharModal()">Fechar</button>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(modalContainer);
            
            overlay.addEventListener('click', fecharModal);
        })
}


function fecharModal() {
    const overlay = document.querySelector('.modal-overlay');
    const modalContainer = document.querySelector('.modal-container');
    if (overlay) overlay.remove();
    if (modalContainer) modalContainer.remove();
}    

function baixarZip() {
    zipUrl = 'path/to/your/file.zip';
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = 'Arquivos_Projeto.zip'; 

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

// Carrega dados ao iniciar a página
window.onload = carregaDados;

// Adiciona o evento de fechar detalhes ao DOM
window.fecharDetalhes = fecharDetalhes;

// Função de logout (apenas para completar o código)
function logout(event) {
    event.preventDefault();
    // Implementar logout aqui
}

function abrirChat() {
    let overlay =
        document.querySelector(".overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);
    }
    overlay.style.display = "block";
    const offcanvasDiv =
        document.createElement("div");
    offcanvasDiv.classList.add(
        "offcanvas",
        "offcanvas-bottom"
    );
    offcanvasDiv.tabIndex = "-1";
    offcanvasDiv.id = "offcanvasBottom";

    offcanvasDiv.style.width = "400px";
    offcanvasDiv.style.height = "70%";
    offcanvasDiv.style.color = "white";
    offcanvasDiv.style.position = "fixed";
    offcanvasDiv.style.bottom = "10px";
    offcanvasDiv.style.right = "10px";
    offcanvasDiv.style.backgroundColor = "white";
    offcanvasDiv.style.borderRadius = "12px";
    offcanvasDiv.style.border = "solid 1px black";

    const offcanvasHeader =
        document.createElement("div");
    offcanvasHeader.classList.add(
        "offcanvas-header"
    );

    const headerTitle =
        document.createElement("span");
    headerTitle.classList.add("header-title");
    headerTitle.textContent = "Chat";

    const offcanvasTitle =
        document.createElement("h5");
    offcanvasTitle.classList.add("offcanvas-title");
    offcanvasTitle.textContent = "Chat";

    const closeButton =
        document.createElement("button");
    closeButton.type = "button";
    closeButton.classList.add("btn-close");
    closeButton.dataset.bsDismiss = "offcanvas";
    closeButton.setAttribute("aria-label", "Close");

    offcanvasHeader.appendChild(offcanvasTitle);
    offcanvasHeader.appendChild(closeButton);

    const offcanvasBody =
        document.createElement("div");
    offcanvasBody.classList.add(
        "offcanvas-body",
        "small"
    );
    const inputContainer =
        document.createElement("div");
    inputContainer.classList.add("input-container");
    offcanvasBody.appendChild(inputContainer);

    const offcanvasInput =
        document.createElement("input");
    offcanvasInput.type = "text";
    offcanvasInput.classList.add("offcanvas-input");
    offcanvasInput.placeholder =
        "Digite uma mensagem";

    const sendButton =
        document.createElement("button");
    sendButton.classList.add("send-button");

    const sendIcon = document.createElement("i");
    sendIcon.classList.add(
        "bi",
        "bi-send-fill",
        "send-icon"
    );
    sendIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
        </svg>`;
    sendButton.appendChild(sendIcon);

    sendButton.addEventListener(
        "mouseover",
        function () {
            sendIcon.style.color = "#004080";
        }
    );

    sendButton.addEventListener(
        "mouseout",
        function () {
            sendIcon.style.color = "#1166ca";
        }
    );

    const closeIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );
    closeIcon.setAttribute(
        "xmlns",
        "http://www.w3.org/2000/svg"
    );
    closeIcon.setAttribute("width", "16");
    closeIcon.setAttribute("height", "16");
    closeIcon.setAttribute("fill", "currentColor");
    closeIcon.setAttribute(
        "class",
        "bi bi-x close-icon"
    );
    closeIcon.setAttribute("viewBox", "0 0 16 16");
    closeIcon.innerHTML = `<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>`;
    closeIcon.addEventListener(
        "click",
        function () {
            offcanvasDiv.remove();
            overlay.style.display = "none";
        }
    );

    offcanvasHeader.appendChild(closeIcon);
    offcanvasHeader.appendChild(headerTitle);
    offcanvasDiv.appendChild(offcanvasHeader);
    offcanvasBody.appendChild(offcanvasInput);
    offcanvasBody.appendChild(sendButton);
    const offcanvasFooter =
        document.createElement("footer");
    offcanvasBody.classList.add("offcanvas-footer");

    offcanvasDiv.appendChild(offcanvasHeader);
    offcanvasDiv.appendChild(offcanvasBody);

    document.body.appendChild(offcanvasDiv);
};