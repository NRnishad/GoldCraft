import { httpClient } from "../../../shared/api/httpClient";
import axios from "axios";
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

  getProfilePhotoUploadUrl(fileName: string, contentType: string) {
    return httpClient.post<{ data: { uploadUrl: string; key: string; publicUrl: string } }>(
      "/shop/profile/photo/upload-url",
      { fileName, contentType }
    );
  },

  uploadToS3(uploadUrl: string, fileBlob: Blob, fileType: string) {
    return axios.put(uploadUrl, fileBlob, {
      headers: {
        "Content-Type": fileType,
      },
    });
  },

  updateProfilePhoto(profilePhotoUrl: string, profilePhotoKey: string) {
    return httpClient.put("/shop/profile/photo", {
      profilePhotoUrl,
      profilePhotoKey,
    });
  },
};