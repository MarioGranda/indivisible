import { z } from "zod";
import { ETHEREUM_ADDRESS_REGEX } from "../constants/ethRegexAddress";

//S3
export const CreateDaoInput = z
  .object({
    name: z.string().min(1).max(255),
    description: z.string().min(1),
    tokenName: z.string().min(1).max(255),
    tokenSymbol: z.string().min(1).max(255),
    minQuorum: z.number().min(1).max(10000),
    minVotingPeriod: z.number().min(1),
    minConsensusPeriod: z.number().min(1),
    mintAmount: z.number().min(1),
    daoCreatorAddress: z.string().regex(ETHEREUM_ADDRESS_REGEX),
    tokenImage: z.string().min(1).max(255),
    daoImage: z.string().min(1).max(255),
    daoAddress: z.string().regex(ETHEREUM_ADDRESS_REGEX),
    transactionHash: z.string().min(1).max(255),
    merkleTreeLeaves: z.array(z.string().min(1).max(255)),
  })
  .strict();

export type CreateDaoInput = z.infer<typeof CreateDaoInput>;
