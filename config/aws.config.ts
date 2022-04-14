import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  s3: {
    acl: process.env.AWS_S3_ACL,
    region: process.env.AWS_S3_REGION,
    signatureVersion: process.env.AWS_S3_SIGNATURE_VERSION,
    signedUrlExpiry: +process.env.AWS_S3_SIGNED_URL_EXPIRY || 3600,
    publicUrl: process.env.AWS_S3_PUBLIC_URL,
    bucket: process.env.AWS_S3_BUCKET,
    tmpFolder: process.env.AWS_S3_FOLDER_UPLOAD_TMP,
    uploadFolder: process.env.AWS_S3_FOLDER_UPLOAD,
  },
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
}));
