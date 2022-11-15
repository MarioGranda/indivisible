import { z } from "zod";
import ETHEREUM_ADDRESS_REGEX from "../constants/ethRegexAddress";

//S3
export const CreateDiscussionInput = z
  .object({
    userId: z.number().min(1),
    userAddress: z.string().regex(ETHEREUM_ADDRESS_REGEX),
    headComment: z.number().min(1).nullable(),
    title: z.string().min(1).max(255).nullable(),
    text: z.string().min(1),
    proposalId: z.number().min(1),
  })
  .strict();

export type CreateDiscussionInput = z.infer<typeof CreateDiscussionInput>;
