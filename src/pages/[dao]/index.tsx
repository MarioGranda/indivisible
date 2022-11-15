import { FC } from "react";
import { Dao, Proposal, User } from "@/shared/models";
import { findDaoBySlug } from "@/backend/repositories/dao";
import FixedContainer from "@/client/layouts/FixedContainer";
import { findProposalsByDaoId } from "@/backend/repositories/proposals";
import { findUsersByDao } from "@/backend/repositories/user";
import ProposalsTable from "@/client/components/dao/ProposalsTable";
import TopMembers from "@/client/components/dao/TopMembers";

interface Props {
  dao: Dao;
  proposals: Proposal[];
  topMembers: User[];
}

const DaoPage: FC<Props> = ({ dao, proposals, topMembers }) => {
  return (
    <div className="explore-bg bg-cover">
      <FixedContainer className="text-white font-source pb-44">
        <div className="flex flex-col">
          <div className="h-[400px] w-full grid grid-cols-3 gap-4 items-center mt-16">
            <div className="col-span-2 flex flex-col items-center justify-center text-center">
              <span className="text-7xl">{dao.name}</span>
              <button className="mt-8 text-2xl flex items-center h-15 font-bold bg-black border-2 rounded-md border-white disabled:opacity-50 enabled:hover:border-green p-4 shadow-lg">
                Create proposal
              </button>
            </div>
            <TopMembers topMembers={topMembers} />
          </div>
          <div className="flex flex-col mt-28 pb-10">
            <ProposalsTable
              dao={dao}
              proposals={proposals.filter(
                (p) => new Date(p.votingDeadline) >= new Date()
              )}
              title="Active proposals"
            />
            <ProposalsTable
              dao={dao}
              proposals={proposals.filter(
                (p) => new Date(p.votingDeadline) < new Date()
              )}
              title="Closed proposals"
            />
          </div>
        </div>
      </FixedContainer>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const slug = params?.dao as string;
  const dao = await findDaoBySlug(slug);

  if (!dao) {
    return { notFound: true };
  }

  const proposals = await findProposalsByDaoId(dao.id);
  const topMembers = await findUsersByDao(dao.id);

  return {
    props: {
      dao,
      proposals,
      topMembers,
    },
  };
};

export default DaoPage;
