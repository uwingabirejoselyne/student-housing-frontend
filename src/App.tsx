import './App.css'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'

function App() {

  return (
     <AuthProvider>
      <Landing/>
    </AuthProvider>
  )
}

export default App
