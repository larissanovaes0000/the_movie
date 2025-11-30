export interface Movie {
  id: number
  title: string
  year?: number
  rating?: number
  poster?: string
}

export interface MovieCardProps {
  movie: Movie
  isFavorite?: boolean
  onToggleFavorite?: (id: number) => void
  onClick?: () => void
}
