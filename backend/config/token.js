import jwt from "jsonwebtoken"

const genToken= async (userId) => {
    try{
        const token= await jwt.sign({id:userId},process.env.JWT_SECRET, {expiresIn:"24h"} )
        console.log("Generated token:",token);
        return token
    }catch(error){
        console.log("Generate token error:", error.message)
    }
}

export default genToken