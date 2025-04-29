import { useState, useEffect } from "react"
import { X } from "lucide-react"
import "../css/modal.css"

const TaskModal = ({ task, columns, assignees, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
    priority: "normal",
    dueDate: new Date().toISOString().split("T")[0],
    assigneeId: "",
  })

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "PENDING",
        priority: task.priority || "normal",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        assigneeId: task.assigneeId || task.assignee?.id || "",
      })
    }
  }, [task])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{task ? "Editar Tarefa" : "Nova Tarefa"}</div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Prioridade</label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Data Limite</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="assigneeId">Responsável</label>
              <select
                id="assigneeId"
                name="assigneeId"
                className="form-control"
                value={formData.assigneeId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um responsável</option>
                {assignees.map((assignee) => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {task ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
