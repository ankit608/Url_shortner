import { sequelize } from "../src/config/db";

module.exports = async () => {
  await sequelize.close();
};
