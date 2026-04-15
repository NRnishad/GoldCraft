import { Document, Model, Schema, Types, model, models } from "mongoose";

interface ChatAttachment {
  fileName?: string;
  url: string;
  mimeType?: string;
  sizeBytes?: number;
}

export interface ChatMessageDocument extends Document {
  conversationId: Types.ObjectId;
  senderUserId?: Types.ObjectId;
  senderRole: "admin" | "jeweller" | "bot" | "system";
  messageType: "text" | "attachment" | "system" | "event";
  message?: string;
  attachments: ChatAttachment[];
  metadata?: Record<string, unknown>;
  readByAdminAt?: Date;
  readByUserAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const chatAttachmentSchema = new Schema<ChatAttachment>(
  {
    fileName: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      trim: true,
    },
    sizeBytes: {
      type: Number,
      min: 0,
    },
  },
  { _id: false },
);

const chatMessageSchema = new Schema<ChatMessageDocument>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "ChatConversation",
      required: true,
    },
    senderUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    senderRole: {
      type: String,
      enum: ["admin", "jeweller", "bot", "system"],
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "attachment", "system", "event"],
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    attachments: {
      type: [chatAttachmentSchema],
      default: [],
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    readByAdminAt: Date,
    readByUserAt: Date,
  },
  {
    collection: "chatMessages",
    timestamps: true,
  },
);

chatMessageSchema.index({ conversationId: 1, createdAt: 1 });

export const ChatMessageModel =
  (models.ChatMessage as Model<ChatMessageDocument> | undefined) ||
  model<ChatMessageDocument>("ChatMessage", chatMessageSchema);

export default ChatMessageModel;
