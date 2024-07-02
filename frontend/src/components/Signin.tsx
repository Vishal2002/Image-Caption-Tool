import {useState,useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../api/apiService';
import { AuthContext } from '../AuthContext';
const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserName } = useContext(AuthContext);
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.username);
      toast.success('Signed in successfully');
      setIsLoggedIn(true);
      setUserName(data.username);
      navigate('/');
     
    } catch (error:any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="flex items-center  justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 w-[30%] rounded-xl text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Sign in to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                id="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col items-baseline justify-between">
              <button className="px-6 py-2 mt-4 text-white w-full bg-blue-600 rounded-lg hover:bg-blue-900" type="submit">Sign In</button>
              <Link to="/signup" className="text-sm text-blue-600 hover:underline">Don't have an account? Sign up</Link>
            </div>
          </div>
        </form>
        <div className="mt-6">
          <button 
            onClick={() => window.location.href = '/auth/google'}
            className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;