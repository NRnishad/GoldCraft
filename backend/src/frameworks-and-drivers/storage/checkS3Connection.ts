import { HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "@drivers/config/env";

const s3Client = new S3Client({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function checkS3Connection() {
  try {
    await s3Client.send(
      new HeadBucketCommand({
        Bucket: env.AWS_S3_BUCKET_NAME,
      }),
    );

    console.log(
      "S3 connected"
    );
  } catch (error) {
    console.error("S3 connection failed");

    if (error instanceof Error) {
      console.error(error.message);
    }

    throw error;
  }
}