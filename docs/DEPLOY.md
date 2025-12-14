# 项目部署指南

本项目支持多种部署方式，让外网可以访问。

## 方式一：Vercel 部署（推荐，最简单）

### 步骤：

1. **注册 Vercel 账号**
   - 访问 https://vercel.com
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **部署项目**
   - 点击 "New Project"
   - 导入你的 Git 仓库（如果没有，先推送到 GitHub）
   - 或者直接拖拽 `dist` 文件夹到 Vercel
   - Vercel 会自动检测 Vite 项目并配置

3. **自动部署**
   - 每次推送到 Git 仓库，Vercel 会自动重新部署
   - 会获得一个 `https://miniadwall.vercel.app` 的链接（如果项目名为 MiniAdWall）

4. **配置自定义域名 MiniAdWall**
   - 在项目设置中找到 "Domains" 选项
   - 添加域名：`miniadwall.com` 或 `miniadwall.vercel.app`
   - 如果使用自己的域名，需要配置 DNS：
     - 添加 CNAME 记录：`miniadwall` -> `cname.vercel-dns.com`
     - 或添加 A 记录指向 Vercel 的 IP
   - Vercel 会自动配置 SSL 证书

### 优点：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署
- ✅ 支持自定义域名

---

## 方式二：Netlify 部署

### 步骤：

1. **注册 Netlify 账号**
   - 访问 https://www.netlify.com
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **部署项目**
   - 点击 "Add new site" -> "Import an existing project"
   - 连接你的 Git 仓库
   - 构建命令：`npm run build`
   - 发布目录：`dist`
   - 点击 "Deploy site"

3. **获得链接**
   - 会获得一个 `https://miniadwall.netlify.app` 的链接（如果站点名为 miniadwall）

4. **配置自定义域名 MiniAdWall**
   - 在站点设置中找到 "Domain management"
   - 点击 "Add custom domain"
   - 输入域名：`miniadwall.com` 或使用 Netlify 子域名 `miniadwall.netlify.app`
   - 如果使用自己的域名，配置 DNS：
     - 添加 CNAME 记录：`miniadwall` -> `miniadwall.netlify.app`
   - Netlify 会自动配置 SSL 证书

### 优点：
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 支持表单处理

---

## 方式三：GitHub Pages 部署

### 步骤：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **配置仓库**
   - 在 GitHub 仓库 Settings -> Pages
   - Source 选择 "GitHub Actions"

3. **推送代码**
   - 推送代码到 GitHub
   - GitHub Actions 会自动构建并部署
   - 访问：`https://your-username.github.io/MiniAdWall/`（替换为你的用户名和仓库名）

### 注意：
- 需要修改 `vite.config.js` 中的 `base` 为仓库名称
- 需要启用 GitHub Actions

---

## 方式四：使用内网穿透（临时访问）

### 使用 ngrok（推荐）

1. **安装 ngrok**
   ```bash
   # 下载 ngrok: https://ngrok.com/download
   # 或使用 npm
   npm install -g ngrok
   ```

2. **启动本地服务**
   ```bash
   npm run dev
   ```

3. **启动 ngrok**
   ```bash
   ngrok http 3000
   ```

4. **获得公网链接**
   - ngrok 会提供一个 `https://xxxx.ngrok.io` 的链接
   - 这个链接可以外网访问

### 使用 Cloudflare Tunnel（免费）

1. **安装 cloudflared**
   ```bash
   # 下载: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
   ```

2. **启动隧道**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

### 优点：
- ✅ 快速测试
- ✅ 不需要部署
- ✅ 适合临时演示

### 缺点：
- ❌ 链接会变化（免费版）
- ❌ 需要保持本地服务运行

---

## 方式五：部署到自己的服务器

### 步骤：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传 dist 文件夹**
   - 使用 FTP/SFTP 上传到服务器
   - 或使用 scp 命令：
   ```bash
   scp -r dist/* user@your-server:/var/www/html/
   ```

3. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name miniadwall.com;
       root /var/www/html;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **配置 HTTPS（可选）**
   - 使用 Let's Encrypt 免费证书
   - 或使用 Cloudflare 的免费 SSL

---

## 快速部署命令（Vercel CLI）

如果已安装 Vercel CLI：

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

---

## 配置自定义域名 MiniAdWall

### 方案一：使用平台提供的子域名（最简单）

**Vercel:**
- 项目名称设置为 `MiniAdWall`
- 自动获得：`https://miniadwall.vercel.app`

**Netlify:**
- 站点名称设置为 `miniadwall`
- 自动获得：`https://miniadwall.netlify.app`

### 方案二：使用自己的域名

1. **购买域名**
   - 在域名注册商（如阿里云、腾讯云、GoDaddy）购买 `miniadwall.com` 或类似域名

2. **配置 DNS（以 Vercel 为例）**
   - 登录 Vercel，进入项目设置 -> Domains
   - 添加域名：`miniadwall.com`
   - 根据提示配置 DNS：
     ```
     类型: CNAME
     名称: miniadwall (或 @)
     值: cname.vercel-dns.com
     ```
   - 或使用 A 记录指向 Vercel 提供的 IP 地址

3. **等待生效**
   - DNS 配置通常需要几分钟到几小时生效
   - Vercel/Netlify 会自动配置 SSL 证书

### 方案三：使用免费域名服务

- **Freenom**: 提供免费 .tk, .ml, .ga 域名
- **GitHub Pages**: 使用 `miniadwall.github.io` 格式

## 推荐方案

- **个人项目/演示**：使用 Vercel 或 Netlify（最简单）
- **需要自定义域名**：购买域名后配置 DNS
- **临时访问**：使用 ngrok 或 Cloudflare Tunnel
- **企业项目**：部署到自己的服务器

---

## 注意事项

1. **环境变量**：如果有敏感信息，使用平台的环境变量功能
2. **构建优化**：确保 `npm run build` 成功
3. **路由问题**：单页应用需要配置重定向到 `index.html`
4. **静态资源**：确保图片等资源路径正确

---

## 常见问题

### Q: 部署后页面空白？
A: 检查资源路径，可能需要修改 `vite.config.js` 中的 `base` 配置

### Q: 路由404错误？
A: 确保配置了重定向规则（已包含在配置文件中）

### Q: 图片不显示？
A: 检查图片路径，确保使用相对路径或正确的 base URL

