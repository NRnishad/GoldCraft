import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import { injectable } from "inversify";
import { CreateUploadUrlInput, CreateUploadUrlOutput, IS3Service } from "@application/interfaces/IS3Service";
import { env } from "@config/env";

@injectable()
export class S3StorageService implements IS3Service {
  private readonly s3 = new S3Client({
    region: env.AWS_S3_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  public async createProfilePhotoUploadUrl(
    input: CreateUploadUrlInput,
  ): Promise<CreateUploadUrlOutput> {
    const extension = path.extname(input.fileName).toLowerCase();
    const safeExtension = extension || ".jpg";

    const fileKey = `shops/${input.ownerUserId}/profile/${crypto.randomUUID()}${safeExtension}`;

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60 * 5,
    });

    const publicUrl = `https://${env.AWS_S3_BUCKET_NAME}.s3.${env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;

    return {
      uploadUrl,
      fileKey,
      publicUrl,
    };
  }
}
