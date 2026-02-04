import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeCard from '../components/EmployeeCard';

function Dashboard() {
    const { user, logout } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, [searchTerm, filterDepartment, filterStatus]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterDepartment) params.department = filterDepartment;
            if (filterStatus) params.status = filterStatus;

            const response = await axios.get('/api/employees', { params });
            setEmployees(response.data.employees);
            setError('');
        } catch (err) {
            setError('Failed to fetch employees');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setShowForm(true);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setShowForm(true);
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) {
            return;
        }

        try {
            await axios.delete(`/api/employees/${id}`);
            fetchEmployees();
        } catch (err) {
            alert('Failed to delete employee');
            console.error(err);
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingEmployee(null);
        fetchEmployees();
    };

    const departments = [...new Set(employees.map(emp => emp.department))];

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>Employee Management System</h1>
                        <p>Welcome, {user?.username}</p>
                    </div>
                    <button onClick={logout} className="btn-secondary">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Controls */}
                <div className="controls-section">
                    <div className="search-filters">
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />

                        <select
                            value={filterDepartment}
                            onChange={(e) => setFilterDepartment(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <button onClick={handleAddEmployee} className="btn-primary">
                        + Add Employee
                    </button>
                </div>

                {/* Employee Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Employees</h3>
                        <p className="stat-number">{employees.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active</h3>
                        <p className="stat-number">
                            {employees.filter(e => e.status === 'active').length}
                        </p>
                    </div>
                    <div className="stat-card">
                        <h3>Departments</h3>
                        <p className="stat-number">{departments.length}</p>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        <span>⚠️</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Employee List */}
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading employees...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="empty-state">
                        <h3>No employees found</h3>
                        <p>Click "Add Employee" to create your first employee record</p>
                    </div>
                ) : (
                    <div className="employees-grid">
                        {employees.map(employee => (
                            <EmployeeCard
                                key={employee.id}
                                employee={employee}
                                onEdit={handleEditEmployee}
                                onDelete={handleDeleteEmployee}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Employee Form Modal */}
            {showForm && (
                <EmployeeForm
                    employee={editingEmployee}
                    onClose={handleFormClose}
                />
            )}
        </div>
    );
}

export default Dashboard;
