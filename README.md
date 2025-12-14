# Mini广告墙 - 前后端分离版本

基于 React + Node.js/Express 构建的前后端分离的广告墙管理系统。

> **注意**：本项目已升级为前后端分离架构。如需查看纯前端版本，请查看历史提交。

## 项目结构

```
MiniAdWall/
├── server/                  # 后端服务
│   ├── routes/             # 路由层
│   │   └── ads.js          # 广告相关路由
│   ├── services/           # 业务逻辑层
│   │   └── adService.js     # 广告服务
│   ├── repositories/       # 数据访问层
│   │   └── adRepository.js # 广告数据仓库
│   ├── data/               # 数据存储目录（自动创建）
│   ├── index.js            # 服务器入口
│   └── package.json        # 后端依赖配置
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.jsx       # 头部组件
│   │   ├── AdCard.jsx       # 广告卡片组件
│   │   ├── AdList.jsx       # 广告列表组件
│   │   ├── AdModal.jsx      # 广告弹窗组件
│   │   └── DeleteModal.jsx  # 删除确认弹窗组件
│   ├── utils/               # 工具模块
│   │   ├── api.js           # API 服务层（新增）
│   │   ├── adManager.js     # 广告数据管理（已废弃，保留兼容）
│   │   ├── helpers.js       # 辅助函数
│   │   └── formSerialize.js # 表单序列化工具
│   ├── App.jsx              # 主应用组件
│   ├── App.css              # 应用样式
│   └── main.jsx             # 入口文件
├── image/                   # 图片资源
├── style.css                # 全局样式
├── iconFont.css             # 图标字体样式
├── index.html               # HTML 入口
├── package.json             # 项目配置
├── vite.config.js           # Vite 配置
└── README.md                # 项目说明

```

## 功能特性

### 前端
- ✅ React 18 + Vite 构建
- ✅ 模块化组件设计
- ✅ 响应式布局（固定宽度，支持滚动）
- ✅ 表单验证和数据管理
- ✅ 热度排行前三显示火焰图标

### 后端
- ✅ Node.js + Express 框架
- ✅ RESTful API 设计
- ✅ 竞价排名算法
- ✅ 数据持久化（JSON 文件存储）
- ✅ CORS 跨域支持

### API 接口
- ✅ 创建广告接口
- ✅ 编辑广告接口
- ✅ 删除广告接口
- ✅ 查询广告列表接口（支持多种排序）
- ✅ 点击广告次数+1接口

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 2. 启动项目

#### 方式一：分别启动（推荐开发时使用）

```bash
# 终端1：启动后端服务（端口 3001）
npm run server:dev

# 终端2：启动前端开发服务器（端口 3000）
npm run dev
```

#### 方式二：同时启动前后端

```bash
npm run dev:all
```

### 3. 访问应用

- 前端：http://localhost:3000
- 后端API：http://localhost:3001/api/ads
- 健康检查：http://localhost:3001/health

## 构建生产版本

```bash
npm run build
```

## 预览生产版本

```bash
npm run preview
```

## 部署到外网

项目支持多种部署方式，详细说明请查看 [DEPLOY.md](./DEPLOY.md)

### 快速部署（Vercel）

1. 安装 Vercel CLI: `npm i -g vercel`
2. 运行: `vercel`
3. 按照提示完成部署

或直接访问 [vercel.com](https://vercel.com) 通过网页界面部署。

## 技术栈

### 前端
- **React 18** - UI 框架
- **Vite** - 构建工具
- **form-serialize** - 表单序列化

### 后端
- **Node.js** - 运行环境
- **Express** - Web 框架
- **JSON 文件存储** - 数据持久化

## API 文档

详细的 API 接口文档请查看 [README_BACKEND.md](./README_BACKEND.md)

## 组件说明

### Header
页面头部组件，包含标题和新增广告按钮。

### AdCard
广告卡片组件，显示单个广告信息，支持操作菜单（编辑、复制、删除）。

### AdList
广告列表组件，负责渲染广告卡片列表。

### AdModal
广告弹窗组件，支持创建、编辑、复制三种模式。

### DeleteModal
删除确认弹窗组件。

## 数据管理

### 前端
- 使用 `src/utils/api.js` 中的 `adAPI` 进行所有数据操作
- 通过 RESTful API 与后端通信
- 不再使用 localStorage

### 后端
- 数据存储在 `server/data/ads.json` 文件中
- 首次启动自动初始化默认数据
- 竞价排名算法在后端实现

## 竞价排名算法

排名分数计算公式：
```
排名分数 = 出价 + (出价 × 点击数 × 0.42)
```

排序规则：按排名分数降序排列

