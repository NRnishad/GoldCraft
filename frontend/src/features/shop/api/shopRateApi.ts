import { httpClient } from '../../../shared/api/httpClient';

export interface IShopEffectiveRate {
  date: string;
  rate22KPerGram: number;
  rate22KPer8Gram: number;
  rate18KPerGram: number;
  rate18KPer8Gram: number;
  silverPerGram: number;
  silverPer8Gram: number;
  isOverridden: boolean;
}

export interface IShopRateOverridePayload {
  rate22KPerGram?: number;
  rate18KPerGram?: number;
  silverPerGram?: number;
}

export const shopRateApi = {
  getTodayRate: async (): Promise<IShopEffectiveRate> => {
    const response = await httpClient.get('/shop/rates/today');
    return response.data.data.rate;
  },

  updateRateOverride: async (payload: IShopRateOverridePayload): Promise<void> => {
    await httpClient.post('/shop/rates/override', payload);
  }
};