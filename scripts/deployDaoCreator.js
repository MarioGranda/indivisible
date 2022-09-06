const { ethers, upgrades } = require("hardhat");
const hardhat = require("hardhat");

function getUpgradedEvent(transaction) {
  return transaction.logs.filter(
    (log) =>
      log.topics[0] ===
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Upgraded(address)"))
  )[0];
}

async function initializeDaoCreatorImplementation(transaction) {
  const daoCreatorImplementationAddress = ethers.utils.getAddress(
    ethers.utils.hexZeroPad(
      ethers.utils.hexStripZeros(getUpgradedEvent(transaction).topics[1])
    )
  );
  console.log(
    "DAOCreator Implementation deployed to: ",
    daoCreatorImplementationAddress
  );
  const DAOCreatorImplementation = await ethers.getContractFactory(
    "DAOCreator"
  );
  const daoCreatorImplementation = DAOCreatorImplementation.attach(
    daoCreatorImplementationAddress
  );
  const daoCreatorInitialization = await daoCreatorImplementation.initialize(
    process.env.ADMIN_ADDRESS,
    ethers.constants.AddressZero,
    ethers.constants.AddressZero
  );
  await daoCreatorInitialization.wait();
}

async function deployTokenImplementation() {
  //Deploy Token implementation
  const Token = await ethers.getContractFactory("Token");
  console.log("Deploying Token implementation contract...");
  const token = await Token.deploy();
  await token.deployed();
  console.log(token.address);
  //Initialize Token implementation
  await token.initialize("IMPLEMENTATION TOKEN", "IMPTKN");
  const Beacon = await ethers.getContractFactory("UpgradeableBeacon");
  const beacon = await Beacon.deploy(token.address);
  await beacon.deployed();
  return beacon.address;
}

async function deployDaoImplementation(beaconTokenAddress) {
  //Deploy DAO implementation
  const DAO = await ethers.getContractFactory("DAO");
  console.log("Deploying DAO implementation contract...");
  const dao = await DAO.deploy();
  await dao.deployed();
  console.log(dao.address);
  //Initialize DAO implementation
  await dao.initialize(
    process.env.ADMIN_ADDRESS,
    beaconTokenAddress,
    "DAO TOKEN",
    "DAOTKN",
    1,
    1,
    1,
    10000
  );
  const Beacon = await ethers.getContractFactory("UpgradeableBeacon");
  const beacon = await Beacon.deploy(dao.address);
  await beacon.deployed();
  return beacon.address;
}
async function main() {
  console.log("Deploying contracts to ", hardhat.network.name);
  // Deploy Token and DAO implementation contracts
  const beaconTokenAddress = await deployTokenImplementation();
  const beaconDaoAddress = await deployDaoImplementation(beaconTokenAddress);
  // Deploy DAO Creator as an UUPS proxy
  const DAOCreator = await ethers.getContractFactory("DAOCreator");
  console.log("Deploying DAOCreator contract...");
  const daoCreator = await upgrades.deployProxy(
    DAOCreator,
    [process.env.ADMIN_ADDRESS, beaconDaoAddress, beaconTokenAddress],
    {
      kind: "uups",
    }
  );
  const daoCreatorDeployment = await daoCreator.deployed();
  console.log("DAOCreator Proxy deployed to: ", daoCreator.address);
  const transaction = await daoCreatorDeployment.deployTransaction.wait();
  await initializeDaoCreatorImplementation(transaction);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
