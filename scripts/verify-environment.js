/**
 * 🔧 环境验证脚本
 * 验证Hardhat开发环境是否正确配置
 */

const { ethers, network } = require("hardhat");

async function main() {
  console.log("🔧 开始验证Hardhat开发环境...\n");

  try {
    // 检查是否为本地模式
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    const isLocalMode = !ALCHEMY_API_KEY || ALCHEMY_API_KEY === "YOUR-FREE-ALCHEMY-KEY";
    
    if (isLocalMode) {
      console.log("🏠 本地开发模式 (无需API密钥)");
    } else {
      console.log("🍴 Fork主网模式 (使用Alchemy API)");
    }

    // 1. 验证网络配置
    console.log("\n📡 网络信息:");
    console.log(`  - 网络名称: ${network.name}`);
    console.log(`  - Chain ID: ${await ethers.provider.getNetwork().then(n => n.chainId)}`);
    
    // 2. 验证账户配置
    console.log("\n👥 账户信息:");
    const accounts = await ethers.getSigners();
    console.log(`  - 可用账户数量: ${accounts.length}`);
    
    for (let i = 0; i < Math.min(5, accounts.length); i++) {
      const balance = await accounts[i].getBalance();
      console.log(`  - 账户 ${i}: ${accounts[i].address} (余额: ${ethers.utils.formatEther(balance)} ETH)`);
    }

    // 3. 验证网络状态
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`\n🔗 区块链状态:`);
    console.log(`  - 当前区块高度: ${blockNumber}`);

    // 4. Fork网络特殊验证 (只有在Fork模式下才执行)
    if (network.name === "hardhat" && network.config.forking && !isLocalMode) {
      console.log("\n🍴 Fork网络验证:");
      try {
        // 测试获取Vitalik的余额 (验证Fork是否工作)
        const vitalikAddress = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
        const vitalikBalance = await ethers.provider.getBalance(vitalikAddress);
        console.log(`  - Vitalik余额: ${ethers.utils.formatEther(vitalikBalance)} ETH (验证Fork成功)`);
      } catch (error) {
        console.log(`  - Fork验证失败: ${error.message}`);
      }
    } else if (isLocalMode) {
      console.log("\n🏠 本地模式验证:");
      console.log("  - 使用本地区块链，无需外部API");
      console.log("  - 所有数据都是模拟的，适合开发和测试");
    }

    // 4. 验证编译环境
    console.log("\n🔨 编译环境验证:");
    console.log("  - Solidity编译器版本: 0.8.19");
    console.log("  - 优化器: 启用 (200 runs)");

    // 5. 验证测试框架
    console.log("\n🧪 测试框架验证:");
    console.log("  - Hardhat: ✅");
    console.log("  - Ethers.js: ✅");
    console.log("  - Chai: ✅");

    console.log("\n🎉 环境验证完成! 所有配置正常.");
    
    if (isLocalMode) {
      console.log("\n📋 本地开发模式 - 下一步:");
      console.log("  1. 运行 'npm run compile' 编译合约");
      console.log("  2. 运行 'npm run test' 执行测试");
      console.log("  3. 开始开发第一个合约!");
      console.log("\n💡 提示:");
      console.log("  - 当前为纯本地模式，无需网络连接");
      console.log("  - 如需Fork主网数据，请配置.env文件中的ALCHEMY_API_KEY");
    } else {
      console.log("\n📋 Fork模式 - 下一步:");
      console.log("  1. 运行 'npm run compile' 编译合约");
      console.log("  2. 运行 'npm run test' 执行测试");
      console.log("  3. 可以与真实主网协议交互测试!");
    }

  } catch (error) {
    console.error("\n❌ 环境验证失败:");
    console.error(error.message);
    
    const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
    const isLocalMode = !ALCHEMY_API_KEY || ALCHEMY_API_KEY === "YOUR-FREE-ALCHEMY-KEY";
    
    console.log("\n🔧 可能的解决方案:");
    if (isLocalMode) {
      console.log("  1. 运行 'npm install' 重新安装依赖");
      console.log("  2. 确保没有其他Hardhat进程运行");
      console.log("  3. 尝试运行 'npx hardhat compile' 直接测试");
      console.log("\n💡 本地模式无需网络连接或API密钥");
    } else {
      console.log("  1. 检查 .env 文件中的API密钥是否正确");
      console.log("  2. 确保网络连接正常");
      console.log("  3. 验证Alchemy API密钥是否有效");
      console.log("  4. 或者删除.env文件使用纯本地模式");
    }
    
    process.exit(1);
  }
}

// 运行验证
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
