import { useState, useEffect } from "react"
import { AlertTriangle, Clock } from "lucide-react"
import "../css/modal.css"

const ImportantMessage = ({ message, onClose }) => {
  const [countdown, setCountdown] = useState(10)
  const [showCloseButton, setShowCloseButton] = useState(false)

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setShowCloseButton(true)
    }
  }, [countdown])

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header important">
          <div className="modal-title">
            <AlertTriangle size={20} />
            Mensagem Importante
          </div>
        </div>
        <div className="modal-body">
          <p className="important-message">{message}</p>
          <div className="modal-countdown">
            {!showCloseButton ? (
              <>
                <Clock size={16} />
                <span>Aguarde {countdown} segundos...</span>
              </>
            ) : null}
          </div>
        </div>
        {showCloseButton && (
          <div className="modal-footer">
            <button className="auth-button" onClick={onClose}>
              Fechar aviso
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportantMessage
