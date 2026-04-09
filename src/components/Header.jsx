import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { LogOut, LogIn, Plus } from 'lucide-react'

function Header() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="header">
      <a href="/" className="header-logo">
          <img src="/Hunger.svg" alt="Hunger 2.0" height="32" />
        </a>
      <nav className="header-nav">
        {user && (
          <a href="/neu" className="header-link"><Plus size={20} /> Neues Rezept </a>
        )}
        {user
          ? <button onClick={handleLogout} className="header-btn">Logout <LogOut size={22} /></button>
          : <a href="/login" className="header-btn"><LogIn size={22} /> Login</a>
        }
      </nav>
    </header>
  )
}

export default Header