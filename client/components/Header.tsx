import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-[#03183b] text-white p-10 shadow-md flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Project
      </Link>
      <button
        className="lg:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>
      <nav className={`lg:flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'} lg:block items-center`}>
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {user?.role === 'admin' && (<Link href="/admin-dashboard" className="hover:underline">Dashboard</Link>)}
        {user ? (<button onClick={logout} className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600">Logout</button>) : (
          <Link href="/login" className="hover:underline">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
