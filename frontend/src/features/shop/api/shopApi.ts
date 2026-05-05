import { httpClient } from "../../../shared/api/httpClient";
import type {
  GetOnboardingStateResponse,
  GetShopProfileResponse,
  SaveOnboardingResponse,
  ShopOnboardingInput,
  UpdateShopProfileInput,
  UpdateShopProfileResponse,
} from "../types/shopTypes";

export const shopApi = {
  getOnboardingState() {
    return httpClient.get<GetOnboardingStateResponse>("/shop/onboarding");
  },

  saveOnboarding(input: ShopOnboardingInput) {
    return httpClient.post<SaveOnboardingResponse>("/shop/onboarding", input);
  },

  getProfile() {
    return httpClient.get<GetShopProfileResponse>("/shop/profile");
  },

  updateProfile(input: UpdateShopProfileInput) {
    return httpClient.put<UpdateShopProfileResponse>("/shop/profile", input);
  },
};