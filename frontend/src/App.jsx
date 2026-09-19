import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/public/Home';
import EventsCatalog from './pages/public/EventsCatalog';
import EventDetail from './pages/public/EventDetail';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MyTickets from './pages/customer/MyTickets';
import MyOrders from './pages/customer/MyOrders';
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyEvents from './pages/company/CompanyEvents';
import CompanyCreateEvent from './pages/company/CompanyCreateEvent';
import CompanyEditEvent from './pages/company/CompanyEditEvent';
import CompanyCheckIn from './pages/company/CompanyCheckIn';
import AdminCompanies from './pages/admin/AdminCompanies';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsCatalog />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-tickets" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/company" element={<ProtectedRoute roles={['company_admin', 'company_staff', 'superadmin']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/events" element={<ProtectedRoute roles={['company_admin', 'superadmin']}><CompanyEvents /></ProtectedRoute>} />
        <Route path="/company/events/new" element={<ProtectedRoute roles={['company_admin', 'superadmin']}><CompanyCreateEvent /></ProtectedRoute>} />
        <Route path="/company/events/:id" element={<ProtectedRoute roles={['company_admin', 'superadmin']}><CompanyEditEvent /></ProtectedRoute>} />
        <Route path="/company/checkin" element={<ProtectedRoute roles={['company_admin', 'company_staff', 'superadmin']}><CompanyCheckIn /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute roles={['superadmin']}><AdminCompanies /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
