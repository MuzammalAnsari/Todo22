import React, { useState } from 'react'
import { Button, Divider, Form, Input, Typography, message } from 'antd'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useAuthContext } from '../../context/Authcontext'
import { auth } from '../../config/firebase'

import { Link } from 'react-router-dom'

const { Title } = Typography

export default function Login() {

  const { readUserProfile, setIsApploading, dispatch } = useAuthContext()
  const [state, setState] = useState({ email: "", password: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleLogin = e => {
    e.preventDefault()

    let { email, password } = state

    setIsProcessing(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        readUserProfile(user)
        dispatch({ type: "SET_LOGGED_IN", payload: { user } })
      })
      .catch(err => {
        message.error("Something went wrong while signing user")
        console.error(err)
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  return (
    <div className="page" >
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card shadow w-100 p-4">
              <div className="row">
                <h1 className='text-center my-2 '><u>Login Here</u></h1>
                <div className="row">
                  <div className="col">
                    <label htmlFor="Email">Email</label>
                    <Input placeholder="Enter Email" className='form-control my-2' name="email" onChange={handleChange} />
                  </div>
                </div>
                <div className="row ">
                  <div className="col">
                    <label htmlFor="Password">Password</label>
                    <Input.Password type="text" name='password' className='my-2' id='password' onChange={handleChange} placeholder='Enter Password' />
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col">
                    <Button className='w-50  mt-4 mb-3' type="primary" htmlType="submit" loading={isProcessing} onClick={handleLogin} >Submit</Button>
                    <p>If you are not Register Please <Link to='/auth/register' >Register</Link> First</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}