import { Proposal } from "@/shared/models/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const proposalMapper = (result: Record<string, any>): Proposal => {
  return {
    id: result.id,
    name: result.name,
    description: result.description,
    daoId: result.dao_id,
    proposalCreatorAddress: result.proposal_creator_address,
    minQuorum: result.min_quorum,
    consensusDeadline: result.consensus_deadline.toJSON(),
    votingDeadline: result.voting_deadline.toJSON(),
    yea: result.yea,
    nay: result.nay,
    status: result.status,
    createdAt: result.created_at.toJSON(),
    updatedAt: result.updated_at.toJSON()
  };
};
