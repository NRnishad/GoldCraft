import { Document, Model, Schema, Types, model, models } from "mongoose";

export interface ChatConversationDocument extends Document {
  userId: Types.ObjectId;
  shopId: Types.ObjectId;
  status: "open" | "waiting_admin" | "waiting_user" | "resolved";
  category:
    | "billing"
    | "poster"
    | "integration"
    | "ai"
    | "campaign"
    | "public_profile"
    | "widget"
    | "other";
  priority: "low" | "normal" | "high" | "urgent";
  escalatedToAdmin: boolean;
  escalationReason?: string;
  assignedAdminUserId?: Types.ObjectId;
  resolvedByBot: boolean;
  resolvedByUserId?: Types.ObjectId;
  lastMessageAt: Date;
  lastMessagePreview?: string;
  lastMessageSenderRole: "bot" | "admin" | "jeweller" | "system";
  unreadCountForAdmin: number;
  unreadCountForUser: number;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatConversationSchema = new Schema<ChatConversationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "waiting_admin", "waiting_user", "resolved"],
      required: true,
      default: "open",
    },
    category: {
      type: String,
      enum: [
        "billing",
        "poster",
        "integration",
        "ai",
        "campaign",
        "public_profile",
        "widget",
        "other",
      ],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },
    escalatedToAdmin: {
      type: Boolean,
      default: false,
    },
    escalationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    assignedAdminUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedByBot: {
      type: Boolean,
      default: false,
    },
    resolvedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessageAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    lastMessagePreview: {
      type: String,
      trim: true,
    },
    lastMessageSenderRole: {
      type: String,
      enum: ["bot", "admin", "jeweller", "system"],
      default: "system",
    },
    unreadCountForAdmin: {
      type: Number,
      default: 0,
      min: 0,
    },
    unreadCountForUser: {
      type: Number,
      default: 0,
      min: 0,
    },
    resolvedAt: Date,
  },
  {
    collection: "chatConversations",
    timestamps: true,
  },
);

chatConversationSchema.index({ userId: 1, updatedAt: -1 });
chatConversationSchema.index({ status: 1, priority: 1, lastMessageAt: -1 });

export const ChatConversationModel =
  (models.ChatConversation as Model<ChatConversationDocument> | undefined) ||
  model<ChatConversationDocument>("ChatConversation", chatConversationSchema);

export default ChatConversationModel;
