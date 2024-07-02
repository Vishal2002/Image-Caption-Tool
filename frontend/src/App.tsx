import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Signup from './components/Signup';
import NoPage from './components/NoPage';
import { AuthProvider } from './AuthContext';
const App = () => {
  

  return (
    <AuthProvider>
    <BrowserRouter>
    <div className="h-screen">
      <Navbar />
      
      <Routes>
      <Route path='/' element={<HeroSection/>}/>
      <Route path='Signin' element={<Signin/>} />
      <Route path='Signup' element={<Signup/>}/>
      <Route path='*' element={<NoPage/>}/>

      </Routes>
      
      <ToastContainer />
    </div>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
