

//in this file have mathod data post get 

// const recipe = require("../models/recipe")
const Recipes=require("../models/recipe")
// const multer  = require('multer')


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/Public/images')
//   },
//   filename: function (req, file, cb) {
//     const filename = Date.now() + '-' + file.fieldname
//     cb(null,filename)
//   }
// })

// const upload = multer({ storage: storage })

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'Public', 'images')); //this way path was cath in any way
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });



// to get data all recipe
const getRecipes=async(req,res)=>{
  
    const recipes=await Recipes.find()
    return res.json(recipes)
}
// to choice one recipe and get that
const getRecipe=async(req,res)=>{
    const recipe=await Recipes.findById(req.params.id)
    res.json(recipe)
}
// add recipe
// const addRecipe=async(req,res)=>{
// //    defines an async funtion named addrecipe that take the request and response object
// // an arguments
//     const {title,ingredients,instructions,time}=req.body   
//     // add the  new values form the req.body to the properties of the recipe object
//     if(!title||!ingredients || !instructions || !time)
//     { 
//         res.json({message:"Required filld can't be empty"})
//     }
//     const newRecipe= await Recipes.create({
//         title,ingredients,instructions,time,coverImage:req.file.filename
//     })
//     return res.json(newRecipe)
// }


const addRecipe = async (req, res) => {
  console.log(req.user)
  const { title, ingredients, instructions, time, video } = req.body;

  if (!title || !ingredients || !instructions || !time) {
    return res.json({ message: "Required fields can't be empty" });
  }

  const newRecipe = await Recipes.create({
    title,
    ingredients,
    instructions,
    time,
    video,
    coverImage: req.file ? req.file.filename : "",
    createdby:req.user,
  });

  return res.json(newRecipe);
};

// const editRecipe = async (req, res) => {
//   try {
//     const { title, ingredients, instructions, time, video } = req.body;
//     let recipe = await Recipes.findById(req.params.id);

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }

//     const coverImage = req.file?.filename || recipe.coverImage;

//     const updatedRecipe = await Recipes.findByIdAndUpdate(
//       req.params.id,
//       { title, ingredients, instructions, time, coverImage, video },
//       { new: true }
//     );

//     res.json(updatedRecipe);
//   } catch (err) {
//     console.error("Update error:", err);
//     return res.status(500).json({ message: "Failed to update recipe" });
//   }
// };


// // // to edit 
// const editRecipe=async(req,res)=>{
     
//     const {title,ingredients,instructions,time,coverImage,video}=req.body
//     let recipe=await Recipes.findById(req.params.id)
   
//    try{
//     if(recipe){
//         await Recipes.findByIdAndUpdate(req.params.id,{...req.body,coverImage,video},{new:true})
//         res.json({title,ingredients,instructions,time,coverImage,video})
//     }
// }
// catch(err){
//     return res.status(404).json({message:"Error youre data not show"})
// }
// }

const editRecipe=async(req,res)=>{
    const {title,ingredients,instructions,time}=req.body 
    let recipe=await Recipes.findById(req.params.id)

    try{
        if(recipe){
            let coverImage=req.file?.filename ? req.file?.filename : recipe.coverImage 
            await Recipes.findByIdAndUpdate(req.params.id,{...req.body,coverImage},{new:true})
            res.json({title,ingredients,instructions,time})
        }
    }
    catch(err){
        return res.status(404).json({message:err})
    }
    
}



// delete recipe
const deleteRecipe= async(req,res)=>{
    try{
      await Recipes.deleteOne({_id:req.params.id})
      res.json({status:"ok"})
    }
    catch(err){
      return res.status(400).json({message:"error"})
    }
}



module.exports={getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload}

