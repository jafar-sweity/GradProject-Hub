var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Comment from "../MongoDB/comment.js";
import UserCommunity from "../MongoDB/user.js";
import Post from "../MongoDB/Post.js";
// Create a new comment
export const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            current_user = yield UserCommunity.findById(user_id);
        }
        else {
            current_user = yield UserCommunity.findOne({ user_id: user_id });
        }
        // Find the user in the UserCommunity schema
        if (!current_user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Find the post to which the comment will be added
        const post = yield Post.findById(postId);
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
        yield newComment.save();
        // Add the comment reference to the Post's comments array
        post.comments.push({
            comment_id: newComment._id,
        });
        yield post.save();
        res
            .status(201)
            .json({ message: "Comment created successfully", comment: newComment });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error creating comment", error: error.message });
    }
});
export const getCommentsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        // Check if the post exists
        const post = yield Post.findById(postId);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        // Fetch all comments for the post
        const comments = yield Comment.find({ post_id: postId }).sort({
            createdAt: -1, // Sort by newest first
        });
        // Map over comments and fetch user data separately
        const commentsWithAuthors = yield Promise.all(comments.map((comment) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield UserCommunity.findById(comment.user_id);
            return {
                id: comment._id,
                content: comment.content,
                author: {
                    username: (user === null || user === void 0 ? void 0 : user.username) || "Deleted User",
                    avatarurl: (user === null || user === void 0 ? void 0 : user.avatarurl) || null,
                },
                createdAt: comment.createdAt,
            };
        })));
        res.status(200).json({ comments: commentsWithAuthors });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Error fetching comments", error: error.message });
    }
});
// Get a single comment by ID
export const getCommentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        res.status(200).json(comment);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching comment", error: error.message });
    }
});
// Update a comment
export const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    try {
        const comment = yield Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        // Update the comment content
        comment.content = content || comment.content;
        const updatedComment = yield comment.save();
        res.status(200).json({
            message: "Comment updated successfully",
            comment: updatedComment,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error updating comment", error: error.message });
    }
});
// Delete a comment
export const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        // Delete the comment
        yield comment.deleteOne();
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting comment", error: error.message });
    }
});
//# sourceMappingURL=commentController.js.map