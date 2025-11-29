import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Menu.scss'
import { useDebounce } from '../../hooks/useDebounce'

interface MenuItem {
  id: string
  label: string
  path: string
}

interface MenuProps {
  items?: MenuItem[]
  onSearch?: (query: string) => void
}

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
      // empty submit should clear search results and go home
      navigate('/')
      setIsOpen(false)
      return
    }
    if (onSearch) {
      onSearch(q)
    } else {
      // default behavior: navigate to a search query route
      navigate(`/search?query=${encodeURIComponent(q)}`)
    }
    setQuery('')
    setIsOpen(false)
  }

  useEffect(() => {
    const q = debouncedQuery.trim()
    if (!q) {
      // when user clears the input, remove search state by navigating home
      // only navigate if currently on search or if there is a query in the URL
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  return (
    <nav className="menu">
      <div className="menu-container">
        <div className="menu-brand" onClick={() => navigate('/')}>
          🎬 MovieDB
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
          {/* <button type="submit" className="menu-search-btn" aria-label="Pesquisar">🔍</button>  */}
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
