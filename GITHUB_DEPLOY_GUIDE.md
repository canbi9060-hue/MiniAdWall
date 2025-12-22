# GitHub上传与Vercel部署指南

## 环境检查说明

在当前环境中，我们无法直接安装或使用Git命令行工具。这是因为：
1. 当前环境的PATH变量中没有Git的安装路径
2. 系统中未找到Git的安装目录（C:\Program Files\Git或C:\Program Files (x86)\Git）
3. 无法通过包管理器（如winget）安装Git

因此，以下是您在**自己的本地环境**中完成GitHub上传和Vercel部署的详细步骤：

## 一、本地Git配置

1. **安装Git**
   - 访问Git官网：https://git-scm.com/downloads
   - 下载并安装适合您操作系统的Git版本

2. **配置Git**
   ```bash
   git config --global user.name "您的GitHub用户名"
   git config --global user.email "您的GitHub邮箱"
   ```

## 二、项目Git初始化

1. **创建.gitignore文件**
   在项目根目录创建`.gitignore`文件，添加以下内容：
   ```
   # Dependencies
   node_modules/
   server/node_modules/

   # Build outputs
   dist/

   # Environment variables
   .env
   .env.local
   .env.*.local

   # Editor directories and files
   .vscode/
   .idea/
   *.suo
   *.ntvs*
   *.njsproj
   *.sln
   *.sw?

   # OS files
   Thumbs.db
   .DS_Store

   # Logs
   logs
   *.log
   npm-debug.log*
   yarn-debug.log*
   yarn-error.log*
   pnpm-debug.log*
   lerna-debug.log*
   ```

2. **初始化Git仓库**
   ```bash
   cd d:\MiniAdWall
   git init
   git add .
   git commit -m "Initial commit"
   ```

## 三、GitHub仓库创建与关联

1. **创建GitHub仓库**
   - 访问GitHub：https://github.com
   - 登录后点击"New repository"
   - 填写仓库名称（建议使用mini-ad-wall）
   - 选择公开或私有
   - 不勾选"Initialize this repository with a README"
   - 点击"Create repository"

2. **关联本地仓库与GitHub仓库**
   ```bash
   git remote add origin https://github.com/您的用户名/mini-ad-wall.git
   git push -u origin main
   ```

## 四、Vercel部署

1. **登录Vercel**
   - 访问Vercel官网：https://vercel.com
   - 使用GitHub账号登录

2. **导入GitHub仓库**
   - 点击"Add New Project"
   - 选择您刚刚创建的GitHub仓库
   - 点击"Import"

3. **配置项目**
   - **Framework Preset**: 选择React
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Environment Variables**: 如果您的项目需要环境变量，可以在此添加

4. **部署项目**
   - 点击"Deploy"
   - Vercel将自动构建和部署您的项目

5. **访问部署结果**
   - 部署完成后，Vercel会提供一个域名（如：mini-ad-wall.vercel.app）
   - 您可以通过这个域名访问您的应用

## 五、注意事项

1. **后端服务**
   - 当前项目的后端服务是独立运行的Node.js服务
   - 如果您需要将后端也部署到Vercel，可以将后端代码放在`api`目录下（Vercel Serverless Functions）
   - 或者将后端部署到其他服务（如Heroku、AWS Lambda等）

2. **API代理设置**
   - 如果您的前端应用需要访问后端API，确保在Vercel上配置正确的代理设置
   - 可以在`vite.config.js`中配置代理，或者在Vercel的项目设置中配置

3. **数据库**
   - 当前项目使用JSON文件作为数据源
   - 如果需要更可靠的数据库，可以考虑使用MongoDB、PostgreSQL等，并部署到相应的服务

## 六、后续维护

1. **更新代码**
   ```bash
   git add .
   git commit -m "Update message"
   git push
   ```

2. **自动部署**
   - 当您将代码推送到GitHub时，Vercel会自动重新构建和部署您的项目
   - 您可以在Vercel的项目设置中配置部署触发器

祝您部署成功！
