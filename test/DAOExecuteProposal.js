const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts, wait } = require("./helpers");

describe("DAO executeProposal tests", async function () {
  let signers,
    user,
    multisig,
    daoDeployer,
    daoCreator,
    dao,
    daoAddress,
    tokenAddress,
    voter,
    token;
  let DAO, Token;
  let consensusPeriod, votingPeriod;
  const name = "HOAs";
  const symbol = "HOA";
  const mintAmount = ethers.utils.parseUnits("1", "ether");
  const days = 1;
  const minConsensusPeriod = 1;
  const minVotingPeriod = 1;
  const minQuorum = 5000;
  const vote = true;
  const lockingDays = 10;
  const lockingSeconds = lockingDays * 24 * 60 * 60;

  beforeEach(async function () {
    signers = await ethers.getSigners();
    deployer = signers[0].address;
    daoDeployer = signers[1].address;
    multisig = signers[2].address;
    user = signers[3].address;
    voter = signers[4].address;

    consensusPeriod = days * 24 * 60 * 60;
    votingPeriod = days * 24 * 60 * 60;

    daoCreator = await deployContracts(multisig);
    DAO = await ethers.getContractFactory("DAO");
    Token = await ethers.getContractFactory("Token");

    //create DAO
    let tx = await daoCreator
      .connect(signers[1])
      .createDAO(
        name,
        symbol,
        mintAmount,
        minConsensusPeriod,
        minVotingPeriod,
        minQuorum,
        {
          from: daoDeployer,
        }
      );
    let result = await tx.wait();
    let event = result.events[result.events.length - 1];
    daoAddress = event.args.dao;
    dao = DAO.attach(daoAddress);
    tokenAddress = await dao.connect(signers[1]).token();
    token = Token.attach(tokenAddress);

    //user joins dao
    await dao.connect(signers[3]).join({ from: user });
    //voter joins dao
    await dao.connect(signers[4]).join({ from: voter });
  });
  it("Success: Executes proposal", async function () {
    const depositAmount = ethers.utils.parseUnits("1", "ether");
    consensusPeriod = 1;
    votingPeriod = 1;
    //Create new proposal from dao
    const tx = await dao
      .connect(signers[3])
      .newProposal(consensusPeriod, votingPeriod, minQuorum, tokenAddress, [], {
        from: user,
      });

    let result = await tx.wait();
    let event = result.events[result.events.length - 1];
    const proposalID = event.args.proposalID;

    //Approve transfer from voter to DAO
    await token.connect(signers[4]).approve(daoAddress, depositAmount);

    //Vote on proposal
    await dao
      .connect(signers[4])
      .vote(proposalID, vote, depositAmount, lockingSeconds, tokenAddress, [], {
        from: voter,
      });

    await wait(2000);

    //Proposal creator executes proposal
    await expect(
      dao.connect(signers[3]).executeProposal(proposalID, { from: user })
    )
      .to.emit(dao, "ProposalExecuted")
      .withArgs(proposalID, true);
  });

  it("Fails: Non-creator proposal execute it", async function () {
    const depositAmount = ethers.utils.parseUnits("1", "ether");
    consensusPeriod = 1;
    votingPeriod = 1;
    //Create new proposal from dao
    const tx = await dao
      .connect(signers[3])
      .newProposal(consensusPeriod, votingPeriod, minQuorum, tokenAddress, [], {
        from: user,
      });

    let result = await tx.wait();
    let event = result.events[result.events.length - 1];
    const proposalID = event.args.proposalID;

    //Approve transfer from voter to DAO
    await token.connect(signers[4]).approve(daoAddress, depositAmount);

    //Vote on proposal
    await dao
      .connect(signers[4])
      .vote(proposalID, vote, depositAmount, lockingSeconds, tokenAddress, [], {
        from: voter,
      });

    await wait(2000);

    //Proposal creator executes proposal
    await expect(
      dao.connect(signers[4]).executeProposal(proposalID, { from: voter })
    ).to.be.revertedWith(
      "DAO: Only proposal creator can execute this proposal"
    );
  });

  it("Fails: Executes proposal before voting deadline", async function () {
    const depositAmount = ethers.utils.parseUnits("1", "ether");
    consensusPeriod = 1;
    //Create new proposal from dao
    const tx = await dao
      .connect(signers[3])
      .newProposal(consensusPeriod, votingPeriod, minQuorum, tokenAddress, [], {
        from: user,
      });

    let result = await tx.wait();
    let event = result.events[result.events.length - 1];
    const proposalID = event.args.proposalID;

    //Approve transfer from voter to DAO
    await token.connect(signers[4]).approve(daoAddress, depositAmount);

    //Vote on proposal
    await dao
      .connect(signers[4])
      .vote(proposalID, vote, depositAmount, lockingSeconds, tokenAddress, [], {
        from: voter,
      });

    //Proposal creator executes proposal
    await expect(
      dao.connect(signers[3]).executeProposal(proposalID, { from: user })
    ).to.be.revertedWith("DAO: Voting has not finished yet");
  });

  it("Fails: Min Quorum proposal has not been achieved", async function () {
    //Not enough depositAmount to achieve the minimum quorum
    const depositAmount = ethers.utils.parseUnits("0.5", "ether");
    consensusPeriod = 1;
    votingPeriod = 1;
    //Create new proposal from dao
    const tx = await dao
      .connect(signers[3])
      .newProposal(consensusPeriod, votingPeriod, minQuorum, tokenAddress, [], {
        from: user,
      });

    let result = await tx.wait();
    let event = result.events[result.events.length - 1];
    const proposalID = event.args.proposalID;

    //Approve transfer from voter to DAO
    await token.connect(signers[4]).approve(daoAddress, depositAmount);

    //Vote on proposal
    await dao
      .connect(signers[4])
      .vote(proposalID, vote, depositAmount, lockingSeconds, tokenAddress, [], {
        from: voter,
      });

    await wait(2000);

    //Proposal creator executes proposal
    await expect(
      dao.connect(signers[3]).executeProposal(proposalID, { from: user })
    ).to.be.revertedWith(
      "DAO: Quorum must be greater than proposal's minQuorum"
    );
  });
});
