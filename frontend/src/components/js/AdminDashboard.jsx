import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Users, Bell, BarChart2, AlertTriangle, Clock, Info, X, Eye, LogOut, Edit } from 'lucide-react'
import "../css/dashboard.css"
import "../css/admin.css"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("announcements")
  const [announcements, setAnnouncements] = useState([])
  const [newAnnouncement, setNewAnnouncement] = useState({
    message: "",
    icon: "info",
  })
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [teams, setTeams] = useState([])
  const [newTeam, setNewTeam] = useState({ name: "" })
  const [showNewTeamForm, setShowNewTeamForm] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      navigate("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "ADMIN") {
      navigate("/dashboard")
      return
    }

    setUser(parsedUser)
    fetchData()
  }, [navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const announcementsData = [
        {
          id: 1,
          message: "Reunião geral amanhã às 10h no auditório.",
          icon: "info",
          createdAt: "2025-04-27T10:00:00",
          viewers: ["Rebeca Monteiro", "Raphaela Toledo"],
        },
      ]
      setAnnouncements(announcementsData)

      const teamsData = [
        { id: 1, name: "Desenvolvimento" },
        { id: 2, name: "Marketing" },
        { id: 3, name: "Recursos Humanos" },
        { id: 4, name: "TI" },
      ]
      setTeams(teamsData)
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      setError("Falha ao carregar dados. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleAddAnnouncement = (e) => {
    e.preventDefault()
    if (!newAnnouncement.message) return

    const announcement = {
      id: Date.now(),
      message: newAnnouncement.message,
      icon: newAnnouncement.icon,
      createdAt: new Date().toISOString(),
      viewers: [],
    }

    setAnnouncements([announcement, ...announcements])
    setNewAnnouncement({ message: "", icon: "info" })

    const viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements") || "[]")
    localStorage.setItem(
      "viewedAnnouncements",
      JSON.stringify(viewedAnnouncements.filter((id) => id !== announcement.id)),
    )
  }

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id))
  }

  const handleAddTeam = (e) => {
    e.preventDefault()
    if (!newTeam.name.trim()) return

    const team = {
      id: Date.now(),
      name: newTeam.name,
    }

    setTeams([...teams, team])
    setNewTeam({ name: "" })
    setShowNewTeamForm(false)
  }

  const renderIcon = (iconName) => {
    switch (iconName) {
      case "alert":
        return <AlertTriangle size={20} className="announcement-icon-alert" />
      case "clock":
        return <Clock size={20} className="announcement-icon-clock" />
      case "info":
      default:
        return <Info size={20} className="announcement-icon-info" />
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="btn btn-primary" onClick={fetchData}>
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!user) {
    return <div>Redirecionando para login...</div>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <img src="/assets/logoVivoNow-White.png" alt="VivoNow Logo" className="dashboard-logo" />
        <div className="dashboard-nav">
          <a href="/dashboard" className="dashboard-nav-link">
            Dashboard
          </a>
          <a href="/users" className="dashboard-nav-link">
            Usuários
          </a>
          <a href="/admin/announcements" className="dashboard-nav-link active">
            Avisos
          </a>
          <div className="dashboard-user" onClick={() => setShowUserDropdown(!showUserDropdown)}>
            <div className="dashboard-user-avatar">{user.name.charAt(0)}</div>
            <span>{user.name} ▼</span>

            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="user-dropdown-item">
                  {/* <Users size={16} /> */}
                  {/* <span style={{ marginLeft: "8px" }}>Perfil</span> */}
                {/* </div> */}
                {/* <div className="user-dropdown-item"> */}
                  {/* <Settings size={16} /> */}
                  {/* <span style={{ marginLeft: "8px" }}>Configurações</span> */}
                </div>
                <div className="user-dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span style={{ marginLeft: "8px" }}>Sair</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-content" onClick={() => showUserDropdown && setShowUserDropdown(false)}>
        <h1 className="dashboard-title">Painel de Administração</h1>

        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            <Bell size={16} />
            Avisos
          </button>
          <button
            className={`admin-tab ${activeTab === "teams" ? "active" : ""}`}
            onClick={() => setActiveTab("teams")}
          >
            <Users size={16} />
            Equipes
          </button>
          <button
            className={`admin-tab ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart2 size={16} />
            Estatísticas
          </button>
        </div>

        {activeTab === "announcements" && (
          <div className="admin-section">
            <div className="card mb-4">
              <h3 className="section-title">Novo Aviso</h3>
              <form onSubmit={handleAddAnnouncement}>
                <div className="form-group">
                  <label htmlFor="message">Mensagem</label>
                  <textarea
                    id="message"
                    className="form-control"
                    rows="3"
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                    placeholder="Digite a mensagem do aviso..."
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Ícone</label>
                  <div className="icon-options">
                    <label className={`icon-option ${newAnnouncement.icon === "info" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="icon"
                        value="info"
                        checked={newAnnouncement.icon === "info"}
                        onChange={() => setNewAnnouncement({ ...newAnnouncement, icon: "info" })}
                      />
                      <div className="icon-container">
                        <Info size={20} />
                      </div>
                      <span>Informação</span>
                    </label>
                    <label className={`icon-option ${newAnnouncement.icon === "alert" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="icon"
                        value="alert"
                        checked={newAnnouncement.icon === "alert"}
                        onChange={() => setNewAnnouncement({ ...newAnnouncement, icon: "alert" })}
                      />
                      <div className="icon-container">
                        <AlertTriangle size={20} />
                      </div>
                      <span>Alerta</span>
                    </label>
                    <label className={`icon-option ${newAnnouncement.icon === "clock" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="icon"
                        value="clock"
                        checked={newAnnouncement.icon === "clock"}
                        onChange={() => setNewAnnouncement({ ...newAnnouncement, icon: "clock" })}
                      />
                      <div className="icon-container">
                        <Clock size={20} />
                      </div>
                      <span>Prazo</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  <Plus size={16} />
                  Adicionar Aviso
                </button>
              </form>
            </div>

            <div className="card">
              <h3 className="section-title">Avisos Ativos</h3>
              <div className="announcements-list">
                {announcements.length === 0 ? (
                  <p>Nenhum aviso ativo no momento.</p>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="announcement-item">
                      <div className="announcement-icon-wrapper">{renderIcon(announcement.icon)}</div>
                      <div className="announcement-content">
                        <p className="announcement-message">{announcement.message}</p>
                        <small className="announcement-date">
                          {new Date(announcement.createdAt).toLocaleString("pt-BR")}
                        </small>

                        <div className="announcement-viewers">
                          <div className="announcement-viewers-title">
                            <Eye size={14} style={{ marginRight: "5px" }} />
                            Visualizado por ({announcement.viewers.length})
                          </div>
                          <div className="viewer-list">
                            {announcement.viewers.length === 0 ? (
                              <span className="no-viewers">Ninguém visualizou ainda</span>
                            ) : (
                              announcement.viewers.map((viewer, index) => (
                                <div key={index} className="viewer-item">
                                  <div className="viewer-avatar">{viewer.charAt(0)}</div>
                                  <span>{viewer}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="announcement-delete" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="admin-section">
            <div className="card mb-4">
              <h3 className="section-title">Gerenciar Equipes</h3>

              {!showNewTeamForm ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowNewTeamForm(true)}
                  style={{ marginBottom: "20px" }}
                >
                  <Plus size={16} />
                  Nova Equipe
                </button>
              ) : (
                <form onSubmit={handleAddTeam} className="team-form">
                  <div className="form-group">
                    <label htmlFor="teamName">Nome da Equipe</label>
                    <input
                      type="text"
                      id="teamName"
                      className="form-control"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                      placeholder="Digite o nome da nova equipe"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Adicionar
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowNewTeamForm(false)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="teams-list">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th className="actions-column">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id}>
                        <td>{team.id}</td>
                        <td>{team.name}</td>
                        <td className="actions-column">
                          <button className="btn btn-icon btn-edit">
                            <Edit size={14} />
                          </button>
                          <button className="btn btn-icon btn-delete">
                            <X size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="admin-section">
            <div className="card">
              <h3 className="section-title">Estatísticas de Tarefas</h3>
              <div className="analytics-placeholder">
                <BarChart2 size={48} />
                <p>Funcionalidade em desenvolvimento...</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
