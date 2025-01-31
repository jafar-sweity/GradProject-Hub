import mongoose, { Schema } from "mongoose";
const LikeSchema = new Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
LikeSchema.index({ post_id: 1, user_id: 1 });
export default mongoose.model("Like", LikeSchema);
//# sourceMappingURL=Like.js.map