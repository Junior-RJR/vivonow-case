import axios from "axios"

const API_URL = "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, 
})

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  (error) => {
    console.error("Erro na requisição:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("Erro na resposta:", error)

    if (error.response) {
      console.log("Status:", error.response.status)
      console.log("Dados:", error.response.data)
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authService = {
  login: async (email, password) => {
    try {
      console.log("Tentando login com:", email)
      const response = await api.post("/auth/login", { email, password })
      console.log("Resposta do login:", response.data)

      if (response.data && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data))
        return response.data
      } else {
        throw new Error("Token não recebido na resposta")
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      throw error
    }
  },

  register: async (userData) => {
    try {
      console.log("Tentando registrar:", userData)
      const response = await api.post("/auth/register", userData)
      console.log("Resposta do registro:", response.data)

      if (response.data && response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data))
        return response.data
      } else {
        throw new Error("Token não recebido na resposta")
      }
    } catch (error) {
      console.error("Erro ao registrar usuário:", error)
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem("user")
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem("user") || "{}")
  },

  isAuthenticated: () => {
    const user = localStorage.getItem("user")
    return !!user
  },

  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return user && user.role === "ADMIN"
  },
}

export const taskService = {
  getAllTasks: async () => {
    try {
      const response = await api.get("/tasks")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error)
      throw error
    }
  },

  getTasksByStatus: async (status) => {
    try {
      const response = await api.get(`/tasks/status/${status}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar tarefas com status ${status}:`, error)
      throw error
    }
  },

  getTasksByAssignee: async (assigneeId) => {
    try {
      const response = await api.get(`/tasks/assignee/${assigneeId}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar tarefas do responsável ${assigneeId}:`, error)
      throw error
    }
  },

  createTask: async (taskData) => {
    try {
      const response = await api.post("/tasks", taskData)
      return response.data
    } catch (error) {
      console.error("Erro ao criar tarefa:", error)
      throw error
    }
  },

  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData)
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar tarefa ${id}:`, error)
      throw error
    }
  },

  updateTaskStatus: async (id, status) => {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status })
      return response.data
    } catch (error) {
      console.error(`Erro ao atualizar status da tarefa ${id}:`, error)
      throw error
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
    } catch (error) {
      console.error(`Erro ao excluir tarefa ${id}:`, error)
      throw error
    }
  },
}

export const announcementService = {
  getAllAnnouncements: async () => {
    try {
      const response = await api.get("/announcements")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar anúncios:", error)
      throw error
    }
  },

  createAnnouncement: async (announcementData) => {
    try {
      const response = await api.post("/announcements", announcementData)
      return response.data
    } catch (error) {
      console.error("Erro ao criar anúncio:", error)
      throw error
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      await api.delete(`/announcements/${id}`)
    } catch (error) {
      console.error(`Erro ao excluir anúncio ${id}:`, error)
      throw error
    }
  },
}

export const teamService = {
  getAllTeams: async () => {
    try {
      const response = await api.get("/teams")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar equipes:", error)
      throw error
    }
  },

  getTeamById: async (id) => {
    try {
      const response = await api.get(`/teams/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar equipe ${id}:`, error)
      throw error
    }
  },

  createTeam: async (name) => {
    try {
      const response = await api.post("/teams", null, { params: { name } })
      return response.data
    } catch (error) {
      console.error("Erro ao criar equipe:", error)
      throw error
    }
  },

  deleteTeam: async (id) => {
    try {
      await api.delete(`/teams/${id}`)
    } catch (error) {
      console.error(`Erro ao excluir equipe ${id}:`, error)
      throw error
    }
  },
}

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get("/users")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      throw error
    }
  },

  getUsersByTeam: async () => {
    try {
      const response = await api.get("/users/team")
      return response.data
    } catch (error) {
      console.error("Erro ao buscar usuários da equipe:", error)
      throw error
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error)
      throw error
    }
  },
}

export default api
