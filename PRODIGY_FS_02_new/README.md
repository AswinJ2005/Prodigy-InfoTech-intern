# Employee Management System

A full-stack web application for managing employee records with CRUD operations, authentication, and validation.

## 🚀 Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Modern CSS with Glassmorphism

## 📋 Features

- ✅ Secure JWT-based authentication
- ✅ Full CRUD operations on employee records
- ✅ Search and filter employees
- ✅ Form validation (client & server-side)
- ✅ Responsive premium dark mode UI
- ✅ Role-based access control
- ✅ Real-time employee statistics

## 🛠️ Installation

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Important**: Change the default password after first login in production!

## 📁 Project Structure

```
PRODIGY_FS_02/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Login/register routes
│   │   └── employees.js     # Employee CRUD routes
│   ├── database.js          # SQLite database setup
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env                 # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── EmployeeCard.jsx
    │   │   └── EmployeeForm.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new admin

### Employees (Protected)
- `GET /api/employees` - Get all employees (with search/filter)
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## 📊 Employee Data Fields

- Name (required)
- Email (required, unique)
- Position (required)
- Department (required)
- Salary (required, numeric)
- Phone (optional)
- Hire Date (required)
- Status (active/inactive)

## 🎨 UI Features

- Modern glassmorphism design
- Dark mode with vibrant gradients
- Smooth animations and transitions
- Responsive layout (mobile-friendly)
- Interactive employee cards
- Modal forms for add/edit
- Real-time search and filtering

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation on both client and server
- Role-based authorization

## 🚀 Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Login with default credentials
4. Manage employee records:
   - Click "Add Employee" to create new records
   - Use search/filters to find employees
   - Click "Edit" on any employee card to update
   - Click "Delete" to remove employees (with confirmation)

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

## 🤝 Contributing

This project was created as part of Prodigy InfoTech internship program.

## 📄 License

ISC
