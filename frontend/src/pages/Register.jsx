import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', { name, email, password });
      navigate('/login'); // redirect after successful register
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Name" className="w-full mb-3 p-2 bg-gray-800 text-white border border-gray-700 rounded" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full mb-3 p-2 bg-gray-800 text-white border border-gray-700 rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full mb-3 p-2 bg-gray-800 text-white border border-gray-700 rounded" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:cursor-pointer">Register</button>
      </form>
    </div>
  );
};

export default Register;