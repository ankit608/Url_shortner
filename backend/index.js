import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session'
import passport from 'passport'
import  {initializeDB} from "./src/config/db.js"
import router from './src/routes/route.js'
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from './src/models/user.js'
import { authenticateUser } from './src/middlewares/authMiddleware.js'
import SwaggerDocs from './src/config/swagger.js'
import swagger from './src/config/swagger.js'

dotenv.config()

const app = express()
app.use(express.json())
swagger(app)

app.use(cors({
    origin: "http://localhost:3000", // Frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers)
}))
app.use(cookieParser())
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secretKey",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set `true` in production with HTTPS
    })
);
  
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
      try{
           
        let user = await User.findOne({ where: { googleId: profile.id } });
              
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }

               
                const token = jwt.sign(
                    { id: user.id, name: user.name, email: user.email },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );

                return done(null,  user); // 
      }catch(error){
        return done(error, null);
      }
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const generateToken = (user) => {
    return jwt.sign({ id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET, { expiresIn: "1h" });
};
app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/dashboard", session: false }),
    (req, res) => {
        const token = generateToken(req.user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000 // 1 hour
        });
        res.redirect(process.env.CLIENT_URL);
    }
);
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});
initializeDB().then(()=>{
    console.log("Database initilization completed")
}).catch((err)=>{
    console.error("❌ Database initialization error:", err);
})
app.get("/dashboard", authenticateUser , (req, res) => {
    res.json({ message: "Welcome to Dashboard", user: req.user });
});
app.use(router)

app.listen(8080,()=>{
    console.log(`server is connected to the 8080`)
})






