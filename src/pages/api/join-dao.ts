import { okResponse } from "@/backend/responses/success";
import {
  methodNotAllowedError,
  validationError,
} from "@/backend/responses/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { JoinDaoInput } from "@/shared/validators/joinDao";
import { insertUser } from "@/backend/repositories/user";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return methodNotAllowedError(res, ["POST"]);
  }

  const result = JoinDaoInput.safeParse(req.body);

  if (result.success === false) {
    return validationError(res, result.error);
  }
  await insertUser(result.data);
  return okResponse(res);
};
