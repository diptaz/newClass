import React, { useState } from 'react';
import { useStore } from '../context/Store';
import { useNavigate } from 'react-router-dom';
import { Lock, User as UserIcon, Loader2 } from 'lucide-react';

export const Login = () => {
  const { login, loginWithGoogle } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials or inactive account');
      }
    } catch (e) {
      setError('An error occurred during login.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleMock = () => {
    // In a real app, this would be the Google OAuth callback
    // For this demo, we simulate a successful login from a random google user
    const mockGoogleUser = {
      email: 'student_google@gmail.com',
      name: 'Google Student User',
      googleId: '123456789'
    };
    loginWithGoogle(mockGoogleUser.email, mockGoogleUser.name, mockGoogleUser.googleId);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">AC24DIA</h1>
          <p className="text-gray-500 dark:text-gray-400">Class Management System</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter username"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 p-2.5 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2"
          >
            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-2">
           <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
           <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
           <div className="h-[1px] bg-gray-200 dark:bg-gray-700 flex-1"></div>
        </div>

        <button 
          onClick={handleGoogleMock}
          className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 font-medium py-2.5 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
            />
          </svg>
          Sign in with Gmail
        </button>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Demo Credentials:</p>
          <p>Admin: admin / password</p>
          <p>Bendahara: bendahara / password</p>
          <p>Student: student1 / password</p>
        </div>
      </div>
    </div>
  );
};