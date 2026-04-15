import ShopModel, { type ShopDocument } from "../models/ShopModel";

type ShopUpdateData = Partial<
  Pick<
    ShopDocument,
    | "shopName"
    | "logoUrl"
    | "phone"
    | "address"
    | "city"
    | "tagline"
    | "gstin"
    | "showGoldRate"
    | "showSilverRate"
    | "defaultTemplateId"
    | "qrCodeUrl"
    | "showQrOnPoster"
    | "qrTargetType"
    | "qrCustomUrl"
    | "whatsappWabaId"
    | "whatsappPhoneNumberId"
    | "whatsappAccessToken"
    | "whatsappAutoShare"
    | "whatsappCaptionTemplate"
    | "whatsappIsConnected"
    | "whatsappLastConnectedAt"
    | "instagramIgUserId"
    | "instagramAccessToken"
    | "instagramTokenExpiresAt"
    | "instagramAutoPost"
    | "instagramCaptionTemplate"
    | "instagramHashtagPresets"
    | "instagramIsConnected"
    | "instagramLastConnectedAt"
    | "isPublicProfileEnabled"
    | "onboardingComplete"
    | "onboardingStep"
  >
>;

type OnboardingUpdateData = Partial<
  Pick<
    ShopDocument,
    "shopName" | "logoUrl" | "phone" | "address" | "city" | "tagline" | "gstin"
  >
>;

const removeUndefinedValues = <T extends Record<string, unknown>>(data: T) =>
  Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as Partial<T>;

const buildWidgetToken = (ownerUserId: string) =>
  `shop-${ownerUserId.slice(-6).toLowerCase()}-${Date.now().toString(36)}`;

/**
 * Mongo-backed shop repository used by onboarding, profile, and widget-related flows.
 * It keeps shop persistence concerns out of the use-case layer.
 */
export class MongoShopRepository {
  async createEmpty(ownerUserId: string) {
    const created = await ShopModel.create({
      ownerUserId,
      shopName: "My Shop",
      widgetToken: buildWidgetToken(ownerUserId),
    });

    return ShopModel.findById(created._id).lean().exec();
  }

  async findByOwnerUserId(ownerUserId: string) {
    return ShopModel.findOne({ ownerUserId }).lean().exec();
  }

  async updateOnboardingStep(
    ownerUserId: string,
    step: number,
    data: OnboardingUpdateData,
  ) {
    const update = removeUndefinedValues({
      ...data,
      onboardingStep: step,
      onboardingComplete: step >= 3,
    });

    return ShopModel.findOneAndUpdate(
      { ownerUserId },
      { $set: update },
      { new: true },
    )
      .lean()
      .exec();
  }

  async update(ownerUserId: string, data: ShopUpdateData) {
    const update = removeUndefinedValues(data);

    return ShopModel.findOneAndUpdate(
      { ownerUserId },
      { $set: update },
      { new: true },
    )
      .lean()
      .exec();
  }
}

export default MongoShopRepository;
