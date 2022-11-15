import { keccak256 } from "ethers/lib/utils";
import MerkleTree from "merkletreejs";

export const generateMerkleTree = (leaves: string[]) => {
  const hashedLeaves = leaves.map((x) => keccak256(x));
  const tree = new MerkleTree(hashedLeaves, keccak256, { sort: true });
  return tree;
};

export const generateMerkleRoot = (tree: MerkleTree) => {
  const root = tree.getHexRoot();
  return root;
};

export const generateMerkleProof = (tree: MerkleTree, leaf: string) => {
  const proof = tree.getHexProof(keccak256(leaf));
  return proof;
};
