// const express = require("express");
// const multer = require("multer");
// const Review = require("../models/Review");

// const router = express.Router();

// // Storage config
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
// });

// const upload = multer({ storage });

// // POST route
// router.post("/add", upload.single("image"), async (req, res) => {
//   try {
//     const { name, rating, comment } = req.body;
//     const newReview = new Review({
//       name,
//       rating,
//       comment,
//       imageUrl: req.file ? req.file.filename : ""
//     });

//     await newReview.save();
//     res.status(201).json({ message: "Review added successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET all reviews
// router.get("/", async (req, res) => {
//   try {
//     const reviews = await Review.find().sort({ createdAt: -1 });
//     res.json(reviews);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;






const Review = require("../models/review");
const multer = require("multer");
const path = require("path");

// Setup multer storage for review images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "Public", "reviewImages")); // upload location
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // unique filename
  },
});

const upload = multer({ storage });


// 👉 Get all reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch reviews", error: err.message });
  }
};

// 👉 Get review by ID
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving review", error: err.message });
  }
};

// 👉 Add new review
const addReview = async (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const newReview = await Review.create({
      name,
      rating,
      comment,
      imageUrl: req.file ? req.file.filename : "",
    });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: "Unable to save review", error: err.message });
  }
};

// 👉 Edit review
const editReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update review", error: err.message });
  }
};

// 👉 Delete review
const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete review", error: err.message });
  }
};

module.exports = {
  getReviews,
  getReview,
  addReview,
  editReview,
  deleteReview,
  upload,
}
