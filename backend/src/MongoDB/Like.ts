import mongoose, { Schema, Document } from "mongoose";

interface ILike extends Document {
  post_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema(
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
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);

LikeSchema.index({ post_id: 1, user_id: 1 }); 

export default mongoose.model<ILike>("Like", LikeSchema);
