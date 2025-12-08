// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//   name:{
//      type:String,
//   } ,
//   rating:{
//     type: Number,
//   },
//   comment:{
//       type:String,
//   } ,
//   imageUrl:{
//     type:String,
//   },
//   },{
//     timestamps:true
//   }
// );

// module.exports = mongoose.model("Review", reviewSchema)



const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: String,
    comment: String,
    rating: Number,
    image: String, // image filename from multer
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
