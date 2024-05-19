var loginAttempts = 0;

document.querySelector(".btnLogin").addEventListener("click", function (event) {
  event.preventDefault(); // Evita que o formulário seja enviado

  if (todosCamposPreenchidos()) {
    // valores do email e senha
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    var emailCorreto = "teste@teste.com";
    var senhaCorreta = "senha123";

    if (email !== emailCorreto || senha !== senhaCorreta) {
      loginAttempts++;

      if (loginAttempts === 3) {
        // Bloqueia a conta após três tentativas
        Swal.fire({
          icon: "error",
          title: "Conta bloqueda!",
          text: "Feita 3 tentativas de login incorretas.",
        });
        disableForm(); // Desativa o formulário
      } else {
        // Exibe mensagem de erro caso esteja errado o email ou a senha
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "error",
          title: "Senha ou e-mail incorreto",
        });
      }
      document.getElementById("email").value = "";
      document.getElementById("senha").value = "";
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Login feito com sucesso!",
      });
      resetForm(); // Reseta o formulário
    }
  } else {
    // Exibe um alerta informando que todos os campos precisam ser preenchidos
    Swal.fire({
      icon: "warning",
      title: "Campos vazios",
      text: "Por favor, preencha todos os campos antes de prosseguir.",
    });
  }
});

function todosCamposPreenchidos() {
  var email = document.getElementById("email").value;
  var senha = document.getElementById("senha").value;

  // Verifica se algum campo está vazio
  if (email === "" || senha === "") {
    return false; // Retorna falso se algum campo estiver vazio
  }

  return true; // Retorna verdadeiro se todos os campos estiverem preenchidos
}

// Função para resetar o formulário
function resetForm() {
  document.getElementById("email").value = "";
  document.getElementById("senha").value = "";
  loginAttempts = 0; // Reseta o número de tentativas de login
}

// Função para desativar o formulário
function disableForm() {
  document.getElementById("email").disabled = true; // Desativa o campo de nome de usuário
  document.getElementById("senha").disabled = true; // Desativa o campo de senha
  document.querySelector(".btnLogin").disabled = true; // Desativa o botão de envio 
}
document.addEventListener("DOMContentLoaded", function() {
  const campos = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], select, button, a');
  const botaoEnviar = document.getElementById('btnLogin');

  campos.forEach(function(campo, index) {
    campo.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Impede o envio do formulário
        const próximoCampo = campos[index + 1];
        if (próximoCampo) {
          próximoCampo.focus();
        } else if (campo === campos[campos.length - 1]) {
          window.location.href = botaoEnviar.getAttribute('onclick').replace("window.location.href='", "").replace("';", "");
        }
      }
    });
  });
});