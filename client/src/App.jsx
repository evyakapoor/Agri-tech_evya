import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import FarmsPage from './pages/FarmsPage';
import CropsPage from './pages/CropsPage';
import SoilPage from './pages/SoilPage';
import WeatherPage from './pages/WeatherPage';
import ResourcesPage from './pages/ResourcesPage';

function AppShell() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">Agri-Tech</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/dashboard">Dashboard</a></li>
              <li className="nav-item"><a className="nav-link" href="/farms">Farms</a></li>
              <li className="nav-item"><a className="nav-link" href="/crops">Crops</a></li>
              <li className="nav-item"><a className="nav-link" href="/soil">Soil</a></li>
              <li className="nav-item"><a className="nav-link" href="/weather">Weather</a></li>
              <li className="nav-item"><a className="nav-link" href="/resources">Marketplace</a></li>
            </ul>
            <div className="d-flex align-items-center gap-2">
              {!user ? (
                <>
                  <a href="/auth" className="btn btn-outline-light btn-sm">Login</a>
                  <a href="/auth" className="btn btn-light btn-sm">Register</a>
                </>
              ) : (
                <>
                  <span className="text-white me-2">{user.name}</span>
                  <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/farms" element={<ProtectedRoute><FarmsPage /></ProtectedRoute>} />
        <Route path="/crops" element={<ProtectedRoute><CropsPage /></ProtectedRoute>} />
        <Route path="/soil" element={<ProtectedRoute><SoilPage /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      </Routes>

      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container d-flex justify-content-between flex-wrap">
          <div>© 2026 Agri-Tech</div>
          <div>Smart irrigation • Soil intelligence • Sustainable growth</div>
        </div>
      </footer>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  );
}
