var jwt =module.require('jsonwebtoken');
const bcrypt = module.require('bcrypt');
const usermodel=module.require("../models/usersModel")



const login=async(req,res)=>{
    let{email,password}=req.body;
    if(!email||!password){
        return res.json({message:"required"})
    }
    let user=await usermodel.findOne({email:email})
    if(!user){
        return res.json({message:"invalid email or password"})
    }
    let isvalid=await bcrypt.compare(password,user.password)
    if(!isvalid){
        return res.json({message:"invalid email or password "})

    }
    let token=jwt.sign({data:{email:user.email,id:user._id,role:user.role}},process.env.secret,{expiresIn:"3h"})
    return res.json({message:"success",token:token})
}
module.exports={login}
