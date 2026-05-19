import { z } from "zod";

export const onboardingSchema = z.object({
  shopName: z.string().trim().min(2, "Shop name is required").max(100, "name is too long"),
  phone: z.string().trim().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  city: z.string().trim().min(2, "City is required").max(100, "city is too long"),
  address: z.string().trim().min(5, "Address is required").max(150, "address is too long"),
  tagline: z.string().trim().max(150, "Tagline is too long").optional(),
});

export const updateShopProfileSchema = z
  .object({
    shopName: z.string().trim().min(2, "Shop name is too short").max(100, "name is too long").optional(),
    phone: z.string().trim().regex(/^\d{10}$/, "Phone number must be exactly 10 digits").optional(),
    city: z.string().trim().min(2, "City is too short").max(100, "city is too long").optional(),
    address: z.string().trim().min(5, "Address is too short").max(150, "address is too long").optional(),
    tagline: z.string().trim().max(150, "Tagline is too long").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field is required",
  });
  export const profilePhotoUploadUrlSchema = z.object({
  fileName: z.string().trim().min(1, "File name is required"),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    errorMap: () => ({
      message: "Only JPG, PNG, and WebP images are allowed",
    }),
  }),
});

export const updateProfilePhotoSchema = z.object({
  profilePhotoKey: z.string().trim().min(1, "Profile photo key is required"),
  profilePhotoUrl: z.string().trim().url("Profile photo URL must be valid"),
});

export type ProfilePhotoUploadUrlInput = z.infer<
  typeof profilePhotoUploadUrlSchema
>;

export type UpdateProfilePhotoInput = z.infer<typeof updateProfilePhotoSchema>;

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type UpdateShopProfileInput = z.infer<typeof updateShopProfileSchema>;