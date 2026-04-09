import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NewRecipePage from './pages/NewRecipePage'
import EditRecipePage from './pages/EditRecipePage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navigation />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/neu" element={<NewRecipePage />} />
            <Route path="/rezept/:slug" element={<RecipeDetailPage />} />
            <Route path="/favoriten" element={<FavoritesPage />} />
            <Route path="/rezept/:slug/bearbeiten" element={<EditRecipePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App