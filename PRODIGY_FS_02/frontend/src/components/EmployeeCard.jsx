function EmployeeCard({ employee, onEdit, onDelete }) {
    return (
        <div className="employee-card">
            <div className="employee-header">
                <div className="employee-avatar">
                    {employee.name.charAt(0).toUpperCase()}
                </div>
                <div className="employee-info">
                    <h3>{employee.name}</h3>
                    <p className="employee-position">{employee.position}</p>
                </div>
                <span className={`status-badge ${employee.status}`}>
                    {employee.status}
                </span>
            </div>

            <div className="employee-details">
                <div className="detail-row">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{employee.email}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{employee.department}</span>
                </div>
                <div className="detail-row">
                    <span className="detail-label">Salary:</span>
                    <span className="detail-value">${parseFloat(employee.salary).toLocaleString()}</span>
                </div>
                {employee.phone && (
                    <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{employee.phone}</span>
                    </div>
                )}
                <div className="detail-row">
                    <span className="detail-label">Hire Date:</span>
                    <span className="detail-value">
                        {new Date(employee.hire_date).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <div className="employee-actions">
                <button onClick={() => onEdit(employee)} className="btn-edit">
                    Edit
                </button>
                <button onClick={() => onDelete(employee.id)} className="btn-delete">
                    Delete
                </button>
            </div>
        </div>
    );
}

export default EmployeeCard;
