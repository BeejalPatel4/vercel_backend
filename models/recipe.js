



const mongoose=require("mongoose")
// schema database have what type of data type
const recipeSchema=mongoose.Schema({
  title:{
    type:String,
    
  },
  ingredients:{
    type:[String],
    require:true
   
    
  },
instructions: {
  type: String
},
  time:{
    type:String,
    
  },
  coverImage:{
    type:String,
   
  },
  video: {
      type: String,
    },
createdby: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},


},
{timeStamps:true}
)

module.exports=mongoose.model("Recipes",recipeSchema)



