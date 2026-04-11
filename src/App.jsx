import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from './lib/supabase'
import { AuthProvider } from './context/AuthContext'
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import NewRecipePage from "./pages/NewRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import SetPasswordPage from "./pages/SetPasswordPage";
import "./App.css";

function AuthListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && window.location.hash.includes("type=recovery")) {
        navigate("/passwort-setzen");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthListener />
        <div className="app-layout">
          <Navigation />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/neu" element={<NewRecipePage />} />
              <Route path="/rezept/:slug" element={<RecipeDetailPage />} />
              <Route path="/rezept/:slug/bearbeiten" element={<EditRecipePage />} />
              <Route path="/favoriten" element={<FavoritesPage />} />
              <Route path="/passwort-setzen" element={<SetPasswordPage />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
