import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { FavoritesView } from '../views/FavoritesView/FavoritesView'
import { DetailsView } from '../views/DetailsView/DetailsView'
import { HomeView } from '../views/HomeView/HomeView'
import { Menu } from '../components/Menu/Menu'

export function AppRoutes() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/search" element={<HomeView />} />
        <Route path="/favorites" element={<FavoritesView />} />
        <Route path="/details/:id" element={<DetailsView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
