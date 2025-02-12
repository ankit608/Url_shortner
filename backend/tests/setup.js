import { sequelize } from "../src/config/db";

module.exports = async () => {
  await sequelize.sync({ force: true }); // Reset DB
};
