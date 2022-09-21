import { Dao } from "@/shared/models/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const daoMapper = (result: Record<string, any>): Dao => {
  return {
    id: result.id,
    name: result.name,
    description: result.description,
    image: result.image,
    daoCreatorAddress: result.dao_creator_address,
    address: result.address,
    tokenName: result.token_name,
    tokenSymbol: result.token_symbol,
    tokenImage: result.token_image,
    slug: result.slug,
    minQuorum: result.min_quorum,
    minConsensusDeadline: result.min_consensus_deadline,
    minVotingDeadline: result.min_voting_deadline,
    transactionHash: result.transaction_hash,
    createdAt: result.created_at.toJSON(),
    updatedAt: result.updated_at.toJSON(),
    level: result.level,
  };
};
