import './FavoritesView.scss'

interface Favorite {
  id: string
  title: string
  category: string
}

export function FavoritesView() {
  const favorites: Favorite[] = [
    { id: '1', title: 'Inception', category: 'Sci-Fi' },
    { id: '2', title: 'The Shawshank Redemption', category: 'Drama' },
    { id: '3', title: 'The Dark Knight', category: 'Action' },
  ]

  return (
    <div className="favorites-view">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p>Your collection of favorite movies and TV shows</p>
      </div>

      <div className="favorites-container">
        {favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="favorite-card">
                <div className="card-image">
                  <span className="placeholder">{favorite.title.charAt(0)}</span>
                </div>
                <div className="card-content">
                  <h3>{favorite.title}</h3>
                  <span className="category-badge">{favorite.category}</span>
                  <div className="card-actions">
                    <button className="btn-remove">Remove</button>
                    <button className="btn-watch">Watch Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No Favorites Yet</h2>
            <p>Start adding movies and TV shows to your favorites!</p>
            <button className="btn btn-primary">Browse Content</button>
          </div>
        )}
      </div>
    </div>
  )
}
