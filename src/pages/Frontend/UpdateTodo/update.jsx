import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Select, Modal, Input, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { doc, getDoc, collection, setDoc } from "firebase/firestore";
import { firestore } from '../../../config/firebase'
const initialstate = { title: "", description: "", date: "", color: "" }

export default function Update() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, setState] = useState(initialstate)
  const params = useParams()


  const getDocument = async () => {
    const docRef = doc(firestore, "todos", params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const Data = docSnap.data()
      setState(Data)
    } else {
      console.log("No such document!");
    }
  }
  useEffect(() => {
    getDocument()
    showModal()
  }, [])

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  };

  const handleSubmit = async () => {
    const { title, description, date, color, list } = state
    const todo = {
      title, description, date, color, list,
      dateCreated: new Date(),
      id: params.id,
      role: "",
    }

    try {
      await setDoc(doc(firestore, "todos", params.id), todo, { merge: true });
      message.success("Todo is Updated successfully")
    } catch (e) {
      console.error("Error adding document: ", e);
      message.error("Something went wrong while Updating todo")
    }
    setState(initialstate)
    setIsModalOpen(false);
    navigate("/")
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <Modal open={isModalOpen} >
      <div className="row">
        <div className="col">
          <div className=" p-4">
            <div className="row">
              <h1 className='text-center my-2 '>Update Todo</h1>
              <div className="col">
                <label htmlFor="Title">Title</label>
                <Input placeholder="Enter Title" className='form-control my-2' value={state.title} name="title" onChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <label htmlFor="Date">Date</label>
                <Input type="date" className='form-control my-2' value={state.date} name="date" onChange={handleChange} />
              </div>
              <div className="col-6">
                <label htmlFor="Color">Color For Background</label>
                <Input type="color" className='form-control my-2' value={state.color} name="color" onChange={handleChange} />
              </div>
              <label htmlFor="list">Add List</label>
              <Select placeholder="Select List" value={state.list} onChange={list => setState(s => ({ ...s, list }))}>
                {['personal', "work"].map((list, i) => {
                  return (<Select.Option key={i} value={list}>{list}</Select.Option>)
                })}
              </Select>
            </div>
            <div className="row ">
              <div className="col">
                <label htmlFor="Description">Description</label>
                <TextArea type="text" name='description' className='my-2' value={state.description} id='Description' placeholder='Enter Description' onChange={handleChange} />
              </div>
            </div>
            <div className="row text-center">
              <div className="col">
                <Button className='w-75  mt-4 mb-3' type="primary" onClick={handleSubmit} htmlType="submit"
                >Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
