import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaHome } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    village: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('कृपया नाम दर्ज करें');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('कृपया ईमेल दर्ज करें');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('पासवर्ड मेल नहीं खा रहे');
      return false;
    }
    if (!formData.village.trim()) {
      toast.error('कृपया गाँव का नाम दर्ज करें');
      return false;
    }
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('कृपया सही मोबाइल नंबर दर्ज करें');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
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
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌾</div>
        <h2 style={{ color: '#1a472a', fontWeight: 700, fontSize: '1.5rem' }}>
          रजिस्टर करें
        </h2>
        <p style={{ color: '#718096', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          नया अकाउंट बनाएं
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">पूरा नाम *</label>
          <div style={{ position: 'relative' }}>
            <FaUser style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: '#a0aec0'
            }} />
            <input
              type="text" name="name" value={formData.name}
              onChange={handleChange} className="input-field"
              placeholder="उदा: राम सिंह" style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">ईमेल *</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: '#a0aec0'
            }} />
            <input
              type="email" name="email" value={formData.email}
              onChange={handleChange} className="input-field"
              placeholder="उदा: ram@example.com" style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">गाँव का नाम *</label>
          <div style={{ position: 'relative' }}>
            <FaHome style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: '#a0aec0'
            }} />
            <input
              type="text" name="village" value={formData.village}
              onChange={handleChange} className="input-field"
              placeholder="उदा: रामपुर" style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">मोबाइल नंबर (वैकल्पिक)</label>
          <div style={{ position: 'relative' }}>
            <FaPhone style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: '#a0aec0'
            }} />
            <input
              type="tel" name="phone" value={formData.phone}
              onChange={handleChange} className="input-field"
              placeholder="10 अंकों का नंबर" maxLength="10"
              style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">पासवर्ड *</label>
          <div style={{ position: 'relative' }}>
            <FaLock style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: '#a0aec0'
            }} />
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} className="input-field"
              placeholder="कम से कम 6 अक्षर" style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">पासवर्ड दोबारा *</label>
          <div style={{ position: 'relative' }}>
            <FaLock style={{
              position: 'absolute', left: '1rem', top: '50%',
              transform: 'translateY(-50%)', color: '#a0aec0'
            }} />
            <input
              type="password" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} className="input-field"
              placeholder="पासवर्ड दोबारा लिखें" style={{ paddingLeft: '2.75rem' }}
            />
          </div>
        </div>

        <button
          type="submit" className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
          disabled={loading}
        >
          {loading ? 'रजिस्टर हो रहा है...' : 'रजिस्टर करें'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <p style={{ color: '#718096', fontSize: '0.875rem' }}>
          पहले से अकाउंट है?{' '}
          <Link to="/login" style={{ color: '#1a472a', fontWeight: 600, textDecoration: 'none' }}>
            लॉग इन करें
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
