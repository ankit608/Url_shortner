import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import Url from "./url";

const Click = sequelize.define('Click', {
    id:{type:DataTypes.UUID, defaultValue:DataTypes.UUIDV4, primaryKey:true},
    urlId: {type:DataTypes.UUID, allowNull:false, references: {model:Url,key:'id'}},
    userAgent: {type: DataTypes.STRING},
    ipAddress: {type:DataTypes.STRING},
    osType:{type:DataTypes.STRING},
    deviceType: {type:DataTypes.STRING},
    clickedAt: {type:DataTypes.DATE, defaultValue: DataTypes.NOW}

});

Url.hasMany(Click,{foreignKey:'urlId'})
Click.belongsTo(Url,{foreignKey:'urlId'});

export default Click