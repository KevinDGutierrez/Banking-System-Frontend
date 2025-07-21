
import { useLocation } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

const Dashboard = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  return user?.role === 'ADMIN' ? <AdminDashboard /> : <ClientDashboard />;
};

export default Dashboard;