var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserCommunity from "../MongoDB/user.js"; // MongoDB UserCommunity Model
export function getUserInfoByUserName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const { userName } = req.params;
            const { currentUserId } = req.query; // assuming you pass the logged-in user's ID as a query parameter
            if (!userName) {
                res.status(400).json({ message: "Username is required" });
                return;
            }
            const userCommunity = yield UserCommunity.findOne({
                username: userName,
            });
            if (!userCommunity) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const currentUser = yield UserCommunity.findOne({
                user_id: currentUserId,
            });
            // Check if the logged-in user is following the profile
            const isFollowedByUser = (_a = userCommunity.followers) === null || _a === void 0 ? void 0 : _a.some((follower) => {
                return follower.user_id === Number(currentUserId);
            });
            const responseData = {
                id: userCommunity._id.toString(),
                user_id: userCommunity.user_id,
                username: userCommunity.username,
                avatarurl: userCommunity.avatarurl || null,
                followersCount: ((_b = userCommunity.followers) === null || _b === void 0 ? void 0 : _b.length) || 0,
                followingCount: ((_c = userCommunity.following) === null || _c === void 0 ? void 0 : _c.length) || 0,
                postsCount: ((_d = userCommunity.posts) === null || _d === void 0 ? void 0 : _d.length) || 0,
                createdAt: userCommunity.createdAt,
                isFollowedByUser, // Add the follow status here
                bio: userCommunity.bio || "",
            };
            res.status(200).json(responseData);
        }
        catch (error) {
            console.error("Error fetching user info:", error.message);
            res.status(500).json({
                message: "Error fetching user info",
                error: error.message,
            });
        }
    });
}
//# sourceMappingURL=userCommunityControllers.js.map