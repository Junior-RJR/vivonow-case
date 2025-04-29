import { useState } from "react"
import { X, Calendar, Edit, MessageSquare, Send } from "lucide-react"
import "../css/modal.css"

const TaskDetailModal = ({ task, columns, onClose, onEdit, onAddComment }) => {
  const [comment, setComment] = useState("")

  const getStatusTitle = (statusId) => {
    const column = columns.find((col) => col.id === statusId)
    return column ? column.title : "Desconhecido"
  }

  const getStatusColor = (statusId) => {
    const column = columns.find((col) => col.id === statusId)
    return column ? column.color : "pending"
  }

  const handleSubmitComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return

    onAddComment(comment)
    setComment("")
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: "700px", maxWidth: "90%" }}>
        <div className="modal-header">
          <div className="modal-title">Detalhes da Tarefa</div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="task-detail-header">
            <div>
              <h2 className="task-detail-title">{task.title}</h2>
              <div className="task-detail-status">
                <div className={`task-detail-status-dot ${getStatusColor(task.status)}`}></div>
                <span className="task-detail-status-text">{getStatusTitle(task.status)}</span>
              </div>
            </div>

            <button className="btn btn-secondary" onClick={onEdit}>
              <Edit size={16} />
              <span style={{ marginLeft: "5px" }}>Editar</span>
            </button>
          </div>

          <div className="task-detail-section">
            <h3 className="task-detail-section-title">Descrição</h3>
            <div className="task-detail-description">{task.description || "Sem descrição"}</div>
          </div>

          <div className="task-detail-meta">
            <div className="task-detail-meta-item">
              <div className="task-detail-meta-label">Responsável</div>
              <div className="task-detail-meta-value">
                <div className="task-card-avatar">{task.assigneeInitial}</div>
                {task.assignee?.name}
              </div>
            </div>

            <div className="task-detail-meta-item">
              <div className="task-detail-meta-label">Data Limite</div>
              <div className="task-detail-meta-value">
                <Calendar size={16} />
                {new Date(task.dueDate).toLocaleDateString("pt-BR")}
              </div>
            </div>

            <div className="task-detail-meta-item">
              <div className="task-detail-meta-label">Prioridade</div>
              <div className="task-detail-meta-value">
                {task.priority === "low" && "Baixa"}
                {task.priority === "normal" && "Normal"}
                {task.priority === "high" && "Alta"}
                {task.priority === "urgent" && "Urgente"}
              </div>
            </div>
          </div>

          <div className="task-comments">
            <div className="task-comments-title">
              <MessageSquare size={18} />
              <span>Comentários ({task.comments.length})</span>
            </div>

            <form className="comment-form" onSubmit={handleSubmitComment}>
              <input
                type="text"
                className="comment-input"
                placeholder="Adicione um comentário..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <Send size={16} />
              </button>
            </form>

            <div className="comment-list">
              {task.comments.length === 0 ? (
                <div style={{ color: "var(--gray-dark)", fontSize: "14px", padding: "10px 0" }}>
                  Nenhum comentário ainda. Seja o primeiro a comentar!
                </div>
              ) : (
                task.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <div className="comment-author">
                        <div className="comment-avatar">{comment.authorInitial}</div>
                        <span>{comment.author}</span>
                      </div>
                      <div className="comment-date">{new Date(comment.createdAt).toLocaleString("pt-BR")}</div>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailModal
