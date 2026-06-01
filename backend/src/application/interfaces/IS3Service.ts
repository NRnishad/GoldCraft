export interface CreateUploadUrlInput {
  ownerUserId: string;
  fileName: string;
  contentType: string;
}

export interface CreateUploadUrlOutput {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
}

export interface IS3Service {
  createProfilePhotoUploadUrl(input: CreateUploadUrlInput): Promise<CreateUploadUrlOutput>;
}
