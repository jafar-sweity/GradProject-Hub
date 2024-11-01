import { Request, Response } from "express";
import Post from "../MongoDB/Post.js";

// Create a new post
export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, content } = req.body;

  try {
    if (!content || !user_id) {
      res.status(400).json({ message: "Content and user_id are required" });
      return;
    }

    // Create and save the post
    const newPost = new Post({
      user_id,
      content,
    });

    const savedPost = await newPost.save();

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
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
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

    // Update the post content
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
    return;
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
    return;
  }
};
