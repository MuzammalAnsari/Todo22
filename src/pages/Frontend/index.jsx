import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Upcomming from './Upcoming'
import Today from './Today'
import Personal from './Personal'
import Work from './Work'
import Update from './UpdateTodo/update'

export default function index() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='upcomming' element={<Upcomming />} />
      <Route path='today' element={<Today />} />
      <Route path='personal' element={<Personal />} />
      <Route path='work' element={<Work />} />
      <Route path='update/:id' element={<Update />} />
    </Routes>
  )
}
