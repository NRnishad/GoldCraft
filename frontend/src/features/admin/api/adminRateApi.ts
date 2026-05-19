import { httpClient } from '../../../shared/api/httpClient';

export interface IRateData {
  date: string;
  rate22KPerGram: number;
  rate22KPer8Gram: number;
  rate18KPerGram: number;
  rate18KPer8Gram: number;
  silverPerGram: number;
  silverPer8Gram: number;
  source: 'market' | 'admin';
  isMarketHoliday: boolean;
}

export interface IUpdateRatePayload {
  rate22KPerGram: number;
  rate18KPerGram: number;
  silverPerGram: number;
  isMarketHoliday?: boolean;
}

export const adminRateApi = {
  getRateHistory: async (days: number = 30): Promise<IRateData[]> => {
    const response = await httpClient.get(`/admin/rates/history?days=${days}`);
    return response.data?.data?.rates || response.data?.rates || [];
  },

  updateTodayRate: async (payload: IUpdateRatePayload): Promise<IRateData> => {
    const response = await httpClient.post('/admin/rates/today', payload);
    return response.data?.data?.rate || response.data?.rate;
  },

  triggerManualFetch: async (): Promise<IRateData> => {
    const response = await httpClient.post('/admin/rates/fetch');
    return response.data?.data?.rate || response.data?.rate;
  }
};