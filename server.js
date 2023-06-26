//CRIAR SERVIDOR PARA O CHAT
// Importando o módulo 'express' e atribuindo-o à constante 'app'
const app = require('express')();
// Importando o módulo 'http' e criando um servidor com ele, atribuindo-o à constante 'http'
const http = require('http').createServer(app);
// Importando o módulo 'socket.io' e passando o servidor 'http' como parâmetro, atribuindo-o à constante 'io'
const io = require('socket.io')(http);

//Server do json
/*const jsonServer =  require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const requisicao = jsonServer.defaults();
server.use(requisicao);
server.use(router);
*/
//armazenar id do socket associado ao id do usuario
var conectados = [];
var ultimoQueSaiu = 0;

//usa todas as paginas do public
const express = require('express');
//const { Script } = require('vm');
app.use(express.static('public'));

// Rota para a página inicial
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));

// Evento para quando o cliente se conecta ao servidor via Socket.io
io.on('connection', (socket) => {
    if(ultimoQueSaiu != 0){
        io.emit('removeUltimo', ultimoQueSaiu);
    }
    ultimoQueSaiu=0;

    console.log('Usuário conectado');

    socket.on('entrou', (idInfoUser) => {
        io.emit('entrou', idInfoUser);
        console.log(`Conectado: ${socket.id} - ${idInfoUser.idUser}`);
        conectados.push([socket.id, idInfoUser.idUser]);
        //console.log(conectados);
    })

    // Evento para quando o cliente envia uma mensagem via Socket.io
    socket.on('chat message', (data) => io.emit('chat message', data));
    // Evento para quando o cliente envia uma Imagem via Socket.io
    socket.on('chat imagem', (dados) => io.emit('chat imagem', dados));

    //avisar os outros usuarios quem saiu do chat
    //socket.on('disconnect', () => io.emit('saiu'))
    

    // Evento para quando o cliente se desconecta do servidor via Socket.io
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
        for(var i=0; i<conectados.length; i++){
            if(conectados[i][0] == socket.id){
                var id = conectados[i][1];
                io.emit('remove', id);

                if(conectados.length == 1){
                    ultimoQueSaiu = conectados[0][1];
                    console.log('ultimo '+ultimoQueSaiu)
                }else{
                    ultimoQueSaiu = 0
                }
                conectados.splice(i,1);
            }
        }
        console.log("desconectado "+socket.id);
    });
});



const portaChat = 3000;
// Inicia o servidor na porta 3000
http.listen(portaChat, () => {
  console.log(`Servidor CHAT rodando na porta ${portaChat} - Link http://localhost:${portaChat}`);
});





const jsonServer = require('json-server');
const serverJson = jsonServer.create();
const routerJson = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
serverJson.use(middlewares);
const portaJson = 3001;
serverJson.use(routerJson);
const expressJson = require('express');
const appJson = express();
appJson.use(expressJson.static('public'));
appJson.get('/', function(req, res) {
    res.send(__dirname = '/public/index.html');
})
serverJson.listen(portaJson, () => {
    console.log(`JSON SERVER está rodando em http://localhost:${portaJson}`);
})


