<div align="center">

<br/>

```
  ████████╗███████╗███████╗████████╗ ██████╗ ██████╗ ██████╗ ███████╗
     ██╔══╝██╔════╝██╔════╝╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔════╝
     ██║   █████╗  █████╗     ██║   ██║     ██║   ██║██║  ██║█████╗  
     ██║   ██╔══╝  ██╔══╝     ██║   ██║     ██║   ██║██║  ██║██╔══╝  
     ██║   ███████╗███████╗   ██║   ╚██████╗╚██████╔╝██████╔╝███████╗
     ╚═╝   ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
```

# 🚀 TeetCode
### *The Next-Generation Algorithmic Mastery Platform*

<br/>

> **"Don't just memorize solutions — understand *why* they work."**

<br/>

[![Made by Tanmay](https://img.shields.io/badge/Made%20by-Tanmay%20Chouhan-orange?style=for-the-badge&logo=github)](https://github.com/tanmaychouhan28)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)

<br/>

---

</div>

## 🎯 What is TeetCode?

**TeetCode** is a premium coding interview preparation platform built from the ground up by **Tanmay Chouhan**. It combines the clean, focused problem-solving interface inspired by LeetCode with an intelligent **Socratic AI Mentor** that teaches you *how to think*, not just what to code.

Whether you're grinding for FAANG, preparing for quant interviews, or leveling up your algorithmic thinking — TeetCode has you covered.

---

## ✨ Features at a Glance

<table>
<tr>
<td width="50%">

### 🧠 Socratic AI Mentorship
An AI coach that asks you the right questions — guiding your reasoning step by step, never giving away answers too early. Think of it as a world-class tutor available 24/7.

</td>
<td width="50%">

### 💻 Real-Time Code Execution
Write and run code in **C++17, Python 3, Java 17, and JavaScript (Node.js)** instantly inside the browser — no setup needed.

</td>
</tr>
<tr>
<td width="50%">

### 🔓 5-Tier Progressive Hints
Stuck? Unlock hints gradually — from a nudge about the concept, all the way to a full reference solution. You choose how much help you need.

</td>
<td width="50%">

### 📊 Deep Mistake Diagnostics
Every wrong submission gets analyzed. TeetCode tells you *why* it failed — off-by-one errors, wrong invariant, edge case missed — so you learn, not just retry.

</td>
</tr>
<tr>
<td width="50%">

### 🗺️ Personalized Roadmap
14 sequential DSA modules — from Arrays & Hashing to Dynamic Programming. Track your mastery, identify weaknesses, and follow a structured path.

</td>
<td width="50%">

### 🎤 Mock Interview Simulator
Simulate real technical interviews with a Socratic AI interviewer. Get evaluated on logic, communication, and problem-solving with a full debrief scorecard.

</td>
</tr>
</table>

---

## 🎨 Design Philosophy

TeetCode is built with a **developer-first, distraction-free** aesthetic:

| Element | Value | Purpose |
|---|---|---|
| 🎨 Base Background | `#1A1A1A` | LeetCode-accurate dark canvas |
| 📦 Card Surface | `#262626` | Elevated content areas |
| 🟢 Easy Difficulty | `#00B8A3` | Emerald Green |
| 🟡 Medium Difficulty | `#FFA116` | Amber Gold |
| 🔴 Hard Difficulty | `#FF375F` | Crimson Rose |
| ✅ Submit Action | `#2CBB5D` | LeetCode Green |
| 🔤 Code Font | `JetBrains Mono` | Precision monospace |
| 🔤 UI Font | `Inter` | Clean sans-serif |

---

## 🛠️ Tech Stack

```
Frontend                    Backend
─────────────────────       ─────────────────────
React 18 + TypeScript       FastAPI (Python 3.11)
Vite (build tool)           SQLAlchemy ORM
Tailwind CSS                SQLite / PostgreSQL
Lucide React Icons          Google Gemini AI API
Monaco-style Editor         Uvicorn ASGI Server
```

---

## ⚡ Quickstart

### 🖥️ Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server (runs on http://localhost:5173)
npm run dev
```

### 🔧 Backend

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the API server (runs on http://localhost:8000)
python -m backend.main
```

### 🗄️ Seed Problems

```bash
# Load the full problem database
python backend/seed_data.py
```

---

## 📁 Project Structure

```
TeetCode/
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 🧩 LandingPage.tsx       — Hero, features, CTA
│   │   │   ├── 🧩 Navbar.tsx            — Top navigation bar
│   │   │   ├── 🧩 Sidebar.tsx           — Left nav sidebar
│   │   │   ├── 🧩 ProblemsView.tsx      — Problem catalog & filters
│   │   │   ├── 🧩 ProblemWorkspace.tsx  — Split-screen IDE
│   │   │   ├── 🧩 DashboardView.tsx     — User stats & heatmap
│   │   │   ├── 🧩 RoadmapView.tsx       — Study plan modules
│   │   │   ├── 🧩 MockInterviewView.tsx — AI interview simulator
│   │   │   ├── 🧩 ProgressView.tsx      — Charts & analytics
│   │   │   ├── 🧩 NotesView.tsx         — Personal algorithm notes
│   │   │   └── 🧩 TeetCodeLogo.tsx      — Brand logo component
│   │   ├── 📄 App.tsx                   — Root application
│   │   └── 📄 index.css                 — Global design tokens
│   └── 📄 index.html
│
├── 📂 backend/
│   ├── 📄 main.py                       — FastAPI app & routes
│   ├── 📄 seed_data.py                  — Problem seeder script
│   └── 📄 requirements.txt
│
└── 📄 README.md                         — You are here!
```

---

## 🗺️ Learning Roadmap Modules

| # | Module | Key Problems |
|---|--------|-------------|
| 1 | **Arrays & Hashing** | Two Sum, Contains Duplicate, Group Anagrams |
| 2 | **Two Pointers** | Valid Palindrome, 3Sum, Container With Most Water |
| 3 | **Sliding Window** | Best Time to Buy Stock, Longest Substring Without Repeating |
| 4 | **Stack** | Valid Parentheses, Min Stack, Daily Temperatures |
| 5 | **Binary Search** | Binary Search, Search Rotated Array, Find Minimum |
| 6 | **Linked Lists** | Reverse Linked List, Merge Two Lists, Detect Cycle |
| 7 | **Trees** | Invert Binary Tree, BFS, BST Validation, Serialize & Deserialize |
| 8 | **Tries** | Implement Trie, Design Add & Search Words |
| 9 | **Heap / Priority Queue** | Kth Largest, Task Scheduler, Merge K Sorted Lists |
| 10 | **Backtracking** | Permutations, Subsets, N-Queens |
| 11 | **Graphs** | Clone Graph, Number of Islands, Course Schedule |
| 12 | **Advanced Graphs** | Dijkstra, Prim's MST, Network Delay Time |
| 13 | **1D Dynamic Programming** | Climbing Stairs, House Robber, Coin Change |
| 14 | **2D Dynamic Programming** | Unique Paths, Longest Common Subsequence |

---

## 🤝 Contributing

This project is built and maintained by **Tanmay Chouhan**. If you'd like to contribute, raise an issue or submit a pull request — all contributions are welcome!

---

<div align="center">

<br/>

**Built with ❤️ by [Tanmay Chouhan](https://github.com/tanmaychouhan28)**

*"The best way to learn algorithms is to be asked the right questions."*

<br/>

[![Star this repo](https://img.shields.io/github/stars/tanmaychouhan28/TeetCode?style=social)](https://github.com/tanmaychouhan28/TeetCode)

<br/>

</div>
