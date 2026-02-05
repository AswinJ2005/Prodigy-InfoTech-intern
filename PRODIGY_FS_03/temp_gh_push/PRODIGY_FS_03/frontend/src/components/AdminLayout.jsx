import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
    return (
        <div style={{ display: 'flex' }}>
            <AdminSidebar />
            <div style={{ flex: 1, marginLeft: '250px', padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
