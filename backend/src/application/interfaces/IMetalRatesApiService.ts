export interface MetalRatesData {
  date: string;
  currency: string;
  unit: string;
  gold: {
    "22k": number;
    "18k": number;
  };
  silver: {
    "999": number;
  };
  updatedAt: string;
}

export interface IMetalRatesResponse {
  success: boolean;
  data?: MetalRatesData;
  error?: string;
}

export interface IMetalRatesApiService {
  fetchTodayRates(): Promise<IMetalRatesResponse>;
}
