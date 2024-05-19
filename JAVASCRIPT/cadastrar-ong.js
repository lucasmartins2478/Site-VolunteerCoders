document.getElementById("btn-cadastrar-ong").addEventListener("click", function () {
    // Capturando os valores dos campos
    const nomeONG = document.getElementById("nome-ong").value.trim();
    const nomeResponsavel = document.getElementById("nome-responsavel").value.trim();
    const cnpj = document.getElementById("cnpj").value.trim();
    const segmento = document.getElementById("segmento").value.trim();
    const cep = document.getElementById("cep-ong").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const cidade = document.getElementById("cidade-ong").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const numeroEndereco = document.getElementById("numero-endereco").value.trim();
    const emailONG = document.getElementById("email-ong").value.trim();
    const telefoneONG = document.getElementById("telefone-ong").value.trim();
    const sobreONG = document.getElementById("sobre").value.trim();

    // Verificando se algum campo está vazio
    if (
        nomeONG === "" ||
        nomeResponsavel === "" ||
        cnpj === "" ||
        segmento === "" ||
        cep === "" ||
        estado === "" ||
        cidade === "" ||
        endereco === "" ||
        numeroEndereco === "" ||
        emailONG === "" ||
        telefoneONG === "" ||
        sobreONG === ""
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Por favor, preencha todos os campos.',
        });
    } else {
        // Se todos os campos estiverem preenchidos, prossegue com o cadastro
        Swal.fire({
            icon: 'warning',
            title: 'Atenção!',
            text: 'Os dados fornecidos serão transmitos e armazenados conforme as diretrizes de segurança. Por favor, confirme que está ciente para prosseguirmos com o cadastro.',
            showCancelButton: true,
            confirmButtonText: 'Estou ciente e quero cadastrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Depois iremos colocar aqui a função para cadastrar os dados da ONG
                // Por exemplo: cadastrarONG();
                Swal.fire('Cadastrado!', 'Os dados foram cadastrados com sucesso.', 'success');
            }
        });
    }
});

