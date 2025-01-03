import { Routes, Route } from 'react-router-dom'

import './globals.css';

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route path='/sign-in' element={<SigninForm />} />

        {/* private routes */}
        <Route index element={<Home />} />
      </Routes>
    </main>
  )
}

export default App