import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Menu.scss'
import { useDebounce } from '../../hooks/useDebounce'
import type { MenuItem, MenuProps } from './interfaces'

export function Menu({ items = [], onSearch }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const debouncedQuery = useDebounce(query, 600)
  const location = useLocation()

  const defaultItems: MenuItem[] = [
    { id: '1', label: 'Home', path: '/' },
    { id: '2', label: 'Favorites', path: '/favorites' },
  ]

  const menuItems = items.length > 0 ? items : defaultItems

  const handleItemClick = (item: MenuItem) => {
    navigate(item.path)
    setIsOpen(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) {

      navigate('/')
      setIsOpen(false)
      return
    }
    if (onSearch) {
      onSearch(q)
    } else {
      navigate(`/search?query=${encodeURIComponent(q)}`)
    }
    setQuery('')
    setIsOpen(false)
  }

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (!q) {
      if (location.pathname === '/search' || location.search.includes('query=')) {
        navigate('/')
      }
      return
    }

    if (onSearch) {
      onSearch(q)
    } else {
      navigate(`/search?query=${encodeURIComponent(q)}`)
    }
    setIsOpen(false)
  }, [debouncedQuery])

  return (
    <nav className="menu">
      <div className="menu-container">
        <div className="menu-brand" onClick={() => navigate('/')} title="Ir para Home">
          <p>🎬 MovieDB</p>
        </div>

        <form className="menu-search-wrapper" onSubmit={handleSearch} role="search">
          <input
            className="menu-search"
            type="search"
            placeholder="Buscar filme"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar filme"
          />
          
        </form>

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className="hamburger"></span>
        </button>

        <ul className={`menu-list ${isOpen ? 'open' : ''}`}>
          {
            menuItems.map((item) => (
              <li key={item.id} className="menu-item">
                <a onClick={(e) => { e.preventDefault(); handleItemClick(item) }}>
                  {item.label}
                </a>
              </li>
            ))
          }
        </ul>
      </div>
    </nav>
  )
}
