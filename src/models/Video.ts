import mongoose, { Schema, model, models } from "mongoose";

export interface IVideo {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  video: string;
  thumbnail: string;
  transformation?: {
    width: number;
    height: number;
    quality: number;
  };
  controls?: boolean;
  views?: number;
  likes?: mongoose.Types.ObjectId[];
  dislikes?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    description: { type: String },
    video: { type: String, required: true },
    thumbnail: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      width: Number,
      height: Number,
      quality: Number,
    },
    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  },
  { timestamps: true }
);

export const Video = models.Video || model<IVideo>("Video", videoSchema);
