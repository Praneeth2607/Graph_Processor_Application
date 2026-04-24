# Graph Processor Application

A high-performance full-stack application designed to process, analyze, and visualize hierarchical tree and graph relationships from string inputs.

## 🚀 Live Demo
- **Frontend**: [https://vppraneeth-frontend.vercel.app/](https://vppraneeth-frontend.vercel.app/)
- **Backend API**: [https://praneeth-backend.vercel.app/bfhl](https://praneeth-backend.vercel.app/bfhl)

## 👤 Developer Identity
- **User ID**: `vppraneeth_26012006`
- **Email**: `pv1719@srmist.edu.in`
- **Roll Number**: `RA2311027020125`

## ✨ Features
- **Intelligent Processing**: Validates node relationships using regex patterns.
- **Cycle Detection**: Identifies cyclic dependencies within connected groups.
- **Tree Visualization**: Renders complex hierarchies in an interactive, nested expandable tree view.
- **Summary Dashboard**: Provides real-time statistics on total trees, cycles, and identifies the largest tree root.
- **Multi-Parent Handling**: Silently resolves diamond dependencies by following the "first parent wins" rule.
- **Responsive UI**: Built with React and Tailwind CSS for a premium, professional experience.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (v4), Lucide Icons, Axios.
- **Backend**: Node.js, Express, CORS, Body-Parser.
- **Deployment**: Vercel (Serverless Functions for Backend).

## 🔌 API Endpoints

### `POST /bfhl`
Processes an array of node relationships.
- **Request Body**:
  ```json
  {
    "data": ["A->B", "A->C", "B->D", "hello"]
  }
  ```
- **Response**: Returns structured hierarchies, invalid entries, duplicates, and a summary object.

### `GET /bfhl`
Health check endpoint returning developer identity.

## 📦 Installation & Setup

### Backend
1. `cd backend`
2. `npm install`
3. `npm start` (Server runs on port 3000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📄 License
MIT License
