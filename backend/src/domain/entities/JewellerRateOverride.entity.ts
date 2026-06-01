import { Result } from "@domain/shared/Result";

export class JewellerRateOverride {
  private constructor(
    private readonly shopId: string,
    private readonly date: Date,
    private readonly rate22KPerGram: number | undefined,
    private readonly rate18KPerGram: number | undefined,
    private readonly silverPerGram: number | undefined,
    private readonly createdByUserId: string,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static create({
    shopId,
    date,
    rate22KPerGram,
    rate18KPerGram,
    silverPerGram,
    createdByUserId,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: {
    shopId: string;
    date: Date;
    rate22KPerGram?: number;
    rate18KPerGram?: number;
    silverPerGram?: number;
    createdByUserId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): Result<JewellerRateOverride> {
    if (!shopId) {
      return Result.fail<JewellerRateOverride>("Shop ID is required");
    }

    if (!date) {
      return Result.fail<JewellerRateOverride>("Date is required");
    }

    if (!createdByUserId) {
      return Result.fail<JewellerRateOverride>("Created By User ID is required");
    }

    if (rate22KPerGram !== undefined && rate22KPerGram < 0) {
      return Result.fail<JewellerRateOverride>("Rate 22K cannot be negative");
    }

    if (rate18KPerGram !== undefined && rate18KPerGram < 0) {
      return Result.fail<JewellerRateOverride>("Rate 18K cannot be negative");
    }

    if (silverPerGram !== undefined && silverPerGram < 0) {
      return Result.fail<JewellerRateOverride>("Silver rate cannot be negative");
    }

    const override = new JewellerRateOverride(
      shopId,
      date,
      rate22KPerGram,
      rate18KPerGram,
      silverPerGram,
      createdByUserId,
      createdAt,
      updatedAt,
    );

    return Result.ok(override);
  }

  // --- Getters ---

  public getShopId(): string {
    return this.shopId;
  }

  public getDate(): Date {
    return this.date;
  }

  public getRate22KPerGram(): number | undefined {
    return this.rate22KPerGram;
  }

  public getRate18KPerGram(): number | undefined {
    return this.rate18KPerGram;
  }

  public getSilverPerGram(): number | undefined {
    return this.silverPerGram;
  }

  public getCreatedByUserId(): string {
    return this.createdByUserId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
