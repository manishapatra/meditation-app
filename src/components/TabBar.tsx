import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/today', label: 'Today' },
  { to: '/journal', label: 'Journal' },
  { to: '/path', label: 'Path' },
  { to: '/growth', label: 'Growth' },
]

export function TabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-stone-200 bg-cream-dim pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-screen-sm justify-around px-4">
        {tabs.map((tab) => (
          <li key={tab.to} className="flex-1">
            <NavLink
              to={tab.to}
              className={({ isActive }) =>
                `flex items-center justify-center py-3 text-xs font-medium uppercase tracking-wider ${
                  isActive ? 'text-primary' : 'text-muted'
                }`
              }
            >
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
