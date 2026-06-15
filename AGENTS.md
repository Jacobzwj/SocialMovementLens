# AGENTS.md — 项目说明（供 AI 编码助手阅读）

> 这是 **Social Movement Lens** 项目。本文件帮助 AI 助手（Cursor / Claude Code 等）快速理解项目并安全地修改、更新网站。这是面向 AI 的**唯一信息源**。

## 项目是什么

一个**学术开源**的社会运动（Social Movement）研究网站：把人工编码的研究数据，做成可交互的语义检索 + 可视化 + AI 对话分析平台。

- 线上地址：https://social-movement-lens.vercel.app
- 仓库（公开）：https://github.com/Jacobzwj/SocialMovementLens

## 数据

约 **148 个全球社会运动**，每个由专家人工编码约 **50 个变量**（数据在根目录 `Coding_LATEST_LH.xlsx` / `CodingRational_LATEST.xlsx`）。主要维度：

- **时空**：年份(year)、地区(region)、ISO 国家码(iso)、政体类型(regime)
- **运动属性**：规模(scale)、类型(type/kind)、集中度(centralization)、关键参与者(key_participants)、持续天数(length_days)、是否再发生(reoccurrence)、是否有线下行动(offline_presence)
- **结果与国家反应**：结果(outcome / longterm_outcome)、国家回应——接纳(state_accommodation)/分化(state_distraction)/镇压(state_repression)
- **数字维度**：hashtag、推文量(tweets_count)、Twitter 渗透度(twitter_penetration)、星级(star_rating)
- **定性说明**：每项编码的文字理由(rationales / rationale_text)，另有 Wikipedia 链接

后端数据模型见 `server.py` 的 `class Movement` 与 `class Rationale`。

## 架构（前后端分离，4 个部分）

| 部分 | 技术 | 部署 | 说明 |
|------|------|------|------|
| 前端 | React + TypeScript + Vite | **Vercel** | 目录 `webpage_example/` |
| 后端 | Python + FastAPI | **Render** | 入口 `server.py` |
| 数据 | Excel（已纳入 git） | — | `Coding_LATEST_LH.xlsx`、`CodingRational_LATEST.xlsx`、`embeddings_cache.pkl` |
| AI 接口 | OpenRouter（OpenAI 兼容） | — | key 形如 `sk-or-...`，存在 Render 环境变量 `OPENAI_API_KEY` |

**自动部署**：向 GitHub `main` 分支 `git push` 后，Vercel（前端）和 Render（后端）会自动重新构建上线，几分钟生效。**改代码 + push 是更新网站的唯一日常操作。**

## 改东西去哪里

| 想改什么 | 文件 / 位置 |
|----------|------------|
| 后端逻辑 / API / 聊天 agent | `server.py` |
| **切换聊天大模型** | `server.py` → `get_openai_client()` 里的 `CHAT_MODEL` 变量（OpenRouter 分支处）。**全局只此一处，改一行即可全局生效** |
| Embedding 模型 | 同上，`EMBEDDING_MODEL`（当前 `baai/bge-m3`） |
| 前端页面 / 文字 / 致谢 | `webpage_example/src/App.tsx` |
| 前端样式 | `webpage_example/src/App.css` |
| 研究数据 | 根目录两个 `.xlsx`（改完需要重新生成 embedding 缓存，见 `generate_cache.py`） |

## 修改后的标准流程

```bash
git pull                                  # 先同步
# ……改代码……
git add .
git commit -m "简述改动"
git push                                  # 触发自动部署
```

验证：打开线上地址，①在 chat 框问一句确认后端/AI 正常；②确认改动的页面内容已更新。

## ⚠️ 改代码（push）解决不了的事 —— 需要登录托管平台后台

以下内容**不在仓库代码里**，AI 改代码无法解决，必须由有 Render / Vercel 权限的人在后台操作：

- 更换 / 设置 API key（环境变量 `OPENAI_API_KEY`）→ Render 后台
- 改其它环境变量（如前端 `VITE_API_URL`）→ Vercel / Render 后台
- 查看部署失败、后端崩溃的日志 → Render / Vercel 后台
- 手动重新部署、回滚、清构建缓存 → 后台

> 遇到这类问题时，应明确告知用户"这需要在 Render/Vercel 后台处理"，不要试图用改代码绕过。

## 常见故障与历史（重要背景）

本项目的"网站打不开 / 聊天报错"主要有两类根因：

1. **AI 模型被下线**（最常见）：OpenRouter 上的模型会停服。报错通常是 `404 ... is deprecated`。
   **解决**：在 `server.py` 改 `CHAT_MODEL` 为新模型，push 即可。
   *模型变更史*：OpenAI 触发区域封锁 → 改用 OpenRouter 非美区模型；`deepseek-v3.2` → `grok-4-fast` → 现为 `x-ai/grok-4.3`。
2. **API key 失效 / 额度用尽**：需在 Render 后台更换 `OPENAI_API_KEY`（属上一节的后台操作）。

## 安全须知（公开仓库）

- 仓库公开，代码与数据可被任何人查看下载（这是项目的开源意图，正常）。
- **绝不要把任何 API key / 密码 commit 进仓库。** key 只通过托管平台环境变量配置（`.env` 已被 `.gitignore` 忽略）。
- 若不慎提交了 key：立即去 OpenRouter 吊销并重新生成，再更新 Render 环境变量（仅删 commit 无效，git 历史里仍可被找到）。

## 本地运行（开发调试）

```bash
# 后端 (Python 3.9+)
pip install -r requirements.txt
# 设置 key 后启动（PowerShell: $env:OPENAI_API_KEY="sk-or-..."）
uvicorn server:app --reload

# 前端 (Node 18+)
cd webpage_example
npm install && npm run dev
```

完整部署步骤见 `DEPLOY.md`。
