const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployContracts } = require("./helpers");

describe("DAOCreator tests", async function () {
  let signers, deployer, multisig, daoDeployer;
  let daoCreator;

  beforeEach(async function () {
    signers = await ethers.getSigners();
    deployer = signers[0].address;
    daoDeployer = signers[1].address;
    multisig = signers[2].address;

    daoCreator = await deployContracts(multisig);
  });
  it("Success", async function () {
    const name = "HOAs";
    const symbol = "HOA";
    const mintAmount = ethers.utils.parseUnits("1", "ether");
    const days = 1;
    const minConsensusPeriod = days * 24 * 60 * 60;
    const minVotingPeriod = days * 24 * 60 * 60;
    const minQuorum = 5000;

    //create dao
    const tx = await daoCreator
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

    const result = await tx.wait();
    const daoCreatedEvent = result.events[result.events.length - 1];

    expect(daoCreatedEvent.args.daoCreator).to.equal(daoDeployer);
  });
});
