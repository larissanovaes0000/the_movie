import { useEffect, useState } from 'react'
import './FavoritesView.scss'


export function FavoritesView() {
  const API_KEY = "367014a3bfb5f31c249f13d24550b58f"; 
  const [sessionId, setSessionId] = useState<string | null>(null);
 // const [accountId, setAccountId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  async function createRequestToken() {
    const res = await fetch(
      `https://api.themoviedb.org/3/authentication/token/new?api_key=${API_KEY}`
    );
    const data = await res.json();
    return data.request_token;
  }


  async function authenticate() {
    const token = await createRequestToken();
    window.location.href = `https://www.themoviedb.org/authenticate/${token}?redirect_to=${window.location.origin}/tmdb-auth`;
  }

  async function generateSessionId(approvedToken: string) {
    const res = await fetch(
      `https://api.themoviedb.org/3/authentication/session/new?api_key=${API_KEY}`,
      {
        method: "POST",
        body: JSON.stringify({ request_token: approvedToken }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();
    if (data.success) {
      setSessionId(data.session_id);
      localStorage.setItem("tmdb_session", data.session_id);
    }
  }

  async function loadAccountId(session: string) {
    const res = await fetch(
      `https://api.themoviedb.org/3/account?api_key=${API_KEY}&session_id=${session}`
    );
    const data = await res.json();
   // setAccountId(data.id);
    return data.id;
  }


  async function loadFavorites(account: number, session: string) {
    const res = await fetch(
      `https://api.themoviedb.org/3/account/${account}/favorite/movies?api_key=${API_KEY}&session_id=${session}`
    );
    const data = await res.json();
    setFavorites(data.results || []);
  }

  useEffect(() => {
    const savedSession = localStorage.getItem("tmdb_session");
    const urlParams = new URLSearchParams(window.location.search);
    const approvedToken = urlParams.get("request_token");
    const approved = urlParams.get("approved");

    async function handleFlow() {
      setLoading(true);

      if (approved === "true" && approvedToken) {
        await generateSessionId(approvedToken);
        return;
      }

      if (savedSession && !sessionId) {
        setSessionId(savedSession);
        return;
      }

      setLoading(false);
    }

    handleFlow();
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    async function loadAll() {
      setLoading(true);
      if (typeof sessionId === 'string') {
        const accId = await loadAccountId(sessionId);
        await loadFavorites(accId, sessionId);
      }
      setLoading(false);
    }

    loadAll();
  }, [sessionId]);


  if (loading) return <p>Carregando...</p>;

  if (!sessionId) {
    return (
      <div className="view-container">
        <h2>Favoritos do TMDB</h2>
        <button onClick={authenticate}>
          Fazer login no TMDB
        </button>
      </div>
    );
  }

  return (
    <div className="view-container favorites-view">
      <h2>Favoritos do TMDB</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {favorites.map((movie) => (
          <div
            key={movie.id}
            style={{
              width: "160px",
              background: "#222",
              padding: "10px",
              borderRadius: "10px",
              color: "white",
            }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              style={{ width: "100%", borderRadius: "6px" }}
            />
            <h4 style={{ marginTop: "8px", fontSize: "15px" }}>
              {movie.title}
            </h4>
            <p>⭐ {movie.vote_average?.toFixed(1)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
