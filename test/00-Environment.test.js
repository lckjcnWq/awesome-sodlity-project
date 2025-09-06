/**
 * 🧪 环境基础测试
 * 确保Hardhat环境配置正确
 */

const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("🔧 Environment Setup Tests", function () {
  
  before(function () {
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    const hasValidAPIKey = ALCHEMY_API_KEY && ALCHEMY_API_KEY !== "YOUR-FREE-ALCHEMY-KEY";
    
    let mode = '🏠 本地模式';
    if (network.name === 'sepolia') {
      mode = '🧪 Sepolia测试网';
    } else if (hasValidAPIKey && network.name === 'hardhat') {
      mode = '🍴 Fork模式';
    }
    
    console.log(`\n    📊 测试模式: ${mode}`);
  });

  describe("Network Configuration", function () {
    it("should have correct network name", async function () {
      expect(network.name).to.be.oneOf(["hardhat", "localhost", "sepolia"]);
    });

    it("should have sufficient test accounts", async function () {
      const accounts = await ethers.getSigners();
      
      if (network.name === 'sepolia') {
        // Sepolia: 至少1个账户 (来自私钥)
        expect(accounts.length).to.be.at.least(1);
        console.log(`    ℹ️  Sepolia账户数: ${accounts.length}`);
      } else {
        // 本地/Fork: 至少10个账户
        expect(accounts.length).to.be.at.least(10);
      }
    });

    it("should have accounts with sufficient ETH balance", async function () {
      const accounts = await ethers.getSigners();
      
      if (network.name === 'sepolia') {
        // Sepolia: 检查第一个账户有基本余额 (0.01+ ETH)
        const balance = await accounts[0].getBalance();
        expect(balance).to.be.above(ethers.utils.parseEther("0.01"));
        console.log(`    ℹ️  账户余额: ${ethers.utils.formatEther(balance)} ETH`);
      } else {
        // 本地/Fork: 检查前3个账户每个都有1000+ ETH
        for (let i = 0; i < 3; i++) {
          const balance = await accounts[i].getBalance();
          expect(balance).to.be.above(ethers.utils.parseEther("1000"));
        }
      }
    });
  });

  describe("Provider Functions", function () {
    it("should be able to get block number", async function () {
      const blockNumber = await ethers.provider.getBlockNumber();
      expect(blockNumber).to.be.at.least(0); // 本地网络从区块0开始是正常的
      expect(blockNumber).to.be.a('number');
      console.log(`    ℹ️  当前区块号: ${blockNumber}`);
    });

    it("should be able to get network info", async function () {
      const network = await ethers.provider.getNetwork();
      expect(network.chainId).to.equal(31337);
    });
  });

  describe("Ethers.js Integration", function () {
    it("should create contract factory", async function () {
      // 简单的测试合约字节码
      const bytecode = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632e64cec11461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007e565b005b60008054905090565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea264697066735822122064856de85a2706463526593b08dd790054536042ef66d3204018e6f394edea7264736f6c63430008130033";
      
      const contractFactory = new ethers.ContractFactory(
        ["function get() view returns (uint256)", "function set(uint256)"],
        bytecode,
        (await ethers.getSigners())[0]
      );
      
      expect(contractFactory).to.not.be.undefined;
    });

    it("should be able to parse and format ether", async function () {
      const oneEther = ethers.utils.parseEther("1.0");
      expect(oneEther).to.equal(ethers.BigNumber.from("1000000000000000000"));
      
      const formatted = ethers.utils.formatEther(oneEther);
      expect(formatted).to.equal("1.0");
    });
  });

  describe("Gas and Transaction Testing", function () {
    it("should estimate gas for simple transaction", async function () {
      const [sender] = await ethers.getSigners();
      const accounts = await ethers.getSigners();
      
      let targetAddress;
      if (network.name === 'sepolia') {
        // Sepolia: 使用固定地址避免真实转账
        targetAddress = "0x0000000000000000000000000000000000000001";
      } else {
        // 本地: 使用第二个账户
        targetAddress = accounts[1].address;
      }
      
      const gasEstimate = await sender.estimateGas({
        to: targetAddress,
        value: ethers.utils.parseEther(network.name === 'sepolia' ? "0.001" : "1.0")
      });
      
      expect(gasEstimate).to.be.above(0);
      expect(gasEstimate).to.be.below(100000); // 应该远低于10万gas
      console.log(`    ℹ️  Gas估算: ${gasEstimate}`);
    });

    it("should execute simple ETH transfer", async function () {
      const accounts = await ethers.getSigners();
      
      if (network.name === 'sepolia') {
        console.log(`    ℹ️  Sepolia真实网络 - 跳过转账测试 (避免消耗真实ETH)`);
        this.skip();
        return;
      }
      
      // 仅在本地网络执行真实转账
      const [sender, receiver] = accounts;
      const initialBalance = await receiver.getBalance();
      
      await sender.sendTransaction({
        to: receiver.address,
        value: ethers.utils.parseEther("1.0")
      });
      
      const finalBalance = await receiver.getBalance();
      expect(finalBalance.sub(initialBalance)).to.equal(ethers.utils.parseEther("1.0"));
    });
  });

  describe("Time and Block Manipulation", function () {
    it("should be able to increase block time", async function () {
      const initialTime = (await ethers.provider.getBlock("latest")).timestamp;
      expect(initialTime).to.be.a('number');
      expect(initialTime).to.be.above(0);
      
      if (network.name === 'sepolia') {
        console.log(`    ℹ️  Sepolia真实网络 - 跳过时间操作测试`);
        this.skip();
        return;
      }
      
      // 增加1小时 (仅本地网络)
      await ethers.provider.send("evm_increaseTime", [3600]);
      await ethers.provider.send("evm_mine", []);
      
      const newTime = (await ethers.provider.getBlock("latest")).timestamp;
      expect(newTime - initialTime).to.be.at.least(3600);
      console.log(`    ℹ️  时间增加: ${newTime - initialTime}秒`);
    });

    it("should be able to mine blocks", async function () {
      const initialBlock = await ethers.provider.getBlockNumber();
      expect(initialBlock).to.be.at.least(0);
      
      if (network.name === 'sepolia') {
        console.log(`    ℹ️  Sepolia真实网络 - 跳过挖矿测试`);
        this.skip();
        return;
      }
      
      await ethers.provider.send("evm_mine", []);
      
      const newBlock = await ethers.provider.getBlockNumber();
      expect(newBlock).to.equal(initialBlock + 1);
      console.log(`    ℹ️  区块增加: ${initialBlock} -> ${newBlock}`);
    });
  });

  describe("Network Mode Verification", function () {
    it("should work in the current network mode", async function () {
      const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
      const hasValidAPIKey = ALCHEMY_API_KEY && ALCHEMY_API_KEY !== "YOUR-FREE-ALCHEMY-KEY";
      
      if (network.name === 'sepolia') {
        console.log("    ℹ️  Sepolia模式验证 - 真实测试网");
        
        // 验证Sepolia网络功能
        const blockNumber = await ethers.provider.getBlockNumber();
        expect(blockNumber).to.be.above(1000000); // Sepolia应该有很多区块
        
        const chainId = await ethers.provider.getNetwork();
        expect(chainId.chainId).to.equal(11155111); // Sepolia Chain ID
        
        console.log(`    ℹ️  Sepolia区块高度: ${blockNumber}, Chain ID: ${chainId.chainId}`);
        
      } else if (hasValidAPIKey && network.name === 'hardhat' && network.config.forking) {
        console.log("    ℹ️  Fork模式验证 - 使用Alchemy API");
        
        // 测试是否能获取主网的知名地址余额
        const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
        const balance = await ethers.provider.getBalance(vitalikAddress);
        
        // Vitalik应该有一些ETH余额
        expect(balance).to.be.above(0);
        
        console.log(`    ℹ️  Fork验证成功 - Vitalik余额: ${ethers.utils.formatEther(balance)} ETH`);
        
      } else {
        console.log("    ℹ️  本地模式验证 - 无需API密钥");
        
        // 验证本地网络基本功能
        const blockNumber = await ethers.provider.getBlockNumber();
        expect(blockNumber).to.be.at.least(0);
        
        console.log(`    ℹ️  本地区块高度: ${blockNumber}`);
      }
    });
  });

});
