# Mini广告墙 - 开发文档

## 技术选型

### 前端框架
- **React 18** - UI框架，用于组件化开发
- **Vite** - 构建工具，提供快速的开发体验

### 数据存储
- **后端 API** - 通过 RESTful API 与后端通信
- **JSON 文件存储** - 后端使用 JSON 文件持久化数据

### 工具库
- **form-serialize** - 表单序列化工具，用于获取表单数据

## 架构设计

### 项目结构
```
src/
├── components/          # React组件
│   ├── Navbar.jsx      # 导航栏组件
│   ├── AdCard.jsx      # 广告卡片组件
│   ├── AdList.jsx      # 广告列表组件
│   ├── AdModal.jsx     # 广告弹窗组件
│   ├── DynamicForm.jsx # 动态表单组件
│   ├── VideoModal.jsx  # 视频播放弹窗组件
│   └── DeleteModal.jsx # 删除确认弹窗
├── utils/              # 工具模块
│   ├── api.js          # API 服务层
│   ├── upload.js       # 文件上传工具
│   ├── helpers.js      # 辅助函数
│   └── formSerialize.js # 表单序列化
├── App.jsx             # 主应用组件
└── main.jsx            # 入口文件
```

### 组件层次
```
App (主组件)
├── Header (头部)
├── AdList (广告列表)
│   └── AdCard (广告卡片) × N
├── AdModal (广告弹窗)
└── DeleteModal (删除确认弹窗)
```

### 数据流
1. **数据管理**: 通过 `adAPI` 与后端 API 通信
2. **状态管理**: 使用 React Hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
3. **数据持久化**: 后端使用 JSON 文件存储，前端通过 API 获取和更新数据
4. **动态表单**: 从后端获取表单配置，动态渲染表单项

## 核心功能实现

### 1. 广告排名算法
**位置**: `src/utils/adManager.js`

```javascript
calculateRankingScore(ad) {
    return ad.pricing + (ad.pricing * ad.clicked * 0.42);
}
```

**逻辑说明**:
- 排名分数 = 出价 + (出价 × 点击数 × 0.42)
- 出价越高，排名越靠前
- 点击数越多，排名也会提升
- 0.42 是经验系数，平衡出价和热度的权重

### 2. 热度前三标识
**位置**: `src/components/AdCard.jsx`

```javascript
const isTopThree = index < 3;
{isTopThree && <i className="iconfont icon-huo"></i>}
```

**逻辑说明**:
- 根据排序后的索引判断是否为前三
- 前三名显示火焰图标
- 使用图标字体显示，样式统一

### 3. 点击跳转优化
**位置**: `src/App.jsx` - `handleAdClick`

**实现细节**:
1. 先打开新窗口 (`window.open`)
2. 延迟100ms后更新点击数，避免阻塞窗口打开
3. 使用 `requestAnimationFrame` 延迟刷新列表
4. 添加错误处理，确保即使打开失败也能更新数据

**为什么这样设计**:
- 防止浏览器阻止弹窗导致数据不更新
- 异步更新避免阻塞主线程
- 提升用户体验

### 4. 操作菜单点击外部关闭
**位置**: `src/components/AdCard.jsx`

```javascript
useEffect(() => {
    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setShowMenu(false);
        }
    };
    if (showMenu) {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }
}, [showMenu]);
```

**逻辑说明**:
- 使用 `useEffect` 监听点击事件
- 判断点击是否在菜单外部
- 组件卸载时清理事件监听器，防止内存泄漏

### 5. 表单数据获取
**位置**: `src/components/AdModal.jsx`

使用 `form-serialize` 插件自动获取表单数据：
```javascript
const formData = serialize(form, { hash: true });
```

**优势**:
- 无需手动获取每个字段
- 自动处理各种表单元素类型
- 代码更简洁易维护

### 6. 固定布局防缩放
**位置**: `style.css`

```css
html, body {
    min-width: 1200px;
    overflow-x: auto;
    overflow-y: auto;
}
.container {
    min-width: 1200px;
}
.ad-list {
    grid-template-columns: repeat(3, 1fr);
}
```

**设计思路**:
- 设置最小宽度，防止布局被压缩
- 固定3列网格布局
- 超出部分显示滚动条

## 数据模型

### 广告对象结构
```javascript
{
    id: string,           // 唯一标识
    title: string,         // 广告标题
    publisher: string,     // 发布人
    content: string,       // 内容文案
    landingPage: string,  // 落地页URL
    pricing: number,       // 出价
    clicked: number,       // 点击数（热度）
    createdAt: string,     // 创建时间
    updatedAt?: string     // 更新时间（可选）
}
```

## 关键设计决策

### 1. 为什么使用 localStorage？
- 无需后端服务器
- 数据持久化简单
- 适合单机使用场景

### 2. 为什么使用 React Hooks？
- 代码更简洁
- 逻辑复用方便
- 符合 React 最佳实践

### 3. 为什么先打开窗口再更新数据？
- 避免浏览器阻止弹窗
- 提升用户体验
- 确保数据更新的可靠性

## 开发注意事项

1. **必须通过开发服务器运行**: 使用 `npm run dev`，不能直接打开 HTML 文件
2. **数据初始化**: 首次加载会自动创建6条默认数据
3. **错误处理**: 所有关键操作都包含错误处理逻辑
4. **性能优化**: 使用 `useCallback` 避免不必要的重渲染

## 扩展建议

1. **状态管理**: 数据量大时可考虑使用 Redux 或 Zustand
2. **后端集成**: 可替换 localStorage 为 API 调用
3. **数据验证**: 可添加更严格的表单验证
4. **单元测试**: 可添加 Jest + React Testing Library 测试

