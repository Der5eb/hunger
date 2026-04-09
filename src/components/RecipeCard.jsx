import { Clock } from 'lucide-react'
import FavoriteButton from './FavoriteButton'

function RecipeCard({ recipe }) {
  return (
    <a href={`/rezept/${recipe.id}`} className="recipe-card-wrapper">
      <div className="recipe-card-favorite">
        <FavoriteButton recipeId={recipe.id} />
      </div>
      <div className="recipe-card">
        <div className="recipe-card-image">
          {recipe.image_url
            ? <img src={recipe.image_url} alt={recipe.title} />
            : <div className="recipe-card-placeholder">🍽️</div>
          }
        </div>
        <div className="recipe-card-body">
          <h2 className="recipe-card-title">{recipe.title}</h2>
          {recipe.duration && (
            <span className="recipe-card-duration">
              <Clock size={14} /> {recipe.duration}
            </span>
          )}
          {recipe.tags?.length > 0 && (
            <div className="recipe-card-tags">
              {recipe.tags.map(tag => (
                <span key={tag} className="recipe-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}

export default RecipeCard