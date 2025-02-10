import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import User from '../models/user.js'



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

  export const PassAuth =  passport.authenticate("google", { scope: ["profile", "email"] })


 export const passAuthCallback =   passport.authenticate("google", { failureRedirect: "/dashboard", session: false })
 export const sendcookie =   (req, res) => {
        const token = generateToken(req.user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 3600000 // 1 hour
        });
        res.redirect(process.env.CLIENT_URL);
    }

export const logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
}