import { okResponse } from "@/backend/responses/success";
import {
    methodNotAllowedError,
    validationError,
} from "@/backend/responses/errors";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateDaoInput } from "@/shared/validators/createDao";
import { insertDao } from "@/backend/repositories/dao";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return methodNotAllowedError(res, ["POST"]);
    }

    const result = CreateDaoInput.safeParse(req.body);

    if (!result.success) {
        return validationError(res, result.error);
    }
    await insertDao(result.data);
    return okResponse(res);
}
