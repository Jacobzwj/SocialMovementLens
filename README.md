# Social Movement Lens
### Human-AI Collaborative Research Engine | 人机协作研究引擎

> **🔴 [Click Here to Launch Live Demo / 点击进入在线网站](https://social-movement-lens.vercel.app)** 🔴

[![Status](https://img.shields.io/badge/Status-Live-green)](https://social-movement-lens.vercel.app)
[![AI Agent](https://img.shields.io/badge/AI-Agent%20Powered-blue)](https://openai.com)
[![Human Coding](https://img.shields.io/badge/Data-Expert%20Human%20Coded-orange)](https://pandas.pydata.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)

**Social Movement Lens** is a research platform that bridges the gap between **rigorous human qualitative coding** and **autonomous AI agent capabilities**.

Unlike purely automated systems, our database is built upon expert human analysis of global social movements (providing high-quality "Ground Truth"). We then deploy advanced AI Agents to "read", visualize, and interact with this expert knowledge, providing users with a semantic search engine and a real-time conversational analyst.

---

[中文说明 (Chinese Version)](#-中文说明-chinese-version) 👇

## ✨ Key Features

- **🧠 Hybrid Intelligence (Human + AI)**:
  - **Expert Human Coding**: The core dataset is meticulously coded by researchers, providing nuanced qualitative data (e.g., rationales, outcomes, participant demographics).
  - **AI Agent Analyst**: An autonomous LLM agent that reasons across this expert dataset. It intelligently switches strategies—using retrieval-augmented generation (RAG) for screen context or autonomous tool-use for full-database analysis.

- **🔍 Semantic Search**: Vector-based retrieval (Embeddings) allows searching by concept (e.g., "digital authoritarianism"), not just keywords.
- **🗺️ Geospatial Intelligence**: Interactive map highlighting movement locations.
- **📊 Temporal & Categorical Analytics**: Timeline charts, category distribution, and regime type analysis.
- **📱 Responsive Cyberpunk UI**: A modern, immersive interface built with React and Recharts.

## 🚀 Tech Stack

- **Data Foundation**: Expert-coded Excel Datasets (`.xlsx`) with qualitative rationales.
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

## 📄 Funding & Acknowledgements 

**Funding:**  
This work was supported by the Hong Kong Research Grants Council under GRF: 14601723 (PI: Hai Liang, [hailiang@cuhk.edu.hk](mailto:hailiang@cuhk.edu.hk)).

**Acknowledgements:**  
We would like to thank Nathan L.T. Tsang and Wanjiang Jacob Zhang for their assistance with data collection, as well as Sidi Huang, Yingdan Lu, Yilang Peng, and Cindy Shen for refining the coding scheme and performing manual coding and checking.

---

<div id="chinese-version"></div>

# 🇨🇳 中文说明 (Chinese Version)

> **🔴 [点击进入在线网站 / Launch Live Demo](https://social-movement-lens.vercel.app)** 🔴

**Social Movement Lens** 是一个**人机协作 (Human-AI Collaboration)** 的社会运动研究平台。它旨在连接**严谨的人类定性编码**与**自主 AI 智能体能力**。

与纯自动化的系统不同，我们的数据库建立在专家对全球社会运动的深入人工分析之上（提供高质量的“基本事实”）。在此基础上，我们利用先进的 AI Agent 来“阅读”、可视化并与这些专家知识进行交互，为用户提供基于语义的搜索引擎和实时的对话式分析师。

## ✨ 核心功能

- **🧠 混合智能 (人类专家 + AI)**:
  - **专家人工编码**: 核心数据集由研究人员精心编码，提供了细致入微的定性数据（如运动成因、结果、参与者人口统计等）。
  - **自主 AI 分析师**: 一个能够推理专家数据的 LLM 智能体。它会根据问题自动判断策略——利用 RAG 技术分析当前屏幕内容，或自主调用工具进行全量数据库分析。

- **🔍 语义检索**: 基于向量（Embeddings）的检索技术，支持概念搜索，而不仅仅是关键词匹配。
- **🗺️ 地理空间智能**: 交互式全球地图，高亮显示运动发生地。
- **📊 多维数据分析**: 提供时间线趋势图、分类分布图以及政体类型分析。
- **📱 赛博朋克风 UI**: 现代沉浸式界面，适配移动端与桌面端。

## 🚀 技术栈

- **数据基础**: 包含定性分析的专家编码数据集 (`.xlsx`)
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

## 📄 资助与致谢 (Funding & Acknowledgements)

**资助 (Funding):**  
本研究由香港研究资助局 GRF: 14601723 资助（PI: 梁海, [hailiang@cuhk.edu.hk](mailto:hailiang@cuhk.edu.hk)）。

**致谢 (Acknowledgements):**  
我们要感谢 Nathan L.T. Tsang 和 Wanjiang Jacob Zhang 在数据收集方面的协助，以及 Sidi Huang, Yingdan Lu, Yilang Peng 和 Cindy Shen 对编码方案的改进以及手动编码和检查工作的贡献。

---
*Created by Jacobzwj*
