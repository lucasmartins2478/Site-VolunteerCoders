
var nome = localStorage.getItem('nome')
document.querySelector('#responsavel').value = nome


document.addEventListener("DOMContentLoaded", function () {
    const btnCadastrarProblema = document.querySelector('.btn-cadastrar-problema');

    btnCadastrarProblema.addEventListener('click', function () {
        const titulo = document.getElementById("titulo").value;
        const descricao = document.getElementById("descricao").value;
        const segmento = document.getElementById("causas-da-ong").value;
        const responsavel = document.getElementById("responsavel").value;
        const telefone = document.getElementById("telefone").value;


        if (!titulo || !descricao || !segmento || !responsavel || !telefone) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos vazios',
                text: 'Por favor, preencha todos os campos antes de prosseguir.'
            });
            return;
        }

        const novoProblema = { titulo, descricao, segmento, responsavel, telefone };
        const problemas = JSON.parse(localStorage.getItem('problemas')) || [];
        problemas.push(novoProblema);
        localStorage.setItem('problemas', JSON.stringify(problemas));
        problemas.splice(0, 1);
        problemas.splice(2, 1);
        problemas.splice(3, 1);
       

        localStorage.setItem('problemas', JSON.stringify(problemas));

        const swalConfig = {
            title: 'Insira sua senha de login para confirmar sua identidade:',
            input: 'password', // Define o tipo de entrada como senha
            inputAttributes: {
                // Adiciona classes personalizadas ao campo de senha
                class: 'swal2-input minha-classe-personalizada'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        };

        var senha = 's'

        Swal.fire(swalConfig).then((result) => {
            if (result.isConfirmed) {
                var senhaInserida = result.value;

                if (senhaInserida === senha) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Problema cadastrado com sucesso!',
                        text: 'Os dados sensíveis de ONG e estudante são privados.'
                    }).then(() => {
                        window.location.href = 'telaInicialONG.html';
                    });
                }}
        
        
    });
});
})