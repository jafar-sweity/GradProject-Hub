var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserCommunity from "../MongoDB/user.js";
import Post from "../MongoDB/Post.js";
import mongoose from "mongoose";
import Like from "../MongoDB/Like.js";
import Bookmark from "../MongoDB/Bookmark.js";
// Create a new post
export const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, content, username, photoUrls } = req.body;
    try {
        if (!content || !user_id) {
            res.status(400).json({ message: "Content and user_id are required" });
            return;
        }
        const userCommunity = yield UserCommunity.findOne({ user_id: user_id });
        if (!userCommunity) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const newPost = new Post({
            user_id: userCommunity._id,
            content,
            username,
            photoUrls: photoUrls,
        });
        const savedPost = yield newPost.save();
        yield userCommunity.updateOne({
            $push: { posts: { post_id: savedPost._id } },
        });
        res
            .status(201)
            .json({ message: "Post created successfully", post: savedPost });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error creating post", error: error.message });
    }
});
// Get all posts
export const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching posts", error: error.message });
    }
});
export const getForYouPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        if (!userId) {
            res.status(400).json({ message: "userId is required" });
            return;
        }
        const currentUser = yield UserCommunity.findOne({ user_id: userId }, { posts: 1 }).populate("posts.post_id");
        // get the avatar url for the current user
        const avatrurl = yield UserCommunity.findOne({ user_id: userId });
        if (!avatrurl) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!currentUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const posts = yield Post.find({ user_id: currentUser._id }).select("_id user_id content likes createdAt comments username avatarurl photoUrls");
        // log the avaatrurl
        const bookmarkedPosts = yield Bookmark.find({
            user_id: currentUser._id,
        }).select("post_id");
        const bookmarkedPostIds = bookmarkedPosts.map((bookmark) => bookmark.post_id.toString());
        const transformedPosts = posts.map((post) => {
            var _a;
            const typedPost = post.toObject();
            return {
                id: typedPost._id.toString(),
                user_id: (_a = typedPost.user_id) === null || _a === void 0 ? void 0 : _a.toString(),
                content: typedPost.content,
                likes: typedPost.likes,
                username: typedPost.username || "",
                createdAt: typedPost.createdAt,
                isBookmarkedByUser: bookmarkedPostIds.includes(typedPost._id.toString()),
                comments: post.comments.length || 0,
                avatarurl: avatrurl.avatarurl || "",
                photoUrls: typedPost.photoUrls,
            };
        });
        res.status(200).json(transformedPosts);
    }
    catch (error) {
        console.error("Error fetching user's posts:", error);
        res
            .status(500)
            .json({ message: "Error fetching posts", error: error.message });
    }
});
export const getFollowingPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query;
        if (!userId) {
            res.status(400).json({ message: "userId is required" });
            return;
        }
        const userCommunity = yield UserCommunity.findOne({
            user_id: Number(userId),
        });
        if (!userCommunity) {
            res.status(404).json({ message: "User not found in the community" });
            return;
        }
        const followingUserIds = userCommunity.following.map((follow) => follow.user_id);
        if (followingUserIds.length === 0) {
            res.status(200).json([]);
            return;
        }
        const followingObjectIds = yield UserCommunity.find({ user_id: { $in: followingUserIds } }, { _id: 1 });
        // Extract the MongoDB ObjectIds
        const followingMongoIds = followingObjectIds.map((user) => user._id);
        const posts = yield Post.find({
            user_id: { $in: followingMongoIds },
        })
            .sort({ createdAt: -1 })
            .select("_id user_id content likes createdAt comments username photoUrls");
        const bookmarkedPosts = yield Bookmark.find({
            user_id: userCommunity._id,
        }).select("post_id");
        const bookmarkedPostIds = bookmarkedPosts.map((bookmark) => bookmark.post_id.toString());
        // Fetch avatar URLs for users
        const userAvatars = yield UserCommunity.find({
            _id: { $in: followingMongoIds },
        }).select("_id avatarurl");
        const avatarMap = userAvatars.reduce((map, user) => {
            map[user._id.toString()] = user.avatarurl;
            return map;
        }, {});
        const transformedPosts = posts.map((post) => {
            var _a, _b;
            return ({
                id: post._id.toString(),
                user_id: (_a = post.user_id) === null || _a === void 0 ? void 0 : _a.toString(),
                content: post.content,
                likes: post.likes,
                username: post.username,
                comments: post.comments.length || 0,
                createdAt: post.createdAt,
                isBookmarkedByUser: bookmarkedPostIds.includes(post._id.toString()),
                avatarurl: avatarMap[(_b = post.user_id) === null || _b === void 0 ? void 0 : _b.toString()] || "",
                photoUrls: post.photoUrls,
            });
        });
        res.status(200).json(transformedPosts);
    }
    catch (error) {
        console.error("Error fetching posts:", error.message);
        res.status(500).json({
            message: "Error fetching posts",
            error: error.message,
        });
    }
});
export const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = (yield Post.findOne({
            _id: req.params.id,
        }));
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const user_id = yield UserCommunity.findOne({ _id: post.user_id });
        // check if the user liked the post or not
        const like = yield Like.findOne({
            post_id: post._id,
            user_id: user_id === null || user_id === void 0 ? void 0 : user_id._id,
        });
        res.status(200).json({
            post_id: post._id,
            user_id: user_id === null || user_id === void 0 ? void 0 : user_id.user_id,
            content: post.content,
            likes: post.likes,
            username: post.username,
            comments: post.comments.length, // Return the number of comments
            createdAt: post.createdAt,
            avatarurl: user_id === null || user_id === void 0 ? void 0 : user_id.avatarurl,
            isLikedByUser: !!like,
            isBookmarkedByUser: true,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching post", error: error.message });
    }
});
// Update a post
export const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    try {
        const post = yield Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        post.content = content || post.content;
        const updatedPost = yield post.save();
        res
            .status(200)
            .json({ message: "Post updated successfully", post: updatedPost });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error updating post", error: error.message });
    }
});
// Delete a post
export const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const post = yield Post.findById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        const userCommunity = yield UserCommunity.findOne({
            user_id: userId,
        });
        if (!userCommunity) {
            res.status(404).json({ message: "User not found in the community" });
            return;
        }
        const deletedPost = yield Post.findByIdAndDelete(id);
        if (!deletedPost) {
            res.status(500).json({ message: "Failed to delete post" });
            return;
        }
        const updatedUserCommunity = yield UserCommunity.updateOne({ user_id: userId }, { $pull: { posts: { post_id: new mongoose.Types.ObjectId(id) } } });
        if (!updatedUserCommunity.modifiedCount) {
            res.status(500).json({ message: "Failed to update user community" });
            return;
        }
        res.status(200).json({
            message: "Post deleted successfully",
            post: deletedPost,
        });
    }
    catch (error) {
        console.error("Error deleting post:", error.message);
        res
            .status(500)
            .json({ message: "Error deleting post", error: error.message });
    }
});
// BookmarkPosts
export const addBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query; // Retrieve numeric userId from query params
        const { id: postId } = req.params; // Retrieve postId from route params
        if (!userId || !postId) {
            res.status(400).json({ message: "userId and postId are required" });
            return;
        }
        // Find the corresponding MongoDB user document using the numeric user_id
        const userDocument = yield UserCommunity.findOne({
            user_id: Number(userId),
        });
        if (!userDocument) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userObjectId = userDocument._id; // Get the MongoDB ObjectId of the user
        // Check if the bookmark already exists
        const existingBookmark = yield Bookmark.findOne({
            user_id: userObjectId,
            post_id: postId,
        });
        if (existingBookmark) {
            res.status(400).json({ message: "Post is already bookmarked" });
            return;
        }
        // Create and save the new bookmark
        const newBookmark = new Bookmark({
            user_id: userObjectId, // Use the MongoDB ObjectId here
            post_id: postId,
        });
        yield newBookmark.save();
        res.status(201).json({ message: "Post bookmarked successfully" });
    }
    catch (error) {
        console.error("Error adding bookmark:", error);
        res
            .status(500)
            .json({ message: "Error adding bookmark", error: error.message });
    }
});
export const removeBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.query; // Retrieve numeric userId from query params
        const { id: postId } = req.params; // Retrieve postId from route params
        if (!userId || !postId) {
            res.status(400).json({ message: "userId and postId are required" });
            return;
        }
        // Find the corresponding MongoDB user document using the numeric user_id
        const userDocument = yield UserCommunity.findOne({
            user_id: Number(userId),
        });
        if (!userDocument) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userObjectId = userDocument._id; // Get the MongoDB ObjectId of the user
        // Check if the bookmark exists
        const existingBookmark = yield Bookmark.findOne({
            user_id: userObjectId,
            post_id: postId,
        });
        if (!existingBookmark) {
            res.status(404).json({ message: "Bookmark not found" });
            return;
        }
        // Remove the bookmark
        yield Bookmark.deleteOne({ _id: existingBookmark._id });
        res.status(200).json({ message: "Bookmark removed successfully" });
    }
    catch (error) {
        console.error("Error removing bookmark:", error);
        res
            .status(500)
            .json({ message: "Error removing bookmark", error: error.message });
    }
});
export const getBookmarkedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Numeric user ID from the route params
        const { cursor, limit = 10 } = req.query; // Pagination parameters
        if (!userId) {
            res.status(400).json({ message: "userId is required" });
            return;
        }
        // Find the MongoDB user document using the numeric `user_id`
        const userDocument = yield UserCommunity.findOne({
            user_id: Number(userId),
        });
        if (!userDocument) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userObjectId = userDocument._id;
        const query = { user_id: userObjectId };
        if (cursor) {
            query._id = { $gt: cursor };
        }
        // Fetch bookmarks and populate post details
        const bookmarks = yield Bookmark.find(query)
            .sort({ _id: 1 }) // Sort by ascending ID for consistent pagination
            .limit(Number(limit))
            .populate({
            path: "post_id",
            model: "Post", // Reference to the Post model
            select: "_id content createdAt username user_id", // Include relevant fields
            populate: {
                path: "user_id", // Populate the user_id field in the Post model
                model: "UserCommunity", // Reference to the UserCommunity model
                select: "avatarurl", // Include the avatarurl field
            },
        });
        // Check if there are any bookmarks
        if (bookmarks.length === 0) {
            res.status(200).json({ posts: [], nextCursor: null });
            return;
        }
        // Prepare the response data with type assertion
        const posts = bookmarks
            .map((bookmark) => {
            var _a;
            const post = bookmark.post_id; // Type assertion
            if (post) {
                return {
                    post_id: post._id,
                    content: post.content,
                    createdAt: post.createdAt ? post.createdAt.toISOString() : "", // Ensure a valid date format
                    username: post.username,
                    avatarurl: ((_a = post.user_id) === null || _a === void 0 ? void 0 : _a.avatarurl) || "", // Access avatarurl from the populated user_id
                    isBookmarkedByUser: true,
                };
            }
            else {
                return null;
            }
        })
            .filter(Boolean); // Remove null entries
        const nextCursor = bookmarks.length === Number(limit)
            ? bookmarks[bookmarks.length - 1]._id
            : null;
        res.status(200).json({ posts, nextCursor });
    }
    catch (error) {
        console.error("Error fetching bookmarked posts:", error);
        res.status(500).json({
            message: "Error fetching bookmarked posts",
            error: error.message,
        });
    }
});
export const Search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { q, userId } = req.query;
    if (!q) {
        res.status(400).json({ message: "Query is required" });
        return;
    }
    if (!userId) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    try {
        // Convert userId to MongoDB ObjectId
        const userCommunity = yield UserCommunity.findOne({
            user_id: Number(userId),
        });
        if (!userCommunity) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userObjectId = userCommunity._id;
        // Aggregate pipeline for searching posts
        const posts = yield Post.aggregate([
            {
                $match: {
                    content: { $regex: q, $options: "i" }, // Search by content
                },
            },
            {
                $lookup: {
                    from: "bookmarks", // Reference to the Bookmark collection
                    localField: "_id",
                    foreignField: "post_id",
                    as: "bookmarks",
                },
            },
            {
                $lookup: {
                    from: "likes", // Reference to the Like collection
                    localField: "_id",
                    foreignField: "post_id",
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "usercommunities", // Fetch user details from the UserCommunity collection
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user_details",
                },
            },
            {
                $project: {
                    id: "$_id",
                    content: 1,
                    username: { $arrayElemAt: ["$user_details.username", 0] }, // Get the username
                    avatarurl: { $arrayElemAt: ["$user_details.avatarurl", 0] }, // Get the avatarurl
                    createdAt: 1,
                    likes: { $size: "$likes" }, // Count the likes
                    comments: { $size: "$comments" }, // Count the comments array
                    isBookmarkedByUser: {
                        $in: [userObjectId, "$bookmarks.user_id"], // Check if bookmarked by the user
                    },
                    isLikedByUser: {
                        $in: [userObjectId, "$likes.user_id"], // Check if liked by the user
                    },
                },
            },
        ]);
        // Map over the posts to ensure the username is from the current user
        const updatedPosts = posts.map((post) => (Object.assign(Object.assign({}, post), { username: userCommunity.username })));
        res.status(200).json(updatedPosts);
    }
    catch (error) {
        console.error("Error fetching posts:", error.message);
        res
            .status(500)
            .json({ message: "Error fetching posts", error: error.message });
    }
});
//# sourceMappingURL=postController.js.map