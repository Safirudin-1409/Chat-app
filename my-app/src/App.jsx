import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage.jsx';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
const App = () => {
  const { authUser } = useContext(AuthContext);
  return (
    <div className = "bg-[url('/src/Assets/bgImage.svg')] bg-contain">
      <Toaster/>
      <Routes>
        <Route path = '/' element = {authUser ? <HomePage/> : <Navigate to = "/login"/>}/>
        <Route path = '/login' element = {!authUser ? <LoginPage/> : <Navigate to = "/"/>}/>
        <Route path = '/profile' element = {authUser ? <ProfilePage/> : <Navigate to = "/"/>}/>
        {/* <Route path = '*' element = {<NotFoundPage/>}/> */}
      </Routes>

    </div>
  )
}

export default App
