import { Request, Response } from "express";
import Like from "../MongoDB/Like.js";
import Post from "../MongoDB/Post.js";
import mongoose from "mongoose";
import UserCommunity from "../MongoDB/user.js";

// Like a post
export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Post ID
    const { userId } = req.query; // Extract user ID from query params

    // Validate input
    if (!userId) {
      res.status(400).json({ message: "Invalid or missing user ID" });
      return;
    }

    const user_ID = await UserCommunity.findOne({ user_id: userId });
    if (!user_ID) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      post_id: id,
      user_id: user_ID._id,
    });
    if (existingLike) {
      res.status(400).json({ message: "Already liked this post" });
      return;
    }

    // Create new like
    const newLike = new Like({
      post_id: id,
      user_id: user_ID._id,
      createdAt: new Date(),
    });
    // and increase the likes count in the post
    const post = await Post.findById(id);
    if (post) {
      post.likes += 1;
      await post.save();
    } else {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    await newLike.save();
    res.status(201).json({ message: "Post liked successfully" });
  } catch (error: any) {
    console.error("Error liking post:", error);
    res
      .status(500)
      .json({ message: "Error liking post", error: error.message });
  }
};

// Unlike a post
export const unlikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Post ID
    const { userId } = req.query; // Extract user ID from query params

    // Validate input
    if (!userId) {
      res.status(400).json({ message: "Invalid or missing user ID" });
      return;
    }

    const user_ID = await UserCommunity.findOne({ user_id: userId });
    if (!user_ID) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Find and delete the like
    const result = await Like.findOneAndDelete({
      post_id: id,
      user_id: user_ID._id,
    });
    // and decres the likes count in the post
    const post = await Post.findById(id);
    if (post) {
      post.likes -= 1;
      await post.save();
    } else {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    if (!result) {
      res.status(404).json({ message: "Like not found" });
      return;
    }

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error: any) {
    console.error("Error unliking post:", error);
    res
      .status(500)
      .json({ message: "Error unliking post", error: error.message });
  }
};

// Get likes for a specific post
export const getLikesForPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; // Post ID
    const { userId } = req.query; // Current user ID

    if (!userId) {
      res.status(400).json({ message: "Invalid or missing user ID" });
      return;
    }

    const user_ID = await UserCommunity.findOne({ user_id: userId });
    if (!user_ID) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const totalLikes = await Like.countDocuments({ post_id: id });

    // Check if the user has liked the post
    const isLikedByUser = await Like.exists({
      post_id: id,
      user_id: user_ID._id,
    });

    res.status(200).json({
      likes: totalLikes,
      isLikedByUser: !!isLikedByUser, // Convert to boolean
    });
  } catch (error: any) {
    console.error("Error fetching likes:", error);
    res
      .status(500)
      .json({ message: "Error fetching likes", error: error.message });
  }
};

// Get posts liked by a user
export const getLikedPostsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const likedPosts = await Like.find({ user_id: userId }).populate("post_id");
    res.status(200).json({ likedPosts });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching liked posts", error: error.message });
  }
};
