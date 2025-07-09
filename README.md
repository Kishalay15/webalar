# 📌 Real-Time Collaborative Kanban Board

A full-stack web application for managing tasks on a real-time collaborative Kanban board — inspired by Trello, built using the MERN stack with Socket.IO for live updates.

---

<!-- ## 🚀 Live Demo

* **Frontend**: [https://your-frontend-link.vercel.app](https://your-frontend-link.vercel.app)
* **Backend**: [https://your-backend-link.onrender.com](https://your-backend-link.onrender.com)
* **Demo Video**: [https://your-demo-video-link.com](https://your-demo-video-link.com)

--- -->

## 🧱 Tech Stack

### Frontend

* React (Vite + TypeScript)
* Tailwind CSS (No third-party UI libraries)
* Axios, Socket.IO Client, DnD Kit

### Backend

* Node.js + Express
* MongoDB (with Mongoose)
* JWT Auth, Bcrypt, Socket.IO

---

## 🔧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/kanban-collab.git
cd kanban-collab
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Add your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
# Set VITE_API_BASE to your backend URL
npm install
npm run dev
```

---

## 🧩 Features

### ✅ Authentication

* Secure registration and login (JWT)
* Password hashing with Bcrypt

### ✅ Real-Time Collaboration

* Socket.IO-based updates
* Live task creation, updates, deletion

### ✅ Task Management

* Create, update, delete tasks
* Drag and drop between Todo, In Progress, Done
* Assign tasks to users

### ✅ Smart Assign

* Assigns a task to the user with the fewest active (non-Done) tasks

### ✅ Conflict Handling

* Prevents overwriting: compares `clientUpdatedAt` with DB’s `updatedAt`
* Returns `409 Conflict` with both versions for frontend merge

### ✅ Activity Logs

* Tracks all actions: create/update/delete/assign
* `/api/logs` returns last 20 logs
* Logs are streamed live via Socket.IO (`activity-log` event)

### ✅ UI & UX

* Fully custom Tailwind UI
* Responsive layout (desktop + mobile)
* Animations for drag/drop, task updates

---

<!-- ## 🧠 Smart Assign Logic

See [Logic\_Document.md](./Logic_Document.md) for detailed explanation.

--- -->

## 📜 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Users

* `GET /api/users` (get all users)

### Tasks

* `GET /api/tasks`
* `POST /api/tasks`
* `GET /api/tasks/:id`
* `PATCH /api/tasks/:id`
* `DELETE /api/tasks/:id`
* `POST /api/tasks/:id/smart-assign`

### Logs

* `GET /api/logs`

---

<!-- ## 🎥 Demo Video

> Link: [https://your-demo-video-link.com](https://your-demo-video-link.com)

Covers:

* Register/login
* Task creation
* Drag & drop
* Smart Assign
* Real-time updates
* Activity log
* Conflict handling

--- -->

<!-- ## ✍️ Author

**Your Name** – [@yourgithub](https://github.com/yourgithub)

--- -->
<!-- 
## 📩 Submission Summary

* ✅ GitHub repo with commits
* ✅ Deployed frontend & backend
* ✅ Logic\_Document.md
* ✅ Demo video
* ✅ ReadMe ✅ -->


