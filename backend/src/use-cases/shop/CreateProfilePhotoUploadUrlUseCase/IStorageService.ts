export interface ICreateProfilePhotoUploadUrlStorageService {
  createProfilePhotoUploadUrl(input: {
    ownerUserId: string;
    fileName: string;
    contentType: string;
  }): Promise<{
    uploadUrl: string;
    fileKey: string;
    publicUrl: string;
  }>;
}