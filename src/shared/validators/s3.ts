import { z } from "zod";

const imageContentTypes = ["image/png", "image/jpeg", "image/webp"] as const;

//S3
export const SignedUrlInput = z
  .object({
    daoName: z.string().min(1).max(255),
    tokenName: z.string().max(255),
    daoImage: z.object({
      name: z.string().min(1).max(255),
      contentType: z.enum(imageContentTypes),
    }),
    tokenImage: z.object({
      name: z.string().min(1).max(255),
      contentType: z.enum(imageContentTypes),
    }),
  })
  .strict();

export type SignedUrlInput = z.infer<typeof SignedUrlInput>;
