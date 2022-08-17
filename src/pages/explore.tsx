import React, { FC, useRef } from "react";
import { GetServerSideProps } from "next";
import FixedContainer from "@/client/layouts/FixedContainer";
import { findAllDaos } from "@/backend/repositories/dao";
import { Dao } from "@/shared/models";
import DaoCard from "@/client/components/DaoCard";

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
    <FixedContainer className="mt-5">
      {/* body */}
      <div className="grid grid-cols-3 gap-10" ref={nftRef}>
        {cards}
      </div>
    </FixedContainer>
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
