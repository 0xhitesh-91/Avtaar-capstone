import jwt from "jsonwebtoken";

function jwtTokens(userid, name, email){
    const user = {userid, name, email};
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'20s'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn:'5m'});
    return ({accessToken, refreshToken});
}

export {jwtTokens};