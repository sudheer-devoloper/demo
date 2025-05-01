import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();
  const pathname = router.pathname;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setRole(user?.role);
  }, []);

  const isActive = (path: string) => pathname === path;

  const getLinkClasses = (path: string) =>
    `py-3 px-2 rounded-xl ${
      isActive(path)
        ? 'bg-[#03183b] text-white' 
        : 'hover:bg-gray-50'       
    }`;

  return (
    <aside className="w-64 bg-gray-100 p-4 h-full border-r border-gray-300">
      <nav className="space-y-2 h-204">
        {role === 'admin' ? (
          <>
            <div className={getLinkClasses('/admin-dashboard')}>
              <Link href="/admin-dashboard">Dashboard</Link>
            </div>
            <div className={getLinkClasses('/user/users')}>
              <Link href="/user/users">Manage Users</Link>
            </div>
            <div className={getLinkClasses('/user/profile')}>
              <Link href="/user/profile">Profile</Link>
            </div>
            <div className={getLinkClasses('/user/chat')}>
              <Link href="/user/chat">Chat</Link>
            </div>
          </>
        ) : (
          <>
            <div className={getLinkClasses('/user-dashboard')}>
              <Link href="/user-dashboard">Dashboard</Link>
            </div>
            <div className={getLinkClasses('/user-dashboard/blogs')}>
              <Link href="/user-dashboard/blogs">My Blogs</Link>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
