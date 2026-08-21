import { RouterProvider } from 'react-router'
import './App.css'
import { router } from "./app.routes.jsx"
import { AuthProvider } from './features/auth/auth.context.jsx'

function App() {

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
