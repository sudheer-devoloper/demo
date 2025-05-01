// client/pages/admin-dashboard.tsx
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import API from '../services/axios';
import { withAuth } from '../utils/withAuth';
import Link from 'next/link';

interface User {
    email: string;
    role: 'admin' | 'user';
}

const AdminDashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const fetchUsers = async () => {
        const res = await API.get('/users/list');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <Layout showSidebar>
            <div className="max-w-8xl mx-auto space-y-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </div>
                <Link href="/users">
                <div className='h-32 w-60 bg-[#03183b] rounded-2xl justify-center flex items-center'>
                       <h1 className="text-2xl text-white font-bold">Users ({users?.length})</h1>
                </div>
                </Link>
            </div>
        </Layout>
    );
};

export default withAuth(AdminDashboard, ['admin']);
