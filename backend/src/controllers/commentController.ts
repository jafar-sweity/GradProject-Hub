import { Request, Response } from "express";
import Comment from "../MongoDB/comment.js";

// Create a new comment
export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { post_id, user_id, content } = req.body;

  try {
    // Validate the input
    if (!post_id || !user_id || !content) {
      res
        .status(400)
        .json({ message: "Post ID, user ID, and content are required" });
      return;
    }

    // Create and save the comment
    const newComment = new Comment({
      post_id,
      user_id,
      content,
    });

    const savedComment = await newComment.save();

    res
      .status(201)
      .json({ message: "Comment created successfully", comment: savedComment });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating comment", error: error.message });
  }
};

// Get all comments for a specific post
export const getCommentsByPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post_id: postId });

    if (comments.length === 0) {
      res.status(404).json({ message: "No comments found for this post" });
      return;
    }

    res.status(200).json(comments);
  } catch (error: any) {
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
