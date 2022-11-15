import { Problem } from "@/shared/models/api";
import { NextApiResponse } from "next";
import { ZodError } from "zod";

export const methodNotAllowedError = (
  res: NextApiResponse,
  allowedMethods: string[]
) => {
  res.setHeader("Allow", allowedMethods);
  return sendProblem(res, {
    title: "Method not allowed",
    status: 405,
  });
};

export const validationError = (res: NextApiResponse, error: ZodError) => {
  return sendProblem(res, {
    title: "Validation error",
    errors: error.formErrors,
    status: 400,
  });
};

export const authenticationError = (res: NextApiResponse, detail: string) => {
  return sendProblem(res, {
    title: "Authentication failure",
    detail: detail,
    status: 401,
  });
};

export const notAuthenticatedError = (res: NextApiResponse) => {
  return sendProblem(res, {
    title: "Unauthorized",
    detail: "You must be authenticated",
    status: 401,
  });
};

export const conflictError = (res: NextApiResponse, message: string) => {
  return sendProblem(res, {
    title: "Conflict",
    detail: message,
    status: 409,
  });
};

export const unexpectedError = (
  res: NextApiResponse,
  error: unknown,
  detail?: string
) => {
  // We want to log this error as it was unexpected
  console.log(error);

  return sendProblem(res, {
    title: "Unexpected error",
    detail,
    status: 500,
  });
};

export const notFoundError = (res: NextApiResponse, message: string) => {
  return sendProblem(res, {
    title: "Not found",
    detail: message,
    status: 404,
  });
};

export const badRequestError = (res: NextApiResponse, detail: string) => {
  return sendProblem(res, {
    title: "Bad request error",
    detail,
    status: 400,
  });
};

export const preconditionFailedError = (
  res: NextApiResponse,
  detail: string
) => {
  return sendProblem(res, {
    title: "Precondition failed error",
    detail,
    status: 412,
  });
};

const sendProblem = (res: NextApiResponse, problem: Problem) => {
  return res
    .status(problem.status)
    .setHeader("Content-Type", "application/problem+json")
    .json({ type: "about:blank", ...problem });
};
