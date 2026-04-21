import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./context/AuthContext";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CharitiesPage from "./pages/CharitiesPage";
import DrawsPage from "./pages/DrawsPage";
import PricingPage from "./pages/PricingPage";

import DashboardLayout from "./components/user/DashboardLayout";
import DashboardHome from "./pages/user/DashboardHome";
import ScoresPage from "./pages/user/ScoresPage";
import MyCharityPage from "./pages/user/MyCharityPage";
import WinningsPage from "./pages/user/WinningsPage";
import SubscriptionPage from "./pages/user/SubscriptionPage";
import ProfilePage from "./pages/user/ProfilePage";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDraws from "./pages/admin/AdminDraws";
import AdminCharities from "./pages/admin/AdminCharities";
import AdminWinners from "./pages/admin/AdminWinners";
import AdminPayments from "./pages/admin/AdminPayments";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}><div className="spinner-border text-success" /></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}><div className="spinner-border text-success" /></div>;
  return user?.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/charities" element={<CharitiesPage />} />
        <Route path="/draws" element={<DrawsPage />} />
        <Route path="/pricing" element={<PricingPage />} />

        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<DashboardHome />} />
          <Route path="scores" element={<ScoresPage />} />
          <Route path="charity" element={<MyCharityPage />} />
          <Route path="winnings" element={<WinningsPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="draws" element={<AdminDraws />} />
          <Route path="charities" element={<AdminCharities />} />
          <Route path="winners" element={<AdminWinners />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="dark"
      toastStyle={{ background: "#111c13", border: "1px solid rgba(45,158,95,0.2)", color: "#e8f5ec" }}
    />
  </AuthProvider>
);

export default App;
