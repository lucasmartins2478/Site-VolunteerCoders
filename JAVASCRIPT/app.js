const express = require("express");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const { prisma } = require("./lib/prisma");

const app = express();
const port = 3000;

// Middleware para analisar o corpo das solicitações como JSON
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  return res.send("hello");
});

// Rota para cadastrar um novo aluno
app.post("/cadastrar-aluno", async (req, res) => {
  try {
    const {
      nome,
      cidade,
      dataNascimento,
      cpf,
      email,
      telefone,
      instituicao,
      emailValidacao,
      senha,
    } = req.body;

    const alunoComEmail = await prisma.alunos.findUnique({
      where: { email },
    });

    if (alunoComEmail) {
      return res.status(409).json({
        mensagem: "Já existe um aluno utilizando este e-mail.",
      });
    }

    await prisma.alunos.create({
      data: {
        nome,
        cidade,
        email,
        dataNascimento: new Date(dataNascimento),
        instituicao,
        telefone,
        cpf,
        emailValidacao,
        senha,
      },
    });

    return res.status(201).send();
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

// Rota para login
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const aluno = await prisma.alunos.findUnique({
      where: { email },
    });

    if (!aluno) {
      return res.status(400).json({
        mensagem: "Credenciais incorretas",
      });
    }

    if (senha !== aluno.senha) {
      return res.status(400).json({
        mensagem: "Credenciais incorretas",
      });
    }

    const dadosDeRetorno = {
      nome: aluno.nome,
      email: aluno.email,
      cidade: aluno.cidade,
      dataNascimento: aluno.dataNascimento,
      instituicao: aluno.instituicao,
      telefone: aluno.telefone,
      cpf: aluno.cpf,
      emailValidacao: aluno.emailValidacao,
    };

    return res.status(200).json({
      mensagem: "Logado com sucesso",
      dados: dadosDeRetorno,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
