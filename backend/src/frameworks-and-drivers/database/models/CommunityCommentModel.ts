import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface CommunityCommentDocument extends Document {
  postId: Types.ObjectId;
  authorUserId: Types.ObjectId;
  message: string;
  parentCommentId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const communityCommentSchema = new Schema<CommunityCommentDocument>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
    },
    authorUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "CommunityComment",
    },
  },
  {
    collection: "communityComments",
    timestamps: true,
  },
);

communityCommentSchema.index({ postId: 1, createdAt: 1 });

export const CommunityCommentModel =
  (models.CommunityComment as Model<CommunityCommentDocument> | undefined) ||
  model<CommunityCommentDocument>("CommunityComment", communityCommentSchema);

export default CommunityCommentModel;
