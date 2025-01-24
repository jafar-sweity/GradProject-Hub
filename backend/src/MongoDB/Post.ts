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
  photoUrls?: string[]; // Array of image URLs
}

const PostSchema: Schema = new Schema(
  {
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
    photoUrls: { type: [String], default: [] }, // Added photoUrls to the schema
  },
  {
    timestamps: true,
    createdAt: { type: Date, default: Date.now },
  }
  // photoUrls: [String], not required
);

PostSchema.index({ user_id: 1 });
export default mongoose.model<IPost>("Post", PostSchema);
