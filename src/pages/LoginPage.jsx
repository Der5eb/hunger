import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleLogin() {
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Login fehlgeschlagen. Bitte prüfe deine Zugangsdaten.')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Willkommen zurück.</h1>
        <p className="login-subtitle">Meld dich an um Rezepte zu verwalten.</p>

        <div className="form-group">
          <label>E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="du@example.com"
          />
        </div>

        <div className="form-group">
          <label>Passwort</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="form-submit" onClick={handleLogin}>
          Einloggen
        </button>
      </div>
    </div>
  )
}

export default LoginPage