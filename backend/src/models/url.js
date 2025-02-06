import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import User from "./user";

const Url = sequelize.define('Url',{
    id: {type:DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey:true},
    longUrl: {type:DataTypes.STRING, allowNull:false},
    shortUrl: {type:DataTypes.STRING, unique:true},
    customUrl: {type:DataTypes.STRING,unique:true},
    topic: {type:DataTypes.STRING},
    userId: {type:DataTypes.UUID,allowNull:false,references:{model:User,key:"id"}},
})

User.hasMany(Url,{foreignKey:'userId'})
Url.belongsTo(User,{foreignKey:'userId'})

export default Url
