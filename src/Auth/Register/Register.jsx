import React, { useState } from 'react'
import { Button, DatePicker, Divider, Form, Input, Typography, message } from 'antd'
import { useAuthContext } from '../../context/Authcontext'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, firestore } from '../../config/firebase'
import { Link, useNavigate } from "react-router-dom"
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
export default function Register() {
  const navigate = useNavigate()
  const { dispatch } = useAuthContext()
  const [state, setState] = useState({ fullName: "", email: "", password: "", dob: "" })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  const handleRegister = e => {
    e.preventDefault()

    let { email, password, } = state

    setIsProcessing(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        createUserProfile(user)
      })
      .catch(err => {
        message.error("Something went wrong while creating user")
        console.error(err)
      })
      .finally(() => {
        setIsProcessing(false)
      })
  }

  const createUserProfile = async (user) => {
    let { fullName, dob } = state
    const { email, uid } = user
    const userData = {
      fullName, email, uid, dob,
      dateCreated: serverTimestamp(),
      status: "active",
      roles: ["superAdmin"]
    }
    try {
      await setDoc(doc(firestore, "users", uid), userData);
      message.success("A new user has been created successfully")
      dispatch({ payload: { user: userData } })
      navigate("/auth/login")
    } catch (e) {
      message.error("Something went wrong while creating user profile")
      console.error("Error adding document: ", e);
    }
  }


  return (
    <div className="page">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="card shadow w-100 p-4">
              <div className="row">
                <h1 className='text-center my-2 '><u>Register Here</u></h1>
                <div className="col">
                  <label htmlFor="FullName">Full Name</label>
                  <Input placeholder="Enter Full Name" className='form-control my-2' name="fullName" onChange={handleChange} />
                </div>
              </div>
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
                  <Button className='w-50  mt-4 mb-3' type="primary" htmlType="submit" onClick={handleRegister} >Submit</Button>
                </div>
                <p>Go To <Link to="/auth/login">Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}