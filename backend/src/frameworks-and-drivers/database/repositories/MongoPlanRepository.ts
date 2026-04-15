import SubscriptionPlanModel from "../models/SubscriptionPlanModel";

/**
 * Mongo-backed plan catalog repository used by pricing and registration flows.
 * It only reads from the subscription plan catalog.
 */
export class MongoPlanRepository {
  async findById(planId: string) {
    return SubscriptionPlanModel.findById(planId).lean().exec();
  }

  async findActivePublicPlans(billingCycle: "monthly" | "yearly") {
    const activeBillingPath = `billingOptions.${billingCycle}.isActive`;

    return SubscriptionPlanModel.find({
      isActive: true,
      isVisibleOnPricing: true,
      [activeBillingPath]: true,
    })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean()
      .exec();
  }
}

export default MongoPlanRepository;
