import getProvider from "@/shared/utils/get/provider";
import { CreateDiscussionInput } from "@/shared/validators/createDiscussion";
import axios from "axios";

export const publish = async (data: CreateDiscussionInput) => {
  const provider = getProvider();
  const connectedAccounts = await provider.send("eth_accounts", []);
  await axios.post("/api/create-discussion", {
    ...data,
    userAddress: connectedAccounts[0] ?? "0x00",
  });
};
