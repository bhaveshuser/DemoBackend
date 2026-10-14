import jwt from "jsonwebtoken";
import secretKey from "../jwtConfig.js";

function authenToken(req, res, next) {

    const authToken = req.header("Authorization");

    if (!authToken) {
        return res.status(401).json({
            message: "Token is missing"
        });
    }

    const [bearer, token] = authToken.split(" ");

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Format not valid"
        });
    }

    jwt.verify(token, secretKey, (err, user) => {

        if (err) {
            console.log("JWT ERROR:", err.message);

            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        console.log("JWT USER:", user);

        req.user = user;

        next();
    });
}

export default authenToken;