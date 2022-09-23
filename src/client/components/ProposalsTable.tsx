import { Dao, Proposal } from "@/shared/models";
import { getProposalUrl } from "@/shared/utils/createUrls";
import Link from "next/link";
import React, { FC } from "react";

interface Props {
  dao: Dao;
  proposals: Proposal[];
  title: string;
}

const ProposalsTable: FC<Props> = ({ dao, proposals, title }) => {
  return (
    <div className="h-[550px] flex flex-col items-start justify-start border-2 rounded-md border-white mb-8">
      <span className="p-6 text-4xl">{title}</span>
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
                <div className="grid grid-cols-3 gap-4 w-full border rounded-md border-white py-2 mb-4">
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
                    <div>{Math.round(p.minQuorum) / 100}%</div>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalsTable;
