
const express = require('express');
const app = express();

//Importante o body parser
const bodyParser = require('body-parser');

//importando a conexão 
const connection = require('./database/database');

//Importando a tabel 
const Pergunta = require('./database/Pergunta');





//Testando a conexão 
connection
    .authenticate()
    .then(() => { // THEN SE AUTENTICAÇÃO OCORREU COM SUCESSO
        console.log("Conexão feita com sucesso");
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })




/* 
 * BODY PARSER = TRADUZ OS DADOS PEGOS NO FORMULARIO
 */


 //Configurando o body parser
 app.use(bodyParser.urlencoded({extended: false})) // Esse comando que vai traduzir os dados do formulário = decodificar
//permite leia dados de formulario enviados via JSON, só vamos utilizar com api
app.use(bodyParser.json());





//Dizendo para o express usar EJS como view engine (desenhar o html)
app.set('view engine', 'ejs');
//Definindo que vou usar arquivos staticos. aqui vou colocar a pasta public que está o css e vou chamar o css no index.ejs
app.use(express.static('public'))


//ROUTES

//falando para o express reendenizar o ejs (render é desenhar alguma coisa na tela)
app.get('/', (req, res) => {

    //Pesquisando sobre as perguntas = SELECT * ALL FROM pergunta 
            //RAW SIGNIFICADA CRU, ele vai fazer os dados
    Pergunta.findAll({raw: true}).then(perguntas => {
           // passando as perguntas para o front and
           res.render("index",{
               perguntas: perguntas
           }); 
    }); 
});



/**
 * Criando rota para cadastro
 */
app.get('/perguntar',(req, res) => {
    //vai rendenizar a view perguntar
    res.render("perguntar");
})



/**
 * ROTAS QUE VAI RECEBER OS DADOS DO FORMULARIo
 */
app.post('/salvarpergunta', (req, res) => {
    //capturando os dados do formulario, tenho que baixar a biblioteca npm install body-parser --save   
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
     //SALVANDO PERGUNTA NO BD 
     Pergunta.create({ // mesma coisa que fazer um insert 
         //passando os dados que vem do formulário
         titulo: titulo,
         descricao: descricao
     }).then(() => {
        // Quando a pergunta for salva no banco, vamos redirecionar o usuário para página principal
        res.redirect("/");
     });
})



/**
 * RODANDO O SERVIDOR
 */
app.listen(3004, (error) => {
    if(error){
        console.log("Ocorreu um erro");
    }else{
        console.log("App rodando com suceso");
    }
})