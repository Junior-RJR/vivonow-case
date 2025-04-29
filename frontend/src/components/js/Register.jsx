import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "./api"
import "../css/auth.css"

const Register = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("register")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    teamType: "existing", 
    teamName: "",
    password: "",
    confirmPassword: "",
    newTeam: false,
  })
  const [error, setError] = useState("")
  const [teams] = useState([
    { id: 1, name: "Desenvolvimento" },
    { id: 2, name: "Marketing" },
    { id: 3, name: "Recursos Humanos" },
    { id: 4, name: "TI" },
  ])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard")
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "teamType") {
      setFormData({
        ...formData,
        teamType: value,
        newTeam: value === "new",
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Por favor, preencha todos os campos obrigatórios.")
        setLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("As senhas não coincidem.")
        setLoading(false)
        return
      }

      if (formData.teamType === "existing" && !formData.teamName) {
        setError("Por favor, selecione uma equipe.")
        setLoading(false)
        return
      }

      if (formData.teamType === "new" && !formData.teamName) {
        setError("Por favor, informe o nome da nova equipe.")
        setLoading(false)
        return
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        teamName: formData.teamName,
        newTeam: formData.teamType === "new",
      }

      console.log("Enviando dados de registro:", userData)
      const response = await authService.register(userData)
      console.log("Resposta do registro:", response)

      if (response && response.token) {
        navigate("/dashboard")
      } else {
        setError("Erro desconhecido ao registrar.")
      }
    } catch (err) {
      console.error("Erro no registro:", err)

      if (err.response) {
        if (err.response.data) {
          setError(typeof err.response.data === "string" ? err.response.data : "Erro no servidor. Tente novamente.")
        } else {
          setError("Falha no registro. Verifique os dados informados.")
        }
      } else if (err.request) {
        setError("Servidor não respondeu. Verifique sua conexão.")
      } else {
        setError("Erro ao processar sua solicitação.")
      }
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
          <button className={`auth-tab ${activeTab === "login" ? "active" : ""}`} onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Cadastro
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="auth-form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              className="auth-input"
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

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

          {/* <div className="auth-form-group">
            <label>Equipe</label>
            <div className="auth-radio-group">
              <div className="auth-radio-option">
                <input
                  type="radio"
                  id="existingTeam"
                  name="teamType"
                  value="existing"
                  className="auth-radio"
                  checked={formData.teamType === "existing"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="existingTeam">Equipe existente</label>
              </div>
              <div className="auth-radio-option">
                <input
                  type="radio"
                  id="newTeam"
                  name="teamType"
                  value="new"
                  className="auth-radio"
                  checked={formData.teamType === "new"}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="newTeam">Nova equipe</label>
              </div>
            </div>
          </div> */}

          {formData.teamType === "existing" ? (
            <div className="auth-form-group">
              <label htmlFor="teamSelect">Selecione a equipe</label>
              <select
                id="teamSelect"
                name="teamName"
                className="auth-input"
                value={formData.teamName}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Selecione uma equipe</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="auth-form-group">
              <label htmlFor="teamName">Nome da nova equipe</label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                className="auth-input"
                placeholder="Digite o nome da nova equipe"
                value={formData.teamName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          )}

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

          <div className="auth-form-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="auth-input"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Processando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
