import { Result } from "@domain/shared/Result";

export enum RateSource {
  MARKET = "market",
  ADMIN = "admin",
}

export class GoldRate {
  private constructor(
    private readonly date: Date,
    private readonly rate22KPerGram: number,
    private readonly rate22KPer8Gram: number,
    private readonly rate18KPerGram: number,
    private readonly rate18KPer8Gram: number,
    private readonly silverPerGram: number,
    private readonly silverPer8Gram: number,
    private readonly source: RateSource,
    private readonly isMarketHoliday: boolean,
    private verifiedAt: Date | undefined,
    private readonly createdAt: Date,
  ) {}

  public static create({
    date,
    rate22KPerGram,
    rate22KPer8Gram,
    rate18KPerGram,
    rate18KPer8Gram,
    silverPerGram,
    silverPer8Gram,
    source,
    isMarketHoliday,
    verifiedAt,
    createdAt = new Date(),
  }: {
    date: Date;
    rate22KPerGram: number;
    rate22KPer8Gram: number;
    rate18KPerGram: number;
    rate18KPer8Gram: number;
    silverPerGram: number;
    silverPer8Gram: number;
    source: RateSource;
    isMarketHoliday: boolean;
    verifiedAt?: Date;
    createdAt?: Date;
  }): Result<GoldRate> {
    if (!date) {
      return Result.fail<GoldRate>("Date is required");
    }

    if (rate22KPerGram < 0 || rate22KPer8Gram < 0 || rate18KPerGram < 0 || rate18KPer8Gram < 0) {
      return Result.fail<GoldRate>("Gold rates cannot be negative");
    }

    if (silverPerGram < 0 || silverPer8Gram < 0) {
      return Result.fail<GoldRate>("Silver rates cannot be negative");
    }

    if (!source) {
      return Result.fail<GoldRate>("Rate source is required");
    }

    const goldRate = new GoldRate(
      date,
      rate22KPerGram,
      rate22KPer8Gram,
      rate18KPerGram,
      rate18KPer8Gram,
      silverPerGram,
      silverPer8Gram,
      source,
      isMarketHoliday,
      verifiedAt,
      createdAt,
    );

    return Result.ok(goldRate);
  }

  // --- Domain Logic Methods ---

  public verify(verifiedAt: Date = new Date()): void {
    this.verifiedAt = verifiedAt;
  }

  // --- Getters ---

  public getDate(): Date {
    return this.date;
  }

  public getRate22KPerGram(): number {
    return this.rate22KPerGram;
  }

  public getRate22KPer8Gram(): number {
    return this.rate22KPer8Gram;
  }

  public getRate18KPerGram(): number {
    return this.rate18KPerGram;
  }

  public getRate18KPer8Gram(): number {
    return this.rate18KPer8Gram;
  }

  public getSilverPerGram(): number {
    return this.silverPerGram;
  }

  public getSilverPer8Gram(): number {
    return this.silverPer8Gram;
  }

  public getSource(): RateSource {
    return this.source;
  }

  public getIsMarketHoliday(): boolean {
    return this.isMarketHoliday;
  }

  public getVerifiedAt(): Date | undefined {
    return this.verifiedAt;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }
}
