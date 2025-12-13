# 快速部署指南 - MiniAdWall

## Vercel 部署步骤

### 1. 安装 Vercel CLI（如果还没安装）
```bash
npm i -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 部署项目

**重要：项目名称必须是小写！**

```bash
vercel
```

当提示输入项目名称时：
- ✅ **正确**：输入 `miniadwall`（全小写）
- ❌ **错误**：`MiniAdWall`（包含大写字母）
- ❌ **错误**：`Mini-Ad-Wall`（包含大写字母）

### 4. 选择选项

```
? Set up and deploy "D:\MiniAdWall"? 
> Yes

? Which scope should contain your project?
> 选择你的账号（bc 或 MiniAdWall）

? Link to existing project?
> No（首次部署）

? What's your project's name?
> miniadwall（必须小写！）

? In which directory is your code located?
> .（直接回车，使用当前目录）
```

### 5. 部署到生产环境

```bash
vercel --prod
```

## 部署后的访问地址

部署成功后，你会获得：
- **预览地址**：`https://miniadwall-xxxxx.vercel.app`
- **生产地址**：`https://miniadwall.vercel.app`

## 常见错误解决

### 错误：项目名称必须是小写

**问题**：输入了 `MiniAdWall` 或包含大写字母的名称

**解决**：
- 使用 `miniadwall`（全小写）
- 或使用 `mini-ad-wall`（小写加连字符）

### 错误：项目名称已存在

**解决**：
- 使用不同的名称，如 `miniadwall-app`
- 或在 Vercel Dashboard 中删除旧项目

## 验证部署

部署完成后，访问：
```
https://miniadwall.vercel.app
```

如果看到你的项目页面，说明部署成功！

## 后续操作

1. **查看部署状态**：
   ```bash
   vercel ls
   ```

2. **查看部署日志**：
   ```bash
   vercel logs
   ```

3. **重新部署**：
   ```bash
   vercel --prod
   ```

4. **在 Vercel Dashboard 管理**：
   - 访问 https://vercel.com/dashboard
   - 查看项目状态和设置

