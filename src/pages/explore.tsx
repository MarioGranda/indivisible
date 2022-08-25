import React, { FC, useRef } from "react";
import { GetServerSideProps } from "next";
import FixedContainer from "@/client/layouts/FixedContainer";
import { findAllDaos } from "@/backend/repositories/dao";
import { Dao } from "@/shared/models";
import DaoCard from "@/client/components/DaoCard";
import Hero from "@/client/components/Hero";

interface Props {
  daos: Dao[];
}

const Explore: FC<Props> = ({ daos }) => {
  const nftRef = useRef<HTMLDivElement>(null);

  const cards = daos.map((dao, i) => (
    <DaoCard
      className="mr-3 md:mr-10 mt-5 mb-10"
      itemId={dao.id}
      key={dao.id}
      dao={dao}
    />
  ));
  return (
    <div>
    <FixedContainer className="mt-5">
    <Hero dao={daos[0]}/>
    </FixedContainer>
    <FixedContainer className="mt-5">
      {/* body */}
      <h2 className="text-white text-center font-source text-4xl my-5">
        Latest DAOs
      </h2>
      <div className="grid grid-cols-3 gap-10" ref={nftRef}>
        {cards}
      </div>
    </FixedContainer>
    </div>
  );
};

export const getServerSideProps = async () => {
  const daos = await findAllDaos();
  return {
    props: {
      daos
    },
  };
}

export default Explore;
