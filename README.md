# 🔐 Secure User Authentication System

A full-stack user authentication system built with **Flask** (Python), **React**, **MySQL**, and **JWT** authentication.

## ✨ Features

- **User Registration** with strong password validation
- **User Login** with secure JWT tokens
- **Protected Routes** - access only after authentication
- **Role-Based Access Control** (Admin/User roles)
- **Password Hashing** using bcrypt
- **Token Refresh** mechanism
- **Token Blacklisting** for secure logout
- **Admin Dashboard** for user management
- **Profile Management** with password change functionality
- **Responsive UI** with modern design

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Flask (Python) |
| Frontend | React.js |
| Database | MySQL |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcrypt |
| HTTP Client | Axios |

## 📁 Project Structure

```
PRODIGY_FS_01/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory & configuration
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── user.py          # User & TokenBlocklist models
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # Auth routes (login, register, etc.)
│   │   │   └── user.py          # User & Admin routes
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── validators.py    # Email & password validators
│   ├── run.py                   # Application entry point
│   ├── create_admin.py          # Script to create admin user
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   └── AuthContext.js   # Auth state management
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── Profile.js
    │   │   └── AdminDashboard.js
    │   ├── services/
    │   │   └── api.js           # Axios configuration
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- MySQL Server

### 1. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE auth_db;
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from template
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux

# Edit .env file with your MySQL credentials
# DATABASE_URL=mysql+pymysql://root:your_password@localhost/auth_db

# Run the application
python run.py
```

The backend will start at `http://localhost:5000`

### 3. Create Admin User (Optional)

```bash
python create_admin.py
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `Admin@123`

### 4. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env   # Windows
cp .env.example .env     # macOS/Linux

# Start the development server
npm start
```

The frontend will start at `http://localhost:3000`

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/logout` | User logout | Yes |
| POST | `/refresh` | Refresh access token | Yes (Refresh Token) |
| GET | `/me` | Get current user | Yes |
| POST | `/change-password` | Change password | Yes |

### User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| GET | `/dashboard` | Access protected dashboard | Yes |

### Admin Routes (`/api/user/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get specific user | Admin |
| PUT | `/users/:id` | Update user (role, status) | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

## 🔒 Security Features

1. **Password Requirements:**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one digit
   - At least one special character

2. **JWT Token Security:**
   - Access token expires in 1 hour
   - Refresh token expires in 30 days
   - Token blacklisting on logout

3. **Password Hashing:**
   - Using bcrypt with salt rounds

4. **CORS Protection:**
   - Configured for specific origins

## 🎨 Screenshots

### Login Page
Modern login interface with form validation.

### Registration Page
Registration with real-time password strength indicator.

### Dashboard
User dashboard showing account information.

### Admin Panel
User management interface for administrators.

## 📝 Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-super-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=mysql+pymysql://root:password@localhost/auth_db
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Prodigy InfoTech Internship Task-01**
