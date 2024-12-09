import mongoose, { Schema, Document } from "mongoose";

interface IFollow extends Document {
  follower_id: mongoose.Types.ObjectId; // Reference to user in MongoDB
  following_id: mongoose.Types.ObjectId; // Reference to user in MongoDB
  createdAt: Date;
}

const FollowSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

FollowSchema.index({ follower_id: 1, following_id: 1 }, { unique: true });

export default mongoose.model<IFollow>("Follow", FollowSchema);
