// client/pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import API from '../services/axios';
import TextInput from '../components/formComponents/TextInput';
import SelectDropdown from '../components/formComponents/SelectDropdown';
import Button from '../components/formComponents/Button';

const options = [
  {
    title: "User",
    value: "user"
  },
  {
    title: "Admin",
    value: "admin"
  }
]



const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/user-dashboard');
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[url('../public/images/login.jpg')] bg-cover bg-center">
      <div className="bg-white p-6 rounded shadow w-96 space-y-4">
        <h2 className="text-xl font-bold mb-2">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <TextInput
          value={email}
          type="email"
          placeholder="Email"
          setValue={setEmail}
          className="w-full border px-3 py-2 rounded"
        />
        <TextInput
          value={password}
          type="password"
          placeholder="Password"
          setValue={setPassword}
          className="w-full border px-3 py-2 rounded"
        />
        <SelectDropdown
          value={role}
          setValue={setRole}
          className="w-full border px-3 py-2 rounded"
          options={options}
        />
        <Button type={"Submit"} className="w-full bg-blue-600 text-white py-2 rounded" onclick={handleLogin} title={"Login"}/>
      </div>
    </div>

  );
};

export default LoginPage;
