import mongoose, { Schema, model, models } from "mongoose";

export interface IVideo {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  controls?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    controls: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Video = models.Video || model("Video", videoSchema);
