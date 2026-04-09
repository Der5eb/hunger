import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import FavoriteButton from "../components/FavoriteButton";
import { Clock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Pencil } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function RecipeDetailPage() {
    const { id } = useParams();
    const { user } = useAuth()
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const navigate = useNavigate()
    
    async function handleDelete() {
  await supabase.from('recipes').delete().eq('id', recipe.id)
  navigate('/')
}

    useEffect(() => {
        async function fetchRecipe() {
            const { data, error } = await supabase.from("recipes").select("*").eq("id", id).single();

            if (!error) setRecipe(data);
            setLoading(false);
        }
        fetchRecipe();
    }, [id]);

    if (loading) return <p style={{ padding: "2rem" }}>Lädt...</p>;
    if (!recipe) return <p style={{ padding: "2rem" }}>Rezept nicht gefunden.</p>;

    return (
        <div className="page-content">
            <div className="detail-page">
            {recipe.image_url && (
                <div className="detail-hero">
                    {recipe.image_url && <img src={recipe.image_url} alt={recipe.title} />}
                    <div className="detail-hero-overlay">
                            <h1 className="detail-title">{recipe.title}</h1>
                        <div className="detail-meta">
                            {recipe.duration && <span> <Clock size={18}/> {recipe.duration}</span>}
                            {recipe.author && <span> <User size={18}/> {recipe.author}</span>}
                        </div>
                        {recipe.tags?.length > 0 && (
                            <div className="recipe-card-tags">
                                {recipe.tags.map((tag) => (
                                    <span key={tag} className="recipe-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="detail-favorite">
                        <FavoriteButton recipeId={recipe.id} />
                    </div>
                </div>
            )}

            <div className="detail-content">
                <div className="detail-body">
                    {recipe.ingredients?.length > 0 && (
                        <div className="detail-section">
                            <h2>Zutaten</h2>
                            <ul className="ingredient-list">
                                {recipe.ingredients.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {recipe.steps?.length > 0 && (
                        <div className="detail-section">
                            <h2>Zubereitung</h2>
                            <ol className="steps-list">
                                {recipe.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    )}
                </div>
                    {user && (
  <div className="detail-actions">
    <a href={`/rezept/${recipe.id}/bearbeiten`} className="edit-btn btn--ghost">
      <Pencil size={20} /> Bearbeiten
    </a>
    {deleteConfirm ? (
      <div className="delete-confirm">
        <span>Wirklich löschen?</span>
        <button className="btn btn--danger" onClick={handleDelete}>Ja, löschen</button>
        <button className="btn btn--ghost" onClick={() => setDeleteConfirm(false)}>Abbrechen</button>
      </div>
    ) : (
      <button className="edit-btn btn--ghost" onClick={() => setDeleteConfirm(true)}>
        <Trash2 size={20} /> Löschen
      </button>
    )}
  </div>
)}
                
            </div>

        </div>
        </div>
    );
}

export default RecipeDetailPage;
