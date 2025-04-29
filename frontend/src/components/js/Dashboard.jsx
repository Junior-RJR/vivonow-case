import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Calendar, Edit, MessageSquare, ChevronLeft, ChevronRight, X, LogOut } from "lucide-react"
import "../css/dashboard.css"
import ImportantMessage from "./ImportantMessage"
import TaskModal from "./TaskModal"
import TaskDetailModal from "./TaskDetailModal"
import AddColumnModal from "./AddColumnModal"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState("")
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false)
  const [showAddColumnModal, setShowAddColumnModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const [scrollDirection, setScrollDirection] = useState(null)
  const taskBoardRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [tasks, setTasks] = useState([])
  const [announcements, setAnnouncements] = useState([])

  const [columns, setColumns] = useState([
    { id: "PENDING", title: "Pendente", color: "pending" },
    { id: "IN_PROGRESS", title: "Em Andamento", color: "progress" },
    { id: "COMPLETED", title: "Concluída", color: "completed" },
  ])

  const [statusFilter, setStatusFilter] = useState("all")
  const [memberFilter, setMemberFilter] = useState("all")

  


  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      navigate("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser)
    setUser(parsedUser)

    fetchData(parsedUser)
  }, [navigate])

  const fetchData = async (currentUser) => {
    setLoading(true)
    try {
      console.log("Carregando dados para a equipe:", currentUser.team)

      const mockTasks = {
        Desenvolvimento: [
          {
            id: 1,
            title: "Desenvolver tela de login",
            description: "Criar a interface de login com validação de campos",
            dueDate: "2025-04-30",
            status: "PENDING",
            assignee: { id: 2, name: "Rebeca Monteiro" },
            assigneeInitial: "J",
            team: { id: 1, name: "Desenvolvimento" },
            priority: "normal",
            comments: [],
          },
          {
            id: 2,
            title: "Implementar autenticação JWT",
            description: "Configurar o backend para autenticação com JWT",
            dueDate: "2025-05-02",
            status: "IN_PROGRESS",
            assignee: { id: 3, name: "Raphaela Toledo" },
            assigneeInitial: "M",
            team: { id: 1, name: "Desenvolvimento" },
            priority: "high",
            comments: [],
          },
          {
            id: 3,
            title: "Criar componente de lista de tarefas",
            description: "Desenvolver o componente que exibe as tarefas em formato de lista",
            dueDate: "2025-05-04",
            status: "COMPLETED",
            assignee: { id: 4, name: "Pedro Santos" },
            assigneeInitial: "P",
            team: { id: 1, name: "Desenvolvimento" },
            priority: "normal",
            comments: [],
          },
        ],
        Marketing: [
          {
            id: 4,
            title: "Criar campanha de lançamento",
            description: "Desenvolver materiais para a campanha de lançamento do produto",
            dueDate: "2025-05-10",
            status: "PENDING",
            assignee: { id: 5, name: "Ana Costa" },
            assigneeInitial: "A",
            team: { id: 2, name: "Marketing" },
            priority: "high",
            comments: [],
          },
          {
            id: 5,
            title: "Análise de métricas",
            description: "Analisar métricas de campanhas anteriores",
            dueDate: "2025-05-15",
            status: "IN_PROGRESS",
            assignee: { id: 6, name: "Carlos Oliveira" },
            assigneeInitial: "C",
            team: { id: 2, name: "Marketing" },
            priority: "normal",
            comments: [],
          },
        ],
        "Recursos Humanos": [
          {
            id: 6,
            title: "Processo seletivo",
            description: "Conduzir processo seletivo para novos desenvolvedores",
            dueDate: "2025-05-20",
            status: "PENDING",
            assignee: { id: 7, name: "Fernanda Lima" },
            assigneeInitial: "F",
            team: { id: 3, name: "Recursos Humanos" },
            priority: "high",
            comments: [],
          },
        ],
        TI: [
          {
            id: 7,
            title: "Atualização de servidores",
            description: "Atualizar servidores para nova versão",
            dueDate: "2025-05-25",
            status: "PENDING",
            assignee: { id: 8, name: "Roberto Alves" },
            assigneeInitial: "R",
            team: { id: 4, name: "TI" },
            priority: "urgent",
            comments: [],
          },
        ],
      }

      const teamTasks = mockTasks[currentUser.team] || []
      setTasks(teamTasks)

      const mockAnnouncements = [
        {
          id: 1,
          message: "Reunião geral amanhã às 10h no auditório.",
          icon: "info",
          createdAt: "2025-04-27T10:00:00",
          createdBy: "Rogério Junior",
        },
      ]
      setAnnouncements(mockAnnouncements)

      if (mockAnnouncements.length > 0) {
        const latestAnnouncement = mockAnnouncements[0]
        const viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements") || "[]")

        if (!viewedAnnouncements.includes(latestAnnouncement.id)) {
          setMessage(latestAnnouncement.message)
          setShowMessage(true)
        }
      }

      setError(null)
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      setError("Falha ao carregar dados. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!taskBoardRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = taskBoardRef.current
      const isScrollable = scrollWidth > clientWidth

      if (!isScrollable) {
        setShowScrollIndicator(false)
        return
      }

      const isScrollEnd = scrollLeft + clientWidth >= scrollWidth - 20
      const isScrollStart = scrollLeft <= 20

      if (isScrollEnd) {
        setScrollDirection("left")
        setShowScrollIndicator(true)
      } else if (isScrollStart) {
        setScrollDirection("right")
        setShowScrollIndicator(true)
      } else {
        setScrollDirection("both")
        setShowScrollIndicator(true)
      }

      setTimeout(() => {
        setShowScrollIndicator(false)
      }, 2000)
    }

    const boardElement = taskBoardRef.current
    if (boardElement) {
      boardElement.addEventListener("scroll", handleScroll)
      handleScroll()
    }

    return () => {
      if (boardElement) {
        boardElement.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleCloseMessage = () => {
    const latestAnnouncement = announcements[0]
    if (latestAnnouncement) {
      const viewedAnnouncements = JSON.parse(localStorage.getItem("viewedAnnouncements") || "[]")
      if (!viewedAnnouncements.includes(latestAnnouncement.id)) {
        viewedAnnouncements.push(latestAnnouncement.id)
        localStorage.setItem("viewedAnnouncements", JSON.stringify(viewedAnnouncements))
      }
    }

    setShowMessage(false)
  }

  const handleAddTask = () => {
    setEditingTask(null)
    setShowTaskModal(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskModal(true)
  }

  const handleViewTask = task => {
    setSelectedTask(task)
    setShowTaskDetailModal(true)
  }

  const handleDeleteColumn = columnId => {
    setColumns(cols => cols.filter(c => c.id !== columnId))
    setTasks(ts => ts.filter(t => t.status !== columnId))
  }

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                ...taskData,
                assignee: {
                  id: task.assignee.id,
                  name: taskData.assignee,
                },
                assigneeInitial: taskData.assignee.charAt(0),
              }
            : task,
        )
        setTasks(updatedTasks)
      } else {
        const newTask = {
          id: Date.now(),
          ...taskData,
          assignee: {
            id: Date.now(),
            name: taskData.assignee,
          },
          assigneeInitial: taskData.assignee.charAt(0),
          team: { id: user.teamId || 1, name: user.team },
          comments: [],
        }
        setTasks([...tasks, newTask])
      }
      setShowTaskModal(false)
      setEditingTask(null)
    } catch (err) {
      console.error("Erro ao salvar tarefa:", err)
      alert("Erro ao salvar tarefa. Por favor, tente novamente.")
    }
  }

  const handleAddComment = async (taskId, comment) => {
    try {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          const newComment = {
            id: Date.now(),
            author: user.name,
            authorInitial: user.name.charAt(0).toUpperCase(),
            content: comment,
            createdAt: new Date().toISOString(),
          }
          return {
            ...task,
            comments: [...(task.comments || []), newComment],
          }
        }
        return task
      })

      setTasks(updatedTasks)

      if (selectedTask && selectedTask.id === taskId) {
        const updatedTask = updatedTasks.find((t) => t.id === taskId)
        setSelectedTask(updatedTask)
      }
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err)
      alert("Erro ao adicionar comentário. Por favor, tente novamente.")
    }
  }

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (e, columnId) => {
    const taskId = Number.parseInt(e.dataTransfer.getData("taskId"))

    try {
      setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: columnId } : task)))
    } catch (err) {
      console.error("Erro ao atualizar status da tarefa:", err)
      alert("Erro ao mover tarefa. Por favor, tente novamente.")
    }
  }

  const handleAddColumn = (columnData) => {
    const newColumn = {
      id: columnData.id.toUpperCase(),
      title: columnData.title,
      color: columnData.color,
    }

    setColumns([...columns, newColumn])
    setShowAddColumnModal(false)
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = statusFilter === "all" || task.status === statusFilter
    const memberMatch = memberFilter === "all" || task.assignee?.name === memberFilter
    return statusMatch && memberMatch
  })

  const getTasksByStatus = status => filteredTasks.filter(t => t.status === status)

  const getUniqueAssignees = () => {
    const assignees = tasks.map((task) => task.assignee?.name).filter(Boolean)
    return [...new Set(assignees)]
  }

  const scrollLeft = () => {
    if (taskBoardRef.current) {
      taskBoardRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (taskBoardRef.current) {
      taskBoardRef.current.scrollBy({ left: 300, behavior: "smooth" })
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
        <button className="btn btn-primary" onClick={() => fetchData(user)}>
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
          <a href="/dashboard" className="dashboard-nav-link active">
            Dashboard
          </a>
          {user.role === "ADMIN" && (
            <>
              <a href="/users" className="dashboard-nav-link">
                Usuários
              </a>
              <a href="/announcements" className="dashboard-nav-link">
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
        <h1 className="dashboard-title">Tarefas da Equipe {user.team}</h1>

        <div className="dashboard-filters">
          <div className="filter-group">
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos os status</option>
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>

            <select className="filter-select" value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}>
              <option value="all">Todos os membros</option>
              {getUniqueAssignees().map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          <button className="dashboard-button" onClick={handleAddTask}>
            <Plus size={16} />
            Nova Tarefa
          </button>
        </div>

        <div className="task-board-container" ref={taskBoardRef}>
          <div className="task-board">
            {columns.map((column) => (
              <div
                key={column.id}
                className="task-column"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="task-column-header">
                  <div className={`task-column-dot ${column.color}`}></div>
                  <span>
                    {column.title} ({getTasksByStatus(column.id).length})
                    <button 
                      className="delete-column-btn" 
                      onClick={() => handleDeleteColumn(column.id)}
                     >
                      <X size={12}/>
                      </button>
                  </span>
                </div>

                {getTasksByStatus(column.id).map((task) => (
                  <div
                    key={task.id}
                    className="task-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => handleViewTask(task)}
                  >
                    <div className="task-card-title">
                      <span>{task.title}</span>
                      <span
                        className="task-card-edit"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditTask(task)
                        }}
                      >
                        <Edit size={14} />
                      </span>
                    </div>
                    <div className="task-card-description">{task.description}</div>
                    <div className="task-card-footer">
                      <div className="task-card-status">
                        <div className="task-card-status-dot"></div>
                        <span>{task.priority || "normal"}</span>
                      </div>
                      <div className="task-card-date">
                        <Calendar size={12} />
                        <span>{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    <div className="task-card-assignee">
                      <div className="task-card-avatar">{task.assignee?.name.charAt(0)}</div>
                      <span>{task.assignee?.name}</span>
                    </div>
                    {task.comments && task.comments.length > 0 && (
                      <div
                        className="task-card-comments"
                        style={{ marginTop: "8px", fontSize: "12px", color: "var(--gray-dark)" }}
                      >
                        <MessageSquare size={12} style={{ marginRight: "5px" }} />
                        {task.comments.length} comentário{task.comments.length > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                ))}

                {getTasksByStatus(column.id).length === 0 && (
                  <div className="task-card" style={{ opacity: 0.5 }}>
                    <div className="task-card-description">Nenhuma tarefa nesta coluna</div>
                  </div>
                )}
              </div>
            ))}

            <div className="task-column add-column-card" onClick={() => setShowAddColumnModal(true)}>
              <Plus size={24} color="var(--gray-dark)" />
              <span style={{ marginTop: "10px", color: "var(--gray-dark)" }}>Adicionar Coluna</span>
            </div>
          </div>
        </div>

        {showScrollIndicator && (
          <div className={`scroll-indicator visible`}>
            {scrollDirection === "left" || scrollDirection === "both" ? (
              <ChevronLeft size={16} onClick={scrollLeft} style={{ cursor: "pointer" }} />
            ) : null}
            {scrollDirection === "right" || scrollDirection === "both" ? (
              <ChevronRight size={16} onClick={scrollRight} style={{ cursor: "pointer" }} />
            ) : null}
            <span>Role para ver mais</span>
          </div>
        )}
      </main>

      {showMessage && <ImportantMessage message={message} onClose={handleCloseMessage} />}

      {showTaskModal && (
        <TaskModal
          task={editingTask}
          columns={columns}
          assignees={getUniqueAssignees()}
          onSave={handleSaveTask}
          onClose={() => setShowTaskModal(false)}
        />
      )}

      {showTaskDetailModal && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          columns={columns}
          onClose={() => setShowTaskDetailModal(false)}
          onEdit={() => {
            setShowTaskDetailModal(false)
            setEditingTask(selectedTask)
            setShowTaskModal(true)
          }}
          onAddComment={(comment) => handleAddComment(selectedTask.id, comment)}
        />
      )}

      {showAddColumnModal && <AddColumnModal onSave={handleAddColumn} onClose={() => setShowAddColumnModal(false)} />}
    </div>
  )
}

export default Dashboard
