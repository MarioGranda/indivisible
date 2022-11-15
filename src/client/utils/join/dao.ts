import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import Dao from "../../../../artifacts/contracts/DAO.sol/DAO.json";

export async function joinDao(daoAddress: string, provider: JsonRpcProvider) {
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(daoAddress, Dao.abi, signer);

  const transaction = await contract.join();
  const result = await transaction.wait();

  return {
    signerAddress: await signer.getAddress(),
    result: {
      transactionHash: result.transactionHash,
      status: result.status,
    },
  };
}
