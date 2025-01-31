import mongoose, { Schema } from "mongoose";
const UserCommunitySchema = new Schema({
    user_id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    followers: [{ user_id: { type: Number, ref: "User" } }],
    following: [{ user_id: { type: Number, ref: "User" } }],
    posts: [
        {
            post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // Reference to Post model
        },
    ],
    avatarurl: { type: String },
    createdAt: { type: Date, default: Date.now },
    bio: { type: String },
});
export default mongoose.model("UserCommunity", UserCommunitySchema);
//# sourceMappingURL=user.js.map