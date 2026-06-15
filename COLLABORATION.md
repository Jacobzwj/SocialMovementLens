# 如何更新网站 (Quick Start)

所有代码都在这个 GitHub 仓库里。**改完代码推送上去，网站会自动更新**（几分钟内生效，不用做别的）。

## 第一次：克隆到本地

```bash
git clone https://github.com/Jacobzwj/SocialMovementLens.git
cd SocialMovementLens
```

## 以后每次改动

1. **先拉最新代码**
   ```bash
   git pull
   ```

2. **改代码**
   - 后端 / 逻辑 → `server.py`
   - 前端页面 / 文字 → `webpage_example/src/App.tsx`

3. **提交并推送**（推送后网站自动重新部署，几分钟生效）
   ```bash
   git add .
   git commit -m "说明改了什么"
   git push
   ```

改完打开 https://social-movement-lens.vercel.app 看效果即可。

---

💡 用 **Cursor / Claude Code** 等 AI 工具改最省事：直接告诉它你想改什么。仓库里已放好项目说明文件（**Cursor 自动读 `AGENTS.md`，Claude Code 自动读 `CLAUDE.md`**），AI 会自动了解整个项目结构，不用你解释。
