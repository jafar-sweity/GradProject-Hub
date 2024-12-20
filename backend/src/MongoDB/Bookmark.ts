import mongoose, { Schema, Document } from "mongoose";

interface IBookmark extends Document {
  user_id: mongoose.Types.ObjectId; // Reference to the UserCommunity
  post_id: mongoose.Types.ObjectId; // Reference to the Post
  createdAt: Date;
}

const BookmarkSchema: Schema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserCommunity", // Reference to the UserCommunity schema
    },
    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post", // Reference to the Post schema
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

BookmarkSchema.index({ user_id: 1, post_id: 1 }, { unique: true }); // Ensure a user can't bookmark the same post multiple times

export default mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
