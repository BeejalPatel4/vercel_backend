

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Review = require("../models/review");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "Public", "reviewImages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Create review
router.post("/review", upload.single("image"), async (req, res) => {
  try {
    const { name, comment, rating } = req.body;
    const image = req.file?.filename || "";

    if (!name || !comment || !rating) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const newReview = await Review.create({ name, comment, rating, image });
    res.json({ message: "Review submitted!", review: newReview });
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
