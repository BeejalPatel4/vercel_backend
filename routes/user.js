const express=require("express");
const router=express.Router()
const {userLogin,userSignUp,getUser}=require("../Controllre/user")

router.post("/singUp",userSignUp)
router.post("/login",userLogin)
router.get("/user/:id",getUser)

module.exports=router