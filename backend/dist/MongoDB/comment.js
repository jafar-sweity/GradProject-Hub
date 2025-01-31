import mongoose, { Schema } from "mongoose";
const CommentSchema = new Schema({
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
    content: {
        type: String,
        required: true,
        minlength: 1, // Minimum length for the comment
        maxlength: 500, // Maximum length for the comment
    },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
CommentSchema.index({ post_id: 1, user_id: 1 }); // Index for post_id and user_id
export default mongoose.model("Comment", CommentSchema);
//# sourceMappingURL=comment.js.map