# Online Social Movements Explorer (Full Stack Version)

这是一个基于 React (Vite) 和 FastAPI (Python) 的全栈应用，使用了现代的 Cyberpunk 风格设计。

## 核心功能

-   **Frontend**: React + TypeScript + Lucide Icons + Custom CSS (暗黑风格).
-   **Backend**: FastAPI 提供数据检索 API 和 OpenAI 集成.
-   **Data**: 自动读取 Excel 表格 (`Coding_LATEST_LH.xlsx`, `CodingRational_LATEST.xlsx`).

## 环境准备

需要同时安装 Python 和 Node.js。

1.  **Python 依赖**:
    ```bash
    pip install -r requirements_backend.txt
    ```

2.  **Node.js 依赖**:
    ```bash
    cd webpage_example
    npm install
    ```

## 如何运行

你需要开启两个终端窗口分别运行后端和前端。

### 1. 启动后端 (API Server)
在项目根目录下：
```bash
export OPENAI_API_KEY="你的key"  # 如果需要AI功能
python server.py
```
后端默认运行在 `http://localhost:8000`。

### 2. 启动前端 (Web Interface)
打开一个新的终端窗口：
```bash
cd webpage_example
npm run dev
```
前端默认运行在 `http://localhost:5173`。

打开浏览器访问前端地址，即可体验完整的交互式应用。

## 目录结构

-   `server.py`: 后端逻辑，负责 Excel 读取和 API 响应。
-   `webpage_example/`: 前端 React 项目代码。
    -   `src/`: 源代码。
    -   `vite.config.ts`: 前端配置 (已配置 API 代理)。
