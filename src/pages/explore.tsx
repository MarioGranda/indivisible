import React, { FC, useRef } from "react";
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

  const cards = daos.map((dao) => (
    <DaoCard className="mt-5" itemId={dao.id} key={dao.id} dao={dao} />
  ));
  return (
    <div className="explore-bg bg-cover">
      <Hero dao={daos[1]} />
      <FixedContainer className="mt-5 pb-80">
        <h2 className="text-white text-center font-source text-4xl my-5">
          Latest DAOs
        </h2>
        <div
          className="grid grid-cols-4 justify-items-center gap-10"
          ref={nftRef}
        >
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
      daos,
    },
  };
};

export default Explore;
