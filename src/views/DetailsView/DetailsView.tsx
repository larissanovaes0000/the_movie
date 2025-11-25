import './DetailsView.scss'

interface MovieDetails {
  id: string
  title: string
  year: number
  rating: number
  genre: string[]
  director: string
  description: string
  duration: string
}

export function DetailsView() {
  const movie: MovieDetails = {
    id: '1',
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    director: 'Christopher Nolan',
    description:
      'A skilled thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    duration: '2h 28min',
  }

  return (
    <div className="details-view">
      <div className="details-header">
        <div className="header-background"></div>
        <div className="header-content">
          <div className="poster">
            <div className="poster-placeholder">{movie.title.charAt(0)}</div>
          </div>
          <div className="header-info">
            <h1>{movie.title}</h1>
            <div className="meta-info">
              <span className="year">{movie.year}</span>
              <span className="duration">{movie.duration}</span>
              <span className="rating">
                <span className="star">★</span> {movie.rating}
              </span>
            </div>
            <div className="genres">
              {movie.genre.map((g) => (
                <span key={g} className="genre-tag">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="details-body">
        <div className="details-section">
          <h2>Overview</h2>
          <p>{movie.description}</p>
        </div>

        <div className="details-section">
          <h2>Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Director</label>
              <p>{movie.director}</p>
            </div>
            <div className="info-item">
              <label>Release Year</label>
              <p>{movie.year}</p>
            </div>
            <div className="info-item">
              <label>Duration</label>
              <p>{movie.duration}</p>
            </div>
            <div className="info-item">
              <label>Rating</label>
              <p>
                <span className="star">★</span> {movie.rating}/10
              </p>
            </div>
          </div>
        </div>

        <div className="details-actions">
          <button className="btn btn-primary">Add to Favorites</button>
          <button className="btn btn-secondary">Watch Now</button>
          <button className="btn btn-outline">Share</button>
        </div>
      </div>
    </div>
  )
}
