import mongoose, { Schema } from "mongoose";
const PostSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    username: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [
        {
            comment_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        },
    ],
}, {
    timestamps: true,
    createdAt: { type: Date, default: Date.now },
});
PostSchema.index({ user_id: 1 });
export default mongoose.model("Post", PostSchema);
//# sourceMappingURL=Post.js.map