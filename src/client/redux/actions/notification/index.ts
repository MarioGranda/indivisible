import { isMetamaskError, getRevertedTransactionMessage } from "@/client/utils/errors";
import {
  Notification,
} from "@/shared/models/index";

export type ActionType = ReturnType<
  typeof openNotification | typeof closeNotification
>;

export const openNotification = (notification: Notification) => {
  return {
    type: "ADD_NOTIFICATION" as const,
    payload: notification,
  };
};

export const closeNotification = () => {
  return {
    type: "CLOSE_NOTIFICATION" as const,
    payload: null,
  };
};

export const openPendingTransactionNotification = (image: string) => {
  return openNotification({
    title: "Your transaction is being processed",
    status: "PENDING",
    image,
  });
};

export const openWaitForCountDownNotification = () => {
  return openNotification({
    title: "Purchase",
    description:
      "Hey! Once the countdown is finished you'll be able to listen to the song and also buy the NFT.\n \n" +
      "In the meantime you can get your Metamask Wallet ready and add some ETH(NFT price + gas fees) to your account.",
    btnText: "close",
    closeOnBtnClick: true,
  });
};


export const openTransactionCompleteNotification = (
  result: any,
  image: string
) => {
  const { status, transactionHash } = result;
  return openNotification({
    title: "Your transaction is being processed",
    status: status === 1 ? "SUCCESS" : "FAILED",
    description: "",
    transactionHash: transactionHash,
    image,
    btnText: "OK",
    closeOnBtnClick: true,
  });
};

export const openUnsufficientFundsNotification = () => {
  return openNotification({
    title: "Insufficient funds",
    description: "Complete the transaction by adding more ETH to your wallet",
    btnText: "Ok",
    image: "/static/images/icon_metamask.png",
    closeOnBtnClick: true,
  });
};

export const openTransactionFailedNotification = (error: unknown) => {
  return openNotification({
    title: "Oops something went wrong",
    description: isMetamaskError(error)
      ? getRevertedTransactionMessage(error)
      : "Please try again ",
    btnText: "OK",
    image: "/static/icons/error.png",
    closeOnBtnClick: true,
  });
};
