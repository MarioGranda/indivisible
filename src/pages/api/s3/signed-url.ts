import { extname } from "path";
import { resourceCreatedResponse } from "@/backend/responses/success";
import {
    methodNotAllowedError,
    validationError,
} from "@/backend/responses/errors";
import { SignedUrlInput } from "@/shared/validators/s3";
import {
    getDaoImageSignedUrl,
    getTokenImageSignedUrl,
} from "@/backend/services/s3";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        return methodNotAllowedError(res, ["POST"]);
    }

    const result = SignedUrlInput.safeParse(req.body);

    if (!result.success) {
        return validationError(res, result.error);
    }
    try {

    const { daoName, tokenName, daoImage, tokenImage } =
        result.data;
        
    const daoImageExtension = extname(daoImage.name);
    const tokenImageExtension = extname(tokenImage.name);
    const [tokenResult, daoResult] = await Promise.all([
        getTokenImageSignedUrl(
            tokenName,
            tokenImageExtension,
            tokenImage.contentType,
        ),
        getDaoImageSignedUrl(
            daoName,
            daoImageExtension,
            daoImage.contentType,
        )
    ]);
    return resourceCreatedResponse(res, {
        tokenResult,
        daoResult,
    });
} catch (e) {
    console.log(e)
}
}
