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
