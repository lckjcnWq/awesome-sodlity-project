# 🔷 Awesome Solidity Project

**DeFi双项目**: 多签智能钱包 + DEX聚合器平台

## 📋 项目概述

这是一个企业级DeFi双项目，包含：
- 🔐 **多签智能钱包系统**: 支持多重签名、资产管理、DeFi集成
- 🔄 **DEX聚合器平台**: 智能路由、价格聚合、流动性优化

## 🚀 快速开始

### 环境要求
- **Node.js**: 16.0.0 - 20.x.x (⚠️ 不支持Node.js 21+)
- **npm**: >= 7.0.0
- **Git**: 最新版本

> 📋 **重要**: 如果您使用Node.js 21+版本，会收到Hardhat兼容性警告。建议使用Node.js 18.x或20.x LTS版本。

### 安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd awesome-solidity-project

# 安装依赖
npm install

# 🎯 选择开发模式
```

### 开发模式选择

#### 🏠 模式1: 纯本地开发 (推荐新手)
- ✅ **无需API密钥**
- ✅ **无需网络连接**  
- ✅ **零成本使用**
- ✅ **快速启动**

```bash
# 直接开始开发，无需配置
npm run env:verify  # 验证环境
npm run compile     # 编译合约
npm run test        # 运行测试
```

#### 🍴 模式2: Fork主网开发 (需要真实数据)
- 🔑 **需要Alchemy API密钥**
- 🌐 **需要网络连接**
- 💰 **API调用有限额**
- 🚀 **可以与真实协议交互**

```bash
# 1. 复制环境变量文件
cp .env.example .env

# 2. 编辑 .env 文件，填入API密钥
# ALCHEMY_API_KEY=your-actual-api-key

# 3. 开始开发
npm run env:verify  # 验证环境和API连接
npm run compile     # 编译合约  
npm run test        # 运行测试 (可访问真实主网数据)
```

### 获取免费API密钥 (仅Fork模式需要)

> 📋 **重要**: 如果您选择纯本地模式，可以跳过这一步

**需要Fork主网数据时:**

1. **Alchemy API** (推荐): 
   - 访问 https://alchemy.com
   - 注册免费账户 (每月100M请求)
   - 创建App，获取API Key

2. **Etherscan API** (可选):
   - 访问 https://etherscan.io/apis
   - 注册并获取免费API Key

### 基础命令

```bash
# 检查Node.js版本兼容性
npm run check-node

# 验证环境配置
npm run env:verify

# 编译合约
npm run compile

# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# Gas使用报告
npm run test:gas

# 启动本地节点
npm run node

# 部署到本地
npm run deploy:local

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 🔧 故障排除

### Node.js版本兼容性问题

**问题**: 收到"Node.js version not supported"警告
```bash
WARNING: You are currently using Node.js v23.x.x, which is not supported by Hardhat
```

**解决方案**:
1. **使用nvm管理版本** (推荐):
   ```bash
   # 安装并使用推荐版本
   nvm install 20.9.0
   nvm use 20.9.0
   
   # 设为默认版本
   nvm alias default 20.9.0
   ```

2. **手动安装Node.js 20.x**:
   - 访问 [Node.js官网](https://nodejs.org)
   - 下载并安装Node.js 20.x LTS版本

3. **临时解决方案** (不推荐):
   ```bash
   # 忽略版本警告继续运行
   npm run compile --force
   ```

### 依赖安装问题

**问题**: 遇到依赖冲突或安装失败

**解决方案**:
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 如果仍有问题，使用legacy模式
npm install --legacy-peer-deps
```

## 🏗️ 项目架构

```
awesome-solidity-project/
├── contracts/                 # 智能合约
│   ├── core/                 # 核心基础设施
│   ├── multisig/             # 多签钱包系统
│   ├── dex-aggregator/       # DEX聚合器
│   ├── shared/               # 共享组件
│   └── interfaces/           # 接口定义
├── test/                     # 测试文件
├── scripts/                  # 部署脚本
├── deploy/                   # 部署配置
└── reports/                  # 测试报告
```

## 🔧 开发工具

- **Hardhat**: 开发框架
- **OpenZeppelin**: 安全合约库
- **Diamond Standard**: 可升级合约模式
- **Waffle & Chai**: 测试框架
- **Solhint**: 代码检查
- **Prettier**: 代码格式化

## 📊 开发状态

- ✅ 项目环境初始化
- 🔄 Diamond标准实现 (进行中)
- ⏳ 多签钱包开发
- ⏳ DEX聚合器开发

## 🛡️ 安全注意事项

- 所有智能合约都会经过严格测试
- 计划进行专业安全审计
- 采用多层安全防护机制
- 遵循OpenZeppelin安全标准

## 📚 文档

- [开发跟踪记录](./需求规划/开发进度跟踪/DEVELOPMENT_TRACKER.md)
- [架构设计文档](./需求规划/架构设计/)
- [PRD需求文档](./需求规划/solidity/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 开发团队

- **James** - Full Stack Developer & 项目负责人

---

**⚠️ 免责声明**: 本项目仅用于学习和开发目的。在生产环境使用前请进行充分测试和安全审计。