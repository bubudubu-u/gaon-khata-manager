import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaArrowLeft, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const PersonForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    village: '',
    mobile: '',
    aadharNumber: '',
    address: '',
    notes: '',
    totalLand: ''
  });
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchPerson();
    }
  }, [id]);

  const fetchPerson = async () => {
    try {
      const res = await api.get(`/persons/${id}`);
      const person = res.data.data.person;
      setFormData({
        name: person.name || '',
        fatherName: person.fatherName || '',
        village: person.village || '',
        mobile: person.mobile || '',
        aadharNumber: person.aadharNumber || '',
        address: person.address || '',
        notes: person.notes || '',
        totalLand: person.totalLand || ''
      });
      if (person.photo) {
        setPhotoPreview(person.photo);
      }
    } catch (error) {
      toast.error('व्यक्ति विवरण लोड करने में त्रुटि');
      navigate('/persons');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.fatherName.trim() || !formData.village.trim()) {
      toast.error('कृपया सभी आवश्यक फ़ील्ड भरें');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/persons/${id}`, formData);
        toast.success('व्यक्ति अपडेट किया गया');
      } else {
        await api.post('/persons', formData);
        toast.success('नया व्यक्ति जोड़ा गया');
      }
      navigate('/persons');
    } catch (error) {
      toast.error(error.response?.data?.error || 'सेव करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="page-header">
        <div>
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '0.5rem' }}>
            <FaArrowLeft /> वापस
          </button>
          <h1 className="page-title hindi-text">
            {isEdit ? 'व्यक्ति संपादित करें' : 'नया व्यक्ति जोड़ें'}
          </h1>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px' }}>
        {/* Photo Upload */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            background: photoPreview ? `url(${photoPreview})` : '#e2e8f0',
            backgroundSize: 'cover', backgroundPosition: 'center',
            margin: '0 auto', position: 'relative',
            border: '3px solid #1a472a'
          }}>
            <label style={{
              position: 'absolute', bottom: '0', right: '0',
              background: '#1a472a', color: 'white',
              width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
            }}>
              <FaCamera />
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </label>
          </div>
          <p style={{ marginTop: '0.5rem', color: '#718096', fontSize: '0.8125rem' }}>
            फोटो अपलोड करें (वैकल्पिक)
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">नाम *</label>
              <input type="text" name="name" value={formData.name}
                onChange={handleChange} className="input-field"
                placeholder="पूरा नाम" required />
            </div>

            <div className="input-group">
              <label className="input-label">पिता का नाम *</label>
              <input type="text" name="fatherName" value={formData.fatherName}
                onChange={handleChange} className="input-field"
                placeholder="पिता का नाम" required />
            </div>

            <div className="input-group">
              <label className="input-label">गाँव *</label>
              <input type="text" name="village" value={formData.village}
                onChange={handleChange} className="input-field"
                placeholder="गाँव का नाम" required />
            </div>

            <div className="input-group">
              <label className="input-label">मोबाइल नंबर</label>
              <input type="tel" name="mobile" value={formData.mobile}
                onChange={handleChange} className="input-field"
                placeholder="10 अंक" maxLength="10" />
            </div>

            <div className="input-group">
              <label className="input-label">आधार नंबर</label>
              <input type="text" name="aadharNumber" value={formData.aadharNumber}
                onChange={handleChange} className="input-field"
                placeholder="12 अंक" maxLength="12" />
            </div>

            <div className="input-group">
              <label className="input-label">कुल ज़मीन (बीघा)</label>
              <input type="number" name="totalLand" value={formData.totalLand}
                onChange={handleChange} className="input-field"
                placeholder="बीघा में" min="0" step="0.01" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">पता</label>
            <textarea name="address" value={formData.address}
              onChange={handleChange} className="input-field"
              placeholder="पूरा पता" rows="2" />
          </div>

          <div className="input-group">
            <label className="input-label">नोट्स</label>
            <textarea name="notes" value={formData.notes}
              onChange={handleChange} className="input-field"
              placeholder="कोई अतिरिक्त जानकारी" rows="3" maxLength="500" />
            <small style={{ color: '#718096' }}>{formData.notes.length}/500</small>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FaSave /> {loading ? 'सेव हो रहा है...' : 'सेव करें'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
              रद्द करें
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PersonForm;
