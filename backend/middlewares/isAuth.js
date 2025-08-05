// const isAuth=async (req,res, next)=>{
//     try {

//         let token=req.cookies.token
//         if(!token){
//             return res.status(400).json({message:"Token is not found"})
//         }

//         let verifyToken=await jwt.verify(token.process.env.JWT_SECRET)
//         console.log(verifyToken)
//         req.userId=verifyToken.userId;
//         next();

        
//     } catch (error) {

//         return res.status(500).json({message:`isauth error: ${error}`})
        
//     }
// }

// export default isAuth;


import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    // ✅ Correct usage of jwt.verify
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Make sure you're using the same key structure when signing the token
    req.userId = verifyToken.id; // or verifyToken.userId, depending on what you used when signing

    next();
  } catch (error) {
    return res.status(401).json({ message: `isAuth error: ${error.message}` });
  }
};

export default isAuth;
