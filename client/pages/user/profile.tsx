import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import API from '../../services/axios'
import { getValue } from '../../utils/storage'
import TextInput from '../../components/formComponents/TextInput'
import Button from '../../components/formComponents/Button'

const profile = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState("")
    const [mobile, setMobile] = useState("")
    const [editId, setEditId] = useState(null)
    const [role, setRole] = useState<'admin' | 'user'>('user');

    useEffect(() => {
        getProfileData();
    }, [])

    const getProfileData = async () => {
        let user: any = await getValue('user')
        const res = await API.post('/users/profile', { email: user.email })
        setEditId(res.data._id)
        setName(res.data.name)
        setEmail(res.data.email)
        setMobile(res.data.mobile)
        setRole(res.data.role)
    }

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            e.preventDefault();
            const res = await API.put(`/users/${editId}`, { name, email, mobile, role });
            console.log(res);
        } catch (err) {
            console.log('Error adding user', err);
        }
    };
    return (
        <Layout showSidebar>
            <div className="max-w-8xl mx-auto space-y-10">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Profile</h1>
                </div>
                <div className="space-y-4 max-w-2xl">
                    <TextInput type='text' placeholder='User Name' value={name} setValue={setName} className='w-full border border-[#d4d4d4] p-2 rounded' />
                    <TextInput type='email' placeholder='User Email' value={email} setValue={setEmail} className='w-full border border-[#d4d4d4] p-2 rounded' />
                    <TextInput type='mobile' placeholder='User Mobile' value={mobile} setValue={setMobile} className='w-full border border-[#d4d4d4] p-2 rounded' />
                    <div className="flex justify-end">
                        <Button className='bg-[#03183b] text-white px-4 py-2 rounded' type="submit" onclick={handleUpdateUser} title='Update User' />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default profile