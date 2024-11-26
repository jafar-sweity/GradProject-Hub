import mongoose, { Schema, Document } from "mongoose";

interface IComment {
  comment_id: mongoose.Types.ObjectId; // Reference to Comment
}

interface IPost extends Document {
  user_id: mongoose.Types.ObjectId; // Reference to User
  content: string;
  likes: number;
  comments: IComment[]; // Changed to use a defined interface
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
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
  },
  {
    timestamps: true,
  createdAt: { type: Date, default: Date.now },
},
);

PostSchema.index({ user_id: 1 }); 
export default mongoose.model<IPost>("Post", PostSchema);
