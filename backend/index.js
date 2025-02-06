import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session'
import passport from 'passport'
import  {initializeDB} from "./src/config/db.js"


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(session({secret:process.env.SESSION_SECRET,resave:false}))

initializeDB().then(()=>{
    console.log("Database initilization completed")
}).catch((err)=>{
    console.error("❌ Database initialization error:", err);
})










