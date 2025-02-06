import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session'
import passport from 'passport'
import  {initializeDB} from "./src/config/db.js"
import router from './src/routes/route.js'

dotenv.config()

const app = express()
app.use(express.json())

app.use(cors())



initializeDB().then(()=>{
    console.log("Database initilization completed")
}).catch((err)=>{
    console.error("❌ Database initialization error:", err);
})

app.use(router)

app.listen(8080,()=>{
    console.log(`server is connected to the 8080`)
})






