import { Dao } from "@/shared/models";
import { FC } from "react";
import FixedContainer from "../../layouts/FixedContainer";
import DaoCard from "./DaoCard";
import { ImArrowRight2 } from "react-icons/im";
import HeroStatistic from "./HeroStatistic";
import HeroTitle from "./HeroTitle";

interface Props {
  dao: Dao;
  className?: string;
}

const Hero: FC<Props> = ({ dao }) => {
  return (
    <section className="h-[600px]">
      <FixedContainer className="">
        <div className="grid grid-cols-3">
          <div className="col-span-2">
            <FixedContainer className="mt-5 flex flex-col gap-9 pt-72 md:pt-0 justify-center w-full md:h-[540px] md:w-auto">
              <HeroTitle />
              <button className="my-8 ml-[202px] flex  mx-auto items-center h-10 font-bold rounded-md text-white bg-black border border-white disabled:opacity-50 enabled:hover:border-green p-4">
                <span>Discover DAOs &nbsp;</span>
                <ImArrowRight2></ImArrowRight2>
              </button>
              <div className="flex gap-8">
                <HeroStatistic text="+100 Organizations" />
                <HeroStatistic text="+35K Members" />
                <HeroStatistic text="+100K Proposals" />
              </div>
            </FixedContainer>
          </div>
          <div className="flex relative mt-20 justify-center px-20 col-span-1">
            <div className="absolute inset-0 w-[250px] h-[320px] border border-white rotate-[8.9deg] rounded-xl translate-x-5 translate-y-5"></div>
            <DaoCard
              className="absolute inset-0 left-0 m-4"
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
