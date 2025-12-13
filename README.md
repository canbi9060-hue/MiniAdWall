# Mini广告墙 - React版本

基于 React 框架构建的模块化、组件化的广告墙管理系统。

## 项目结构

```
MiniAdWall/
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.jsx       # 头部组件
│   │   ├── AdCard.jsx       # 广告卡片组件
│   │   ├── AdList.jsx       # 广告列表组件
│   │   ├── AdModal.jsx      # 广告弹窗组件
│   │   └── DeleteModal.jsx  # 删除确认弹窗组件
│   ├── utils/               # 工具模块
│   │   ├── adManager.js     # 广告数据管理
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

- ✅ React 18 + Vite 构建
- ✅ 模块化组件设计
- ✅ 组件化开发
- ✅ 数据持久化（localStorage）
- ✅ 热度排行前三显示火焰图标
- ✅ 响应式布局（固定宽度，支持滚动）
- ✅ 表单验证和数据管理

## 安装依赖

```bash
npm install
```

## 开发运行

```bash
npm run dev
```

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

- **React 18** - UI 框架
- **Vite** - 构建工具
- **form-serialize** - 表单序列化
- **localStorage** - 数据持久化

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

使用 `AdManager` 模块管理广告数据：
- 数据存储在 localStorage
- 支持默认数据初始化
- 自动排序和排名计算

