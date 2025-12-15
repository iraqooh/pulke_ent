import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logging, setLogging] = useState(false)
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (logging) return
    setLogging(true)
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      alert(`${err}: Login failed`);
    } finally {
      setLogging(false)
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-xl">
      <h2 className="text-3xl font-bold mb-6">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button 
          type="submit" 
          disabled={logging}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded font-bold transition cursor-pointer
          ${
              logging
                ? 'bg-blue-800 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}>
          {logging && (
            <span
              className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
          )}
          {logging ? 'Signing you in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}