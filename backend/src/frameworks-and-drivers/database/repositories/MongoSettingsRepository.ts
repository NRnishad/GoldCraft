import PlatformSettingsModel, {
  type PlatformSettingsDocument,
} from "../models/PlatformSettingsModel";

type PlatformSettingsUpdateData = Partial<
  Pick<
    PlatformSettingsDocument,
    | "trialDays"
    | "cronTime"
    | "maxBroadcastContactsDefault"
    | "maintenanceMode"
    | "uiDefaults"
    | "security"
  >
>;

const removeUndefinedValues = <T extends Record<string, unknown>>(data: T) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;

/**
 * Mongo-backed platform settings repository used by admin settings use cases.
 * The collection is treated as a singleton settings document.
 */
export class MongoSettingsRepository {
  async getSingleton() {
    return PlatformSettingsModel.findOne().sort({ createdAt: 1 }).lean().exec();
  }

  async upsertSingleton(data: PlatformSettingsUpdateData) {
    const update = removeUndefinedValues(data);

    return PlatformSettingsModel.findOneAndUpdate(
      {},
      { $set: update },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    )
      .lean()
      .exec();
  }
}

export default MongoSettingsRepository;
