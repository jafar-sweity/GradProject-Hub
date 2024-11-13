import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  post_id: mongoose.Types.ObjectId; // Reference to Post
  user_id: mongoose.Types.ObjectId; // Reference to User in MongoDB
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true } 
);

CommentSchema.index({ post_id: 1, user_id: 1 }); 

export default mongoose.model<IComment>("Comment", CommentSchema);
