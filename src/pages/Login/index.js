import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../services/api';  
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const userData = await loginUser(formData);
      login(userData);
      navigate('/');
    } catch (error) {
      setError(error.message || '登入失敗，請稍後再試');
      console.error('登入失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md">
        <h2>待辦事項</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="username">使用者名稱</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="請輸入使用者名稱"
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">密碼</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="請輸入密碼"
            />
          </div>
          <button
            type="submit"
            className={isLoading ? 'loading' : ''}
            disabled={isLoading}
          >
            {isLoading ? '登入中...' : '登入'}
          </button>
          <div className="text-center mt-4">
            <span>還沒有帳號？</span>
            <button
              type="button"
              onClick={() => navigate('/register')}
            >
              立即註冊
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;