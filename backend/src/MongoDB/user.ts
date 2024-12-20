import { create } from "domain";
import mongoose, { Schema, Document } from "mongoose";
import { userInfo } from "os";

interface IUserCommunity extends Document {
  user_id: number; // Reference to MySQL user_id
  followers: Array<{ user_id: number }>;
  following: Array<{ user_id: number }>;
  posts: Array<{
    post_id: mongoose.Types.ObjectId; // Reference to Post
  }>;
  avatarurl: string;
}

const UserCommunitySchema: Schema = new Schema({
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

export default mongoose.model<IUserCommunity>(
  "UserCommunity",
  UserCommunitySchema
);
