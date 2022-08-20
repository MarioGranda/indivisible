import { User } from "@/shared/models/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userMapper = (result: Record<string, any>): User => {
  return {
    id: result.id,
    address: result.address,
    avatar: result.avatar,
    createdAt: result.created_at.toJSON(),
    updatedAt: result.updated_at.toJSON()
  };
};
