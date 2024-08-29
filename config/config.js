const {Sequelize} = require('sequelize');
require("dotenv").config()
const seq = new Sequelize(
    process.env.DATABASE,
    process.env.US,
    process.env.PASS,
    {
      host: process.env.HOST,
      dialect: process.env.DIALECT,  // Correct usage here
    }
  );




module.exports = { seq };
  
