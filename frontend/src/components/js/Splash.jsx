import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/splash.css"

const Splash = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
      navigate("/login")
    }, 4000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="splash-container">
      <img src="/assets/logoVivoNow.png" alt="VivoNow Logo" className="splash-logo" />
      <img src="/assets/mascotevivo.svg" alt="Vivo Mascot" className="splash-mascot" />
      <div className="splash-dots">
        <div className="splash-dot"></div>
        <div className="splash-dot"></div>
        <div className="splash-dot"></div>
      </div>
    </div>
  )
}

export default Splash
