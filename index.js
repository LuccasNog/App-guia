
const express = require('express');
const app = express();

//Importante o body parser
const bodyParser = require('body-parser');

//importando a conexão 
const connection = require('./database/database');

//Importando a tabel 
const Pergunta = require('./database/Pergunta');

const Resposta = require('./database/Resposta');




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
    Pergunta.findAll({raw: true, order:[
        // no order: vamos ordernar por id 

        //Colocando regra de ordenação 1 - id, 2- descrente 
        ['id', 'DESC']
    ]}).then(perguntas => {
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




//Busca atraves de condições -> condicional com sequelize
app.get('/pergunta/:id', (req, res) => {
    //Pegar o id que usuário digitou na rota
    var id = req.params.id;
    //Fazendo busca no banco pelo que uusário digitou 

    //O model pergunta representa a tabela  = Pesquisando a pergunta no bd
    Pergunta.findOne({
        where: {
            //buscando a pergunta que tem o id igual a variavel id
            id: id
        }
    }).then(pergunta => { // o then vai nos retornar a pergunta
        //verificando se a pergunta foi achada
        if(pergunta != undefined) { //Pergunta achada

            // Aqui vamos fazer uma busca no banco de ados para trazer todas as respostas correspondentes a pergunta
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
               // ordenar pelo id
               order:[ ['id', 'DESC'] ]
            }).then(respostas => {
                //Exibir a página da perguntae.ejs
                 res.render("pergunta", {
                    // Vamos usar a variavel pergunta lá na view pergunta.ejs igual no começo do modulo
                    pergunta: pergunta,
                    //Passando as respostas para que pesquisei para view
                    respostas: respostas
                 });
            })   
        }
        else{ // Não encontrada
            //redirecionar para página principal
            res.redirect("/");
        }
    })
})

//Routes para resposta -> post pq vai receber dados do formulário
app.post('/responder', (req, res) => {
    //RECEBENDO  OS DADOS DO FORMULÁRIO

    //vai receber o conteudo da textarea
    let corpo = req.body.corpo;
    //Pegando o id da pergunta respondida 
    let perguntaId = req.body.pergunta;

    //Criar uma nova resposta, chamando o model de resposta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        //redirecionar para a página da perguntaID
        res.redirect("/pergunta/" + perguntaId);
     });
})  





/*
 * RODANDO O SERVIDOR
 */
app.listen(3004, (error) => {
    if(error){
        console.log("Ocorreu um erro");
    }else{
        console.log("App rodando com suceso");
    }
})