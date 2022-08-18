import { FC } from "react";
import { Dao, Proposal } from "@/shared/models";
import { findDaoBySlug } from "@/backend/repositories/dao";
import FixedContainer from "@/client/layouts/FixedContainer";
import Image from "next/image";
import { findProposalsByDaoId } from "@/backend/repositories/proposals";

interface Props {
    dao: Dao,
    proposals: Proposal[]
}

const DaoPage: FC<Props> = ({
    dao,
    proposals
}) => {
    return (
        <FixedContainer className="text-white font-source">
            <div className="w-full h-[400px] flex items-center justify-evenly" >
                <div className="flex flex-col items-center justify-center">
                    <span className="text-7xl">
                        {dao.name}
                    </span>
                    <button
                        className="mt-8 text-2xl flex items-center h-15 font-bold my-2 bg-black border border-white disabled:opacity-50 enabled:hover:border-green enabled:focus:border-green p-4 shadow-lg"
                    >
                        Create proposal
                    </button>
                </div>
                <div className="items-end flex flex-col text-3xl border border-white">
                    Top members
                </div>
            </div>
            <div className="h-[550px] flex flex-col items-start justify-start border border-white mb-8">
                <span className="p-6 text-4xl">
                    Active proposals
                </span>
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
                    </ div>
                    {
                        proposals.map((p, i) => (
                            <div className="grid grid-cols-3 gap-4 w-full border border-white py-2">
                                <div className="flex items-center justify-start px-6">{p.name}</div>
                                <div className="flex items-center gap-16 justify-center">
                                    <div className="">{new Date(p.consensusDeadline).toDateString()}</div>
                                    <div className="">{new Date(p.votingDeadline).toDateString()}</div>
                                </div>
                                <div className="flex items-center gap-14 justify-end px-8">
                                    <div>{p.yea}</div>
                                    <div>{p.nay}</div>
                                    <div>{p.minQuorum}</div>
                                </div>
                            </ div>
                            // <div className="flex items-center justify-start  px-6">
                            //     #{i + 1} {p.name}
                            // </ div>
                        ))
                    }
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

    const proposals = await findProposalsByDaoId(dao.id)

    return {
        props: {
            dao,
            proposals
        },
    };
}

export default DaoPage;
