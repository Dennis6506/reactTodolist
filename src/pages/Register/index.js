import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';
import './register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('密碼不一致');
      return;
    }

    setIsLoading(true);
    
    try {
      await registerUser({
        username: formData.username,
        password: formData.password
      });
      navigate('/login');
    } catch (error) {
      setError(error.message || '註冊失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md">
        <h2>註冊帳號</h2>
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
          <div className="input-container">
            <label htmlFor="confirmPassword">確認密碼</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="請再次輸入密碼"
            />
          </div>
          <button
            type="submit"
            className={isLoading ? 'loading' : ''}
            disabled={isLoading}
          >
            {isLoading ? '註冊中...' : '註冊'}
          </button>
          <div className="text-center mt-4">
            <span>已有帳號？</span>
            <button
              type="button"
              onClick={() => navigate('/login')}
            >
              返回登入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;