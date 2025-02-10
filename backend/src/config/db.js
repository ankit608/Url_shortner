import {Sequelize} from 'sequelize'
import dotenv from 'dotenv'

dotenv.config();

export const sequelize = new Sequelize(process.env. DATABASE_URL,{
    dialect:'postgres',
    logging: false,
   
})
export const initializeDB = async () =>{
    try{
      await sequelize.authenticate();
      import("../models/user.js");
      await sequelize.sync({ alter: true }); 
       console.log('Database connected successully')
    }catch(error){
           console.log("db cannot be connected", error)
           process.exit(1)
    }
}
