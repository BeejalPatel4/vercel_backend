// const mongoose=require("mongoose")//that connect the databace in mongoDb

// const connectDb=async()=>{
//     await mongoose.connect(process.env.CONNECTION_STRING)//it awaite the connection string
//     .then(()=>console.log('connectede sucssefuly.'))


// }

// module.exports=connectDb

const mongoose = require("mongoose");

let isConnected = false; // track connection state

const connectDb = async () => {
  if (isConnected) {
    console.log("Already connected to MongoDB.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // stop app if connection fails
  }
};



module.exports = connectDb;
