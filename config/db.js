const Sequelize = require('sequelize');

require('dotenv').config({path: '../variables.env'});


const db = new Sequelize('heroku_96b9f4b8d29fc04', 'b01bb578e7cea2', 'c78a3d61', {
  host: 'us-cdbr-east-02.cleardb.com',
  dialect: 'mysql',
  port: 3306,
  operatorsAliases: false,
  define: {
      timestamps: false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
    }
});

module.exports = db;