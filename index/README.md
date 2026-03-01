# 知识卡片多页面项目

高效学习知识点，随时随地背诵记忆。

## 项目结构

```
knowledge-cards/
├── index.html              # 首页（文档列表）
├── assets/                 # 公共资源
│   ├── css/
│   │   └── styles.css     # 统一样式文件
│   ├── js/
│   │   └── app.js        # 统一JS功能
│   └── images/           # 图片资源
├── docs/                  # 知识文档目录
│   ├── 社区知识.html      # 现有知识卡片
│   └── 模板.html          # 新文档模板
└── README.md              # 本文件
```

## 功能特性

- **主题切换**：支持浅色/深色主题切换
- **记忆状态**：自动保存已掌握知识点（localStorage）
- **进度跟踪**：实时显示学习进度
- **搜索功能**：快速搜索知识点
- **章节导航**：按章节查看知识点
- **响应式设计**：支持桌面端和移动端

## 快速开始

### 本地预览

直接用浏览器打开 `index.html` 即可预览：

```bash
# 或者使用简单的HTTP服务器
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 添加新文档

### 方式一：使用模板

1. 复制 `docs/模板.html` 文件
2. 重命名为你的文档名称（如 `新文档.html`）
3. 修改文档内容

### 方式二：手动创建

1. 在 `docs/` 目录下创建新的HTML文件
2. 引入公共CSS和JS
3. 使用统一的HTML结构

### 文档接入步骤

#### 1. 创建HTML文件

在 `docs/` 目录下创建新文件，例如 `新文档.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文档标题 - 知识卡片</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body>
    <div class="app-container">
        <aside class="sidebar" id="sidebar">
            <!-- 侧边栏内容 -->
        </aside>
        <main class="main-content">
            <!-- 主内容区 -->
        </main>
    </div>
    <script src="../assets/js/app.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            initApp({ docId: 'unique-doc-id' });
        });
    </script>
</body>
</html>
```

#### 2. 修改文档配置

- 修改 `<title>` 文档标题
- 修改侧边栏中的文档名称
- 修改章节导航和数据
- 设置唯一的 `docId`

#### 3. 添加到首页

打开 `index.html`，在 `docsConfig` 数组中添加新文档：

```javascript
const docsConfig = [
    {
        id: 'your-doc-id',        // 与initApp中的docId一致
        title: '新文档标题',       // 文档显示名称
        description: '文档描述',   // 文档简要描述
        icon: '📝',               // 显示图标
        href: 'docs/新文档.html',  // 文档链接
        cards: 50                 // 知识卡片数量
    }
];
```

## 知识卡片标签

在文档中使用以下标签标记知识点类型：

```html
<span class="tag tag-single">单选</span>
<span class="tag tag-multi">多选</span>
<span class="tag tag-important">重点</span>
```

## 内容样式

- `<span class="key-point">关键内容</span>` - 关键点（绿色高亮）
- `<span class="highlight">高亮内容</span>` - 普通高亮（紫色）

## 键盘快捷键

- `Ctrl/Cmd + K` - 聚焦搜索框
- `T` - 切换主题（在非输入框状态下）

## 部署到服务器

### 宝塔面板部署

1. 登录宝塔面板
2. 创建网站（或使用已有网站）
3. 将项目文件上传到网站根目录
4. 确保文件权限正确（755）

### 目录结构

```
/www/wwwroot/your-domain.com/
├── index.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── docs/
    ├── 社区知识.html
    └── 新文档.html
```

## 浏览器支持

- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

## 注意事项

1. 每个文档必须使用唯一的 `docId`，否则记忆状态会混淆
2. `data-key` 属性必须唯一，用于区分不同的知识点
3. 建议使用相对路径引用资源文件

## 更新日志

### 2024.03.01
- 初始版本发布
- 支持多文档管理
- 支持主题切换和记忆状态
