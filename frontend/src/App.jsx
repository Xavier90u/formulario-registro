import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Register from './pages/Register';
import TicketView from './pages/TicketView';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ticket/:id" element={<TicketView />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
