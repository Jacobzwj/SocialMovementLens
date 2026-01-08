# Social Movement Lens 🌍

> **🔴 [Click Here to Launch Live Demo / 点击进入在线网站](https://social-movement-lens.vercel.app)** 🔴

[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

**Social Movement Lens** is an **AI Agent-Powered** full-stack platform for exploring and analyzing global social movements. It combines quantitative data visualization with qualitative semantic search, powered by autonomous LLM agents.

---

[中文说明 (Chinese Version)](#-中文说明-chinese-version) 👇

## ✨ Key Features

- **🤖 Autonomous AI Agent Analyst**: Ask complex questions about the dataset. The **AI Agent** intelligently switches strategies—using retrieval-augmented generation (RAG) for screen context or autonomous tool-use for full-database analysis.
- **🗺️ Geospatial Intelligence**: Interactive 3D/2D global map highlighting movement locations.
- **📊 Temporal & Categorical Analytics**: Timeline charts, category distribution, and regime type analysis.
- **🔍 Semantic Search**: Vector-based retrieval (OpenAI Embeddings) allows searching by concept, not just keyword.
- **📱 Responsive Cyberpunk UI**: A modern, immersive interface built with React and Recharts.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite, Recharts, React-Simple-Maps
- **Backend**: Python, FastAPI, Pandas, OpenAI/Gemini API
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 🛠️ Local Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- OpenAI API Key

### 1. Backend Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Set API Key (Windows PowerShell)
$env:OPENAI_API_KEY="sk-..."

# Run Server
python server.py
```

### 2. Frontend Setup
```bash
cd webpage_example
npm install
npm run dev
```

---

<div id="chinese-version"></div>

# 🇨🇳 中文说明 (Chinese Version)

> **🔴 [点击进入在线网站 / Launch Live Demo](https://social-movement-lens.vercel.app)** 🔴

**Social Movement Lens** 是一个由 **AI Agent (智能体)** 驱动的全栈社会运动分析平台。它结合了定量数据可视化与定性语义检索，利用自主 LLM Agent 为研究人员提供深度洞察。

## ✨ 核心功能

- **🤖 自主 AI Agent 分析员**: 可以回答关于数据集的复杂问题。**AI Agent** 会根据问题自动判断策略——利用 RAG 技术分析当前屏幕内容，或自主调用工具进行全量数据库分析。
- **🗺️ 地理空间智能**: 交互式全球地图，高亮显示运动发生地。
- **📊 多维数据分析**: 提供时间线趋势图、分类分布图以及政体类型分析。
- **🔍 语义检索**: 基于向量（Embeddings）的检索技术，支持概念搜索，而不仅仅是关键词匹配。
- **📱 赛博朋克风 UI**: 现代沉浸式界面，适配移动端与桌面端。

## 🚀 技术栈

- **前端**: React, TypeScript, Vite, Recharts
- **后端**: Python, FastAPI, Pandas, OpenAI/Gemini API
- **部署**: Vercel (前端) + Render (后端)

## 🛠️ 本地运行指南

### 环境要求
- Python 3.9+
- Node.js 18+
- OpenAI API Key

### 1. 启动后端
```bash
# 安装依赖
pip install -r requirements.txt

# 设置 API Key (Windows PowerShell)
$env:OPENAI_API_KEY="sk-..."

# 启动服务器
python server.py
```

### 2. 启动前端
```bash
cd webpage_example
npm install
npm run dev
```

---
*Created by Jacobzwj*
