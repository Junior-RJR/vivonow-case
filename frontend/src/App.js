import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./components/css/global.css"
import Splash from "./components/js/Splash"
import Login from "./components/js/Login"
import Register from "./components/js/Register"
import Dashboard from "./components/js/Dashboard"
import AdminDashboard from "./components/js/AdminDashboard"
import UsersPage from "./components/js/UsersPage"
import ProtectedRoute from "./components/js/ProtectedRoute"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
