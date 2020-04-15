
// Vamos defininr uma tabela do banco por aqui

const Sequelize = require('sequelize');
//Importando conexão
const connection = require('./database');


//Criando a tabela do banco de dados
const Pergunta = connection.define('pergunta', {
    //Definiindo os campos
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: false
    }

});

//Sincronizando com o banco de dados
Pergunta.sync({force: false}).then(() => {});

module.exports = Pergunta;
