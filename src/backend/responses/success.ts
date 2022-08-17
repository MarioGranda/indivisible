import { NextApiResponse } from "next";

export const resourceCreatedResponse = (
  res: NextApiResponse,
  result: unknown
) => {
  res.status(201).json({ result });
};

export const okResponse = (res: NextApiResponse, result?: unknown) => {
  if (typeof result === "undefined") {
    res.status(204).send(undefined);
    return;
  }

  res.status(200).json({ result });
};
