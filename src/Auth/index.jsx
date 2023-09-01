import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login/index'
import Register from './Register/index'

export default function index() {
  return (
    <Routes>
        <Route path='/register' element={ <Register />} />
        <Route path='/login' element={ <Login />} />
    </Routes>
  )
}
