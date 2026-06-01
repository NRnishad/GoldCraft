export interface IGoldRate {
  date: Date;
  rate22KPerGram: number;
  rate22KPer8Gram: number;
  rate18KPerGram: number;
  rate18KPer8Gram: number;
  silverPerGram: number;
  silverPer8Gram: number;
  source: 'market' | 'admin';
  isMarketHoliday: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}