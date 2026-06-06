import { Route, Routes } from 'react-router-dom'
import Home from '../components/Home'
import About from '../components/About'
import Contact from '../components/Contact'

export class AppRoutes {
  static readonly HOME = '/'
  static readonly ABOUT = '/about'
  static readonly CONTACT = '/contact'
}

export default function RouterConfig() {
  return (
    <Routes>
      <Route path={AppRoutes.HOME} element={<Home />} />
      <Route path={AppRoutes.ABOUT} element={<About />} />
      <Route path={AppRoutes.CONTACT} element={<Contact />} />
    </Routes>
  )
}
