import { Result } from "@domain/shared/Result";
import { Phone } from "@domain/value-objects/Phone.vo";

export class Shop {
  private constructor(
    private readonly id: string,
    private readonly ownerUserId: string,
    private shopName: string,
    private phone: Phone,
    private city: string,
    private address: string,
    private tagline: string | undefined,
    private onboardingComplete: boolean,
    private onboardingStep: number,
    private profilePhotoKey: string | undefined,
    private profilePhotoUrl: string | undefined,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static create({
    id,
    ownerUserId,
    shopName,
    phone,
    city,
    address,
    tagline,
    onboardingComplete = false,
    onboardingStep = 1,
    profilePhotoKey,
    profilePhotoUrl,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: {
    id: string;
    ownerUserId: string;
    shopName: string;
    phone: Phone;
    city: string;
    address: string;
    tagline?: string;
    onboardingComplete?: boolean;
    onboardingStep?: number;
    profilePhotoKey?: string;
    profilePhotoUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Result<Shop> {
    if (!id) {
      return Result.fail<Shop>("Shop ID is required");
    }

    if (!ownerUserId) {
      return Result.fail<Shop>("Owner User ID is required");
    }

    if (!shopName || shopName.trim().length < 2) {
      return Result.fail<Shop>("Shop name must be at least 2 characters long");
    }

    if (!city || city.trim().length < 2) {
      return Result.fail<Shop>("City is required");
    }

    if (!address || address.trim().length < 5) {
      return Result.fail<Shop>("Address must be at least 5 characters long");
    }

    const shop = new Shop(
      id,
      ownerUserId,
      shopName.trim(),
      phone,
      city.trim(),
      address.trim(),
      tagline ? tagline.trim() : undefined,
      onboardingComplete,
      onboardingStep,
      profilePhotoKey,
      profilePhotoUrl,
      createdAt,
      updatedAt,
    );

    return Result.ok(shop);
  }

  // --- Domain Logic Methods ---

  public completeOnboarding(): void {
    this.onboardingComplete = true;
    this.onboardingStep = 4; // Max step indicating completion
  }

  public setOnboardingStep(step: number): Result<void> {
    if (step < 1 || step > 4) {
      return Result.fail<void>("Invalid onboarding step");
    }
    this.onboardingStep = step;
    return Result.ok();
  }

  public updateProfileDetails({
    shopName,
    phone,
    city,
    address,
    tagline,
  }: {
    shopName: string;
    phone: Phone;
    city: string;
    address: string;
    tagline?: string;
  }): Result<void> {
    if (!shopName || shopName.trim().length < 2) {
      return Result.fail<void>("Shop name must be at least 2 characters long");
    }
    if (!city || city.trim().length < 2) {
      return Result.fail<void>("City is required");
    }
    if (!address || address.trim().length < 5) {
      return Result.fail<void>("Address must be at least 5 characters long");
    }

    this.shopName = shopName.trim();
    this.phone = phone;
    this.city = city.trim();
    this.address = address.trim();
    this.tagline = tagline ? tagline.trim() : undefined;

    return Result.ok();
  }

  public updateProfilePhoto(key: string, url: string): void {
    this.profilePhotoKey = key;
    this.profilePhotoUrl = url;
  }

  // --- Getters ---

  public getId(): string {
    return this.id;
  }

  public getOwnerUserId(): string {
    return this.ownerUserId;
  }

  public getShopName(): string {
    return this.shopName;
  }

  public getPhone(): Phone {
    return this.phone;
  }

  public getCity(): string {
    return this.city;
  }

  public getAddress(): string {
    return this.address;
  }

  public getTagline(): string | undefined {
    return this.tagline;
  }

  public getOnboardingComplete(): boolean {
    return this.onboardingComplete;
  }

  public getOnboardingStep(): number {
    return this.onboardingStep;
  }

  public getProfilePhotoKey(): string | undefined {
    return this.profilePhotoKey;
  }

  public getProfilePhotoUrl(): string | undefined {
    return this.profilePhotoUrl;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
