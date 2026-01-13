# 🚀 Task Manager (MERN Stack)

A **role-based Task Management System** built using the **MERN stack** where **Admins** can create, assign, and track tasks, while **Employees (Users)** can view and complete their assigned tasks.  
The system also provides **performance insights and productivity metrics** in numerical form.

---

## 🌐 Live Deployment

- **Frontend (Vercel):**  
  👉 https://task-manager-rvn-v1.vercel.app

- **Backend (Render):**  
  👉 https://task-manager-i8kv.onrender.com

---

## 🧠 Core Idea

This project is designed to simulate a **real-world team workflow system** where:

- Admins manage tasks and teams
- Employees focus on execution
- Productivity is measured using **percentage-based performance analytics**

---

## 👥 User Roles

### 🔐 Admin

- Requires a **valid Admin Token** during signup
- If token is **invalid or missing**, the account is automatically created as a **User**

### 👤 User (Employee)

- Regular signup/login
- Can only access tasks assigned to them

---

## 🔑 Authentication Flow

1. **Signup**

   - Admin enters **Admin Token**
   - ✅ Correct token → Admin account
   - ❌ Wrong token → User account

2. **Login**
   - Redirected after successful signup
   - Role-based dashboards

---

## 🧑‍💼 Admin Features

### 📌 Task Management

- Create tasks with:
  - Title
  - Description
  - Priority (Low / Medium / High)
  - Due Date
  - Task checklist (subtasks array)
  - Attachments (if any)
- Assign tasks to **multiple team members**

### 👥 Team Management

- View all registered team members
- Track:
  - Total tasks assigned
  - Tasks completed
  - Tasks pending
- Clear visibility of workload distribution

### 📊 Admin Dashboard Analytics

- Total tasks created
- Completed vs Pending tasks
- Team-wise performance overview
- Productivity insights in **percentage form**

---

## 👨‍💻 User (Employee) Features

### 🧾 My Tasks Dashboard

- View all tasks assigned by Admin
- Task details with priority & due date

### ✅ Task Completion

- Mark tasks as completed (✔ tick)
- Real-time update reflected in Admin dashboard

---

## 🔐 Demo Credentials

You can use the following **demo accounts** to explore the application without creating new users:

### 👑 Admin Account

- **Email:** prajakta@gmail.com
- **Password:** Prajakta
- **Role:** Admin
- **Access:** Full access (Create tasks, assign members, view analytics)

### 👨‍💻 Employee Accounts

**Employee 1**

- **Email:** rv@gmail.com
- **Password:** RV@123
- **Role:** Employee
- **Access:** View & complete assigned tasks

**Employee 2**

- **Email:** rv2@gmail.com
- **Password:** RV@123
- **Role:** Employee
- **Access:** View & complete assigned tasks

> ⚠️ Note: These credentials are only for **demo/testing purposes**.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Deployment:**
  - Frontend → Vercel
  - Backend → Render

---

## 🎯 Key Highlights

- Role-based access control (Admin / User)
- Secure Admin Token validation
- Real-world task assignment flow
- Clean dashboards for both roles
- Fully deployed MERN application

---

## 📌 Conclusion

This Task Manager project demonstrates:

- Strong understanding of **full-stack MERN development**
- Proper **authentication & authorization**
- Scalable **task & team management logic**
- Practical implementation of **productivity analytics**

Perfect for showcasing **real-world project skills** in interviews and portfolios. 💼✨

---

### 🙌 Built with passion using MERN
