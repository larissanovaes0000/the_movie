import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Menu.scss'

interface MenuItem {
  id: string
  label: string
  path: string
}

interface MenuProps {
  items?: MenuItem[]
}

export function Menu({ items = [] }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const defaultItems: MenuItem[] = [
    { id: '1', label: 'Home', path: '/' },
    { id: '2', label: 'Favorites', path: '/favorites' },
  ]

  const menuItems = items.length > 0 ? items : defaultItems

  const handleItemClick = (item: MenuItem) => {
    navigate(item.path)
    setIsOpen(false)
  }

  return (
    <nav className="menu">
      <div className="menu-container">
        <div className="menu-brand" onClick={() => navigate('/')}>
          MovieDB
        </div>

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
