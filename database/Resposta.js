// Vamos defininr uma tabela do banco por aqui

const Sequelize = require('sequelize');
//Importando conexão
const connection = require('./database');



//famoso relacionamento entre duas tabelas

//DESENHANDO O MODEL DA RESPOSTA

const Resposta = connection.define("respostas", {
    // toda resposta vai ter um corpo: TEXTO 

    corpo: {
        //SEQUELIZE.TEXT É TEXTO LONGO
        type: Sequelize.TEXT,
        allowNull: false //Esse campo nunca pode ser vázio
    },
    //qual pergunta essa resposta responde
    perguntaId: { // o id da pergunta que respondi
        type: Sequelize.INTEGER,
        allowNull: false 
    }

});

//Sincronizando com o banco de dados
Resposta.sync({force: false});

module.exports = Resposta;