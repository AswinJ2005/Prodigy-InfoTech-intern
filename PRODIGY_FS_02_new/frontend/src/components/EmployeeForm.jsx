import { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeForm({ employee, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        salary: '',
        phone: '',
        hire_date: '',
        status: 'active'
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                position: employee.position || '',
                department: employee.department || '',
                salary: employee.salary || '',
                phone: employee.phone || '',
                hire_date: employee.hire_date || '',
                status: employee.status || 'active'
            });
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.position.trim()) newErrors.position = 'Position is required';
        if (!formData.department.trim()) newErrors.department = 'Department is required';
        if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Valid salary is required';
        if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            if (employee) {
                // Update existing employee
                await axios.put(`/api/employees/${employee.id}`, formData);
            } else {
                // Create new employee
                await axios.post('/api/employees', formData);
            }
            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to save employee';
            alert(errorMsg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="employee-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="position">Position *</label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className={errors.position ? 'error' : ''}
                            />
                            {errors.position && <span className="error-text">{errors.position}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="department">Department *</label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                className={errors.department ? 'error' : ''}
                            />
                            {errors.department && <span className="error-text">{errors.department}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="salary">Salary *</label>
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className={errors.salary ? 'error' : ''}
                            />
                            {errors.salary && <span className="error-text">{errors.salary}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="hire_date">Hire Date *</label>
                            <input
                                type="date"
                                id="hire_date"
                                name="hire_date"
                                value={formData.hire_date}
                                onChange={handleChange}
                                className={errors.hire_date ? 'error' : ''}
                            />
                            {errors.hire_date && <span className="error-text">{errors.hire_date}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EmployeeForm;
