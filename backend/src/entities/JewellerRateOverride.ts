export interface IJewellerRateOverride {
  shopId: string;
  date: Date;
  rate22KPerGram?: number;
  rate18KPerGram?: number;
  silverPerGram?: number;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}