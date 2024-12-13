import { Request, Response } from "express";
import UserCommunity from "../MongoDB/user.js";

import Post from "../MongoDB/Post.js";
import { where } from "sequelize";
import mongoose from "mongoose";
import user from "../MongoDB/user.js";

// Create a new post
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, content, username } = req.body;

  try {
    if (!content || !user_id) {
      res.status(400).json({ message: "Content and user_id are required" });
      return;
    }
    const userCommunity = await UserCommunity.findOne({ user_id: user_id });
    if (!userCommunity) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const newPost = new Post({
      user_id: userCommunity._id,
      content,
      username,
    });

    const savedPost = await newPost.save();

    await userCommunity.updateOne({
      $push: { posts: { post_id: savedPost._id } },
    });
    res
      .status(201)
      .json({ message: "Post created successfully", post: savedPost });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Get all posts
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

export const getForYouPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;
    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const currentUser = await UserCommunity.findOne(
      { user_id: userId },
      { posts: 1 }
    ).populate("posts.post_id");

    if (!currentUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const posts = await Post.find({ user_id: currentUser._id }).select(
      "_id user_id content likes createdAt comments username"
    );
    const transformedPosts = posts.map((post) => {
      const typedPost = post.toObject() as {
        _id: mongoose.Types.ObjectId;
        user_id: mongoose.Types.ObjectId;
        content: string;
        likes: number;
        username?: string;
        comments: any[];
        createdAt: Date;
      };
      return {
        id: typedPost._id.toString(),
        user_id: typedPost.user_id?.toString(),
        content: typedPost.content,
        likes: typedPost.likes,
        username: typedPost.username || "",
        createdAt: typedPost.createdAt,
      };
    });
    res.status(200).json(transformedPosts);
  } catch (error: any) {
    console.error("Error fetching user's posts:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};
export const getFollowingPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const userCommunity = await UserCommunity.findOne({
      user_id: Number(userId),
    });

    if (!userCommunity) {
      res.status(404).json({ message: "User not found in the community" });
      return;
    }

    const followingUserIds = userCommunity.following.map(
      (follow) => follow.user_id
    );


    if (followingUserIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    const followingObjectIds = await UserCommunity.find(
      { user_id: { $in: followingUserIds } },
      { _id: 1 }
    );

    // Extract the MongoDB ObjectIds
    const followingMongoIds = followingObjectIds.map((user) => user._id);

   


    const posts = await Post.find({
      user_id: { $in: followingMongoIds },
    })
      .sort({ createdAt: -1 })
      .select("_id user_id content likes createdAt comments username");

    const transformedPosts = posts.map((post: any) => ({
      id: post._id.toString(),
      user_id: post.user_id?.toString(),
      content: post.content,
      likes: post.likes,
      username: post.username,
      comments: post.comments?.length || 0,
      createdAt: post.createdAt,
    }));

    res.status(200).json(transformedPosts);
  } catch (error: any) {
    console.error("Error fetching posts:", error.message);

    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

// Get a single post by ID
export const getPostById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.status(200).json(post);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

// Update a post
export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    post.content = content || post.content;
    const updatedPost = await post.save();

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

// Delete a post

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params; 
    const { userId } = req.query; 

    if (!id) {
      res.status(400).json({ message: "Invalid post ID" });
      return;
    }
    if (!userId) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    const userCommunity = await UserCommunity.findOne({
      user_id: userId,
    });
    if (!userCommunity) {
      res.status(404).json({ message: "User not found in the community" });
      return;
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      res.status(500).json({ message: "Failed to delete post" });
      return;
    }

    const updatedUserCommunity = await UserCommunity.updateOne(
      { user_id: userId },
      { $pull: { posts: { post_id: new mongoose.Types.ObjectId(id) } } }
    );

    if (!updatedUserCommunity.modifiedCount) {
      res.status(500).json({ message: "Failed to update user community" });
      return;
    }

    res.status(200).json({
      message: "Post deleted successfully",
      post: deletedPost,
    });
  } catch (error: any) {
    console.error("Error deleting post:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
