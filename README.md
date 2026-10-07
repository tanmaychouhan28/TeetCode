# TeetCode — The Next-Generation Algorithmic Mastery Platform

**"Don't just memorize solutions. Understand why they work."**

TeetCode is a modern web application built for software engineers preparing for high-stakes technical interviews. Inspired by the clean, focused interface of LeetCode and NeetCode, TeetCode elevates problem solving through **Socratic AI mentorship**, **progressive 5-tier hint unlocking**, **instant safe code execution**, and **deep diagnostic mistake detection**.

---

## 🎨 Visual Identity & LeetCode Aesthetics

TeetCode delivers an authentic, developer-first coding environment:

- **LeetCode Dark Theme**: Refined `#1A1A1A` base with `#262626` card surfaces and `#333333` crisp borders.
- **Accurate Difficulty Coding**:
  - Easy: `#00B8A3` (Emerald Green)
  - Medium: `#FFA116` (Amber Gold)
  - Hard: `#FF375F` (Crimson Rose)
- **Submit Action**: `#2CBB5D` (LeetCode Green)
- **Developer Typography**: Inter + JetBrains Mono for code blocks.
- **Precision IDE**: Split-view editor with tabbed problem descriptions, progressive hint accordions, interactive Socratic chat, testcase runner, and instant complexity diagnostics.

---

## 🚀 Core Features

### 1. LeetCode-Inspired Problem Discovery
- Curated catalog with standard problem numbering (`1. Two Sum`, `200. Number of Islands`, `146. LRU Cache`, etc.).
- Category tags carousel with problem counts.
- Search with instant shortcut `/` and multi-parameter filters (Difficulty, Status, Topics).
- "Pick One" random problem selector.

### 2. Split-Screen Problem Workspace (IDE)
- **Left Panel**:
  - **Description**: Full problem statements, formatted examples with input/output blocks, constraints, company tags.
  - **Editorial & Progressive Hints**: 5-tier gradual unlock (Conceptual Orientation → Invariant Selection → Pseudo-code → Logic Details → Full Reference Solution).
  - **Socratic AI Coach**: Interactive AI mentor asking conceptual questions to guide invariant discovery.
  - **Submissions**: History of attempts with runtime and memory benchmarks.
- **Right Panel**:
  - Multi-language support: **C++ (g++ 17), Python 3, Java 17, JavaScript (Node.js)**.
  - Testcase Runner: Pre-configured test cases + custom test case runner.
  - Diff view for Expected vs Actual output.
  - AST complexity and code quality review.

### 3. Study Plan & Personalized Roadmap
- 14 sequential topic modules (Arrays & Hashing → Two Pointers → Sliding Window → Stack → Linked Lists → Trees → Graphs → Dynamic Programming).
- Mastery percentages, historical accuracy, and weak spot diagnostics.

### 4. Mock Technical Interview Simulator
- Live multi-stage technical interview practice simulating Google, Meta, and Quantitative Trading rubrics.
- Socratic interviewer evaluation and debrief scorecard.

### 5. Algorithmic Invariant Notes
- Personal cheatsheet and markdown knowledge base with pre-built algorithmic templates.

---

## 🛠️ Quickstart

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Backend:
```bash
cd backend
pip install -r requirements.txt # (or uvicorn fastapi sqlalchemy)
python -m backend.main
```
