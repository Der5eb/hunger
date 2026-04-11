import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import RecipeCard from "../components/RecipeCard";

function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState([]);
  const allTags = [...new Set(recipes.flatMap((r) => r.tags ?? []))];

  function toggleTag(tag) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  const filtered = recipes.filter((recipe) => {
    const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTags.length === 0 || activeTags.every((tag) => recipe.tags?.includes(tag));
    return matchesSearch && matchesTag;
  });

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase.from("recipes").select("*").order("created_at", { ascending: false });

      if (!error) setRecipes(data);
      setLoading(false);
    }
    fetchRecipes();
  }, []);

  if (loading) return <p style={{ padding: "2rem" }}>Lädt...</p>;

  return (
    <div className="page-content">
      <h1 style={{ padding: "2rem 2rem 0", fontSize: "2rem", color: "var(--text)" }}>Alle Rezepte</h1>

      <div className="filter-bar">
        <input
          className="search-input"
          placeholder="Rezept suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-tags">
          <button
            className={`tag-option ${activeTags.length === 0 ? "tag-option--active" : ""}`}
            onClick={() => setActiveTags([])}>
            Alle
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`tag-option ${activeTags.includes(tag) ? "tag-option--active" : ""}`}
              onClick={() => toggleTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="recipe-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">
            {search || activeTags ? (
              <p>
                Keine Rezepte gefunden für "<strong>{search || activeTags}</strong>"
              </p>
            ) : (
              <p>Noch keine Rezepte vorhanden.</p>
            )}
          </div>
        ) : (
          filtered.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        )}
      </div>
    </div>
  );
}

export default HomePage;
