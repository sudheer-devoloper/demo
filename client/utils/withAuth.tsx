// client/utils/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const withAuth = (Component: React.FC, allowedRoles: string[]) => {
  return () => {
    const router = useRouter();

    useEffect(() => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (!userStr || !token) {
        router.replace('/login');
        return;
      }

      const user = JSON.parse(userStr);
      if (!allowedRoles.includes(user.role)) {
        router.replace('/login');
      }
    }, []);

    return <Component />;
  };
};
