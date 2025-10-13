import './App.css'
import Navbar from './components/layout/Navbar'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
     <AuthProvider>
      <Navbar
        onLoginClick={() => console.log('Login clicked')}
        onSignUpClick={() => console.log('Sign Up clicked')}
      />
    </AuthProvider>
  )
}

export default App
