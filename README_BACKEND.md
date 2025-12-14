# Mini广告墙 - 前后端分离版本

## 项目结构

```
MiniAdWall/
├── server/              # 后端服务
│   ├── routes/         # 路由
│   ├── services/       # 业务逻辑
│   ├── repositories/   # 数据访问层
│   ├── data/          # 数据存储目录（自动创建）
│   └── index.js        # 服务器入口
├── src/                # 前端代码
│   ├── components/     # React组件
│   ├── utils/          # 工具函数
│   │   └── api.js      # API服务层
│   └── App.jsx         # 主应用组件
└── package.json        # 项目配置
```

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
# 终端1：启动后端服务
npm run server:dev

# 终端2：启动前端开发服务器
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

## API 接口文档

### 基础URL
```
http://localhost:3001/api/ads
```

### 1. 获取表单配置

**GET** `/api/form-config`

**说明**: 返回广告表单的动态配置，用于前端动态渲染表单项。

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "field": "title",
      "name": "广告标题",
      "component": "Input",
      "type": "text",
      "required": true,
      "placeholder": "请输入广告标题",
      "validator": {
        "maxLength": 50,
        "minLength": 1
      }
    },
    {
      "field": "publisher",
      "name": "发布人",
      "component": "Input",
      "type": "text",
      "required": true,
      "validator": {
        "maxLength": 50
      }
    },
    {
      "field": "videos",
      "name": "上传视频",
      "component": "VideoUpload",
      "type": "video",
      "required": true,
      "multiple": true,
      "validator": {
        "url": true
      }
    }
  ]
}
```

### 2. 获取广告列表

**GET** `/api/ads?sortBy=ranking`

查询参数：
- `sortBy`: 排序方式，可选值：`ranking`（竞价排名，默认）、`hotness`（热度）、`pricing`（出价）

响应示例：
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "抖音",
      "publisher": "字节跳动",
      "content": "...",
      "landingPage": "https://www.douyin.com",
      "pricing": 10.00,
      "clicked": 2,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. 创建广告

**POST** `/api/ads`

请求体：
```json
{
  "title": "广告标题",
  "publisher": "发布人",
  "content": "内容文案",
  "landingPage": "https://example.com",
  "pricing": 10.00,
  "videos": ["https://example.com/video.mp4"]
}
```

响应示例：
```json
{
  "success": true,
  "message": "广告创建成功",
  "data": { ... }
}
```

### 4. 更新广告

**PUT** `/api/ads/:id`

请求体：同创建广告

响应示例：
```json
{
  "success": true,
  "message": "广告更新成功",
  "data": { ... }
}
```

### 5. 删除广告

**DELETE** `/api/ads/:id`

响应示例：
```json
{
  "success": true,
  "message": "广告删除成功"
}
```

### 6. 点击广告（点击数+1）

**POST** `/api/ads/:id/click`

响应示例：
```json
{
  "success": true,
  "message": "点击记录成功",
  "data": { ... }
}
```

## 竞价排名算法

竞价排名分数计算公式：
```
排名分数 = 出价 + (出价 × 点击数 × 0.42)
```

排序规则：按排名分数降序排列

## 数据存储

- 数据存储在 `server/data/ads.json` 文件中
- 上传的视频文件存储在 `server/uploads/` 目录
- 首次启动会自动创建默认数据
- 数据文件会自动创建，无需手动创建
- 上传的视频可通过 `/uploads/文件名` 访问

## 开发说明

### 前端改动
- 移除了 `localStorage` 存储，改为 API 调用
- 所有数据操作通过 `src/utils/api.js` 中的 `adAPI` 进行
- 保持了原有的 UI 和交互逻辑

### 后端架构
- **路由层** (`routes/ads.js`): 处理 HTTP 请求和响应
- **服务层** (`services/adService.js`): 业务逻辑，包括排序算法
- **数据访问层** (`repositories/adRepository.js`): 数据持久化

### 环境变量

创建 `.env` 文件（可选）：
```
VITE_API_BASE_URL=http://localhost:3001/api
```

如果不设置，默认使用 `http://localhost:3001/api`

## 部署说明

### 后端部署
1. 确保 Node.js 版本 >= 18
2. 安装依赖：`cd server && npm install`
3. 启动服务：`npm start`
4. 设置环境变量 `PORT` 指定端口（默认 3001）

### 前端部署
1. 构建：`npm run build`
2. 部署 `dist` 目录到静态服务器
3. 配置环境变量 `VITE_API_BASE_URL` 指向后端地址

## 注意事项

1. 后端服务需要先启动，前端才能正常工作
2. 数据文件 `server/data/ads.json` 会在首次运行时自动创建
3. CORS 已配置，允许跨域请求
4. 所有 API 返回统一格式：`{ success: boolean, message?: string, data?: any }`

