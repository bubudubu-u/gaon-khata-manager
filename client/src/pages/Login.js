import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('कृपया ईमेल और पासवर्ड दर्ज करें');
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card"
      style={{ padding: '2.5rem' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <FaLeaf style={{ fontSize: '2rem', color: '#1a472a', marginBottom: '0.5rem' }} />
        <h2 style={{ color: '#1a472a', fontWeight: 700, fontSize: '1.5rem' }}>
          लॉग इन करें
        </h2>
        <p style={{ color: '#718096', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          अपने अकाउंट में प्रवेश करें
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">ईमेल</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0aec0'
            }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="उदा: ram@example.com"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">पासवर्ड</label>
          <div style={{ position: 'relative' }}>
            <FaLock style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0aec0'
            }} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading ? 'लॉगिन हो रहा है...' : 'लॉग इन करें'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ color: '#718096', fontSize: '0.875rem' }}>
          अकाउंट नहीं है?{' '}
          <Link to="/register" style={{ color: '#1a472a', fontWeight: 600, textDecoration: 'none' }}>
            रजिस्टर करें
          </Link>
        </p>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f0f4f1',
        borderRadius: '8px',
        fontSize: '0.8125rem',
        color: '#4a5568'
      }}>
        <strong>डेमो अकाउंट:</strong><br />
        ईमेल: admin@gaonkhata.com<br />
        पासवर्ड: admin123
      </div>
    </motion.div>
  );
};

export default Login;
