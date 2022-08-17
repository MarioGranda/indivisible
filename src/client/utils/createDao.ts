import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import DaoCreator from "../../../artifacts/contracts/DAOCreator.sol/DAOCreator.json";
import { DaoCreatedEvent, getEvent } from "@/shared/utils/events";
import { CreateDaoInput } from "@/shared/validators/createDao";

export async function deployDao(
    input: CreateDaoInput,
    provider: JsonRpcProvider
) {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    if (!process.env.NEXT_PUBLIC_DAO_CREATOR_ADDRESS) {
        throw new Error(
            "Error: env NEXT_PUBLIC_DAO_CREATOR_ADDRESS must be defined to create DAOs"
        );
    }
    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAO_CREATOR_ADDRESS,
        DaoCreator.abi,
        signer
    );

    console.log(
        new Date(),
        "Starting creation of DAO ",
        input.name,
        " and token ",
        input.tokenSymbol
    );
    const transaction = await contract.createDAO(
        input.tokenName,
        input.tokenSymbol,
        input.mintAmount,
        input.minVotingPeriod,
        input.minConsensusPeriod,
        input.minQuorum,
    );
    const result = await transaction.wait();
    console.log(result)
    const event = getEvent(result, DaoCreatedEvent);
    const daoAddress = ethers.utils.getAddress(
        ethers.utils.hexZeroPad(
          ethers.utils.hexStripZeros(event.topics[2]),
          20
        )
      );
    return {
        daoAddress,
        transactionHash: result.transactionHash,
        status: Number(ethers.BigNumber.from(result.status)),
        daoCreatorAddress: await signer.getAddress()
    };
}
