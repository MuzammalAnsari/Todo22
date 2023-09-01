import React from 'react'
import {useLocation,Navigate} from 'react-router-dom'
import { useAuthContext } from '../context/Authcontext'

export default function PrivateRouting({Component}) {
  const {isAuth}=useAuthContext()
  const location=useLocation()
  if(!isAuth){
    return <Navigate to='auth/login' state={{from:location.pathname}} replace />
  }
  return (
    <Component />
  )
}
