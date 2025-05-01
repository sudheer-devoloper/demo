import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, showSidebar = false }: { children: React.ReactNode; showSidebar?: boolean }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
