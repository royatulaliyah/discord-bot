const { Sequelize, DataTypes } = require("sequelize");

let dialectOptions = {};

switch (process.env.NODE_ENV) {
  case "PRODUCTION":
    dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
    break;
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    dialectOptions: dialectOptions,
    logging: false,
  }
);

const Fess = sequelize.define("Fess", {
  authorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
});

module.exports = { Fess };
