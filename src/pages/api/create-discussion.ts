import { okResponse } from "@/backend/responses/success";
import {
  methodNotAllowedError,
  validationError,
} from "@/backend/responses/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateDiscussionInput } from "@/shared/validators/createDiscussion";
import { insertComment } from "@/backend/repositories/comments";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return methodNotAllowedError(res, ["POST"]);
  }

  const result = CreateDiscussionInput.safeParse(req.body);

  if (result.success === false) {
    return validationError(res, result.error);
  }
  await insertComment(result.data);
  return okResponse(res);
};
