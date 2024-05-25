
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