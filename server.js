// // import OpenAI from 'openai'
// const mongoose=require("mongoose")//that connect the databace in mongoDb

// const express=require("express")
// const app=express()
// const dotenv=require("dotenv").config()
// // const connectDb=require("./config/connectionDb")

// const cors=require("cors");
// const reviewRoutes = require("./routes/review");
// // const bodyParser = require('body-parser');
// const OpenAI = require('openai');

// const PORT=process.env.PORT 


// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })


// // connectDb()
// app.use(cors());



// let isConnected = false; // track connection state

// const connectDb = async () => {
//   if (isConnected) {
//     console.log("Already connected to MongoDB.");
//     return;
//   }

//   try {
//     const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     isConnected = true;
//     console.log(`MongoDB connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error connecting to MongoDB: ${error.message}`);
//     process.exit(1); // stop app if connection fails
//   }
// };
// app.use(express.json())
// app.post('/agent', async (req, res) => {
//   const userInput = req.body.input
//   const chat = await openai.chat.completions.create({
//     model: 'gpt-4',
//     messages: [{ role: 'user', content: userInput }]
//   })
//   res.json({ reply: chat.choices[0].message.content })
// })


// app.use((req,res,next)=>{
//   if(!isConnected){
//     connectDb();
//   }
//   next();
// })



// // app.use(cors());
// app.use(express.static("public"))
// app.use(express.urlencoded({ extended: true }));


// app.use("/",require("./routes/user"))
// app.use("/recipe",require("./routes/recipe"))


// app.use("/", reviewRoutes); // or app.use("/review", reviewRoutes);



// // app.listen(PORT,(err)=>{
// //     console.log(`app is listenig on port ${PORT}`)
// // })


// module.exports=app



const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const reviewRoutes = require("./routes/review");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let cachedConnection = null;

async function connectDb() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    cachedConnection = conn;
    console.log("MongoDB connected:", conn.connection.host);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error; // don't use process.exit in serverless
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// OpenAI route
app.post("/agent", async (req, res) => {
  try {
    const userInput = req.body.input;
    const chat = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: userInput }],
    });
    res.json({ reply: chat.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ message: "AI request failed" });
  }
});

// Other routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));
app.use("/", reviewRoutes);

// Export for Vercel
module.exports = app;
