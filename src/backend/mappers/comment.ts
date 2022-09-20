import { Comment } from "@/shared/models/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commentMapper = (result: Record<string, any>): Comment => {
  return {
    id: result.id,
    proposalId: result.proposal_id,
    userAddress: result.user_address,
    text: result.text,
    headComment: result.head_comment,
    userId: result.user_id,
    title: result.title,
    createdAt: result.created_at.toJSON(),
    updatedAt: result.updated_at.toJSON(),
  };
};
