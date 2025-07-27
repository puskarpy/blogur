import { validateToken } from "../services/auth.js";

export function checkForAuthenticationCookie(cookieName){
    return (req, res, next)=>{
        const tokenCookieValue = req.cookies[cookieName]

        if(!tokenCookieValue){
            return next();
        }
        
        try {
            const userPayload = validateToken(tokenCookieValue)
            req.user = userPayload
            res.locals.user = userPayload
        } catch (error) {
            console.error("Invalid or expired auth token:", error.message);
        }

        return next();
    }
}