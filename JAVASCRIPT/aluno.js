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
            carregaProjetos();
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
        if (element.aceito == true) {
            const newCard = document.createElement("div");
            newCard.classList.add("card");
            newCard.setAttribute('data-id', element.id);
            newCard.setAttribute('data-ongid', element.ongId);
            newCard.innerHTML = `
                <div>
                    <div class="titulo-card">
                        <h4>${element.titulo}</h4>
                    </div>
                    <p><b>Causa:</b> ${element.causa}</p>
                    <p><b>Descrição:</b> ${element.descricao}</p>
                </div>
                <button class="btn-detalhes" id="selecionado"  '>
                    Selecionado
                </button>
            `;
            cardContainer.appendChild(newCard);
        } else if (element.selecionado === true) {
            // Remova todos os cards existentes no contêiner
            while (selecionadoConteiner.firstChild) {
                selecionadoConteiner.removeChild(selecionadoConteiner.firstChild);
            }

            const newCard = document.createElement("div");
            newCard.classList.add("card");

            if (element.solicitado === true) {
                newCard.innerHTML = `
                    <div>
                        <div class="entrega" id="img-container">
                            <div class="em-desenvolvimento">Solicitação realizada com sucesso!</div>
                        </div>
                        <div class="titulo-card">
                            <h4>${element.titulo}</h4>
                        </div>
                        <p><b>Causa:</b> ${element.causa}</p>
                        <p><b>Descrição:</b> ${element.descricao}</p>
                    </div>
                    <div class="select-buttons">
                        <button class="btn-pedir-aceite" id="btn-selecionar" style="background-color: #808080;" disabled>Solicitar aceite</button>
                        <button class="btn-chat" id="btn-selecionar" onclick="abrirChat()">Chat</button>
                    </div>
                `; 
            }  else {
                newCard.innerHTML = `
                    <div>
                        <div class="entrega" id="img-container">
                            <div class="aindaNao">Realize a solicitação de aceite para a ONG!</div>
                        </div>
                        <div class="titulo-card">
                            <h4>${element.titulo}</h4>
                        </div>
                        <p><b>Causa:</b> ${element.causa}</p>
                        <p><b>Descrição:</b> ${element.descricao}</p>
                    </div>
                    <div class="select-buttons">
                        <button class="btn-pedir-aceite" id="btn-selecionar" onclick="solicitarAceite(${element.id}, this)">Solicitar aceite</button>
                        <button class="btn-chat" id="btn-selecionar" onclick="abrirChat()">Chat</button>
                    </div>
                `;
            }

            selecionadoConteiner.appendChild(newCard);
        }else if (element.recusado === true){
        //     Swal.fire({
        //     icon: 'error',
        //     title: 'Sua solicitação foi recusada pela ONG!',
        //     text: 'O problema voltou a ser disponível.',
        //     confirmButtonText: 'OK',
        // }).then((result) => {
        //     if (result.isConfirmed) {
                const newCard = document.createElement("div");
                newCard.classList.add("card");
                newCard.setAttribute('data-id', element.id);
                newCard.setAttribute('data-ongid', element.ongId);
                newCard.innerHTML = `
                    <div>
                        <div class="entrega" id="img-container">
                            <div class="recusado">A ONG recusou a sua solicitação!</div>
                        </div>
                        <div class="titulo-card">
                            <h4>${element.titulo}</h4>
                        </div>
                        <p><b>Causa:</b> ${element.causa}</p>
                        <p><b>Descrição:</b> ${element.descricao}</p>
                    </div>
                    <button class="btn-detalhes" onclick='mostrarDetalhes(${element.id}, "${element.ongId}")'>
                            Detalhes
                    </button>
                `;
                cardContainer.appendChild(newCard);
            // }
        // })
    } else {
        const newCard = document.createElement("div");
        newCard.classList.add("card");
            newCard.setAttribute('data-id', element.id);
        newCard.setAttribute('data-ongid', element.ongId);
        newCard.innerHTML = `
            <div>
                <div class="titulo-card">
                    <h4>${element.titulo}</h4>
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
    });
}

async function mostrarDetalhes(problemaId, ongId) {
    try {
        const overlay = document.createElement("div");
        overlay.classList.add("modal-overlay");

        const modalContainer = document.createElement("div");
        modalContainer.classList.add("modal-container");

        const [problema, ong] = await Promise.all([
            fetch(`${problemaApiUrl}/${problemaId}`).then(res => res.json()),
            fetch(`${ongApiUrl}/${ongId}`).then(res => res.json())
        ]);

        console.log('Detalhes do problema:', problema); // Log dos dados do problema
        console.log('Detalhes da ONG:', ong); // Log dos dados da ONG

        modalContainer.innerHTML = `
            <div class="detalhes">
                <h2>Detalhes do Problema</h2>
                <p><b>Título:</b> ${problema.titulo}</p>
                <p><b>Causa:</b> ${problema.causa}</p>
                <p><b>Descrição:</b> ${problema.descricao}</p>
                <h2>Detalhes da ONG</h2>
                <p><b>Nome:</b> ${ong.nome}</p>
                <p><b>Descrição:</b> ${ong.descricao}</p>
                <p><b>Endereço:</b> ${ong.endereco}</p>
                <p><b>Contato:</b> ${ong.telefone}</p>
                <p><b>E-mail:</b> ${ong.email}</p>
                <p><b>Site:</b> ${ong.site}</p>
                <div class="button-detalhe">
                    <button id="selecionar" onclick="selecionarProblema(${problemaId})">Selecionar</button>
                    <button onclick="fecharDetalhes()">Fechar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modalContainer);

        detalhesContainer.style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
    }
}

// Função para fechar os detalhes
function fecharDetalhes() {
    const overlay = document.querySelector(".modal-overlay");
    const modalContainer = document.querySelector(".modal-container");
    overlay.remove();
    modalContainer.remove();

    detalhesContainer.style.display = 'none';
}

// Função para selecionar um problema
function selecionarProblema(problemaId) {
    fetch(`${problemaApiUrl}/${problemaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selecionado: true })
    })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Problema Selecionado!',
                    text: 'Envie uma solicitação para a ong e aguarde a resposta.'
                }).then(() => {
                    window.location.href = 'homeAluno.html';
                    carregaDados();
                });
            } else {
                throw new Error('Erro ao selecionar problema.');
            }
        })
        .catch(error => console.error('Erro:', error));
}

function solicitarAceite(problemaId) {
    const senhaCorreta = "s";
    Swal.fire({
        title: "Insira a senha definida pela equipe:",
        // text: "Essa senha será usada futuramente!",
        input: "password",
        inputAttributes: {
            class: "swal2-input minha-classe-personalizada",
        },
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
    }).then(result => {
        if (result.isConfirmed) {
            const senhaInserida = result.value;

            if (senhaInserida === senhaCorreta) {
                fetch(`${problemaApiUrl}/${problemaId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ solicitado: true })
                })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Problema Selecionado!',
                                text: 'Sua solicitação foi enviada para a ong, aguarde a resposta.'
                            }).then(() => {
                                window.location.href = 'homeAluno.html';
                            });
                        } else {
                            throw new Error('Erro ao selecionar problema.');
                        }
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro',
                            text: 'Houve um problema ao enviar sua solicitação. Tente novamente mais tarde.'
                        });
                    });
            }
        }
    });
}

function iniciarProjeto(index, id) {
    const imgContainer = document.getElementById(`img-container-${index}`);
    if (!imgContainer.querySelector('.circulo-img')) {  // Evita adicionar a imagem mais de uma vez
        const img = document.createElement('img');
        img.src = '../CSS/Imagens/circulo.png';
        img.alt = 'Ícone de Círculo';
        img.classList.add('circulo-img');
        imgContainer.appendChild(img);
    }

    // Atualiza o atributo desenvolvimento na API
    fetch(`https://664f32d7fafad45dfae2c56d.mockapi.io/api/v1/projeto/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ iniciado: true })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Projeto atualizado:', data);
            const senhaCorreta = "s";
            Swal.fire({
                title: "Insira a senha definida para equipe:",
                input: "password",
                inputAttributes: {
                    class: "swal2-input minha-classe-personalizada",
                },
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            }).then(result => {
                if (result.isConfirmed) {
                    const senhaInserida = result.value;

                    if (senhaInserida === senhaCorreta) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Desenvolvimento Iniciado!',
                            text: 'O desenvolvimento foi iniciado com sucesso.'
                        }).then(() => {
                            window.location.href = 'homeAluno.html';
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Senha Incorreta',
                            text: 'A senha inserida está incorreta. Tente novamente.'
                        });
                    }
                }
            });
        })
        .catch(error => {
            console.error('Erro ao atualizar projeto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao iniciar o desenvolvimento. Tente novamente.'
            });
        });
}

function listarArquivos(event) {
    const fileList = document.getElementById('file-list');
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement('div');
        
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add('btn-excluir-link');
        deleteButton.onclick = function() {
            fileList.removeChild(listItem);
        };

        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.textContent = file.name;
        link.target = '_blank';

        listItem.appendChild(deleteButton);
        listItem.appendChild(link);
        fileList.appendChild(listItem);
    }
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

function fecharModal() {
    const overlay = document.querySelector('.modal-overlay');
    const modalContainer = document.querySelector('.modal-container');
    if (overlay) overlay.remove();
    if (modalContainer) modalContainer.remove();
}         

function entregarProjeto(projetoId) {
    const fileInput = document.getElementById('file-input');
    const ajuda = document.getElementById('ajuda');
    if (fileInput.files.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Nenhum arquivo selecionado!',
            text: 'Por favor, selecione pelo menos um arquivo antes de entregar o projeto.'
        });
        return;
    } else if (ajuda.value.trim() === ''){
        Swal.fire({
            icon: 'error',
            title: 'Campo para a explicação está vazio!',
            text: 'Por favor, preencha o campo antes de entregar o projeto.'
        });
        return;
    }                
    Swal.fire({
        title: 'Digite a senha da equipe:',
        input: 'password',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Você precisa digitar a senha!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const senha = result.value;
            if (senha === 's') {
                entregarArquivos(projetoId);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Senha incorreta!',
                        text: 'Por favor, digite a senha correta.'
                    });
            }
        }
    });
}     
function entregarArquivos(projetoId) {
    let mensagem = document.querySelector('#ajuda').value
    fetch(`${projetoApiUrl}/${projetoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ entregue: true, 
            mensagem: mensagem })
    })
    .then(response => {
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Projeto Entregue!',
                text: 'O projeto foi atualizado para entregue.'
            }).then(() => {
                window.location.href = 'homeAluno.html'; // Ajuste o redirecionamento conforme necessário
            });
        } else {
            throw new Error('Erro ao atualizar projeto.');
        }
    })
    .catch(error => console.error('Erro:', error));
} 

function atualizarCardProjeto(projetoId) {
    const card = document.querySelector(`[data-projeto-id="${projetoId}"]`);
    if (card) {
        const entregaDiv = card.querySelector('.entrega');
        const btnFinalizar = card.querySelector('.btn-finalizar');
        
        entregaDiv.textContent = 'Projeto entregue!';
        entregaDiv.style.backgroundColor = "#5fff84";
        entregaDiv.style.border = "solid 1px #1cff7f";
        entregaDiv.style.width = "150px"; 
        entregaDiv.style.margin = "0 auto";
        btnFinalizar.textContent = 'Entregue';
        btnFinalizar.disabled = true;
        btnFinalizar.classList.add('btn-disabled'); 
        btnFinalizar.style.backgroundColor = "#808080";

    }
}

function abrirModal(projetoId) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modalContainer = document.createElement("div");
    modalContainer.classList.add("modal-container");

    modalContainer.innerHTML = `
        <h3>Entregar Projeto</h3>
        <div class="insira">Insira todos os arquivos do projeto, de preferência em .zip</div>
        <div id="file-upload">
            <button class="btn-finalizar-selecao" onclick="document.getElementById('file-input').click();"> Adicione um arquivo <img class="add" src="../CSS/imagens/botao-adicionar.png" alt=""></button>
            <input type="file" id="file-input" multiple style="display: none;" onchange="listarArquivos(event)">
            <div id="file-list"></div>
        </div>
        <label for="ajuda">Faça um passo a passo para ONG utilizar seu projeto:</label>
        <textarea name="ajuda" id="ajuda" placeholder="Explique para a ONG como executar ou utilizar esses arquivos que estão sendo submetidos pela equipe."></textarea>
        <div class="buttons">
            <button class="btn-entregar" onclick="entregarProjeto(${projetoId})">Entregar</button>
            <button class="btn-fechar" onclick="fecharModal()">Fechar</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modalContainer);

    overlay.addEventListener('click', fecharModal);
}

function montaProjetos(projetos) {
    let projectContainer = document.querySelector(".projeto-container");
    projectContainer.textContent = ''; // Limpa o container antes de adicionar os novos cards

    projetos.forEach((element, index) => {
        const newCard = document.createElement("div");
        newCard.classList.add("card");
        newCard.setAttribute('data-projeto-id', element.id);

        if (element.iniciado) {
            const entregue = element.entregue;
            newCard.innerHTML = `
            <div>
                <div class="entrega" id="img-container-${index}" style="width: auto; margin: 0 auto; margin-bottom: 15px; background-color: ${entregue ? '#5fff84' : ''}; border: ${entregue ? 'solid 1px #1cff7f' : ''};">${entregue ? 'Seu projeto foi entregue para a ONG!' : 'A ONG está aguardando a entrega!'}</div>
                    <div class="titulo-card">
                        <h4 id="titulo-${index}">${element.titulo}</h4>
                    </div>
                <p><b>Causa:</b> ${element.causa}</p>
                <p><b>Descrição:</b> ${element.descricao}</p>
                <button class="btn-chat" id="btn-selecionar" onclick="abrirChat()">Chat</button>
                <button class="btn-finalizar ${entregue ? 'btn-disabled' : ''}" ${entregue ? 'disabled' : ''} style="background-color: ${entregue ? '#808080' : ''};" onclick="abrirModal(${element.id})">${entregue ? 'Entregue' : 'Finalizar Projeto'}</button>
            </div>
            `;
        } else {
            newCard.innerHTML = `
                <div>
                    <div class="aceito" id="img-container-${index}">A ONG aceitou sua solicitação!</div>
                    <div class="titulo-card">
                        <h4 id="titulo-${index}">${element.titulo}</h4>
                    </div>
                    <p><b>Causa:</b> ${element.causa}</p>
                    <p><b>Descrição:</b> ${element.descricao}</p>
                    <button class="btn-iniciar" onclick="iniciarProjeto(${index}, ${element.id})">Iniciar Desenvolvimento</button>
                </div>
            `;
        }

        projectContainer.appendChild(newCard);
    });
}

function carregarProjetos() {
    fetch(projetoApiUrl)
        .then(response => response.json())
        .then(projetos => {
            montaProjetos(projetos);
        })
        .catch(error => console.error('Erro ao carregar projetos:', error));
}

document.addEventListener('DOMContentLoaded', carregarProjetos);