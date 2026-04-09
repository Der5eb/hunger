import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Heart } from 'lucide-react'

function FavoriteButton({ recipeId }) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    async function checkFavorite() {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .single()
      setIsFavorite(!!data)
    }
    checkFavorite()
  }, [user, recipeId])

  async function toggleFavorite(e) {
    e.preventDefault()
    if (!user || loading) return
    setLoading(true)

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, recipe_id: recipeId })
      setIsFavorite(true)
    }
    setLoading(false)
  }

  if (!user) return null

  return (
    <button
      onClick={toggleFavorite}
      className={`favorite-btn ${isFavorite ? 'favorite-btn--active' : ''}`}
      disabled={loading}
      title={isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
    >
      <Heart size={22} fill={isFavorite ? '#e05555' : 'none'} color={isFavorite ? '#e05555' : '#ababab'}/>
    </button>
  )
}

export default FavoriteButton