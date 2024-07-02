import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signup } from '../api/apiService';
const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      toast.success('Signed up successfully');
      navigate('/signin');
    } catch (error:any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center  justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 w-[30%] mt-4 rounded-xl text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Create an account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Name"
                id="name"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
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
              <button className="px-6 w-full py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900" type="submit">Sign Up</button>
              <Link to="/signin" className="text-sm text-blue-600 hover:underline">Already have an account? Sign in</Link>
            </div>
          </div>
        </form>
        <div className="mt-6">
          <button 
            onClick={() => window.location.href = '/auth/google'}
            className="w-full px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;