import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Plus, Edit, Trash2, X } from "lucide-react"
import "../css/dashboard.css"

const UsersPage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      navigate("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    fetchUsers()
    fetchTeams()
  }, [navigate])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const mockUsers = [
        {
          id: 1,
          name: "Rogério Junior",
          email: "rogeriojunior@vivo.com.br",
          role: "ADMIN",
          team: "Desenvolvimento",
          teamId: 1,
        },
        {
          id: 2,
          name: "Rebeca Monteiro",
          email: "rebeca.monteiro@vivo.com.br",
          role: "USER",
          team: "Desenvolvimento",
          teamId: 1,
        },
        {
          id: 3,
          name: "Raphaela Toledo",
          email: "raphaela.toledo@vivo.com.br",
          role: "USER",
          team: "Recursos Humanos",
          teamId: 3,
        },
        {
          id: 4,
          name: "Pedro Santos",
          email: "pedro.santos@vivo.com.br",
          role: "USER",
          team: "Desenvolvimento",
          teamId: 1,
        },
      ]

      setUsers(mockUsers)
      setError(null)
    } catch (err) {
      console.error("Erro ao carregar usuários:", err)
      setError("Falha ao carregar usuários. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const fetchTeams = async () => {
    try {
      const mockTeams = [
        { id: 1, name: "Desenvolvimento" },
        { id: 2, name: "Marketing" },
        { id: 3, name: "Recursos Humanos" },
        { id: 4, name: "TI" },
      ]

      setTeams(mockTeams)
    } catch (err) {
      console.error("Erro ao carregar equipes:", err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleEditUser = (userToEdit) => {
    setEditingUser({ ...userToEdit })
    setShowEditModal(true)
  }

  const handleDeleteUser = (userToDelete) => {
    setUserToDelete(userToDelete)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteUser = async () => {
    try {
      setUsers(users.filter((u) => u.id !== userToDelete.id))
      setShowDeleteConfirm(false)
      setUserToDelete(null)
    } catch (err) {
      console.error("Erro ao excluir usuário:", err)
      alert("Erro ao excluir usuário. Por favor, tente novamente.")
    }
  }

  const handleSaveUser = async () => {
    try {
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...editingUser,
              team: teams.find((t) => t.id === Number(editingUser.teamId))?.name || editingUser.team,
            }
          : u,
      )
      setUsers(updatedUsers)
      setShowEditModal(false)
      setEditingUser(null)
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err)
      alert("Erro ao atualizar usuário. Por favor, tente novamente.")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditingUser({
      ...editingUser,
      [name]: value,
    })
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
        <button className="btn btn-primary" onClick={fetchUsers}>
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
          {user.role === "ADMIN" && (
            <>
              <a href="/users" className="dashboard-nav-link active">
                Usuários
              </a>
              <a href="/admin/announcements" className="dashboard-nav-link">
                Avisos
              </a>
            </>
          )}
          <div className="dashboard-user" onClick={() => setShowUserDropdown(!showUserDropdown)}>
            <div className="dashboard-user-avatar">{user.name.charAt(0)}</div>
            <span>
              {user.name} ▼
            </span>

            {showUserDropdown && (
              <div className="user-dropdown">
                <div className="user-dropdown-item">
                  {/* <User size={16} /> */}
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
        <h1 className="dashboard-title">Gerenciamento de Usuários</h1>

        <div className="dashboard-filters">
          <div className="filter-group">
            <select className="filter-select">
              <option value="all">Todas as equipes</option>
              <option value="Desenvolvimento">Desenvolvimento</option>
              <option value="Marketing">Marketing</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="TI">TI</option>
            </select>

            <select className="filter-select">
              <option value="all">Todos os papéis</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuário</option>
            </select>
          </div>

          <button className="dashboard-button">
            <Plus size={16} />
            Novo Usuário
          </button>
        </div>

        <div className="card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--gray)" }}>Nome</th>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--gray)" }}>Email</th>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--gray)" }}>Equipe</th>
                <th style={{ textAlign: "left", padding: "12px", borderBottom: "1px solid var(--gray)" }}>Papel</th>
                <th style={{ textAlign: "right", padding: "12px", borderBottom: "1px solid var(--gray)" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--gray-light)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="task-card-avatar">{user.name.charAt(0)}</div>
                      {user.name}
                    </div>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--gray-light)" }}>{user.email}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--gray-light)" }}>{user.team}</td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--gray-light)" }}>
                    <span
                      style={{
                        backgroundColor: user.role === "ADMIN" ? "var(--primary-light)" : "var(--gray)",
                        color: user.role === "ADMIN" ? "white" : "var(--text)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                      }}
                    >
                      {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                    </span>
                  </td>
                  <td style={{ padding: "12px", borderBottom: "1px solid var(--gray-light)", textAlign: "right" }}>
                    <button
                      className="btn btn-secondary"
                      style={{ marginRight: "8px", padding: "6px 12px" }}
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: "6px 12px", backgroundColor: "var(--danger)", color: "white" }}
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Editar Usuário</div>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={editingUser.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={editingUser.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="teamId">Equipe</label>
                <select
                  id="teamId"
                  name="teamId"
                  className="form-control"
                  value={editingUser.teamId}
                  onChange={handleInputChange}
                >
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="role">Papel</label>
                <select
                  id="role"
                  name="role"
                  className="form-control"
                  value={editingUser.role}
                  onChange={handleInputChange}
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSaveUser}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Confirmar Exclusão</div>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Tem certeza que deseja excluir o usuário <strong>{userToDelete.name}</strong>?
              </p>
              <p>Esta ação não pode ser desfeita.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteUser}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
