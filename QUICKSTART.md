# Employee Management System - Quick Start Guide

## 🚀 Quick Start (First Time Setup)

### 1. Install Dependencies

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### 2. Start the Application

#### Option A: Using the Start Script (Windows)
Simply double-click `start.bat` in the project root, or run:
```bash
start.bat
```

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Access the Application

- Open your browser and go to: `http://localhost:3000`
- Login with default credentials:
  - **Username**: `admin`
  - **Password**: `admin123`

---

## 📋 What You Can Do

### 1. **Add Employee**
- Click the "Add Employee" button
- Fill in all required fields:
  - Name, Email, Position, Department, Salary, Hire Date
  - Phone (optional)
  - Status (active/inactive)
- Click "Add Employee" to save

### 2. **Search & Filter**
- Use the search box to find employees by name, email, or position
- Filter by department using the dropdown
- Filter by status (active/inactive)

### 3. **Edit Employee**
- Click "Edit" on any employee card
- Modify the information
- Click "Update Employee" to save changes

### 4. **Delete Employee**
- Click "Delete" on any employee card
- Confirm the deletion in the popup

### 5. **View Statistics**
- Dashboard shows:
  - Total number of employees
  - Number of active employees
  - Number of departments

---

## 🔧 Troubleshooting

### Port Already in Use

If you see an error about ports being in use:

**Backend (Port 5000):**
```bash
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Frontend (Port 3000):**
```bash
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

### Database Issues

If you encounter database errors:
1. Stop the backend server
2. Delete `backend/employees.db`
3. Restart the backend server (database will be recreated)

### Dependencies Not Installing

Make sure you have Node.js installed:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

---

## 📁 Important Files

- **Backend Server**: `backend/server.js`
- **Database**: `backend/employees.db` (auto-created)
- **Environment Config**: `backend/.env`
- **Frontend App**: `frontend/src/App.jsx`
- **Styling**: `frontend/src/index.css`

---

## 🔐 Security Notes

> ⚠️ **For Production Use:**
> 1. Change the JWT_SECRET in `backend/.env`
> 2. Change the default admin password
> 3. Use HTTPS
> 4. Add rate limiting
> 5. Use a production database (PostgreSQL/MySQL)

---

## 📞 Need Help?

Check the full documentation in `README.md` for more details about:
- API endpoints
- Project structure
- Database schema
- Security features
