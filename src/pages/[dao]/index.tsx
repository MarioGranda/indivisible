import { FC } from "react";
import { Dao, Proposal, User } from "@/shared/models";
import { findDaoBySlug } from "@/backend/repositories/dao";
import FixedContainer from "@/client/layouts/FixedContainer";
import Image from "next/image";
import { findProposalsByDaoId } from "@/backend/repositories/proposals";
import { findUsersByDao } from "@/backend/repositories/user";
import { getProposalUrl } from "@/shared/utils/createUrls";
import Link from "next/link";

interface Props {
  dao: Dao;
  proposals: Proposal[];
  topMembers: User[];
}

const DaoPage: FC<Props> = ({ dao, proposals, topMembers }) => {
  return (
    <FixedContainer className="text-white font-source">
      <div className="flex flex-col">
        <div className="h-[400px] w-full grid grid-cols-3 gap-4 items-center">
          <div className="col-span-2 flex flex-col items-center justify-center">
            <span className="text-7xl">{dao.name}</span>
            <button className="mt-8 text-2xl flex items-center h-15 font-bold my-2 bg-black border border-white disabled:opacity-50 enabled:hover:border-green enabled:focus:border-green p-4 shadow-lg">
              Create proposal
            </button>
          </div>
          <div className="col-span-1 h-[300px] flex flex-col gap-4 items-center text-3xl border border-white py-2">
            <span className="text-3xl">Top members</span>
            {topMembers.map((user, i) => (
              <div key={user.id} className="grid grid-cols-3 gap-4  mx-4">
                <div>
                  #{i + " "}
                  <Image
                    src={user.avatar}
                    width={30}
                    height={30}
                    alt={`${user.avatar} image`}
                    className=""
                  />
                </div>
                <div className="items-self-end">
                  {user.address.substring(0, 6) + "..."}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[550px] flex flex-col items-start justify-start border border-white mb-8">
          <span className="p-6 text-4xl">Active proposals</span>
          <div className="flex flex-col w-full mx-auto px-8">
            <div className="grid grid-cols-3 gap-4 h-10 w-full mb-4 font-bold">
              <div className="flex items-center justify-start px-6">Name</div>
              <div className="flex items-center gap-8 justify-center px-2">
                <div>Consensus deadline</div>
                <div>Voting deadline</div>
              </div>
              <div className="flex items-center gap-9 justify-end px-6">
                <div>Yea</div>
                <div>Nay</div>
                <div>Quorum</div>
              </div>
            </div>
            {proposals.map((p) => (
              <div key={p.id}>
                <Link passHref href={getProposalUrl(dao.slug, p.id)}>
                  <a>
                    <div className="grid grid-cols-3 gap-4 w-full border border-white py-2">
                      <div className="flex items-center justify-start px-6">
                        {p.name}
                      </div>
                      <div className="flex items-center gap-16 justify-center">
                        <div className="">
                          {new Date(p.consensusDeadline).toDateString()}
                        </div>
                        <div className="">
                          {new Date(p.votingDeadline).toDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-14 justify-end px-8">
                        <div>{p.yea}</div>
                        <div>{p.nay}</div>
                        <div>{p.minQuorum}</div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FixedContainer>
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
