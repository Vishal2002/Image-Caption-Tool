// Navbar.jsx
import React, { useContext } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import logo from '../../public/caption.png';

const Navbar = () => {
  //@ts-ignore
  const navigate = useNavigate();
  const { isLoggedIn, userName,setIsLoggedIn,setUserName } = useContext(AuthContext)

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    setIsLoggedIn(false);
    setUserName('');

    navigate('/signin');
  };

  return (
    <nav className="flex fixed z-10 border-b-2 border-black top-0 left-0 right-0 cursor-pointer sticky items-center justify-between p-4 bg-[#fff] text-black">
      <div className="flex items-center gap-2">
        <img className='h-8 w-8' src={logo} alt="ClickWorthy Logo" />
        <span style={{fontFamily:'sans-serif'}} className="text-lg font-semibold">ClickWorthy</span>
      </div>

      <div className="flex items-center cursor-pointer">
        {isLoggedIn ? (
          <>
            <span className="text-lg font-semibold mr-4">Hello, {userName}</span>
            <button 
              onClick={handleLogout} 
              className="bg-[#000] hover:bg-gray-700 text-white px-4 py-2 rounded-full"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin" className="bg-[#000] hover:bg-gray-700 text-white px-4 py-2 rounded-full mr-4">Sign In</Link>
            <Link to="/signup" className="bg-[#000] hover:bg-gray-700 text-white px-4 py-2 rounded-full">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;