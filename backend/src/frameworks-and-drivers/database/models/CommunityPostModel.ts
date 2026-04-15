import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface CommunityPostDocument extends Document {
  authorUserId: Types.ObjectId;
  shopId: Types.ObjectId;
  category: "marketInsight" | "promotionIdea" | "question" | "general";
  text: string;
  imageUrl?: string;
  likeCount: number;
  likedUserIds: Types.ObjectId[];
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const communityPostSchema = new Schema<CommunityPostDocument>(
  {
    authorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    category: {
      type: String,
      enum: ["marketInsight", "promotionIdea", "question", "general"],
      required: true,
      default: "general",
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likedUserIds: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    collection: "communityPosts",
    timestamps: true,
  },
);

communityPostSchema.index({ authorUserId: 1, createdAt: -1 });
communityPostSchema.index({ category: 1, createdAt: -1 });

export const CommunityPostModel =
  (models.CommunityPost as Model<CommunityPostDocument> | undefined) ||
  model<CommunityPostDocument>("CommunityPost", communityPostSchema);

export default CommunityPostModel;
