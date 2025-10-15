# 🧠 Smart Task Planner

An AI-ready productivity web app designed to break complex user goals into actionable tasks with timelines, priorities, and dependencies.  
This project was developed combining **frontend development, database integration, and future-ready AI reasoning capabilities**.

---

## 🎯 Objective

The main goal of the **Smart Task Planner** is to help users transform high-level goals (like *“Launch a product in 2 weeks”*) into structured, trackable tasks.  
It enables efficient project planning by breaking large objectives into smaller actionable steps — and is designed for future integration with **AI/LLM-based reasoning** to automate this task breakdown process.

---

## 🚀 Live Demo

🔗 **Access the project here:** [Smart Task Planner](https://navyasri1112.github.io/smart-task-planner/)

---

## ⚙️ Tech Stack

| Category | Technology Used |
|-----------|----------------|
| **Frontend** | React (Vite) |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Backend / Authentication** | Supabase |
| **Database** | Supabase Tables (Goals, Tasks, Dependencies) |
| **Planned AI Integration** | OpenAI API / LLM (for goal-to-task reasoning) |
| **Hosting** | GitHub Pages / Vercel |

---

## 💡 Features

✅ **Goal Management** — Add and organize personal or project-based goals.  
✅ **Task Breakdown** — Create and track tasks under specific goals.  
✅ **Task Prioritization** — Assign priority levels (Low, Medium, High, Critical).  
✅ **Task Status Tracking** — Manage progress with statuses like *Pending*, *In Progress*, or *Completed*.  
✅ **User Authentication** — Secure login/signup using Supabase Auth.  
✅ **Real-Time Data Sync** — Data automatically synced with the Supabase backend.  
✅ **Clean UI** — Responsive design with a smooth, modern interface.  

---

## 🧩 Planned Enhancements

🚀 **AI Integration (LLM)** — Automatically generate task lists, deadlines, and dependencies using natural language input.  
📊 **Visualization Tools** — Add Gantt chart or Kanban-style view for task timelines.  
👥 **Collaboration Features** — Enable multiple users or teams to share and manage goals.  
📱 **Mobile Optimization** — Improved layout and interaction for small-screen devices.  
💬 **Notifications System** — Reminders and task completion alerts.  

---

## 🧰 Installation Guide

To run this project locally:

```bash
# 1. Clone the repository
git clone https://github.com/navyasri1112/smart-task-planner.git

# 2. Navigate to the project directory
cd smart-task-planner

# 3. Install dependencies
npm install

# 4. Add environment variables
# Create a .env file and include:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. Run the app locally
npm run dev
