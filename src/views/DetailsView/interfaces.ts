export interface TMDBGenre {
  id: number
  name: string
}

export interface MovieDetails {
  id: number
  title: string
  overview: string
  release_date?: string
  runtime?: number
  vote_average?: number
  genres?: TMDBGenre[]
  poster_path?: string
  director?: string
}
