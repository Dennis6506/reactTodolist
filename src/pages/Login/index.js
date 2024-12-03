import React, { useState } from 'react';
import './login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
    
    // 模擬 API 請求
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login attempt:', formData);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md">
        <h2>登入系統</h2>
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
        </form>
      </div>
    </div>
  );
};

export default Login;