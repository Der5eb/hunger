import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function SetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function verifyToken() {
      const hash = window.location.hash
      const params = new URLSearchParams(hash.substring(1))
      const tokenHash = params.get('access_token')

      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery'
        })
        if (error) {
          setError('Link ungültig oder abgelaufen. Bitte neuen Link anfordern.')
        } else {
          setTokenValid(true)
        }
      }
    }
    verifyToken()
  }, [])

  async function handleSubmit() {
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein.')
      return
    }
    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein.')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError('Fehler beim Setzen des Passworts.')
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Passwort setzen</h1>
        <p className="login-subtitle">Wähle ein Passwort für deinen Account.</p>

        <div className="form-group">
          <label>Neues Passwort</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mindestens 6 Zeichen"
          />
        </div>

        <div className="form-group">
          <label>Passwort bestätigen</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Passwort wiederholen"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button
          className="form-submit"
          style={{ width: '100%' }}
          onClick={handleSubmit}
          disabled={loading || !password || !tokenValid}
        >
          {loading ? 'Speichert...' : 'Passwort speichern'}
        </button>
      </div>
    </div>
  )
}

export default SetPasswordPage