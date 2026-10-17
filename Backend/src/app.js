
import express from "express";
import postModel from "./models/post.model.js";
import multer from "multer";
import uploadFile from "../services/storage.service.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET all posts
app.get("/posts", async (req, res) => {
  try {
    const post = await postModel.find();

    return res.status(200).json({
      message: "Posts fetched successfully",
      post,
    });
  } catch (error) {
    console.error("Fetch posts error:", error);

    return res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
});

// CREATE a post
app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    const { desc } = req.body;

    if (!desc?.trim()) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const result = await uploadFile(req.file.buffer);

    const post = await postModel.create({
      image: result.url,
      desc: desc.trim(),
    });

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Failed to create post",
    });
  }
});

// DELETE a post
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      post,
    });
  } catch (error) {
    console.error("Delete post error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
      message: "Failed to delete post",
    });
  }
});

// UPDATE a post
app.put("/posts/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { desc } = req.body;

    const updateData = {};

    if (desc !== undefined) {
      if (!desc.trim()) {
        return res.status(400).json({
          message: "Description cannot be empty",
        });
      }

      updateData.desc = desc.trim();
    }

    // Upload a new image only if the user selected one
    if (req.file) {
      const result = await uploadFile(req.file.buffer);
      updateData.image = result.url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No data provided to update",
      });
    }

    const post = await postModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid post ID",
      });
    }

    return res.status(500).json({
      message: "Failed to update post",
    });
  }
});

// Handle Multer errors
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: "Image upload error",
      error: error.message,
    });
  }

  if (error) {
    console.error("Unexpected server error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }

  next();
});

export default app;
