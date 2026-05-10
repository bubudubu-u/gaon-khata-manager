import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaDatabase, FaCloudUploadAlt, FaCloudDownloadAlt, FaTrash, FaUserShield } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    defaultVillage: user?.village || '',
    defaultYear: new Date().getFullYear().toString(),
    language: 'hindi',
    currencySymbol: '₹',
    landUnit: 'bigha',
    notificationsEnabled: true,
    autoBackup: false
  });
  const [saving, setSaving] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save settings to backend/localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));
      toast.success('सेटिंग्स सफलतापूर्वक सेव की गईं');
    } catch (error) {
      toast.error('सेटिंग्स सेव करने में त्रुटि');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const res = await api.get('/backup/create', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `gaon-khata-backup-${date}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('बैकअप सफलतापूर्वक डाउनलोड हुआ');
    } catch (error) {
      toast.error('बैकअप बनाने में त्रुटि');
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestore = async () => {
    if (!restoreFile) {
      toast.error('कृपया बैकअप फाइल चुनें');
      return;
    }

    setRestoring(true);
    try {
      const fileContent = await restoreFile.text();
      const data = JSON.parse(fileContent);
      await api.post('/backup/restore', data);
      toast.success('डेटा सफलतापूर्वक रिस्टोर हुआ');
      setRestoreFile(null);
    } catch (error) {
      toast.error('रिस्टोर करने में त्रुटि');
    } finally {
      setRestoring(false);
    }
  };

  const handleClearCache = () => {
    localStorage.clear();
    toast.success('कैश क्लियर किया गया');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title hindi-text">सेटिंग्स</h1>
          <p className="page-subtitle">अपनी एप्लिकेशन सेटिंग्स प्रबंधित करें</p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
        {/* General Settings */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a472a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚙️ सामान्य सेटिंग्स
          </h3>
          
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">डिफ़ॉल्ट गाँव</label>
              <input type="text" name="defaultVillage" value={settings.defaultVillage}
                onChange={handleChange} className="input-field" placeholder="गाँव का नाम" />
            </div>

            <div className="input-group">
              <label className="input-label">डिफ़ॉल्ट वर्ष</label>
              <select name="defaultYear" value={settings.defaultYear} onChange={handleChange} className="input-field">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">भाषा</label>
              <select name="language" value={settings.language} onChange={handleChange} className="input-field">
                <option value="hindi">हिंदी</option>
                <option value="english">English</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">डिफ़ॉल्ट भूमि इकाई</label>
              <select name="landUnit" value={settings.landUnit} onChange={handleChange} className="input-field">
                <option value="bigha">बीघा</option>
                <option value="acre">एकड़</option>
                <option value="hectare">हेक्टेयर</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
              <input type="checkbox" name="notificationsEnabled" checked={settings.notificationsEnabled}
                onChange={handleChange} id="notif" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <label htmlFor="notif" style={{ cursor: 'pointer', fontSize: '0.9375rem' }}>
                सूचनाएं सक्षम करें
              </label>
            </div>

            <button onClick={handleSaveSettings} className="btn btn-primary" disabled={saving}
              style={{ width: 'fit-content' }}>
              <FaSave /> {saving ? 'सेव हो रहा...' : 'सेटिंग्स सेव करें'}
            </button>
          </div>
        </motion.div>

        {/* Backup & Restore */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1a472a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaDatabase /> बैकअप और रिस्टोर
          </h3>
          
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7' }}>
              <strong style={{ color: '#92400e' }}>⚠️ महत्वपूर्ण:</strong>
              <p style={{ color: '#92400e', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                बैकअप आपके सभी डेटा (व्यक्ति, हिसाब प्रविष्टियाँ) को सेव करता है। 
                नियमित बैकअप लेते रहें।
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleBackup} className="btn btn-success" disabled={backingUp}>
                <FaCloudDownloadAlt /> {backingUp ? 'बैकअप हो रहा...' : 'बैकअप डाउनलोड करें'}
              </button>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <h4 style={{ marginBottom: '0.75rem' }}>रिस्टोर करें</h4>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="file" accept=".json" onChange={(e) => setRestoreFile(e.target.files[0])}
                  style={{ flex: 1, minWidth: '200px' }} />
                <button onClick={handleRestore} className="btn btn-warning" disabled={!restoreFile || restoring}>
                  <FaCloudUploadAlt /> {restoring ? 'रिस्टोर हो रहा...' : 'रिस्टोर करें'}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
              <input type="checkbox" name="autoBackup" checked={settings.autoBackup}
                onChange={handleChange} id="autoBackup" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <label htmlFor="autoBackup" style={{ cursor: 'pointer', fontSize: '0.9375rem' }}>
                साप्ताहिक ऑटो-बैकअप सक्षम करें
              </label>
            </div>
          </div>
        </motion.div>

        {/* Clear Data */}
        <motion.div className="glass-card" style={{ padding: '1.5rem' }}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 style={{ marginBottom: '1rem', color: '#e53e3e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaTrash /> डेटा प्रबंधित करें
          </h3>
          <p style={{ color: '#718096', fontSize: '0.875rem', marginBottom: '1rem' }}>
            कैश क्लियर करें (सेटिंग्स रीसेट होंगी, लेकिन आपका डेटा सुरक्षित रहेगा)
          </p>
          <button onClick={handleClearCache} className="btn btn-danger">
            <FaTrash /> कैश क्लियर करें
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
