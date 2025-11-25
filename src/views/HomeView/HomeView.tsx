import './HomeView.scss'

export function HomeView() {
  return (
    <div className="home-view">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to The Movie</h1>
          <p>Discover and explore thousands of movies and TV shows</p>
          <button className="btn btn-primary">Start Exploring</button>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Content</h2>
        <div className="featured-grid">
          <div className="featured-card">
            <div className="card-placeholder">Movie 1</div>
            <h3>Action Adventure</h3>
            <p>Thrilling action-packed movies</p>
          </div>
          <div className="featured-card">
            <div className="card-placeholder">Movie 2</div>
            <h3>Drama & Romance</h3>
            <p>Emotional and compelling stories</p>
          </div>
          <div className="featured-card">
            <div className="card-placeholder">Movie 3</div>
            <h3>Comedy & Fun</h3>
            <p>Light-hearted entertainment</p>
          </div>
        </div>
      </section>
    </div>
  )
}
