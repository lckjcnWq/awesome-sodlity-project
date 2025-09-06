/**
 * 🔍 Node.js版本检查脚本
 * 检查当前Node.js版本是否与Hardhat兼容
 */

function checkNodeVersion() {
  const currentVersion = process.version;
  const major = parseInt(currentVersion.substring(1).split('.')[0]);
  const supportedRange = '16-20';
  
  console.log('🔍 检查Node.js版本兼容性...\n');
  console.log(`当前Node.js版本: ${currentVersion} (主版本: ${major})`);
  console.log(`Hardhat支持的版本: ${supportedRange}.x.x\n`);
  
  if (major >= 16 && major <= 20) {
    console.log('✅ Node.js版本兼容，可以继续开发！');
    if (major === 16 || major === 18 || major === 20) {
      console.log('✨ 您使用的是推荐的LTS版本！');
    }
    return true;
  } else {
    console.log('⚠️  Node.js版本不在Hardhat支持范围内');
    console.log('\n🔧 解决方案:');
    
    if (major > 20) {
      console.log('1. 您的Node.js版本过新，建议降级到Node.js 20.x.x');
      console.log('2. 使用nvm管理版本: nvm install 20.9.0 && nvm use 20.9.0');
      console.log('3. 或者直接从 https://nodejs.org 下载Node.js 20.x.x');
    } else {
      console.log('1. 您的Node.js版本过旧，建议升级到Node.js 18.x.x或20.x.x');
      console.log('2. 从 https://nodejs.org 下载最新的LTS版本');
    }
    
    console.log('\n📋 推荐版本:');
    console.log('- Node.js 18.19.0 (LTS)');
    console.log('- Node.js 20.9.0 (LTS)');
    
    console.log('\n💡 临时解决方案:');
    console.log('如果您暂时无法更换Node.js版本，可以尝试:');
    console.log('HARDHAT_IGNORE_NODEJS_VERSION_WARNING=1 npm run compile');
    console.log('(注意: 这可能会导致意外行为)');
    
    return false;
  }
}

// 检查是否作为模块被导入，还是直接运行
if (require.main === module) {
  const isCompatible = checkNodeVersion();
  process.exit(isCompatible ? 0 : 1);
}

module.exports = { checkNodeVersion };
