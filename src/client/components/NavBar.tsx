import getProvider from "@/shared/utils/getProvider";
import { parseEthAddress } from "@/shared/utils/parse";
import Link from "next/link";
import { useEffect, useState } from "react";
import FixedContainer from "../layouts/FixedContainer";

const NavBar = () => {
  const [userWallet, setUserWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getAccount = async () => {
      const provider = getProvider();
      provider
        .send("eth_accounts", [])
        .then((accounts) => setUserWallet(accounts[0]));
    };
    getAccount();
    setIsLoading(false);
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", getAccount);
      return () =>
        window.ethereum.removeListener("accountsChanged", getAccount);
    }
  }, []);

  const connectWallet = async () => {
    if (userWallet) {
      return;
    }
    const provider = getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length === 0) {
      return;
    }
    setUserWallet(accounts[0]);
  };

  return (
    <header className="bg-black border border-b-gray sticky top-0 z-10">
      <FixedContainer className="relative">
        <nav className="items-center space-x-10 text-white h-[4.5rem]">
          <div className="grid grid-cols-2 my-4">
            <div className="grid grid-cols-3 gap-4 md:flex justify-start items-center my-4">
              <Link passHref href="/">
                <a>
                  <div className="self-center cursor-pointer">
                    <p className="font-source font-bold text-xl">
                      INDIVISIBLE DAO
                    </p>
                  </div>
                </a>
              </Link>
              <Link passHref href="/createdao">
                <a>
                  <div className="text-gray self-center cursor-pointer ml-20">
                    <p className="font-source font-bold">Create</p>
                  </div>
                </a>
              </Link>
              <Link passHref href="/explore">
                <a>
                  <div className="text-gray self-center cursor-pointer ml-5">
                    <p className="font-source font-bold">Explore</p>
                  </div>
                </a>
              </Link>
            </div>
            <div className="place-self-end mb-1.5">
              {!isLoading && (
                <button
                  className="text-white border hover:border-green hover:text-green px-7 py-3"
                  onClick={connectWallet}
                >
                  <p className="font-source">
                    {userWallet
                      ? parseEthAddress(userWallet)
                      : "Connect Wallet"}
                  </p>
                </button>
              )}
            </div>
          </div>
        </nav>
      </FixedContainer>
    </header>
  );
};

export default NavBar;
