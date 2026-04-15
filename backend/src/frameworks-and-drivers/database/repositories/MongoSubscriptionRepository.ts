import SubscriptionModel, {
  type SubscriptionDocument,
} from "../models/SubscriptionModel";

type CreateTrialSubscriptionData = Pick<
  SubscriptionDocument,
  | "userId"
  | "planId"
  | "billingCycle"
  | "planCodeSnapshot"
  | "planNameSnapshot"
  | "planVersionSnapshot"
  | "priceSnapshot"
  | "featureSnapshot"
> &
  Partial<
    Pick<
      SubscriptionDocument,
      | "trialStartDate"
      | "trialEndDate"
      | "currentPeriodStart"
      | "currentPeriodEnd"
      | "stripeCustomerId"
      | "stripeSubscriptionId"
      | "stripePriceId"
      | "pendingPlanId"
      | "pendingBillingCycle"
      | "pendingChangeAt"
    >
  >;

/**
 * Mongo-backed subscription repository used by register and profile flows.
 * It owns subscription reads and trial-row creation only.
 */
export class MongoSubscriptionRepository {
  async findByUserId(userId: string) {
    return SubscriptionModel.findOne({ userId }).lean().exec();
  }

  async createTrial(data: CreateTrialSubscriptionData) {
    const created = await SubscriptionModel.create({
      ...data,
      status: "trial",
      cancelAtPeriodEnd: false,
    });

    return SubscriptionModel.findById(created._id).lean().exec();
  }
}

export default MongoSubscriptionRepository;
