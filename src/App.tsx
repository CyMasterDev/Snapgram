import { Routes, Route } from 'react-router-dom'

import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { CreatePost, EditPost, EditProfile, Explore, Home, Notifications, People, PostDetails, Profile, Saved } from './_root/pages';
import './globals.css';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/notifications' element={<Notifications />}/>
          <Route path='/people' element={<People />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/edit-post/:id' element={<EditPost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/profile/:id/*' element={<Profile />} />
          <Route path='/edit-profile/:id' element={<EditProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App