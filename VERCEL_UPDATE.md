# Vercel 更新部署指南

## 方法 1：自动部署（推荐）

如果你的项目已经连接到 GitHub，Vercel 会自动检测推送并重新部署：

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard
   - 登录你的账号

2. **找到项目**
   - 在项目列表中找到 `miniad` 或 `MiniAdWall` 项目
   - 点击进入项目详情

3. **查看部署状态**
   - Vercel 会自动检测 GitHub 的推送
   - 通常在推送后 1-2 分钟内开始自动部署
   - 查看 "Deployments" 标签页，应该能看到新的部署

4. **手动触发部署（如果需要）**
   - 如果自动部署没有触发，点击 "Redeploy" 按钮
   - 选择最新的提交，点击 "Redeploy"

## 方法 2：使用 Vercel CLI 手动部署

### 步骤 1：安装 Vercel CLI（如果还没安装）

```bash
npm i -g vercel
```

### 步骤 2：登录 Vercel

```bash
vercel login
```

### 步骤 3：部署到生产环境

```bash
vercel --prod
```

**重要提示**：
- 如果询问是否链接到现有项目，选择 **"Yes"**
- 选择项目名称：`miniad`（或你之前的项目名）
- 其他选项使用默认值

### 步骤 4：验证部署

部署完成后，访问你的域名：
- `https://miniad.com`（你的自定义域名）
- `https://miniad.vercel.app`（Vercel 默认域名）

## 方法 3：在 Vercel Dashboard 中重新部署

1. **访问项目页面**
   - 打开 https://vercel.com/dashboard
   - 点击 `miniad` 项目

2. **查看部署历史**
   - 点击 "Deployments" 标签
   - 找到最新的部署（应该显示你刚才的提交）

3. **重新部署**
   - 点击部署右侧的 "..." 菜单
   - 选择 "Redeploy"
   - 确认重新部署

## 注意事项

### 关于前后端分离

⚠️ **重要**：当前项目是前后端分离架构：

- **前端**：可以部署到 Vercel（纯静态文件）
- **后端**：需要单独部署到其他平台

**后端部署选项**：
1. **Railway** (推荐)：https://railway.app
2. **Render**：https://render.com
3. **Heroku**：https://heroku.com
4. **Vercel Serverless Functions**：需要将后端改造成 Serverless 函数

### 前端环境变量配置

如果后端部署在其他平台，需要在 Vercel 中配置环境变量：

1. 进入项目 Settings → Environment Variables
2. 添加：
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   ```

### 域名配置

域名配置会自动保留，不需要重新配置：
- 自定义域名 `miniad.com` 会自动指向新的部署
- SSL 证书会自动续期

## 验证更新

部署完成后，检查：

1. **访问网站**
   - 打开 `https://miniad.com`
   - 确认页面正常显示

2. **检查功能**
   - 测试搜索功能
   - 测试新增广告功能
   - 检查导航栏是否固定

3. **查看部署日志**
   - 在 Vercel Dashboard 中查看部署日志
   - 确认没有构建错误

## 快速命令

```bash
# 查看当前部署
vercel ls

# 查看部署日志
vercel logs

# 部署到生产环境
vercel --prod

# 查看项目信息
vercel inspect
```

## 常见问题

### Q: 部署后看不到更新？
A: 
1. 清除浏览器缓存（Ctrl+F5）
2. 等待几分钟让 CDN 更新
3. 检查部署是否成功（查看 Vercel Dashboard）

### Q: 构建失败怎么办？
A:
1. 查看 Vercel Dashboard 中的构建日志
2. 检查 `package.json` 中的构建脚本
3. 确认所有依赖都已正确安装

### Q: 域名无法访问？
A:
1. 检查 Vercel Dashboard 中域名的配置状态
2. 确认 DNS 记录仍然有效
3. 等待 DNS 缓存更新（最多 24 小时）

