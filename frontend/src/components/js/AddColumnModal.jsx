import { useState } from "react"
import { X } from "lucide-react"
import "../css/modal.css"

const AddColumnModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    id: "",
    color: "pending",
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "title") {
      const id = value.toLowerCase().replace(/\s+/g, "-")
      setFormData({
        ...formData,
        title: value,
        id,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleColorSelect = (color) => {
    setFormData({
      ...formData,
      color,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Por favor, informe um título para a coluna.")
      return
    }

    onSave(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Nova Coluna</div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="column-modal-body">
          <form className="column-form" onSubmit={handleSubmit}>
            <div className="column-form-group">
              <label className="column-form-label" htmlFor="title">
                Título da Coluna
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="column-form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Em Revisão"
                required
              />
            </div>

            <div className="column-form-group">
              <label className="column-form-label" htmlFor="id">
                ID da Coluna
              </label>
              <input
                type="text"
                id="id"
                name="id"
                className="column-form-input"
                value={formData.id}
                onChange={handleChange}
                placeholder="Gerado automaticamente"
                readOnly
              />
              <small style={{ color: "var(--gray-dark)", fontSize: "12px" }}>
                O ID é gerado automaticamente a partir do título
              </small>
            </div>

            <div className="column-form-group">
              <label className="column-form-label">Cor da Coluna</label>
              <div className="column-form-colors">
                <div
                  className={`color-option ${formData.color === "pending" ? "selected" : ""}`}
                  style={{ backgroundColor: "var(--primary)" }}
                  onClick={() => handleColorSelect("pending")}
                ></div>
                <div
                  className={`color-option ${formData.color === "progress" ? "selected" : ""}`}
                  style={{ backgroundColor: "var(--warning)" }}
                  onClick={() => handleColorSelect("progress")}
                ></div>
                <div
                  className={`color-option ${formData.color === "completed" ? "selected" : ""}`}
                  style={{ backgroundColor: "var(--success)" }}
                  onClick={() => handleColorSelect("completed")}
                ></div>
              </div>
            </div>

            <div className="column-form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Adicionar Coluna
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddColumnModal
