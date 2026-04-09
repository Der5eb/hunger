import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Camera, Images } from 'lucide-react'

function EditRecipePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [tags, setTags] = useState([])
  const [allTags, setAllTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [showNewTag, setShowNewTag] = useState(false)
  const [ingredients, setIngredients] = useState('')
  const [steps, setSteps] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { slug } = useParams()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  useEffect(() => {
    async function fetchRecipe() {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setTitle(data.title ?? '')
        setDuration(data.duration ?? '')
        setTags(data.tags ?? [])
        setIngredients((data.ingredients ?? []).join('\n'))
        setSteps((data.steps ?? []).join('\n'))
        setImagePreview(data.image_url ?? null)
      }
    }

    async function fetchAllTags() {
      const { data } = await supabase.from('recipes').select('tags')
      const flat = data
        .flatMap(r => r.tags ?? [])
        .map(t => t.replace(/^\*\s*/, '').trim())
        .filter(Boolean)
      setAllTags([...new Set(flat)].sort())
    }

    fetchRecipe()
    fetchAllTags()
  }, [id])

  function toggleTag(tag) {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function addNewTag() {
    const trimmed = newTag.trim()
    if (!trimmed) return
    if (!allTags.includes(trimmed)) setAllTags(prev => [...prev, trimmed].sort())
    if (!tags.includes(trimmed)) setTags(prev => [...prev, trimmed])
    setNewTag('')
    setShowNewTag(false)
  }
  
  function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    let uploadedImageUrl = null

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, imageFile)

      if (uploadError) {
        setError('Fehler beim Bild-Upload.')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(fileName)

      uploadedImageUrl = urlData.publicUrl
    }

    const { error } = await supabase
      .from('recipes')
      .update({
        title,
        duration,
        tags,
        ingredients: ingredients.split('\n').map(i => i.trim()).filter(Boolean),
        steps: steps.split('\n').map(s => s.trim()).filter(Boolean),
        ...(uploadedImageUrl && { image_url: uploadedImageUrl }),
      })
      .eq('id', id)

    if (error) {
      setError('Fehler beim Speichern.')
    } else {
      navigate(`/rezept/${generateSlug(title)}`)
    }
    setLoading(false)
  }

  return (
    <div className="page-content">
      <div className="form-page">
      <h1 className="form-title">Rezept bearbeiten</h1>

      <div className="form-group">
        <label>Titel *</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Dauer</label>
        <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="z.B. 30 min" />
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div className="tag-selector">
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              className={`tag-option ${tags.includes(tag) ? 'tag-option--active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
          {showNewTag ? (
            <div className="tag-new-input">
              <input
                autoFocus
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNewTag()}
                placeholder="Neuer Tag..."
              />
              <button type="button" className="tag-confirm" onClick={addNewTag}>✓</button>
              <button type="button" className="tag-cancel" onClick={() => setShowNewTag(false)}>✕</button>
            </div>
          ) : (
            <button
              type="button"
              className="tag-option tag-option--add"
              onClick={() => setShowNewTag(true)}
            >
              + Neu
            </button>
          )}
        </div>
      </div>

      <div className="form-group">
        <label>Bild</label>
        <div className="image-upload-buttons">
          <label className="upload-btn">
            <Camera size={20}/> Kamera
            <input type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleImageChange} 
              hidden />
          </label>
          <label className="upload-btn">
            <Images size={20}/> Galerie
            <input type="file" accept="image/*" onChange={handleImageChange} hidden />
          </label>
        </div>
        {imagePreview && (
          <img src={imagePreview} alt="Vorschau" className="image-preview" />
        )}
      </div>

      <div className="form-group">
        <label>Zutaten (eine pro Zeile)</label>
        <textarea
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          rows={6}
        />
      </div>

      <div className="form-group">
        <label>Zubereitung (ein Schritt pro Zeile)</label>
        <textarea
          value={steps}
          onChange={e => setSteps(e.target.value)}
          rows={8}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button className="form-submit" onClick={handleSubmit} disabled={loading || !title}>
        {loading ? 'Speichert...' : 'Änderungen speichern'}
      </button>
    </div>
    </div>
  )
}

export default EditRecipePage