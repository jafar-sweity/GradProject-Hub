import { Request, Response } from "express";
import Comment from "../MongoDB/comment.js";
import { updateUserCommunity } from "./userController.js";
import UserCommunity from "../MongoDB/user.js";
import Post from "../MongoDB/Post.js";
import mongoose from "mongoose";

// Create a new comment
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id, content } = req.body;
  const { postId } = req.params;

  try {
    // Validate the input
    if (!postId || !user_id || !content) {
      res
        .status(400)
        .json({ message: "Post ID, user ID, and content are required" });
      return;
    }
    let current_user;

    if (user_id.length > 5) {
      current_user = await UserCommunity.findById(user_id);
    } else {
      current_user = await UserCommunity.findOne({ user_id: user_id });
    }
    // Find the user in the UserCommunity schema
    if (!current_user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Find the post to which the comment will be added
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Create and save the comment
    const newComment = new Comment({
      post_id: post._id,
      user_id: current_user._id,
      content,
    });
    console.log("savedComment", newComment);

    await newComment.save();
    // Add the comment reference to the Post's comments array
    post.comments.push({
      comment_id: newComment._id as mongoose.Types.ObjectId,
    });
    await post.save();

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: newComment });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating comment", error: error.message });
  }
};

export const getCommentsByPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // Fetch all comments for the post
    const comments = await Comment.find({ post_id: postId }).sort({
      createdAt: -1, // Sort by newest first
    });

    // Map over comments and fetch user data separately
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const user = await UserCommunity.findById(comment.user_id);
        return {
          id: comment._id,
          content: comment.content,
          author: {
            username: (user as any)?.username || "Deleted User",
            avatarurl: user?.avatarurl || null,
          },
          createdAt: comment.createdAt,
        };
      })
    );

    res.status(200).json({ comments: commentsWithAuthors });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching comments", error: error.message });
  }
};

// Get a single comment by ID
export const getCommentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }
    res.status(200).json(comment);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching comment", error: error.message });
  }
};

// Update a comment
export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { content } = req.body;

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Update the comment content
    comment.content = content || comment.content;
    const updatedComment = await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating comment", error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    // Delete the comment
    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: error.message });
  }
};
