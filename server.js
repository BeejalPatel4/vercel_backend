// import OpenAI from 'openai'
const express=require("express")
const app=express()
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
// const reviewController=require("./Controllre/reviewController")
const cors=require("cors");
const reviewRoutes = require("./routes/review");
// const bodyParser = require('body-parser');
const OpenAI = require('openai');

const PORT=process.env.PORT 


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })


connectDb()
app.use(cors());

app.use(express.json())
app.post('/agent', async (req, res) => {
  const userInput = req.body.input
  const chat = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: userInput }]
  })
  res.json({ reply: chat.choices[0].message.content })
})


// app.use(cors());
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
// app.use("/reviewImages", express.static(path.join(__dirname, "Public", "reviewImages")));

app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))
// app.use("/review", require("./routes/review")) // this adds the review router

app.use("/", reviewRoutes); // or app.use("/review", reviewRoutes);

// app.use(bodyParser.json()); // Ensure request body is properly parsed
// app.listen(3000, () => console.log('Server running on port 3000'));

app.listen(PORT,(err)=>{
    console.log(`app is listenig on port ${PORT}`)
})
// app.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000');
// });

