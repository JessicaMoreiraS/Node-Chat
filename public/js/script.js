//POST USUARIO
function cadastrarUsuario(){
    event.preventDefault();

    fetch("https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios", {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: $("#nome").val(), 
            email: $("#email").val(), 
            senha: $("#senha").val(),
            status: "",
            telefone: "",
            foto: '<img src="../imagens/semFotoPerfil.jpg" class="configFotoPerfil"/>',
            conexao: false,
            backup:""
        })
    })
    .then(response => response.json())

    //adicionar apagar campos
    document.getElementById('nome').value= ""
    document.getElementById('email').value= ""
    document.getElementById('senha').value= ""

    Swal.fire('Cadastro realizado com sucesso')
}

//GET USUARIO (LOGIN)
function buscarUsuario(){
    event.preventDefault();
    fetch('https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios',{
        method: 'GET'
    })
    .then(response => response.json())
    .then(dados => {
        const usuarioEncontrado = dados.find(usuarios => usuarios.email == $("#email").val());
        if(usuarioEncontrado){
            if(usuarioEncontrado.senha == $("#senha").val()){
                localStorage.setItem("idArmazenado", usuarioEncontrado.id);
                window.location = '/chat.html'
            }else{
                Swal.fire("Senha incorreta!")
            }
        }else{
            Swal.fire("Pessoa não encontradas!")
        }
    })
}


//Apagar armazenameto local do ID
function usuarioOff(id){
    console.log(window.location.href)
    var pagAtual = window.location.href
    if(id == localStorage.getItem("idArmazenado") && pagAtual != 'http://localhost:3000/configPerfil.html' && pagAtual != 'https://chat21-jessicamoreiraroso.b4a.run/configPerfil.html' && pagAtual != 'http://localhost:3000/chat.html' && pagAtual != 'https://chat21-jessicamoreiraroso.b4a.run/chat.html'){
        localStorage.setItem("idArmazenado", "ninguem");
    }
}


//GET USUARIO (CHAT)
function carregarUsuarioChat(){        
    var idArquivado = localStorage.getItem("idArmazenado");

    fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
        method: 'GET'
    })
    .then(response => response.json())
    .then(dados => {
            
        $("#nome").val(dados.nome)
        $("#idUserHeader").val(dados.id)
        document.getElementById('areaImgPerfil').style.backgroundImage = "url("+$(dados.foto).attr('src')+")"
        /*$("#areaImgPerfil").html(dados.foto)*/

        if(dados.backup != "" && dados.backup != undefined){
            for(x=0; x<dados.backup.length; x++){
                document.getElementById('mensagens').innerHTML += dados.backup[x]
            }
        }
    })

    //carregar usuarios que estavam conectados antes
    fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios`,{
        method: 'GET'
    })
    .then(response => response.json())
    .then(dados => {
        for(var i=0; i<dados.length; i++){
            if(dados[i].conexao){
                if(dados[i].id != idArquivado){
                    const card = document.createElement('div')
                    card.classList.add("cardConexao");
                    
                    var espacoImg = document.createElement('div');
                    espacoImg.classList.add('imagemDoCard');
                    espacoImg.style.backgroundImage = "url("+$(dados[i].foto).attr('src')+")";
    
                    card.appendChild(espacoImg)
                    card.innerHTML +=  `<div class="cardNomeEstatus">
                                            <h3>${dados[i].nome}</h3>
                                            <p>${dados[i].status}</p>
                                        </div>
                                    <input type="number" value="${dados[i].id}" class="none" id="${dados[i].id}">`;
                    document.getElementById('areaConectados').appendChild(card)
                }
            }
        }
        
    })
}

//GET USUARIO (CONFIGPERFIL)
function carregarPerfil(){
    const idArquivado = localStorage.getItem("idArmazenado");

    fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
        method: 'GET'
    })
    .then(response => response.json())
    .then(dados => {
        //$("#areImgPerfil").append(dados.foto)
        document.getElementById("areImgPerfil").style.backgroundImage = "url("+$(dados.foto).attr('src')+")"
        $("#nome").val(dados.nome)
        $("#status").val(dados.status)
        $("#email").val(dados.email)
        $("#senha").val(dados.senha)
        $("#telefone").val(dados.telefone)
    })
}


function verificaCamposAtualizaUsuario(){
    if($('#nome').val() != "" && $('#email').val() != "" && $('#senha').val() != ""){
        return true
    }else{
        Swal.fire('Atenção, preencha os campos obrigatorios de Nome, Senha e Email')
        return false
    }
}


//PUT USUARIO (CONFIGPERFIL)
function atualizarDdadosUser(){
    event.preventDefault();

    if(verificaCamposAtualizaUsuario()){
        var imgSrc;
        const idArquivado = localStorage.getItem("idArmazenado");
        console.log(idArquivado)
        
        fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
            method: 'GET'
        })
        .then(response => response.json())
        .then(dados => {
            
            if($("#upImgPerfil").val() == ""){
                imgSrc = dados.foto
            }else{
                imgSrc = "<img src='"+$("#upImgPerfil").val()+"' class=\"configFotoPerfil\"/>"
            }      
            
            fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                nome: $("#nome").val(),
                email: $("#email").val(), 
                senha: $("#senha").val(),
                status: $("#status").val(),
                telefone: $("#telefone").val(),
                conexao: false,
                foto: imgSrc,
                backup: dados.backup,
            })
        })
        .then(response => response.json())
        Swal.fire({
            title: 'Atualizando seus dados',
            html: 'Isso levará alguns segundos <b></b>.',
            timer: 5000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
            }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('Atualizando foto de perfil')
            }
        })
        setTimeout('location.reload()', 5000);
        }) 
    };
}

//PUT apena foto (CONFIGPERFIL)
function atualizarImagemPerfil(imagemUp){
    const idArquivado = localStorage.getItem("idArmazenado");
    fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
        method: 'GET'
    })
    .then(response => response.json())
    .then(dados => {     
        fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            nome: dados.nome,
            email: dados.email, 
            senha: dados.senha,
            status: dados.status,
            telefone: dados.telefone,
            conexao: false,
            foto: `<img src="${imagemUp}"  class="configFotoPerfil" >`,
            backup: dados.backup
        })
    })
    .then(response => response.json())
    let timerInterval
    Swal.fire({
        title: 'Atualizando sua foto de perfil',
        html: 'Isso levará alguns segundos <b></b>.',
        timer: 10000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
        }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log('Atualizando foto de perfil')
        }
    })
    setTimeout('location.reload()', 10000);
    }) 
}

//GET USUARIO PUT RESETA FOTO DE PERFIL DO USUARIO (CONFIGPERFIL)
function removerFotoPerfil(){
    const idArquivado = localStorage.getItem("idArmazenado");
    event.preventDefault()
    fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
            method: 'GET'
        })
        .then(response => response.json())
        .then(dados => {    
            fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                nome: dados.nome,
                email: dados.email, 
                senha: dados.senha,
                status: dados.status,
                telefone: dados.telefone,
                foto: '<img src="../imagens/semFotoPerfil.jpg" class="configFotoPerfil"/>',
                conexao: false,
                backup: dados.backup
            })
        })
        .then(response => response.json())
        let timerInterval
        Swal.fire({
            title: 'Removendo sua foto de perfil',
            html: 'Isso levará alguns segundos <b></b>.',
            timer: 5000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
            }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log('Atualizando foto de perfil')
            }
        })
        setTimeout('location.reload()', 5000);
    }) 
}

function cardUserConected() {
    console.log('olá');
}

function mudarClasse(mensagens, idMensagem, idCliente){
    var ultimoFilho = mensagens.lastElementChild;
    if(idMensagem == idCliente){
        ultimoFilho.classList.add("areaMinhaMensagem");
    }
}

//Função para reduzir a qualidade da imagem
function reduceImageQuality(base64, quality) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = base64;
    return new Promise((resolve, reject) => {
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
    });
}




function removeCard(idSaiu){
    setTimeout(() => {      
        if(document.getElementById(idSaiu) != null){
            var paiInput = document.getElementById(idSaiu).parentNode
            paiInput.remove()
        }
    }, 500);
}

function opcoes(){
    document.getElementById("myDropdown").classList.toggle("show");
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
    }
}


function backupConversa(){
    const idArquivado = localStorage.getItem("idArmazenado");
    var oBackup = []
    console.log(document.getElementById("mensagens").children[0])

    fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{method: 'GET'})
    .then(response => response.json())
    .then(dados => {
        if(dados.backup != ""){
            for(var a = 0; a < document.getElementById("mensagens").children.length; a++){
                oBackup.push(dados.backup[a].outerHTML);
                //console.log(dados.backup[a].outerHTML)
            }
        }
        for(var b = 0; b < document.getElementById("mensagens").children.length; b++){
            oBackup.push(document.getElementById("mensagens").children[b].outerHTML);
            //console.log(document.getElementById("mensagens").children[b].outerHTML)
        }
        fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            nome: dados.nome,
            email: dados.email, 
            senha: dados.senha,
            status: dados.status,
            telefone: dados.telefone,
            conexao: dados.conexao,
            foto: dados.foto,
            backup: oBackup
        })
    })
    .then(response => response.json())
    //setTimeout('location.reload()', 2500);
    swal.fire("Backup realizado com sucesso")
    }) 
}



function deletarBackupConversa(){
    const idArquivado = localStorage.getItem("idArmazenado");
    
    fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{method: 'GET'})
    .then(response => response.json())
    .then(dados => {
        fetch(`https://cadastrochat-jessicamoreiraroso.b4a.run/usuarios/${idArquivado}`,{
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            nome: dados.nome,
            email: dados.email, 
            senha: dados.senha,
            status: dados.status,
            telefone: dados.telefone,
            conexao: dados.conexao,
            foto: dados.foto,
            backup: ""
        })
    })
    .then(response => response.json())
    //setTimeout('location.reload()', 2500);
    swal.fire("Backup deletado com sucesso")
    }) 

}
function deletarMensagensFrontUser(){
    document.getElementById('mensagens').innerHTML = "";
}