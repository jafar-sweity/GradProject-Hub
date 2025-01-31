import mongoose, { Schema } from "mongoose";
const FollowSchema = new Schema({
    follower_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "UserCommunity",
    },
    following_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "UserCommunity",
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
FollowSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });
export default mongoose.model("Follow", FollowSchema);
//# sourceMappingURL=follow.js.map