import React, { useState, useEffect } from 'react';
import { UserOutlined, LineChartOutlined, DoubleRightOutlined, UnorderedListOutlined, PlusOutlined, CalendarOutlined, MenuUnfoldOutlined, ClearOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, theme, Select, Divider, Modal, Input, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { collection, addDoc, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from '../../../config/firebase'
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuthContext } from "../../../context/Authcontext"
const { Header, Sider, Content } = Layout;


const initialstate = { title: "", description: "", date: "", color: "" }
export default function App() {
  const Navigate = useNavigate()
  const { dispatch } = useAuthContext()
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [todos, setTodos] = useState([])
  const [document, setDocument] = useState([])
  const [state, setState] = useState({})

  const showModal = () => {
    setIsModalOpen(true);
  };
  const getDocument = async () => {
    const querySnapshot = await getDocs(collection(firestore, "todos"));
    let array = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      array.push(data)
      // console.log(doc.id, " => ", doc.data());
    });
    setDocument(array)
    setTodos(array)
    console.log('todos', array)
  }

  useEffect(() => {
    getDocument()
  }, [])

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  };

  const handleSubmit = async () => {
    const { title, description, date, color, list } = state
    const todo = {
      title, description, date, color, list,
      dateCreated: new Date(),
      id: Math.random().toString(36).slice(2),
      role: "",
    }
    handleAdd(todo)
  };
  const handleAdd = async (todo) => {
    try {
      const docRef = await setDoc(doc(firestore, "todos", todo.id), todo);
      message.success("Todo is added successfully")
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setState(initialstate)
    getDocument()
    setIsModalOpen(false);
  }
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleDelete = async (todo) => {
    try {
      await deleteDoc(doc(firestore, 'todos', todo.id));
      let deletedDocument = document.filter(doc => doc.id !== todo.id)
      setDocument(deletedDocument)
      console.log('deletedDocument', deletedDocument)
      setTodos(deletedDocument)
      message.success('Todo deleted successfully');
    } catch (error) {
      console.error('Error deleting Todo: ', error);
    }
  }
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        message.success('Signout successful');
        dispatch({ type: 'SET_LOGGED_OUT' });
      })
      .catch((err) => {
        message.error('Signout not successful');
      });
  }
  return (
    <Layout style={{ height: "100vh", overflow: "scroll" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <span><Button
          type="text"

          theme="dark"
          icon={collapsed ? <MenuUnfoldOutlined /> : <h4 style={{ margin: "10px" }}>Menu</h4>}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: '16px',
            margin: "10px ",
            width: 64,
            height: 70,
            color: "white",
          }}
        ></Button></span>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Task',
              children: [
                {
                  icon: <Link to='/upcomming'><DoubleRightOutlined /></Link>,
                  label: "Upcomming"
                },
                {
                  icon: <Link to="/today"><VerticalAlignBottomOutlined /></Link>,
                  label: "Today"
                },
                {
                  icon: <Link to="/"><UnorderedListOutlined /></Link>,
                  label: "Todos"
                },
              ]
            },
            {
              key: '2',
              icon: <UnorderedListOutlined />,
              label: 'List',
              children: [
                {
                  icon: <Link to="/personal"> <UserOutlined /></Link>,
                  label: "Personal"
                },
                {
                  icon: <Link to="/work"><LineChartOutlined /></Link>,
                  label: "Work"
                },
              ]
            },
            {
              key: '3',
              icon: <clearImmediate />,
              label: <p onClick={handleLogout} className='mb-0'>Signout</p>,
            },
          ]}
        />
      </Sider>
      <Content
        style={{ height: "100vh", display: "flex", flexDirection: "column", background: colorBgContainer, }}><h1 className=' mt-2'>Todos</h1>
        <Divider />
        <div className="container">
          <ul className="row">
            {todos.map((todo) => (
              <li className="col-4" style={{ listStyleType: 'none' }} key={todo.id}>
                <div className="stick" style={{ backgroundColor: todo.color || '#F8F9FA', padding: '10px', marginBottom: '10px', borderRadius: '10px', height: '250px', }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <h4>{todo.title}</h4>
                    <div className="dropdown">
                      <div className="dropdown-toggle"></div>
                      <div className="dropdown-content  text-center">
                        <button className='btn btn-light' onClick={() => Navigate(`update/${todo.id}`)}><EditOutlined className="m-1" /></button>
                        <button className='btn btn-light mt-1' onClick={() => handleDelete(todo)}>
                          <DeleteOutlined className="mx-1 mb-1" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="stickyDescription">
                    <p>{todo.status}</p>
                    <p>{todo.description}</p>
                  </div>
                  <p>{todo.dateCreated?.seconds && new Date(todo.dateCreated.seconds * 1000).toLocaleString()}</p>
                </div>
              </li>
            ))}
            <li className="col-4" style={{ listStyleType: 'none' }}>
              <button style={{ marginBottom: '10px', borderRadius: '10px', height: '250px', }} type="button" className=" border border-1 col-12" onClick={showModal}>
                <PlusOutlined />
              </button>
            </li>
          </ul>
        </div>
        <Modal open={isModalOpen} >
          <div className="row">
            <div className="col">
              <div className=" p-4">
                <div className="row">
                  <h1 className='text-center my-2 '><u>Add Todo</u></h1>
                  <div className="col">
                    <label htmlFor="Title">Title</label>
                    <Input placeholder="Enter Title" className='form-control my-1' value={state.title} name="title" onChange={handleChange} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <label htmlFor="Date">Date</label>
                    <Input type="date" className='form-control my-1' value={state.date} name="date" onChange={handleChange} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="Color">Background Color</label>
                    <Input type="color" className='form-control my-1' value={state.color} name="color" onChange={handleChange} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="list">Add List</label>
                    <Select placeholder="Select List" className="px-1" value={state.list} onChange={list => setState(s => ({ ...s, list }))}>
                      {['personal', "work"].map((list, i) => {
                        return (<Select.Option key={i} value={list}>{list}</Select.Option>)
                      })}
                    </Select></div>
                </div>
                <div className="row ">
                  <div className="col">
                    <label htmlFor="Description">Description</label>
                    <TextArea type="text" name='description' className='my-1' value={state.description} id='Description' placeholder='Enter Description' onChange={handleChange} />
                  </div>
                </div>
                <div className="row text-center">
                  <div className="col">
                    <Button className='w-75  mt-4 mb-3' type="primary" onClick={handleSubmit} htmlType="submit" loading={isProcessing}
                    >Submit</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Content>
    </Layout>
  )
}