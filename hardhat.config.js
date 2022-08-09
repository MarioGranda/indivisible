require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();
//require("@nomiclabs/hardhat-etherscan");

const privateKey = process.env.privateKey || "";
const infuraId = process.env.infuraKey || "";
const alchemyId = process.env.alchemyKey || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    development: {
      url: "http://127.0.0.1:8545",
      chainId: 1337, // Match any network id
      gas: 500000000,
    },
    ...(infuraId && {
      mumbai_infura: {
        url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
        accounts: [privateKey],
      },
      matic_infura: {
        url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
        accounts: [privateKey],
      },
      mainnet_infura: {
        url: `https://mainnet.infura.io/v3/${infuraId}`,
        accounts: [privateKey],
      },
      ropsten_infura: {
        url: `https://ropsten.infura.io/v3/${infuraId}`,
        accounts: [privateKey],
      },
      rinkeby_infura: {
        url: `https://rinkeby.infura.io/v3/${infuraId}`,
        accounts: [privateKey],
      },
      kovan_infura: {
        url: `https://kovan.infura.io/v3/${infuraId}`,
        accounts: [privateKey],
      },
    }),
    ...(alchemyId && {
      mumbai_alchemy: {
        url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyId}`,
        accounts: [privateKey],
      },
      matic_alchemy: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyId}`,
        accounts: [privateKey],
      },
      mainnet_alchemy: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${alchemyId}`,
        accounts: [privateKey],
      },
      ropsten_alchemy: {
        url: `https://eth-ropsten.alchemyapi.io/v2/${alchemyId}`,
        accounts: [privateKey],
      },
      rinkeby_alchemy: {
        url: `https://eth-rinkeby.alchemyapi.io/v2/${alchemyId}`,
        accounts: [privateKey],
      },
      kovan_alchemy: {
        url: `https://eth-kovan.alchemyapi.io/v2/${alchemyId}`,
        accounts: [privateKey],
      },
    }),
  },
  solidity: {
    version: "0.8.14",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      rinkeby: process.env.ETHERSCAN_API_KEY,
      ropsten: process.env.ETHERSCAN_API_KEY,
      kovan: process.env.ETHERSCAN_API_KEY,
      mainnet: process.env.ETHERSCAN_API_KEY,
    },
  },
};
