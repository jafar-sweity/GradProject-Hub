import { Request, Response } from "express";
import Like from "../MongoDB/Like.js"; 
import Post from "../MongoDB/Post.js"; 

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Post ID
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user_id = req.user.user_id; 

    const existingLike = await Like.findOne({ post_id: id, user_id });
    if (existingLike) {
      res.status(400).json({ message: "Already liked this post" });
      return;
    }

    const newLike = new Like({
      post_id: id,
      user_id,
      createdAt: new Date(),
    });

    await newLike.save();
    res.status(201).json({ message: "Post liked successfully" });
  } catch (error: any) {
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
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user_id = req.user.user_id;

    const result = await Like.findOneAndDelete({ post_id: id, user_id });
    if (!result) {
      res.status(404).json({ message: "Like not found" });
      return;
    }

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error: any) {
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

    const likes = await Like.find({ post_id: id }).populate("user_id", "name");
    res.status(200).json({ likes });
  } catch (error: any) {
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
