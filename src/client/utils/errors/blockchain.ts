interface RevertError extends ContractError {
  code: "UNPREDICTABLE_GAS_LIMIT";
  error: {
    error: {
      body: string;
    };
  };
}

interface ContractError extends Error {
  code: string;
}

export interface MetamaskError {
  code: string;
  error: {
    message: string;
    code: number;
    data?: unknown;
  };
  method: string;
  reason: string;
  transaction?: unknown;
}

const isContractError = (error: unknown): error is ContractError => {
  return error instanceof Error && "code" in error;
};

const isRevertError = (error: unknown): error is RevertError => {
  return (
    isContractError(error) &&
    error.code == "UNPREDICTABLE_GAS_LIMIT" &&
    "error" in error
  );
};

export function getRevertedTransactionMessage(error: unknown) {
  if (isRevertError(error)) {
    return JSON.parse(error.error.error.body).error.message;
  }
  return null;
}

export const isMetamaskError = (error: unknown): error is MetamaskError => {
  const metamaskError = error as MetamaskError;
  return (
    metamaskError &&
    !!metamaskError.error &&
    "message" in metamaskError.error &&
    "code" in metamaskError.error &&
    metamaskError.error.message.startsWith("execution reverted: DAO: ")
  );
};
