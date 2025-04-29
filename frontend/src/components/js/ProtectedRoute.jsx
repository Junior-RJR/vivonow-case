import { Navigate, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const hasToken = !!user.token
    setIsAuthenticated(hasToken)

    setIsAdmin(user.role === "ADMIN")
  }, [location.pathname]) 

  if (isAuthenticated === null) {
    return <div>Carregando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
