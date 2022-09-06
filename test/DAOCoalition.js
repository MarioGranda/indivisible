const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  deployContracts,
  generateMerkleRoot,
  generateMerkleProof,
  verifyMerkleProof,
  generateMerkleTree,
} = require("./helpers");

describe("DAO coalition tests", async function () {
  let signers,
    user,
    multisig,
    daoDeployer,
    dao1Address,
    dao2Address,
    daoCreator,
    token1Address,
    coalitionDao;
  let merkleTree, merkleRoot;
  let DAO, Token;
  const name = "HOAs";
  const symbol = "HOA";
  const mintAmount = ethers.utils.parseUnits("1", "ether");
  const days = 1;
  const minConsensusPeriod = days * 24 * 60 * 60;
  const minVotingPeriod = days * 24 * 60 * 60;
  const minQuorum = 5000;

  beforeEach(async function () {
    signers = await ethers.getSigners();
    deployer = signers[0].address;
    daoDeployer = signers[1].address;
    multisig = signers[2].address;
    user = signers[3].address;

    daoCreator = await deployContracts(multisig);
    DAO = await ethers.getContractFactory("DAO");
    Token = await ethers.getContractFactory("Token");

    //create coalition DAO
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
    coalitionDaoAddress = event.args.dao;
    coalitionDao = DAO.attach(coalitionDaoAddress);

    //create dao1
    tx = await daoCreator
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
    result = await tx.wait();
    event = result.events[result.events.length - 1];
    dao1Address = event.args.dao;
    const dao1 = DAO.attach(dao1Address);

    token1Address = await dao1.connect(signers[1]).token();
    await dao1.connect(signers[3]).join({ from: user });

    //create dao2
    tx = await daoCreator
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
    result = await tx.wait();
    event = result.events[result.events.length - 1];
    dao2Address = event.args.dao;

    //Update merkle root
    const leaves = [dao1Address, dao2Address];
    //get MerkleRoot
    merkleTree = generateMerkleTree(leaves);
    merkleRoot = generateMerkleRoot(merkleTree);
    await coalitionDao
      .connect(signers[1])
      .updateMerkleRoot(merkleRoot, { from: daoDeployer });
  });
  it("Success: Create coalition DAO & submit proposal from subDao", async function () {
    //get MerkleProof
    const merkleProof = generateMerkleProof(merkleTree, dao1Address);

    //Create new proposal from dao1
    await expect(
      coalitionDao
        .connect(signers[3])
        .newProposal(
          minConsensusPeriod,
          minVotingPeriod,
          minQuorum,
          token1Address,
          merkleProof,
          { from: user }
        )
    ).to.emit(coalitionDao, "ProposalAdded");
  });

  it("Fails: Create coalition DAO & submit proposal from fake subDao", async function () {
    //create fake subDAO
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
    const event = result.events[result.events.length - 1];
    const fakeSubDaoAddress = event.args.dao;
    const fakeSubDao = DAO.attach(fakeSubDaoAddress);

    const fakeTokenAddress = await fakeSubDao.connect(signers[1]).token();
    await fakeSubDao.connect(signers[3]).join({ from: user });

    //get MerkleProof
    const merkleProof = generateMerkleProof(merkleTree, fakeSubDaoAddress);

    //Create new proposal from dao1
    await expect(
      coalitionDao
        .connect(signers[3])
        .newProposal(
          minConsensusPeriod,
          minVotingPeriod,
          minQuorum,
          fakeTokenAddress,
          merkleProof,
          { from: user }
        )
    ).to.be.revertedWith("DAO: Token does not belong to any subDao");
  });

  it("Success: Integrate subDao into an already existent coalitionDao", async function () {
    //create dao_3
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
    const event = result.events[result.events.length - 1];
    const dao3Address = event.args.dao;
    const dao3 = DAO.attach(dao3Address);

    const token3Address = await dao3.connect(signers[1]).token();
    await dao3.connect(signers[3]).join({ from: user });

    leaves = [dao1Address, dao2Address, dao3Address];
    //get MerkleRoot
    merkleTree = generateMerkleTree(leaves);
    merkleRoot = generateMerkleRoot(merkleTree);
    //Update merkle root in smart contract
    await coalitionDao
      .connect(signers[1])
      .updateMerkleRoot(merkleRoot, { from: daoDeployer });

    //get MerkleProof
    const merkleProof = generateMerkleProof(merkleTree, dao3Address);

    //Create new proposal from dao3
    await expect(
      coalitionDao
        .connect(signers[3])
        .newProposal(
          minConsensusPeriod,
          minVotingPeriod,
          minQuorum,
          token3Address,
          merkleProof,
          { from: user }
        )
    ).to.emit(coalitionDao, "ProposalAdded");
  });

  it("Fails: No updating merkle root in smart contract after including a new DAO", async function () {
    //create dao_3
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
    const event = result.events[result.events.length - 1];
    const dao3Address = event.args.dao;
    const dao3 = DAO.attach(dao3Address);

    const token3Address = await dao3.connect(signers[1]).token();
    await dao3.connect(signers[3]).join({ from: user });

    leaves = [dao1Address, dao2Address, dao3Address];
    //get MerkleRoot
    merkleTree = generateMerkleTree(leaves);
    merkleRoot = generateMerkleRoot(merkleTree);

    //get MerkleProof
    const merkleProof = generateMerkleProof(merkleTree, dao3Address);

    //Create new proposal from dao3
    await expect(
      coalitionDao
        .connect(signers[3])
        .newProposal(
          minConsensusPeriod,
          minVotingPeriod,
          minQuorum,
          token3Address,
          merkleProof,
          { from: user }
        )
    ).to.be.revertedWith("DAO: Token does not belong to any subDao");
  });
});
