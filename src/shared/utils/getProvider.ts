import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";
import getNetwork from "@/shared/utils/getNetwork";

const getProvider = () => {
  let provider: JsonRpcProvider;
  const network = getNetwork();
  if (typeof window === "undefined" || !window.ethereum) {
    provider = new ethers.providers.JsonRpcProvider(
      `https://polygon-${network}.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
    );
  }
  else {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }
  return provider;
};

export default getProvider;
