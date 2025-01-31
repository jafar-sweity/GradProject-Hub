var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Follow from "../MongoDB/follow.js"; // Import the Follow model
import UserCommunity from "../MongoDB/user.js"; // Import the UserCommunity model
export const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // User to follow
        const { currentUserId } = req.query; // Current user's ID
        if (!currentUserId) {
            res.status(400).json({ message: "Invalid or missing currentUserId" });
            return;
        }
        const currentUserCommunity = yield UserCommunity.findOne({
            user_id: Number(currentUserId),
        });
        const userToFollow = yield UserCommunity.findOne({ user_id: Number(id) });
        if (!currentUserCommunity || !userToFollow) {
            res.status(404).json({ message: "User not found in community" });
            return;
        }
        const existingFollow = yield Follow.findOne({
            follower_id: currentUserCommunity._id,
            following_id: userToFollow._id,
        });
        if (existingFollow) {
            res.status(400).json({ message: "Already following this user" });
            return;
        }
        const newFollow = new Follow({
            follower_id: currentUserCommunity._id,
            following_id: userToFollow._id,
        });
        yield newFollow.save();
        userToFollow.followers.push({ user_id: Number(currentUserId) });
        yield userToFollow.save();
        currentUserCommunity.following.push({ user_id: Number(id) });
        yield currentUserCommunity.save();
        res.status(200).json({
            message: `Successfully followed user ${id}`,
            followersCount: userToFollow.followers.length,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error following user", error: error.message });
    }
});
export const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // User to unfollow
        const { currentUserId } = req.query; // Current user's ID
        if (!currentUserId) {
            res.status(400).json({ message: "Invalid or missing currentUserId" });
            return;
        }
        const currentUserCommunity = yield UserCommunity.findOne({
            user_id: Number(currentUserId),
        });
        const userToUnfollow = yield UserCommunity.findOne({ user_id: Number(id) });
        if (!currentUserCommunity || !userToUnfollow) {
            res.status(404).json({ message: "User not found in community" });
            return;
        }
        yield Follow.deleteOne({
            follower_id: currentUserCommunity._id,
            following_id: userToUnfollow._id,
        });
        userToUnfollow.followers = userToUnfollow.followers.filter((follower) => follower.user_id !== Number(currentUserId));
        yield userToUnfollow.save();
        currentUserCommunity.following = currentUserCommunity.following.filter((follow) => follow.user_id !== Number(id));
        yield currentUserCommunity.save();
        res.status(200).json({
            message: `Successfully unfollowed user ${id}`,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error unfollowing user", error: error.message });
    }
});
export const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // User ID
        const { currentUserId } = req.params; // Current user's ID
        const userCommunity = yield UserCommunity.findOne({ user_id: Number(id) })
            .populate("followers.user_id", "name")
            .exec();
        if (!userCommunity) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isFollowing = userCommunity.followers.some((follower) => follower.user_id === Number(currentUserId));
        res.status(200).json({
            followersCount: userCommunity.followers.length,
            isFollowing,
            followers: userCommunity.followers,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching followers", error: error.message });
    }
});
export const getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // User ID
        const userCommunity = yield UserCommunity.findOne({ user_id: Number(id) })
            .populate("following.user_id", "name")
            .exec();
        if (!userCommunity) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ following: userCommunity.following });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching following list", error: error.message });
    }
});
export const getFollowerInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const currentUserId = req.query.currentUserId;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        // Find the target user
        const user = yield UserCommunity.findOne({ user_id: userId });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // const currentUserId = req.query.currentUserId as string;
        let isFollowedByUser = true;
        const usertogetinto = yield UserCommunity.findOne({ _id: userId });
        if (currentUserId) {
            const currentUser = yield UserCommunity.findOne({ user_id: currentUserId }, { following: 1 });
            if (currentUser) {
                isFollowedByUser = currentUser.following.some((f) => f.user_id === (usertogetinto === null || usertogetinto === void 0 ? void 0 : usertogetinto.user_id) // Ensure the same type for comparison
                );
            }
        }
        res.status(200).json({
            userId: user.user_id,
            isFollowedByUser,
            followerCount: user.followers.length,
            followingCount: user.following.length,
            avatar: user.avatarurl, // Optional: Include additional details
        });
    }
    catch (error) {
        console.error("Error fetching follower info:", error);
        res.status(500).json({ message: "Error fetching follower info" });
    }
});
//# sourceMappingURL=followController.js.map