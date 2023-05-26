//nao deve precisar mais desa pagina

//importar o módulo express
const express = require('express');

//Criar a instancia do express
const app = express();


//INDEX
//Definindo a porta do servidor
const portIndex = 3000;

//funcao de uma requisicao feita pelo servidor
app.use(express.static('public'));

//Definir a rota principal e nviando o arquivo index.html para o localholst3000
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html')
})

//Exibir uma mensagem no console para verificar se o servidor esta funcionando
console.log(`A porta da pagina INDEX é http://localhost:${portIndex}`);

//Iniciando o servidor na porta definida
app.listen(portIndex);



/*
//CONFGPERFIL
const expressPerfil = require('express');
const appPerfil = express();
const portPerfil = 3003;
appPerfil.use(expressPerfil.static('public'));
appPerfil.get('/', function(req, res){
    res.sendFile(__dirname + '/configPerfil.html')
})
console.log(`A porta da pagina CONFPERFIL é http://localhost:${portPerfil}`);
appPerfil.listen(portPerfil);


//LOGIN
const expressLogin = require('express');
const appLogin = express();
const portLogin = 3004;
appLogin.use(expressLogin.static('public'));
appLogin.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html')
})
console.log(`A porta da pagina LOGIN é http://localhost:${portLogin}`);
appLogin.listen(portLogin);


//CADASTRO
const expressCadastro = require('express');
const appCadastro = express();
const portCadastro = 3005;
appCadastro.use(expressCadastro.static('public'));
appCadastro.get('/', function(req, res){
    res.sendFile(__dirname + '/cadastro.html')
})
console.log(`A porta da pagina CADASTRO é http://localhost:${portCadastro}`);
appCadastro.listen(portCadastro);*/