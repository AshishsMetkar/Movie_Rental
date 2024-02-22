const jwt = require("jsonwebtoken");
const config = require ("config");

const verifyToken  = async(req,res,next)=>{
    const token = req.headers["x-auth-token"];

    if(!token) return res.status(401).send("A token is required for autentication");
    try{
        const decode = jwt.verify(token,config.get("password"));
        console.log('verified');
        req.user = decode;
        next()
    }
    catch(error){
      res.status(400).send("Invalid Token");
    }
}

module.exports = verifyToken; 