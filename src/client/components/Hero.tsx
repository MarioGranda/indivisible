//import { scrollToElement } from "@/shared/utils/scrollToElement";
import { Dao } from "@/shared/models";
import { FC } from "react";
import FixedContainer from "../layouts/FixedContainer";
import DaoCard from "./DaoCard";
import { ImArrowRight2 } from "react-icons/im";

interface Props {
  //nftRef: React.RefObject<HTMLDivElement>;
  dao: Dao;
  className?: string;
}

const Hero: FC<Props> = ({ className, dao }) => {
  return (
    <section className="h-[600px]">
      <FixedContainer className="">
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <FixedContainer className="mt-5 flex flex-col gap-9 pt-72 md:pt-0 justify-center w-full md:h-[540px] md:w-auto">
              <div className="font-source leading-[3rem] md:pr-5 text-[50px] md:text-7xl lg:text-7x2 text-white uppercase">
                <div className="flex flex-col">
                  <h1>
                    Join <br />
                    <span className="flex flex-row gap-4 items-center">
                      <span className="border-8 border-brand w-28 bg-white" />
                      <span>Digital</span>
                    </span>
                  </h1>
                </div>
                <div className="flex gap-3 items-center">Democracy</div>
              </div>

              <h2 className="font-bold font-source text-white max-w-[15rem] md:max-w-none whitespace-pre-line">
                Become a member of{" "}
                <span
                  //onClick={() => scrollToElement(nftRef)}
                  className="text-brand underline cursor-pointer"
                >
                  DAOs
                </span>{" "}
                and contribute to Digital Democracy.
              </h2>
              <button className="my-8 ml-[202px] flex  mx-auto items-center h-10 font-bold text-white bg-black border border-white disabled:opacity-50 enabled:hover:border-green enabled:focus:border-green p-4">
                <span>Discover DAOs &nbsp;</span>
                <ImArrowRight2></ImArrowRight2>
              </button>
              <div className="flex gap-8">
                <div className="flex items-center">
                  <div className="box-border h-10 w-2 border-white border-4 bg-white"></div>
                  <span className="flex text-white font-source mx-4 text-2xl">
                    +100 DAOs
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="box-border h-10 w-2 border-white border-4 bg-white"></div>
                  <span className="text-white font-source mx-4 text-2xl whitespace-nowrap">
                    +35K Members
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="box-border h-10 w-2 border-white border-4 bg-white"></div>
                  <span className="text-white font-source mx-4 text-2xl">
                    +100K Proposals
                  </span>
                </div>
              </div>
            </FixedContainer>
          </div>
          <div className="flex relative mt-32 justify-center px-20 col-span-1">
            <div className="absolute inset-0 w-[250px] h-[320px] border border-white rotate-[8.9deg] rounded-xl translate-x-5 translate-y-5"></div>
            <DaoCard
              className="absolute inset-0 left-0 m-4"
              itemId={dao.id}
              key={dao.id}
              dao={dao}
            />
          </div>
        </div>
      </FixedContainer>
    </section>
  );
};

export default Hero;
