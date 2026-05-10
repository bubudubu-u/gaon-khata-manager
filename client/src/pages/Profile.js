import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaKey, FaSave, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    village: '',
    phone: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        village: user.village || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/updatedetails', profile);
      toast.success('प्रोफ़ाइल अपडेट की गई');
    } catch (error) {
      toast.error(error.response?.data?.error || 'अपडेट करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('नया पासवर्ड मेल नहीं खा रहा');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/auth/updatepassword', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success('पासवर्ड बदला गया');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'पासवर्ड बदलने में त्रुटि');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title hindi-text">प्रोफ़ाइल</h1>
          <p className="page-subtitle">अपनी प्रोफ़ाइल और पासवर्ड प्रबंधित करें</p>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: photoPreview ? `url(${photoPreview})` : 'linear-gradient(135deg, #1a472a, #40916c)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          margin: '0 auto', position: 'relative', border: '4px solid white',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          {!photoPreview && (
            <span style={{ color: 'white', fontSize: '3rem', fontWeight: 700, lineHeight: '120px' }}>
              {profile.name?.charAt(0) || '?'}
            </span>
          )}
          <label style={{
            position: 'absolute', bottom: '0', right: '0',
            background: '#1a472a', color: 'white',
            width: '40px', height: '40px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', border: '3px solid white'
          }}>
            <FaCamera />
            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
          </label>
        </div>
        <h2 style={{ marginTop: '1rem', color: '#1a472a' }}>{profile.name}</h2>
        <p style={{ color: '#718096' }}>{profile.village}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('profile')}
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '8px 0 0 8px', flex: 1 }}>
          <FaUser /> प्रोफ़ाइल
        </button>
        <button onClick={() => setActiveTab('password')}
          className={`btn ${activeTab === 'password' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderRadius: '0 8px 8px 0', flex: 1 }}>
          <FaKey /> पासवर्ड
        </button>
      </div>

      {/* Profile Form */}
      {activeTab === 'profile' && (
        <motion.div className="glass-card" style={{ padding: '2rem' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleUpdateProfile}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label"><FaUser style={{ marginRight: '0.5rem' }} />नाम</label>
                <input type="text" name="name" value={profile.name}
                  onChange={handleProfileChange} className="input-field" required />
              </div>

              <div className="input-group">
                <label className="input-label"><FaEnvelope style={{ marginRight: '0.5rem' }} />ईमेल</label>
                <input type="email" name="email" value={profile.email}
                  onChange={handleProfileChange} className="input-field" disabled
                  style={{ background: '#f7fafc', cursor: 'not-allowed' }} />
                <small style={{ color: '#718096' }}>ईमेल बदला नहीं जा सकता</small>
              </div>

              <div className="input-group">
                <label className="input-label"><FaHome style={{ marginRight: '0.5rem' }} />गाँव</label>
                <input type="text" name="village" value={profile.village}
                  onChange={handleProfileChange} className="input-field" />
              </div>

              <div className="input-group">
                <label className="input-label"><FaPhone style={{ marginRight: '0.5rem' }} />फ़ोन</label>
                <input type="tel" name="phone" value={profile.phone}
                  onChange={handleProfileChange} className="input-field" maxLength="10" />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}
                style={{ width: 'fit-content' }}>
                <FaSave /> {loading ? 'सेव हो रहा...' : 'प्रोफ़ाइल अपडेट करें'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Password Form */}
      {activeTab === 'password' && (
        <motion.div className="glass-card" style={{ padding: '2rem' }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleChangePassword}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">वर्तमान पासवर्ड</label>
                <input type="password" name="currentPassword" value={passwords.currentPassword}
                  onChange={handlePasswordChange} className="input-field" required />
              </div>

              <div className="input-group">
                <label className="input-label">नया पासवर्ड</label>
                <input type="password" name="newPassword" value={passwords.newPassword}
                  onChange={handlePasswordChange} className="input-field" minLength="6" required />
                <small style={{ color: '#718096' }}>कम से कम 6 अक्षर</small>
              </div>

              <div className="input-group">
                <label className="input-label">नया पासवर्ड दोबारा</label>
                <input type="password" name="confirmPassword" value={passwords.confirmPassword}
                  onChange={handlePasswordChange} className="input-field" required />
              </div>

              <button type="submit" className="btn btn-warning" disabled={passwordLoading}
                style={{ width: 'fit-content' }}>
                <FaKey /> {passwordLoading ? 'बदल रहा...' : 'पासवर्ड बदलें'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Logout Button */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button onClick={logout} className="btn btn-danger">
          लॉगआउट करें
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
