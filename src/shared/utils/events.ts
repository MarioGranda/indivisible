import { TransactionInput } from "@/shared/models/index";
import { ethers } from "ethers";

export const getEventSignature = (event: string) => {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(event));
};

export function getEvent(
  transaction: TransactionInput,
  eventSignature: string
) {
  const event = transaction.logs.find(
    (log) => log.topics[0] === getEventSignature(eventSignature)
  );
  if (!event) {
    throw new Error("No matching event found");
  }
  return event;
}

export const DaoCreatedEvent =
  "DAOCreated(address,address)";
