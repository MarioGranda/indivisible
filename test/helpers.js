const { upgrades } = require("hardhat");
const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/SHA256')
const { keccak256 } = ethers.utils

const deployContracts = async (multisig) => {
    // Deploy beacons
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy()
    await token.deployed()
    const DAO = await ethers.getContractFactory("DAO");
    const dao = await DAO.deploy()
    await dao.deployed()
    const UpgradeableBeacon = await ethers.getContractFactory("UpgradeableBeacon");
    const beaconDAO = await UpgradeableBeacon.deploy(dao.address)
    await beaconDAO.deployed()
    const beaconToken = await UpgradeableBeacon.deploy(token.address)
    await beaconToken.deployed();
    // Deploy DAOCreator
    const DAOCreator = await ethers.getContractFactory("DAOCreator");
    const daoCreator = await upgrades.deployProxy(DAOCreator, [multisig, beaconDAO.address, beaconToken.address], {
        kind: "uups",
    });
    await daoCreator.deployed();

    return daoCreator
}

const generateMerkleTree = (leaves) => {
    const hashedLeaves = leaves.map(x => keccak256(x))
    const tree = new MerkleTree(hashedLeaves, keccak256, { sort: true })

    return tree
}

const generateMerkleRoot = (tree) => {
    const root = tree.getHexRoot()
    return root
}

const generateMerkleProof = (tree, leaf) => {
    const proof = tree.getHexProof(keccak256(leaf))
    return proof
}

const verifyMerkleProof = (tree, leaf, root, proof) => {
    const hashedLeaf = keccak256(leaf)
    console.log(tree.verify(proof, hashedLeaf, root)) // true
}

const wait = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

module.exports = { deployContracts, generateMerkleTree, generateMerkleRoot, generateMerkleProof, verifyMerkleProof, wait }
