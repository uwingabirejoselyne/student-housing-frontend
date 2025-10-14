import './App.css'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import { AuthProvider } from './context/AuthContext'

function App() {

  return (
     <AuthProvider>
      <Navbar
        onLoginClick={() => console.log('Login clicked')}
        onSignUpClick={() => console.log('Sign Up clicked')}
      />
      <Footer />
    </AuthProvider>
  )
}

export default App
