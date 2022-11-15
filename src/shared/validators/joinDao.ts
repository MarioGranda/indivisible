import { z } from "zod";
import ETHEREUM_ADDRESS_REGEX from "../constants/ethRegexAddress";

//S3
export const JoinDaoInput = z
  .object({
    signerAddress: z.string().regex(ETHEREUM_ADDRESS_REGEX),
    daoId: z.number().min(1),
  })
  .strict();

export type JoinDaoInput = z.infer<typeof JoinDaoInput>;
