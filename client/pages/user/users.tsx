// client/pages/admin-dashboard.tsx
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import API from '../../services/axios';
import { withAuth } from '../../utils/withAuth';
import TextInput from '../../components/formComponents/TextInput';
import SelectDropdown from '../../components/formComponents/SelectDropdown';
import { Roleoptions } from '../../utils/constants';
import Button from '../../components/formComponents/Button';
import { Table } from '../../components/Table';

interface User {
    email: string;
    role: 'admin' | 'user';
}

const Users = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState("")
    const [mobile, setMobile] = useState("")
    const [role, setRole] = useState<'admin' | 'user'>('user');
    const [users, setUsers] = useState<User[]>([]);
    const [isAddUserPressed, setIsAddUserPressesd] = useState<boolean>(false)
    const [editId, setEditId] = useState(null)

    const columns = [
        { key: "index", label: "#" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Mobile" },
        { key: "role", label: "Role" },
        {
            key: "actions",
            label: "Actions",
            render: (user: any) => (
                <div className="space-x-2">
                    <Button
                        className='bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-4 py-2 rounded-lg shadow-sm transition duration-200'
                        type="submit" onclick={() => handleEdit(user)} title='Edit'
                    />
                    <Button
                        className='bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg shadow-sm transition duration-200'
                        type="submit" onclick={() => handleDelete(user)} title='Delete'
                    />
                </div>
            ),
        },
    ];

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            e.preventDefault();
            if (editId) {
                const res = await API.put(`/users/${editId}`, { name,email,mobile, role });
                console.log(res);
            } else {
                const res = await API.post('/users/add', { name,email,mobile, role });
                console.log(res);
                
            }
            setName('')
            setEmail('');
            setMobile('')
            setRole('user');
            setEditId(null)
            fetchUsers();
            setIsAddUserPressesd(false)
        } catch (err) {
            console.log('Error adding user', err);
        }
    };

    const fetchUsers = async () => {
        const res = await API.get('/users/list');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: any) => {
        setIsAddUserPressesd(true)
        setEmail(user.email);
        setName(user.name)
        setMobile(user.mobile)
        setRole(user.role);
        setEditId(user._id)
    }

    const handleDelete = async (user: any) => {
        await API.delete(`/users/${user._id}`);
        fetchUsers()
    }

    return (
        <Layout showSidebar>
            <div className="max-w-8xl mx-auto space-y-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Users list</h1>
                    <Button className='bg-[#03183b] text-white px-4 py-2 rounded' type="submit" onclick={() => setIsAddUserPressesd(!isAddUserPressed)} title={isAddUserPressed ? "List" : "+ Add"} />
                </div>
                {isAddUserPressed &&
                    <div className="space-y-4 max-w-2xl">
                        <TextInput type='text' placeholder='User Name' value={name} setValue={setName} className='w-full border border-[#d4d4d4] p-2 rounded' />
                        <TextInput type='email' placeholder='User Email' value={email} setValue={setEmail} className='w-full border border-[#d4d4d4] p-2 rounded' />
                        <TextInput type='mobile' placeholder='User Mobile' value={mobile} setValue={setMobile} className='w-full border border-[#d4d4d4] p-2 rounded' />
                        <SelectDropdown value={role} setValue={setRole} className='w-full border border-[#d4d4d4] p-2 rounded' options={Roleoptions} />
                        <div className="flex justify-end">
                        {editId ?
                            <Button className='bg-[#03183b] text-white px-4 py-2 rounded' type="submit" onclick={handleAddUser} title='Update User' />
                            :
                            <Button className='bg-[#03183b] text-white  px-4 py-2 rounded' type="submit" onclick={handleAddUser} title='Add User' />
                        }
                        </div>
                    </div>}

                {!isAddUserPressed && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Existing Users</h2>
                        <div className="overflow-x-auto">
                            <Table columns={columns} data={users} />
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default withAuth(Users, ['admin']);
