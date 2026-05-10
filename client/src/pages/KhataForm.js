import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';

const KhataForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    person: searchParams.get('personId') || '',
    entryType: 'charha',
    date: new Date().toISOString().split('T')[0],
    year: new Date().getFullYear().toString(),
    season: 'full_year',
    landDetails: {
      size: '',
      unit: 'bigha',
      khasraNumber: '',
      landType: 'sinchit'
    },
    financials: {
      rate: '',
      rateUnit: 'per_bigha',
      totalAmount: '',
      paidAmount: '',
      paymentMode: 'cash'
    },
    description: ''
  });

  useEffect(() => {
    fetchPersons();
    if (isEdit) fetchEntry();
  }, [id]);

  const fetchPersons = async () => {
    try {
      const res = await api.get('/persons', { params: { limit: 100 } });
      setPersons(res.data.data);
    } catch (error) {
      toast.error('व्यक्ति लोड करने में त्रुटि');
    }
  };

  const fetchEntry = async () => {
    try {
      const res = await api.get(`/khata/${id}`);
      const entry = res.data.data;
      setFormData({
        person: entry.person?._id || entry.person,
        entryType: entry.entryType,
        date: new Date(entry.date).toISOString().split('T')[0],
        year: entry.year.toString(),
        season: entry.season || 'full_year',
        landDetails: { ...entry.landDetails },
        financials: {
          rate: entry.financials.rate || '',
          rateUnit: entry.financials.rateUnit || 'per_bigha',
          totalAmount: entry.financials.totalAmount,
          paidAmount: entry.financials.paidAmount || '',
          paymentMode: entry.financials.paymentMode || 'cash'
        },
        description: entry.description || ''
      });
    } catch (error) {
      toast.error('प्रविष्टि लोड करने में त्रुटि');
      navigate('/khata');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.person) {
      toast.error('कृपया व्यक्ति चुनें');
      return;
    }
    if (!formData.financials.totalAmount) {
      toast.error('कृपया राशि दर्ज करें');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...formData,
        year: parseInt(formData.year),
        landDetails: {
          ...formData.landDetails,
          size: parseFloat(formData.landDetails.size) || 0
        },
        financials: {
          ...formData.financials,
          rate: parseFloat(formData.financials.rate) || 0,
          totalAmount: parseFloat(formData.financials.totalAmount),
          paidAmount: parseFloat(formData.financials.paidAmount) || 0
        }
      };

      if (isEdit) {
        await api.put(`/khata/${id}`, data);
        toast.success('प्रविष्टि अपडेट की गई');
      } else {
        await api.post('/khata', data);
        toast.success('नई प्रविष्टि जोड़ी गई');
      }
      navigate('/khata');
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
            {isEdit ? 'हिसाब संपादित करें' : 'नया हिसाब जोड़ें'}
          </h1>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', maxWidth: '900px' }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="input-group">
              <label className="input-label">व्यक्ति चुनें *</label>
              <select name="person" value={formData.person} onChange={handleChange} className="input-field" required>
                <option value="">-- व्यक्ति चुनें --</option>
                {persons.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.name} - {p.fatherName} ({p.village})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">प्रकार *</label>
              <select name="entryType" value={formData.entryType} onChange={handleChange} className="input-field" required>
                <option value="charha">चरहा</option>
                <option value="batai">बटाई</option>
                <option value="patta">पट्टा</option>
                <option value="bakaya">बकाया</option>
                <option value="payment">भुगतान</option>
                <option value="other">अन्य</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">दिनांक *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" required />
            </div>

            <div className="input-group">
              <label className="input-label">वर्ष *</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className="input-field" min="2000" max="2099" required />
            </div>
          </div>

          {/* Land Details */}
          <h3 style={{ marginBottom: '1rem', color: '#1a472a' }}>भूमि विवरण</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="input-group">
              <label className="input-label">ज़मीन का आकार</label>
              <input type="number" name="landDetails.size" value={formData.landDetails.size} onChange={handleChange} className="input-field" step="0.01" min="0" />
            </div>
            <div className="input-group">
              <label className="input-label">इकाई</label>
              <select name="landDetails.unit" value={formData.landDetails.unit} onChange={handleChange} className="input-field">
                <option value="bigha">बीघा</option>
                <option value="acre">एकड़</option>
                <option value="hectare">हेक्टेयर</option>
                <option value="biswa">बिस्वा</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">खसरा नंबर</label>
              <input type="text" name="landDetails.khasraNumber" value={formData.landDetails.khasraNumber} onChange={handleChange} className="input-field" />
            </div>
          </div>

          {/* Financial Details */}
          <h3 style={{ marginBottom: '1rem', color: '#1a472a' }}>राशि विवरण</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="input-group">
              <label className="input-label">कुल राशि *</label>
              <input type="number" name="financials.totalAmount" value={formData.financials.totalAmount} onChange={handleChange} className="input-field" min="0" required />
            </div>
            <div className="input-group">
              <label className="input-label">भुगतान की गई राशि</label>
              <input type="number" name="financials.paidAmount" value={formData.financials.paidAmount} onChange={handleChange} className="input-field" min="0" />
            </div>
            <div className="input-group">
              <label className="input-label">दर</label>
              <input type="number" name="financials.rate" value={formData.financials.rate} onChange={handleChange} className="input-field" min="0" />
            </div>
            <div className="input-group">
              <label className="input-label">भुगतान का तरीका</label>
              <select name="financials.paymentMode" value={formData.financials.paymentMode} onChange={handleChange} className="input-field">
                <option value="cash">नकद</option>
                <option value="bank_transfer">बैंक ट्रांसफर</option>
                <option value="cheque">चेक</option>
                <option value="upi">UPI</option>
                <option value="other">अन्य</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">विवरण</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="3" placeholder="कोई अतिरिक्त जानकारी" maxLength="500" />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <FaSave /> {loading ? 'सेव हो रहा है...' : 'सेव करें'}
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">रद्द करें</button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default KhataForm;
