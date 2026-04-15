import { Document, Model, Schema, model, models } from "mongoose";

interface UiDefaults {
  highlightedPlanCode?: string;
  defaultBillingCycle?: "monthly" | "yearly";
}

interface SecuritySettings {
  minPasswordLength?: number;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSymbol?: boolean;
}

export interface PlatformSettingsDocument extends Document {
  trialDays: number;
  cronTime: string;
  maxBroadcastContactsDefault: number;
  maintenanceMode: boolean;
  uiDefaults: UiDefaults;
  security: SecuritySettings;
  createdAt: Date;
  updatedAt: Date;
}

const uiDefaultsSchema = new Schema<UiDefaults>(
  {
    highlightedPlanCode: {
      type: String,
      trim: true,
      lowercase: true,
    },
    defaultBillingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
  },
  { _id: false },
);

const securitySettingsSchema = new Schema<SecuritySettings>(
  {
    minPasswordLength: {
      type: Number,
      min: 8,
      default: 8,
    },
    requireUppercase: {
      type: Boolean,
      default: false,
    },
    requireNumber: {
      type: Boolean,
      default: false,
    },
    requireSymbol: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const platformSettingsSchema = new Schema<PlatformSettingsDocument>(
  {
    trialDays: {
      type: Number,
      default: 7,
      min: 0,
    },
    cronTime: {
      type: String,
      required: true,
      default: "08:05",
      trim: true,
    },
    maxBroadcastContactsDefault: {
      type: Number,
      default: 50,
      min: 0,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    uiDefaults: {
      type: uiDefaultsSchema,
      default: () => ({}),
    },
    security: {
      type: securitySettingsSchema,
      default: () => ({}),
    },
  },
  {
    collection: "platformSettings",
    timestamps: true,
  },
);

export const PlatformSettingsModel =
  (models.PlatformSettings as Model<PlatformSettingsDocument> | undefined) ||
  model<PlatformSettingsDocument>("PlatformSettings", platformSettingsSchema);

export default PlatformSettingsModel;
