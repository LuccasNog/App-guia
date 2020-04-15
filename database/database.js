// Aqui vai ficar nossa conexão com sequelize 

const Sequelize = require('sequelize');

//Criando a conexão
                      //New Sequelize vai receber o nome do banco          
const connection = new Sequelize('guiaperguntas','root','root',{
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
});

//exportando a conexão 
module.exports = connection;