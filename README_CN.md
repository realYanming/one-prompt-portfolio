#  One-Prompt Portfolio / 体验设计系统

[English](./README.md) | **简体中文**

> 一个极简主义、强调交互体验的高端 UX 作品集。本项目完全通过单一且严苛的 **Design System Prompt (设计系统提示词)** 端到端全自动生成。它是对“Vibe Coding”理念与 AI 驱动 UI/UX 架构的一次硬核实战实验。

![License](https://img.shields.io/badge/license-MIT-blue.svg) 
![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC.svg?logo=tailwind-css)
![FramerMotion](https://img.shields.io/badge/Framer_Motion-11.0-FF0088.svg?logo=framer)

## 🎯 极限边界测试 (A/B 测试实验)
AI 模型究竟能否在没有人类干预 CSS 细节的情况下，完美理解并还原复杂的大厂级 Design System 与深层微交互？

本仓库包含了在**完全相同**的核心约束文件（`design_system.md`）下，由模型平行生成的两个架构版本：

*   **`v1_HTML_Tailwind/` (静态骨架版)**: 回归纯粹的结构设计。极度聚焦于栅格系统（Grid）、负空间留白（Padding/Margin）以及具有高度一致性的语义化 HTML 排版。
*   **`v2_React_Vite/` (动态全栈版)**: 见证魔法发生的时刻。基于 React 与 Framer Motion 构建，注入了极高调序的微交互体验，包括“磁性鼠标悬停追踪”与“视差毛玻璃背景”。

## 📦 核心引擎 (The Prompt)
贯穿整个项目的核心审美约束系统（钛金属极简克制风、严格的空间跳跃率、大厂一致性规范）已被提纯并开源。
👉 **你可以在此处查看未删减的底层生成约束词：[design_system.md](./design_system.md)。**

## 🚀 快速启动 (本地预览 V2 版本)

如果你想在本地机器上体验完整的 Framer Motion 视差环境：

```bash
cd v2_React_Vite
npm install
npm run dev
```

并在浏览器中访问 `http://localhost:5173`。

## 👨‍💻 关于作者

*   **Twitter / X**: [@realYanming](https://x.com/realYanming)
*   **Live Demo (线上预览)**: [Live on Vercel](#) *(链接稍后更新)*

---
*Built with precision and minimal noise.*
