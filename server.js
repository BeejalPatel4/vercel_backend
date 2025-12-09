


// // const mongoose = require("mongoose");
// // const express = require("express");
// // const cors = require("cors");
// // const dotenv = require("dotenv").config();
// // const reviewRoutes = require("./routes/review");
// // const OpenAI = require("openai");

// // const app = express();
// // const PORT = process.env.PORT;

// // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// // let cachedConnection = null;

// // async function connectDb() {
// //   if (cachedConnection) {
// //     return cachedConnection;
// //   }

// //   try {
// //     const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });
// //     cachedConnection = conn;
// //     console.log("MongoDB connected:", conn.connection.host);
// //     return conn;
// //   } catch (error) {
// //     console.error("MongoDB connection error:", error.message);
// //     throw error; // don't use process.exit in serverless
// //   }
// // }

// // app.use(cors());
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));
// // app.use(express.static("public"));

// // // Middleware to ensure DB connection
// // app.use(async (req, res, next) => {
// //   try {
// //     await connectDb();
// //     next();
// //   } catch (err) {
// //     res.status(500).json({ message: "Database connection failed" });
// //   }
// // });

// // // OpenAI route
// // app.post("/agent", async (req, res) => {
// //   try {
// //     const userInput = req.body.input;
// //     const chat = await openai.chat.completions.create({
// //       model: "gpt-4",
// //       messages: [{ role: "user", content: userInput }],
// //     });
// //     res.json({ reply: chat.choices[0].message.content });
// //   } catch (err) {
// //     console.error("OpenAI error:", err.message);
// //     res.status(500).json({ message: "AI request failed" });
// //   }
// // });

// // // Other routes
// // app.use("/", require("./routes/user"));
// // app.use("/recipe", require("./routes/recipe"));
// // app.use("/", reviewRoutes);

// // // Export for Vercel
// // module.exports = app;


// const mongoose = require("mongoose");
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv").config();
// const reviewRoutes = require("./routes/review");
// const OpenAI = require("openai");
// const serverless = require("serverless-http"); // <-- important

// const app = express();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// let cachedConnection = null;

// async function connectDb() {
//   if (cachedConnection) return cachedConnection;

//   try {
//     const conn = await mongoose.connect(process.env.CONNECTION_STRING, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     cachedConnection = conn;
//     console.log("MongoDB connected:", conn.connection.host);
//     return conn;
//   } catch (error) {
//     console.error("MongoDB connection error:", error.message);
//     throw error; // don't use process.exit in serverless
//   }
// }

// // Connect once at cold start
// (async () => {
//   await connectDb();
// })();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// // OpenAI route
// app.post("/agent", async (req, res) => {
//   try {
//     const userInput = req.body.input;
//     const chat = await openai.chat.completions.create({
//       model: "gpt-4",
//       messages: [{ role: "user", content: userInput }],
//     });
//     res.json({ reply: chat.choices[0].message.content });
//   } catch (err) {
//     console.error("OpenAI error:", err.message);
//     res.status(500).json({ message: "AI request failed" });
//   }
// });

// // Other routes
// app.use("/", require("./routes/user"));
// app.use("/recipe", require("./routes/recipe"));
// app.use("/", reviewRoutes);

// // Export wrapped app for Vercel
// module.exports = serverless(app);


// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connectDb = require("./config/db"); // your db config file
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipe");
const OpenAI = require("openai");

const app = express();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Connect to MongoDB
(async () => {
  await connectDb();
})();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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
app.use("/", userRoutes);
app.use("/recipe", recipeRoutes);
app.use("/", reviewRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
