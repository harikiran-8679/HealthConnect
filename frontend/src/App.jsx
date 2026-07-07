import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import HealthTips from './pages/HealthTips';
import Diseases from './pages/Diseases';
import Vaccinations from './pages/Vaccinations';
import EmergencyContacts from './pages/EmergencyContacts';
import WomenChild from './pages/WomenChild';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Search from './pages/Search';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/health-tips" element={<HealthTips />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/vaccinations" element={<Vaccinations />} />
        <Route path="/emergency" element={<EmergencyContacts />} />
        <Route path="/women-child" element={<WomenChild />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/search" element={<Search />} />
      </Route>
    </Routes>
  );
}
