# 🚀 部署指南 (Deployment Guide)

本指南将指导您如何将 **Social Movement Lens** 部署为前后端分离架构的在线应用。

---

## 🛠️ 第一步：准备 GitHub 仓库

1.  **初始化 Git** (如果尚未初始化):
    ```bash
    git init
    git add .
    git commit -m "Initial commit for deployment"
    ```

2.  **推送到 GitHub**:
    *   在 [GitHub](https://github.com/new) 上创建一个新仓库（例如 `social-movement-explorer`）。
    *   按照页面提示，将本地代码推送到远程仓库：
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/social-movement-explorer.git
        git branch -M main
        git push -u origin main
        ```

---

## ☁️ 第二步：部署后端 (Render)

我们使用 **Render** 来托管 Python FastAPI 后端。

1.  注册/登录 [Render.com](https://render.com)。
2.  点击 **"New +"** -> **"Web Service"**。
3.  选择 **"Build and deploy from a Git repository"**，然后连接您刚才创建的 GitHub 仓库。
4.  **配置参数**:
    *   **Name**: `social-lens-api` (或任意名字)
    *   **Runtime**: **Python 3**
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn server:app --host 0.0.0.0 --port $PORT`
5.  **环境变量 (Environment Variables)**:
    *   向下滚动到 "Environment Variables" 区域。
    *   点击 **"Add Environment Variable"**。
    *   Key: `OPENAI_API_KEY`
    *   Value: `sk-or-......` (填入您的 API Key)
6.  点击 **"Create Web Service"**。
7.  等待几分钟，直到看到绿色勾号。**复制左上角的 URL** (例如 `https://social-lens-api.onrender.com`)，这是您的后端地址。

---

## 🌐 第三步：部署前端 (Vercel)

我们使用 **Vercel** 来托管 React 前端，享受全球 CDN 加速。

1.  注册/登录 [Vercel.com](https://vercel.com)。
2.  点击 **"Add New..."** -> **"Project"**。
3.  在 "Import Git Repository" 下找到您的仓库，点击 **"Import"**。
4.  **配置参数**:
    *   **Framework Preset**: Vercel 会自动识别为 `Vite`。
    *   **Root Directory** (关键步骤!): 点击 "Edit"，选择 `webpage_example` 文件夹。
5.  **环境变量 (Environment Variables)**:
    *   展开 "Environment Variables" 区域。
    *   Key: `VITE_API_URL`
    *   Value: `https://social-lens-api.onrender.com` (您刚才在 Render 获得的网址，**注意不要带末尾的斜杠 /**)
6.  点击 **"Deploy"**。
7.  等待几十秒，撒花！🎉 您的网站上线了。

---

## 🔄 如何更新代码？

1.  在本地修改代码。
2.  `git add .`
3.  `git commit -m "Update feature"`
4.  `git push`
5.  Render 和 Vercel 会自动检测到变化并重新部署（通常几分钟内完成）。

