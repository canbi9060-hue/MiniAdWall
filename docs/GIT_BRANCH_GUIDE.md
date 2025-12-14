# 使用 Git 分支保存项目并创建新版本

## 前提条件

确保已安装 Git：
```bash
# 检查 Git 是否安装
git --version

# 如果未安装，下载安装：https://git-scm.com/download/win
```

## 步骤 1：初始化 Git 仓库（如果还没有）

```bash
# 在项目根目录执行
git init
```

## 步骤 2：配置 Git（首次使用）

```bash
# 设置用户名（如果还没设置）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 步骤 3：保存当前项目到主分支

### 3.1 添加所有文件到暂存区

```bash
git add .
```

### 3.2 提交当前项目

```bash
git commit -m "保存 MiniAdWall 项目初始版本"
```

### 3.3 创建主分支（如果需要）

```bash
# 如果还没有主分支，创建并切换到 main 分支
git branch -M main

# 或者使用 master（根据你的偏好）
# git branch -M master
```

## 步骤 4：创建新项目分支

### 4.1 基于当前分支创建新分支

```bash
# 创建并切换到新分支
git checkout -b new-project-name

# 例如：
# git checkout -b miniad-v2
# git checkout -b another-project
```

### 4.2 修改新分支的项目配置

在新分支中修改以下文件：

**package.json**
```json
{
  "name": "new-project-name",
  "description": "新项目描述"
}
```

**index.html**
```html
<title>新项目名称</title>
```

**src/App.jsx**（如果需要）
- 修改页面标题、内容等

**README.md**（可选）
- 更新项目说明

### 4.3 提交新分支的更改

```bash
# 查看修改的文件
git status

# 添加修改的文件
git add .

# 提交更改
git commit -m "创建新项目版本：new-project-name"
```

## 步骤 5：切换分支

### 切换回原项目（main 分支）

```bash
git checkout main
```

### 切换到新项目分支

```bash
git checkout new-project-name
```

### 查看所有分支

```bash
git branch
```

## 步骤 6：部署不同分支

### 方式一：使用 Vercel CLI 部署当前分支

```bash
# 确保在正确的分支上
git checkout new-project-name

# 部署
vercel
# 输入新的项目名称
vercel --prod
```

### 方式二：在 Vercel Dashboard 连接 Git 仓库

1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 Vercel 中连接仓库
3. 选择要部署的分支
4. 为不同分支设置不同的项目名称

## 步骤 7：推送到远程仓库（可选）

### 7.1 在 GitHub/GitLab 创建新仓库

1. 登录 GitHub/GitLab
2. 创建新仓库（如：`miniadwall`）

### 7.2 添加远程仓库

```bash
# 添加远程仓库
git remote add origin https://github.com/your-username/miniadwall.git

# 或者使用 SSH
# git remote add origin git@github.com:your-username/miniadwall.git
```

### 7.3 推送所有分支

```bash
# 推送主分支
git push -u origin main

# 推送新分支
git checkout new-project-name
git push -u origin new-project-name
```

## 分支管理最佳实践

### 查看分支结构

```bash
# 查看所有分支
git branch -a

# 查看分支图形
git log --oneline --graph --all
```

### 合并分支（如果需要）

```bash
# 切换到主分支
git checkout main

# 合并新分支的更改
git merge new-project-name
```

### 删除分支

```bash
# 删除本地分支
git branch -d new-project-name

# 强制删除（如果分支未合并）
git branch -D new-project-name

# 删除远程分支
git push origin --delete new-project-name
```

## 完整操作示例

```bash
# 1. 初始化 Git（如果还没有）
git init

# 2. 添加并提交当前项目
git add .
git commit -m "保存 MiniAdWall 项目"
git branch -M main

# 3. 创建新项目分支
git checkout -b miniad-v2

# 4. 修改项目配置（手动编辑文件）
# - package.json: name 改为 "miniad-v2"
# - index.html: title 改为 "MiniAd V2"
# - 其他需要修改的内容

# 5. 提交新分支的更改
git add .
git commit -m "创建 MiniAd V2 版本"

# 6. 切换回原项目
git checkout main

# 7. 切换到新项目并部署
git checkout miniad-v2
vercel
# 输入项目名称：miniad-v2
vercel --prod
```

## 优势

✅ 保留原项目代码
✅ 可以随时切换回原项目
✅ 新项目基于原项目，修改方便
✅ 版本控制清晰
✅ 可以推送到远程仓库备份

## 注意事项

1. **不同分支独立部署**：每个分支可以部署为不同的 Vercel 项目
2. **删除 .vercel 目录**：在新分支部署前，删除 `.vercel` 目录避免关联错误
3. **环境变量**：不同项目可能需要不同的环境变量
4. **域名配置**：每个项目需要单独配置域名

## 快速参考

```bash
# 查看当前分支
git branch

# 切换分支
git checkout branch-name

# 创建新分支
git checkout -b new-branch-name

# 查看提交历史
git log --oneline

# 查看文件修改
git status

# 添加文件
git add .

# 提交更改
git commit -m "提交信息"
```

