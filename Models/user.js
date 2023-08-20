const sequelize = require("sequelize");
const { seq } = require("../config/config");
    
    const User = seq.define("User", {
      id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Invalid email format',
          },
        },
      },
      password: {
        type: sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
      updatedAt: {
        type: sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.NOW,
      },
    });

module.exports={User}