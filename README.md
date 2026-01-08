# Social Movement Lens 🌍

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-2ea44f?style=for-the-badge&logo=vercel)](https://social-movement-lens.vercel.app)
[![Python](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

> **[中文说明 (Chinese Version)](#-中文说明-chinese-version)** 👇

**Social Movement Lens** is an AI-powered full-stack platform for exploring and analyzing global social movements. It combines quantitative data visualization with qualitative semantic search, powered by LLM agents.

---

## ✨ Key Features

- **🤖 AI Agent Analyst**: Ask complex questions about the dataset (e.g., "Compare the impact of BLM and Umbrella Movement"). The agent intelligently switches between screen-context RAG and full-database analysis.
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

**Social Movement Lens** 是一个由 AI 驱动的全栈社会运动分析平台。它结合了定量数据可视化与定性语义检索，利用大语言模型 (LLM) 代理为研究人员提供深度洞察。

## ✨ 核心功能

- **🤖 AI 智能分析员**: 可以回答关于数据集的复杂问题（例如：“对比 BLM 和雨伞运动的影响力”）。AI Agent 会根据问题自动在“当前屏幕上下文”和“全量数据库”之间切换策略。
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
