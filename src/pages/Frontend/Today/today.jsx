import React, { useState, useEffect } from 'react';
import { UserOutlined, LineChartOutlined, DoubleRightOutlined, UnorderedListOutlined, PlusOutlined, CalendarOutlined, MenuUnfoldOutlined, ClearOutlined, EditOutlined, DeleteOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { Layout, Menu, Button, Divider, theme, message } from 'antd';
import { collection, addDoc, getDocs, doc, deleteDoc, where, query } from "firebase/firestore";
import { firestore, auth } from '../../../config/firebase'
import { signOut } from 'firebase/auth';
import { useAuthContext } from "../../../context/Authcontext"
import { Link, useNavigate } from 'react-router-dom';
import dayjs from "dayjs"
const { Header, Sider, Content } = Layout;

const App = () => {
    const Navigate = useNavigate()
    const { dispatch } = useAuthContext()
    const [collapsed, setCollapsed] = useState(false);
    const [todos, setTodos] = useState([])
    const today = dayjs().format("YYYY-MM-DD")
    const getDocument = async () => {
        const q = query(collection(firestore, "todos"), where("date", "==", today));

        const querySnapshot = await getDocs(q);
        let array = []
        querySnapshot.forEach((doc) => {
            const data = doc.data()
            console.log(doc.id, " => ", doc.data());
            array.push(data)
        });
        // const querySnapshot = await getDocs(collection(firestore, "todos"));
        // querySnapshot.forEach((doc) => {
        //     // console.log(doc.id, " => ", doc.data());
        // });
        setTodos(array)
        console.log('todos', array)
    }
    useEffect(() => {
        getDocument()
    }, [])


    const handleDelete = async (todo) => {
        try {
            await deleteDoc(doc(firestore, 'todos', todo.id));
            let deletedDocument = document.filter(doc => doc.id !== todo.id)
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
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout >
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <span><Button type="text" theme="dark" icon={collapsed ? <MenuUnfoldOutlined /> : <h4 style={{ margin: "10px" }}>Menu</h4>} onClick={() => setCollapsed(!collapsed)} style={{ fontSize: '16px', margin: "10px ", width: 64, height: 70, color: "white", }}></Button></span>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} items={[
                    {
                        key: '1', icon: <UserOutlined />, label: 'Task', children: [
                            { icon: <Link to='/upcomming'><DoubleRightOutlined /></Link>, label: "Upcomming" },
                            { icon: <Link to="/today"><VerticalAlignBottomOutlined /></Link>, label: "Today" },
                            { icon: <Link to="/"><UnorderedListOutlined /></Link>, label: "Todos" },]
                    },
                    {
                        key: '2', icon: <UnorderedListOutlined />, label: 'List', children: [
                            { icon: <Link to="/personal"> <UserOutlined /></Link>, label: "Personal" },
                            { icon: <Link to="/work"><LineChartOutlined /></Link>, label: "Work" },]
                    },
                    { key: '3', icon: <ClearOutlined />, label: <p onClick={handleLogout}>Signout</p>, },]} />
            </Sider>
            <Content
                style={{ minHeight: "100vh", padding: "20px", display: "flex", flexDirection: "column", background: colorBgContainer, }}><h1>Today</h1>
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
                            </li>))}
                    </ul>
                </div>
            </Content>
        </Layout>);
};
export default App;