import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session'

import  {initializeDB} from "./src/config/db.js"
import router from './src/routes/route.js'
import cookieParser from "cookie-parser";
import swagger from './src/config/swagger.js'
import { authenticateUser } from './src/middlewares/authMiddleware.js'

dotenv.config()

const app = express()
app.use(express.json())
swagger(app)
app.use(morgan("dev"))

app.use(cors())
app.use(cookieParser())
app.get("/",(req,res)=>{
    res.status(200).json({messsgae:"all is good"})
})

initializeDB().then(()=>{
    console.log("Database initilization completed")
}).catch((err)=>{
    console.error(" Database initialization error:", err);
})
/*app.get('/google', (req, res) => {
    
    res.redirect('https://www.google.com');
});*/

router.get("/dashboard" ,authenticateUser, (req,res)=>{
    res.json({messsgae:"welcome to the dashboard", user:req.user})
})
app.use(router)

app.listen(8080,()=>{
    console.log(`server is connected to the 8080`)
})






/*{
    origin: "http://localhost:3000", 
    credentials: true, 
} */