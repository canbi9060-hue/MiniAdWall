# Vercel 部署总结

## 后端部署进展

你已经正确选择了 `服务器` (server) 目录作为部署根目录，这是正确的选择。

### 为什么选择服务器目录？

1. **目录结构**：
   - `server` 目录包含完整的后端代码
   - 有独立的 `package.json` 配置依赖
   - 有专门的 `vercel.json` 配置 Vercel 部署参数

2. **部署配置**：
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node",
         "config": {
           "includeFiles": ["data/ads.json"]
         }
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/index.js"
       }
     ]
   }
   ```

### 接下来的步骤

1. 点击 `继续` (continue) 按钮
2. 配置环境变量（如果需要）
3. 完成部署
4. 获取后端 API 地址
5. 配置前端连接后端

## 前端部署提示

部署完后端后，你需要：
1. 回到 Vercel Dashboard
2. 为根目录创建另一个项目（前端）
3. 配置前端的 `VITE_API_BASE_URL` 环境变量指向后端 API 地址

这样就能完成前后端的完整部署。