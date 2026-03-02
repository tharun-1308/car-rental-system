import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Payment from './pages/Payment';
import Tracking from './pages/Tracking';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <ToastProvider>
                    <div className="app">
                        <Navbar />
                        <main className="container">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/cars/:id" element={<CarDetails />} />
                                <Route path="/dashboard" element={
                                    <ProtectedRoute><UserDashboard /></ProtectedRoute>
                                } />
                                <Route path="/admin" element={
                                    <ProtectedRoute><AdminDashboard /></ProtectedRoute>
                                } />
                                <Route path="/payment" element={
                                    <ProtectedRoute><Payment /></ProtectedRoute>
                                } />
                                <Route path="/track/:id" element={
                                    <ProtectedRoute><Tracking /></ProtectedRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </ToastProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

