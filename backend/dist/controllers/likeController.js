var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Like from "../MongoDB/Like.js";
import Post from "../MongoDB/Post.js";
import UserCommunity from "../MongoDB/user.js";
// Like a post
export const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Post ID
        const { userId } = req.query; // Extract user ID from query params
        // Validate input
        if (!userId) {
            res.status(400).json({ message: "Invalid or missing user ID" });
            return;
        }
        const user_ID = yield UserCommunity.findOne({ user_id: userId });
        if (!user_ID) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Check if already liked
        const existingLike = yield Like.findOne({
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
        const post = yield Post.findById(id);
        if (post) {
            post.likes += 1;
            yield post.save();
        }
        else {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        yield newLike.save();
        res.status(201).json({ message: "Post liked successfully" });
    }
    catch (error) {
        console.error("Error liking post:", error);
        res
            .status(500)
            .json({ message: "Error liking post", error: error.message });
    }
});
// Unlike a post
export const unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Post ID
        const { userId } = req.query; // Extract user ID from query params
        // Validate input
        if (!userId) {
            res.status(400).json({ message: "Invalid or missing user ID" });
            return;
        }
        const user_ID = yield UserCommunity.findOne({ user_id: userId });
        if (!user_ID) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Find and delete the like
        const result = yield Like.findOneAndDelete({
            post_id: id,
            user_id: user_ID._id,
        });
        // and decres the likes count in the post
        const post = yield Post.findById(id);
        if (post) {
            post.likes -= 1;
            yield post.save();
        }
        else {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (!result) {
            res.status(404).json({ message: "Like not found" });
            return;
        }
        res.status(200).json({ message: "Post unliked successfully" });
    }
    catch (error) {
        console.error("Error unliking post:", error);
        res
            .status(500)
            .json({ message: "Error unliking post", error: error.message });
    }
});
// Get likes for a specific post
export const getLikesForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Post ID
        const { userId } = req.query; // Current user ID
        if (!userId) {
            res.status(400).json({ message: "Invalid or missing user ID" });
            return;
        }
        const user_ID = yield UserCommunity.findOne({ user_id: userId });
        if (!user_ID) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const totalLikes = yield Like.countDocuments({ post_id: id });
        // Check if the user has liked the post
        const isLikedByUser = yield Like.exists({
            post_id: id,
            user_id: user_ID._id,
        });
        res.status(200).json({
            likes: totalLikes,
            isLikedByUser: !!isLikedByUser, // Convert to boolean
        });
    }
    catch (error) {
        console.error("Error fetching likes:", error);
        res
            .status(500)
            .json({ message: "Error fetching likes", error: error.message });
    }
});
// Get posts liked by a user
export const getLikedPostsByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const likedPosts = yield Like.find({ user_id: userId }).populate("post_id");
        res.status(200).json({ likedPosts });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching liked posts", error: error.message });
    }
});
//# sourceMappingURL=likeController.js.map