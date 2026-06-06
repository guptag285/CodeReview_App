import { NavLink } from 'react-router-dom'
import { AppRoutes } from '../routes/AppRoutes'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link'

export default function NavBar() {
  return (
    <nav className="top-nav">
      <NavLink to={AppRoutes.HOME} className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to={AppRoutes.ABOUT} className={navLinkClass}>
        About
      </NavLink>
      <NavLink to={AppRoutes.CONTACT} className={navLinkClass}>
        Contact
      </NavLink>
    </nav>
  )
}
