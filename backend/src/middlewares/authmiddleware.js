
import jwt from 'jsonwebtoken'

export const authenticateUser = (req,res,next)=>{
    console.log(req.body,"ghgh")
   const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
   if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user,"user") 
    next(); 
} catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
}
}