# Vercel 部署和域名配置指南 - miniad.com

## 步骤 1：重新部署到 Vercel

### 1.1 登录 Vercel（如果还没登录）

```bash
vercel login
```

按照提示在浏览器中完成登录。

### 1.2 部署项目

```bash
vercel
```

**重要提示**：
- 当询问项目名称时，输入：`miniad`（必须小写）
- 选择 "No" 如果询问是否链接到现有项目（重新开始）
- 其他选项使用默认值即可

### 1.3 部署到生产环境

```bash
vercel --prod
```

部署完成后，你会获得：
- 预览地址：`https://miniad-xxxxx.vercel.app`
- 生产地址：`https://miniad.vercel.app`

---

## 步骤 2：配置自定义域名 miniadwall.com

### 2.1 登录 Vercel Dashboard

1. 访问 https://vercel.com
2. 使用你的账号登录（GitHub/GitLab/Bitbucket 或邮箱）

### 2.2 进入项目设置

1. 在 Dashboard 中找到 `miniad` 项目
2. 点击项目名称进入项目详情页
3. 点击顶部导航栏的 **"Settings"** 标签
4. 在左侧菜单中找到 **"Domains"** 选项

### 2.3 添加域名

1. 在 Domains 页面，点击 **"Add"** 或 **"Add Domain"** 按钮
2. 输入域名：`miniad.com`
3. 点击 **"Add"** 确认

### 2.4 配置 DNS 记录

Vercel 会显示需要配置的 DNS 记录。根据你的域名注册商，配置以下记录：

#### 方式 A：使用 CNAME 记录（推荐）

```
记录类型: CNAME
主机记录: @ 或 miniadwall
记录值: cname.vercel-dns.com
TTL: 自动 或 600
```

#### 方式 B：使用 A 记录

```
记录类型: A
主机记录: @
记录值: 76.76.21.21
TTL: 自动 或 600
```

**注意**：Vercel 会显示具体的 DNS 配置值，请使用 Vercel 提供的值。

### 2.5 在域名注册商配置 DNS

#### 阿里云配置示例：

1. 登录阿里云控制台
2. 进入 **域名** → **域名解析**
3. 找到 `miniad.com` 域名
4. 点击 **解析设置** → **添加记录**
5. 填写：
   - 记录类型：`CNAME`
   - 主机记录：`@`（表示根域名）
   - 解析线路：`默认`
   - 记录值：`cname.vercel-dns.com`（使用 Vercel 提供的值）
   - TTL：`10分钟`
6. 点击 **确认** 保存

#### 腾讯云配置示例：

1. 登录腾讯云控制台
2. 进入 **域名注册** → **我的域名**
3. 找到 `miniad.com` 域名
4. 点击 **解析** → **添加记录**
5. 填写：
   - 主机记录：`@`
   - 记录类型：`CNAME`
   - 线路类型：`默认`
   - 记录值：`cname.vercel-dns.com`（使用 Vercel 提供的值）
   - TTL：`600`
6. 点击 **保存** 完成

#### 其他域名注册商：

配置方法类似，主要步骤：
1. 找到 DNS 管理/域名解析功能
2. 添加 CNAME 或 A 记录
3. 使用 Vercel 提供的记录值

### 2.6 等待 DNS 生效

- DNS 配置通常需要 **5-30 分钟** 生效
- 最长可能需要 **48 小时**（但通常很快）

### 2.7 验证配置

1. **在 Vercel Dashboard 中**：
   - 返回 Domains 页面
   - Vercel 会自动检测 DNS 配置
   - 配置成功后，状态会显示为 "Valid Configuration"
   - Vercel 会自动申请并配置 SSL 证书

2. **使用命令行检查**：
   ```bash
   # Windows
   nslookup miniad.com
   
   # Mac/Linux
   dig miniad.com
   ```

3. **访问测试**：
   - 等待几分钟后，访问 `https://miniad.com`
   - 如果看到你的项目页面，说明配置成功！

---

## 步骤 3：配置 www 子域名（可选）

如果你也想让 `www.miniad.com` 可以访问：

1. 在 Vercel Domains 页面，再次点击 **"Add"**
2. 输入：`www.miniad.com`
3. 配置 DNS：
   ```
   记录类型: CNAME
   主机记录: www
   记录值: cname.vercel-dns.com
   ```
4. Vercel 会自动配置重定向，`www.miniad.com` 会跳转到 `miniad.com`

---

## 常见问题

### Q: DNS 配置后多久生效？
A: 通常 5-30 分钟，最长 48 小时。

### Q: 如何检查 DNS 是否生效？
A: 使用命令：
```bash
nslookup miniad.com
```
或访问 https://dnschecker.org 检查全球 DNS 解析情况。

### Q: SSL 证书如何配置？
A: Vercel 会自动配置免费的 SSL 证书，无需手动操作。配置成功后会自动启用 HTTPS。

### Q: 域名配置失败怎么办？
A: 
1. 检查 DNS 记录是否正确
2. 确认使用了 Vercel 提供的记录值
3. 等待更长时间（最多 48 小时）
4. 在 Vercel Dashboard 的 Domains 页面查看错误提示

### Q: 可以同时使用多个域名吗？
A: 可以，在 Vercel 添加多个域名即可，都会指向同一个项目。

---

## 快速命令参考

```bash
# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署列表
vercel ls

# 查看部署日志
vercel logs

# 查看项目信息
vercel inspect
```

---

## 完成后的访问地址

配置成功后，以下地址都可以访问你的项目：
- ✅ `https://miniad.com`（主域名）
- ✅ `https://www.miniad.com`（如果配置了 www）
- ✅ `https://miniad.vercel.app`（Vercel 默认域名）

所有地址都会自动启用 HTTPS！

