const express=require("express")
const { getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe ,upload} = require("../Controllre/recipe")
const verifyToken = require("../middlwere/auth")
const router=express.Router()

// All routes 

router.get("/",getRecipes)//get all reciprs
router.get("/:id",getRecipe)//get recioe by id
router.post("/",upload.single('file'),verifyToken, addRecipe)// router.post("/",addRecipe)//add recipe
router.put("/:id ",upload.single('file'),editRecipe)//updete recipe
router.delete("/:id",deleteRecipe)//delete recipe

module.exports=router