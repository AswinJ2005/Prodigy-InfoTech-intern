import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

const ProtectedLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="flex h-screen justify-center items-center">Loading...</div>;

    return user ? (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    ) : (
        <Navigate to="/login" />
    );
};

export default ProtectedLayout;
