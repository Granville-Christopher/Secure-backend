const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("demo_database", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to MySQL with Sequelize (from db.js)");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error.message);
  }
})();

module.exports = sequelize;
