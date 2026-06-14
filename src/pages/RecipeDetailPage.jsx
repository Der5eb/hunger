import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import FavoriteButton from "../components/FavoriteButton";
import { Clock, User, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ShareButton from '../components/ShareButton';

function RecipeDetailPage() {
    const { id } = useParams();
    const { slug } = useParams();
    const { user } = useAuth()
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const rafRef = useRef(null);
    const heroRef = useRef(null);
    const imgRef = useRef(null);
    const overlayRef = useRef(null);
    const metaRef = useRef(null);
    const tagsRef = useRef(null);
    const favRef = useRef(null);
    const shareRef = useRef(null);

    async function handleDelete() {
        await supabase.from('recipes').delete().eq('id', recipe.id)
        navigate('/')
    }

    useEffect(() => {
        async function fetchRecipe() {
            const { data, error } = await supabase.from('recipes').select('*').eq('slug', slug).single()
            if (!error) setRecipe(data);
            setLoading(false);
        }
        fetchRecipe();
    }, [id]);

    // Scroll-Effekt direkt auf DOM — kein React State, kein Re-render
    useEffect(() => {
        const scrollContainer = document.querySelector('.app-main');
        if (!scrollContainer) return;

        const HERO_MAX = 400;
        const HERO_MIN = 100;
        const SCROLL_RANGE = 300;

        const onScroll = () => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                const progress = Math.min(scrollContainer.scrollTop / SCROLL_RANGE, 1);

                // Hero-Höhe
                const heroHeight = HERO_MAX - (HERO_MAX - HERO_MIN) * progress;
                if (heroRef.current) heroRef.current.style.height = `${heroHeight}px`;

                // Bild: leicht nach oben verschieben für Parallax
                const imgScale = 1 + 0.15 * (1 - progress);
                if (imgRef.current) imgRef.current.style.transform = `scale(${imgScale})`;

                // Titel-Größe
                const titleSize = 2 - (2 - 1.4) * progress;
                const titleEl = overlayRef.current?.querySelector('.detail-title');
                if (titleEl) titleEl.style.fontSize = `${titleSize}rem`;

                // Meta/Tags/Buttons ausblenden
                const metaOpacity = Math.max(0, 1 - progress * 2);
                const fadeEls = [metaRef.current, tagsRef.current, favRef.current, shareRef.current];
                fadeEls.forEach(el => {
                    if (!el) return;
                    el.style.opacity = metaOpacity;
                    el.style.pointerEvents = metaOpacity <= 0 ? 'none' : 'auto';
                });

                rafRef.current = null;
            });
        };

        scrollContainer.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            scrollContainer.removeEventListener('scroll', onScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    if (loading) return <p style={{ padding: "2rem" }}>Lädt...</p>;
    if (!recipe) return <p style={{ padding: "2rem" }}>Rezept nicht gefunden.</p>;

    return (
    <div className="page-content">
        <div className="detail-page">
            {/* Sticky-Anker: height:0 klebt oben, beeinflusst Flow nicht */}
            <div style={{ position: 'sticky', top: 0, height: 0, zIndex: 100 }}>
                <div ref={heroRef} className="detail-hero">
                    <img
                        ref={imgRef}
                        src={recipe.image_url || '/placeholder.webp'}
                        alt={recipe.title}
                        onError={e => { e.target.src = '/placeholder.webp' }}
                        style={{ transform: 'scale(1.15)', transformOrigin: 'top center' }}
                    />
                    <div ref={overlayRef} className="detail-hero-overlay">
                        <h1
                            className="detail-title"
                            style={{
                                fontSize: '2rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}
                        >
                            {recipe.title}
                        </h1>
                        <div ref={metaRef} className="detail-meta">
                            {recipe.duration && <span><Clock size={18} /> {recipe.duration}</span>}
                            {recipe.author && <span><User size={18} /> {recipe.author}</span>}
                        </div>
                        {recipe.tags?.length > 0 && (
                            <div ref={tagsRef} className="recipe-card-tags">
                                {recipe.tags.map((tag) => (
                                    <span key={tag} className="recipe-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div ref={favRef} className="detail-favorite">
                        <FavoriteButton recipeId={recipe.id} />
                    </div>
                    <div ref={shareRef} className="detail-share">
                        <ShareButton title={recipe.title} />
                    </div>
                </div>
            </div>

            {/* Spacer: hält den Platz den der Hero visuell einnimmt */}
            <div style={{ height: '400px', flexShrink: 0 }} />

            {/* Content: Geschwister vom Spacer, NICHT drin verschachtelt */}
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
                        <a href={`/rezept/${recipe.slug}/bearbeiten`} className="edit-btn btn--ghost">
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