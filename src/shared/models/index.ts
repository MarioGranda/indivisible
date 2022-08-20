export interface ContentFileType {
    image: {
        file: File;
        preview: string;
    };
}


export interface TransactionInput {
        from: string;
        logs: {
              address: string;
              blockHash: string;
              topics: string[];
            }[]         
        transactionHash: string;
} 

export interface Dao {
    id: number;
    name: string;
    description: string;
    image: string;
    daoCreatorAddress: string;
    address: string;
    tokenName: string;
    tokenSymbol: string;
    tokenImage: string;
    slug: string;
    minQuorum: number;
    minConsensusDeadline: number;
    minVotingDeadline: number;
    transactionHash: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface Proposal {
    id: number;
    name: string;
    description: string;
    daoId: number;
    proposalCreatorAddress: string;
    minQuorum: number;
    consensusDeadline: string;
    votingDeadline: string;
    yea: number;
    nay: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }

  export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    address: string;
    avatar: string;
  }
