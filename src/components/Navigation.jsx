import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, PlusCircle, Heart, LogIn, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

function Navigation() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  return saved === null ? true : saved === 'true'
})
    const iconSize = collapsed ? 22 : 20
    
  function toggleCollapsed() {
  const next = !collapsed
  setCollapsed(next)
  localStorage.setItem('sidebar-collapsed', next)
}

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

const links = [
  { to: '/', icon: <Home size={iconSize} />, label: 'Start' },
  ...(user ? [
    { to: '/neu', icon: <PlusCircle size={iconSize} />, label: 'Neu' },
    { to: '/favoriten', icon: <Heart size={iconSize} />, label: 'Favoriten' },
  ] : []),
]

  return (
    <>
      {/* Sidebar Desktop */}
      <nav className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
        <div className="sidebar-header">
          {!collapsed && <a href="/" className="sidebar-logo">
  <img src="/Hunger.svg" alt="Hunger" height="28" />
</a>}
            <button className="sidebar-toggle" onClick={toggleCollapsed}>
                {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
        </div>

        <div className="sidebar-links">
          {links.map(link => (<a
            
              key={link.to}
              href={link.to}
              className={`sidebar-link ${location.pathname === link.to ? 'sidebar-link--active' : ''}`}
              title={collapsed ? link.label : undefined}
            >
              {link.icon}
              {!collapsed && <span>{link.label}</span>}
            </a>
          ))}
        </div>

        <div className="sidebar-bottom">
          {user
            ? <button className="sidebar-link" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
                <LogOut size={20} />
                {!collapsed && <span>Logout</span>}
              </button>
            : <a href="/login" className="sidebar-link" title={collapsed ? 'Login' : undefined}>
                <LogIn size={20} />
                {!collapsed && <span>Login</span>}
              </a>
          }
        </div>
      </nav>

      {/* Bottom Nav Mobile */}
      <nav className="bottom-nav">
        {links.map(link => (<a
          
            key={link.to}
            href={link.to}
            className={`bottom-nav-link ${location.pathname === link.to ? 'bottom-nav-link--active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </a>
        ))}
        {user
          ? <button className="bottom-nav-link" onClick={handleLogout}>
              <LogOut size={20} /><span>Logout</span>
            </button>
          : <a href="/login" className="bottom-nav-link">
              <LogIn size={20} /><span>Login</span>
            </a>
        }
      </nav>
    </>
  )
}

export default Navigation