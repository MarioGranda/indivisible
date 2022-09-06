const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts, wait } = require("./helpers");

describe("DAO withdrawFunds tests", async function () {
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
  let consensusPeriod, votingPeriod, proposalID, depositAmount;
  const name = "HOAs";
  const symbol = "HOA";
  const mintAmount = ethers.utils.parseUnits("1", "ether");
  const days = 1;
  const minConsensusPeriod = 1;
  const minVotingPeriod = 1;
  const minQuorum = 5000;

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

    depositAmount = ethers.utils.parseUnits("1", "ether");
    const vote = true;
    const lockingDays = 10;
    const lockingSeconds = lockingDays * 24 * 60 * 60;
    consensusPeriod = 1;
    votingPeriod = 1;
    //Create new proposal from dao
    tx = await dao
      .connect(signers[3])
      .newProposal(consensusPeriod, votingPeriod, minQuorum, tokenAddress, [], {
        from: user,
      });

    result = await tx.wait();
    event = result.events[result.events.length - 1];
    proposalID = event.args.proposalID;

    //Approve transfer from voter to DAO
    await token.connect(signers[4]).approve(daoAddress, depositAmount);

    //Vote on proposal
    await dao
      .connect(signers[4])
      .vote(proposalID, vote, depositAmount, lockingSeconds, tokenAddress, [], {
        from: voter,
      });
  });
  it("Success: Withdraw funds after executing proposal", async function () {
    await wait(2000);

    //Proposal creator executes proposal
    await expect(
      dao.connect(signers[3]).executeProposal(proposalID, { from: user })
    )
      .to.emit(dao, "ProposalExecuted")
      .withArgs(proposalID, true);

    //Voter withdraws funds
    await expect(
      dao.connect(signers[4]).getMyFunds(proposalID, { from: voter })
    )
      .to.emit(token, "Transfer")
      .withArgs(daoAddress, voter, depositAmount);
  });

  it("Fails: Withdraw funds before executing proposal", async function () {
    //Voter withdraws funds
    await expect(
      dao.connect(signers[4]).getMyFunds(proposalID, { from: voter })
    ).to.be.revertedWith("DAO: Proposal has not been closed yet");
  });

  it("Fails: Withdraw funds without voting", async function () {
    await wait(2000);

    //Proposal creator executes proposal
    await expect(
      dao.connect(signers[3]).executeProposal(proposalID, { from: user })
    )
      .to.emit(dao, "ProposalExecuted")
      .withArgs(proposalID, true);

    //Voter withdraws funds
    await expect(
      dao.connect(signers[3]).getMyFunds(proposalID, { from: user })
    ).to.be.revertedWith("DAO: No deposit was made for this proposal");
  });
});
