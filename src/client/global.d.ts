export declare global {
  import { ExternalProvider } from "@ethersproject/providers";

  interface Window {
    ethereum?: ExternalProvider;
  }
}
