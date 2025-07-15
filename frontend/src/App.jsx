import React, { use, useEffect } from 'react'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import { Route, Routes } from 'react-router'
import Moviepage from './pages/Moviepage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import {Toaster} from 'react-hot-toast'
import { useAuthStore } from './store/authStore';
import AiRecommendation from './pages/AiRecommendation'

const App = () => {
  const { fetchUser, fetchingUser} = useAuthStore();

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  if (fetchingUser) {
    return <p>Loading...</p>
  }
  return (
    <div>
      <Toaster />

      <Navbar />
    
      <Routes>
        <Route path={"/"} element ={<Homepage/>}/>
        <Route path={"/movie/:id"} element ={<Moviepage/>}/>
        <Route path={"/signin"} element ={<SignIn/>}/>
        <Route path={"/signup"} element ={<SignUp/>}/>
        <Route path={"/ai-recommendation"} element ={<AiRecommendation/>}/>
      </Routes>
    </div>
  )
}

export default App