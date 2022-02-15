import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; //bearer token
    const token = authHeader && authHeader.split(' ')[1];

    //check token has any value or not
    if(token == null) return res.status(401).json({error : "Null token"});

    //verify is token valid or not
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error) return res.status(403).json({error : error.message});
        req.user = user;
        next();
    });
}

export {authenticateToken};