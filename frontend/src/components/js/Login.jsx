import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/auth.css"

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.removeItem("user") 
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.email || !formData.password) {
        setError("Por favor, preencha todos os campos.")
        setLoading(false)
        return
      }
      console.log("Enviando requisição de login...")

      const mockUsers = [
        {
          email: "rogeriojunior@vivo.com.br",
          password: "vivo123",
          name: "Rogério Junior",
          role: "ADMIN",
          team: { id: 1, name: "Desenvolvimento" },
        },
        {
          email: "rebeca.monteiro@vivo.com.br",
          password: "vivo123",
          name: "Rebeca Monteiro",
          role: "USER",
          team: { id: 1, name: "Desenvolvimento" },
        },
        {
          email: "raphaela.toledo@vivo.com.br",
          password: "vivo123",
          name: "Raphaela Toledo",
          role: "USER",
          team: { id: 3, name: "Recursos Humanos" },
        },
      ]

      const user = mockUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      )

      if (user) {
        const response = {
          token: "mock-jwt-token-" + Date.now(),
          name: user.name,
          email: user.email,
          role: user.role,
          team: user.team.name,
        }

        localStorage.setItem("user", JSON.stringify(response))

        navigate("/dashboard")
      } else {
        setError("Email ou senha incorretos.")
      }
    } catch (err) {
      console.error("Erro de login:", err)
      setError("Erro ao processar login.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <img src="/assets/logoVivoNow.png" alt="VivoNow Logo" className="auth-logo" />
      <div className="auth-card">
        <h2 className="auth-title">Bem-vindo</h2>
        <p className="auth-subtitle">Faça login ou crie uma conta para continuar</p>

        <div className="auth-tabs">
          <button className="auth-tab active">Login</button>
          <button className="auth-tab" onClick={() => navigate("/register")}>
            Cadastro
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="auth-input"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              className="auth-input"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login