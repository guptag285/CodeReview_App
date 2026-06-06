import './App.css'
import NavBar from './components/NavBar'
import RouterConfig from './routes/AppRoutes'

function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <main className="page-content">
        <RouterConfig />
      </main>
    </div>
  )
}

export default App
