const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const sequelize = new Sequelize(
  config.development.dbName,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
    host: config.development.host,
    pool: {
      max: 10, // Maximum number of connections in pool
      min: 0, // Minimum number of connections in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000, // The maximum time, in milliseconds, that a connection can be idle before being released
    },
  }
);

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to DB");
  } catch (e) {
    console.log(e);
  }
};

sequelize
  .sync()
  .then(() => {
    console.log("Tables synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing tables:", error);
  });

module.exports = { sequelize, connectToDB };
