import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import RecipeCard from '../components/RecipeCard'

function FavoritesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    async function fetchFavorites() {
      const { data, error } = await supabase
        .from('favorites')
        .select('recipe_id, recipes(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setRecipes(data.map(f => f.recipes))
      }
      setLoading(false)
    }

    fetchFavorites()
  }, [user])

  if (loading) return <p style={{ padding: '2rem' }}>Lädt...</p>

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Favoriten</h1>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p>Noch keine Favoriten gespeichert.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Klick das Herz auf einem Rezept um es hier zu speichern.
          </p>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage