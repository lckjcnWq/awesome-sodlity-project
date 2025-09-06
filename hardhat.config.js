require("dotenv").config();

require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-network-helpers");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("hardhat-contract-sizer");

// 可选：从环境变量获取API密钥（免费申请）
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

// 检查是否启用Fork模式（需要API密钥）
const ENABLE_FORK = ALCHEMY_API_KEY && ALCHEMY_API_KEY !== "YOUR-FREE-ALCHEMY-KEY";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      metadata: {
        // 不在字节码中包含metadata hash，节省部署gas
        bytecodeHash: "none",
      },
    },
  },

  networks: {
    // 🧪 Sepolia测试网络 (主要开发和测试环境)
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
      chainId: 11155111,
      gasPrice: 20000000000, // 20 gwei
      gas: 6000000, // Gas限制
      timeout: 60000, // 60秒超时
      verify: {
        etherscan: {
          apiKey: ETHERSCAN_API_KEY
        }
      }
    },

    // 🏠 本地开发网络 (快速开发和单元测试)
    hardhat: {
      // 只有在有API密钥时才启用Fork
      ...(ENABLE_FORK ? {
        forking: {
          url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
          blockNumber: 18800000, // 固定区块号，确保一致性
        }
      } : {}),
      accounts: {
        accountsBalance: "10000000000000000000000", // 每个账户10,000 ETH
        count: 20, // 20个测试账户
        mnemonic: "test test test test test test test test test test test junk"
      },
      chainId: 31337,
      allowUnlimitedContractSize: true, // 允许大合约（开发阶段）
      mining: {
        auto: true,
        interval: 0 // 即时挖矿
      }
    },

    // 🚀 纯本地网络 (备用本地环境)
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      // localhost 使用本地节点的账户，不需要配置 accounts
    },

    // 💎 主网 (生产部署 - 谨慎使用)
    mainnet: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [], // 生产私钥严格管理
      chainId: 1,
      gasPrice: "auto",
    }
  },

  // 📊 Gas使用量报告配置
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    gasPrice: 20, // 模拟主网Gas价格
    showTimeSpent: true,
    showMethodSig: true,
    maxMethodDiff: 10,
    outputFile: "reports/gas-report.txt",
    excludeContracts: ["Migrations", "Mock*"] // 排除测试合约
  },

  // 🧪 测试框架配置
  mocha: {
    timeout: 60000, // 60秒超时
    bail: false, // 不在第一个失败时停止
    reporter: 'spec' // 详细测试报告
  },

  // 📏 合约大小检查
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    only: [':Diamond', ':MultiSigWallet', ':PriceOracle'], // 只检查核心合约
  },

  // 🏷️ 命名账户系统 (hardhat-deploy)
  namedAccounts: {
    deployer: {
      default: 0, // 默认使用第一个账户部署
      mainnet: 0,
      sepolia: 0
    },
    owner: {
      default: 1, // 合约拥有者
    },
    user1: 2,
    user2: 3,
    user3: 4,
    dao: 5,        // DAO治理账户
    treasury: 6,   // 金库账户
    guardian1: 7,  // 守护者1
    guardian2: 8,  // 守护者2
    guardian3: 9,  // 守护者3
  },

  // 📁 路径配置
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: "./deploy"
  },

  // ✅ Etherscan验证配置
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
    }
  },

  // 📋 TypeChain配置
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
    alwaysGenerateOverloads: false,
    externalArtifacts: ["externalArtifacts/*.json"],
  }
};
