import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const userAuth=async(req,res,next)=>{

    const {token}=req.cookies;

    if(!token)
    {
        return res.status(400).send({message:"Not Authorizes,Login Again"});
    }
    try {
        
        const tokenDecode=jwt.verify(token,process.env.SECRET_KEY)

        if(tokenDecode.id)
        {
            req.body.USER_ID=tokenDecode.id;

        }
        else{
            return res.status(400).send({message:"Not Authorized Login Again"})
        }
        next();

    } catch (error) {
        return res.status(400).send({message:"error in token authorization",error})
    }
}

export default userAuth;