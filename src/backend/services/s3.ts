import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { slugify } from "@/shared/utils/strings";

function getCredentials() {
    return {
      region: process.env.AWS_REGION ?? "",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY ?? "",
        secretAccessKey: process.env.AWS_ACCESS_SECRET ?? "",
      },
    };
  }

export const generateSignedUrl = async (path: string, contentType: string) => {
  const credentials = getCredentials();
  const client = new S3Client(credentials);
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: path,
    ContentType: contentType,
  });
  const url = await getSignedUrl(client, command, { expiresIn: 300 });
  return { url, path: `${process.env.S3_BASE_URL}/${path}` };
};

export const getTokenImageSignedUrl = async (
  tokenName: string,
  extension: string,
  contentType: string,
) => {
  const date = new Date();
  const path = `token/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${slugify(
    tokenName
  )}/image${extension}`;
  return generateSignedUrl(path, contentType);
};

export const getDaoImageSignedUrl = async (
  daoName: string,
  extension: string,
  contentType: string,
) => {
  const date = new Date();
  const path = `dao/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${slugify(
    daoName
  )}/image${extension}`;
  return generateSignedUrl(path, contentType);
};
