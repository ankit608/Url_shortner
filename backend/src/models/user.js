import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define('User',{
    id: {type:DataTypes.UUID, defaultValue:DataTypes.UUIDV4, primaryKey:true},
    googleId:{type:DataTypes.STRING,unique:true,allowNull:false},
    email: {type:DataTypes.STRING, unique:true, allowNull:false},
    name:{type:DataTypes.STRING, allowNull:false}

}
)

export default User