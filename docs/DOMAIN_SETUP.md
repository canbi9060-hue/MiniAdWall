# MiniAdWall 域名配置指南

## 快速配置（使用平台子域名）

### Vercel 配置

1. **部署项目时设置项目名**
   ```bash
   vercel
   # 项目名称输入: MiniAdWall
   ```

2. **或修改现有项目名称**
   - 登录 Vercel Dashboard
   - 进入项目设置 -> General
   - 修改项目名称为 `MiniAdWall`
   - 访问地址：`https://miniadwall.vercel.app`

### Netlify 配置

1. **部署时设置站点名称**
   - 在部署界面，站点名称输入：`miniadwall`
   - 访问地址：`https://miniadwall.netlify.app`

2. **或修改现有站点名称**
   - 进入站点设置 -> General
   - 修改站点名称为 `miniadwall`

## 使用自己的域名

### 步骤 1：购买域名

推荐域名注册商：
- **国内**：阿里云、腾讯云、万网
- **国外**：GoDaddy、Namecheap、Cloudflare

建议域名：
- `miniadwall.com`
- `miniadwall.cn`
- `miniadwall.net`

### 步骤 2：在 Vercel 配置域名

1. **添加域名**
   - 登录 Vercel Dashboard
   - 选择项目 -> Settings -> Domains
   - 点击 "Add" 输入域名：`miniadwall.com`

2. **配置 DNS**
   Vercel 会显示需要配置的 DNS 记录，通常有两种方式：

   **方式 A：CNAME 记录（推荐）**
   ```
   类型: CNAME
   名称: @ 或 miniadwall
   值: cname.vercel-dns.com
   TTL: 自动
   ```

   **方式 B：A 记录**
   ```
   类型: A
   名称: @
   值: 76.76.21.21 (Vercel 提供的 IP)
   TTL: 自动
   ```

3. **在域名注册商配置 DNS**
   - 登录域名注册商控制台
   - 找到 DNS 管理/域名解析
   - 添加上述 DNS 记录
   - 等待生效（通常 5-30 分钟）

4. **验证配置**
   - Vercel 会自动检测 DNS 配置
   - 配置成功后会自动申请 SSL 证书
   - 访问 `https://miniadwall.com` 即可

### 步骤 3：在 Netlify 配置域名

1. **添加域名**
   - 登录 Netlify Dashboard
   - 选择站点 -> Domain settings -> Custom domains
   - 点击 "Add custom domain"
   - 输入：`miniadwall.com`

2. **配置 DNS**
   Netlify 会显示需要配置的 DNS 记录：

   ```
   类型: CNAME
   名称: @ 或 miniadwall
   值: miniadwall.netlify.app
   ```

3. **在域名注册商配置**
   - 添加 CNAME 记录
   - 等待生效

## DNS 配置示例

### 阿里云 DNS 配置示例

```
记录类型: CNAME
主机记录: @ (或 miniadwall)
解析线路: 默认
记录值: cname.vercel-dns.com
TTL: 10分钟
```

### 腾讯云 DNS 配置示例

```
记录类型: CNAME
主机记录: @
记录值: cname.vercel-dns.com
TTL: 600
```

## 常见问题

### Q: DNS 配置后多久生效？
A: 通常 5-30 分钟，最长可能需要 48 小时。

### Q: 如何检查 DNS 是否生效？
A: 使用命令：
```bash
# Windows
nslookup miniadwall.com

# Mac/Linux
dig miniadwall.com
```

### Q: SSL 证书如何配置？
A: Vercel 和 Netlify 会自动配置免费的 SSL 证书，无需手动操作。

### Q: 可以同时使用多个域名吗？
A: 可以，在平台添加多个域名即可，都会指向同一个项目。

### Q: 如何设置 www 子域名？
A: 添加 `www.miniadwall.com` 域名，平台会自动配置重定向。

## 推荐配置

**最简单方案**：
- 使用 Vercel 或 Netlify 提供的子域名
- 项目名设置为 `MiniAdWall`
- 立即获得：`https://miniadwall.vercel.app`

**专业方案**：
- 购买 `miniadwall.com` 域名
- 配置 DNS 指向 Vercel/Netlify
- 获得专业域名访问

