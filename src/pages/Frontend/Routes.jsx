import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import PrivateRouting from '../../components/privaterouting'
import { useAuthContext } from '../../context/Authcontext'

import Home from '../../pages/Frontend'
import Auth from '../../Auth'

export default function Index() {
  const { isAuth } = useAuthContext()
  return (
    <>
      <main>
        <Routes>
          <Route path="/*" element={<PrivateRouting Component={Home} />} />
          <Route path="/auth/*" element={isAuth ? <Navigate to="/" /> : <Auth />} />
        </Routes>
      </main>
    </>
  )
}
