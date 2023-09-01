import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import './App.scss';
import { useAuthContext } from './context/Authcontext';
import Routes from './pages/Frontend/Routes';
function App() {
  const {isApploading}=useAuthContext()
  if(isApploading){
    return (<div className="loader-container">
    <span className="loader"></span>
  </div>)
  }
  return (
    <>
    <Routes />
    </>
  );
}

export default App;
