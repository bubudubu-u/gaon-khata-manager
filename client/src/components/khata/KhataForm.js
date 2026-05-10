import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRupeeSign, FaCalendarAlt, FaMapMarkerAlt, FaStickyNote, FaUser, FaRuler } from 'react-icons/fa';
import InputField from '../forms/InputField';
import SelectField from '../forms/SelectField';
import PersonSearch from '../persons/PersonSearch';
import FileUpload from '../forms/FileUpload';
import toast from 'react-hot-toast';
import api from '../../utils/axiosConfig';
import { validateAmount, validateYear, validateLandSize, validateRate, validateNotes } from '../../utils/validators';

const KhataFormComponent = ({ initialData = {}, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    person: initialData.person || '',
    personName: initialData.person?.name || '',
    entryType: initialData.entryType || 'charha',
    date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    year: initialData.year || new Date().getFullYear().toString(),
    season: initialData.season || 'full_year',
    landDetails: {
      size: initialData.landDetails?.size || '',
      unit: initialData.landDetails?.unit || 'bigha',
      khasraNumber: initialData.landDetails?.khasraNumber || '',
      landType: initialData.landDetails?.landType || 'sinchit'
    },
    financials: {
      rate: initialData.financials?.rate || '',
      rateUnit: initialData.financials?.rateUnit || 'per_bigha',
      totalAmount: initialData.financials?.totalAmount || '',
      paidAmount: initialData.financials?.paidAmount || '',
      paymentMode: initialData.financials?.paymentMode || 'cash'
    },
    description: initialData.description || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePersonSelect = (person) => {
    setFormData(prev => ({
      ...prev,
      person: person ? person._id : '',
      personName: person ? person.name : ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.person) {
      newErrors.person = 'कृपया व्यक्ति चुनें';
    }

    const amountError = validateAmount(formData.financials.totalAmount);
    if (amountError) newErrors['financials.totalAmount'] = amountError;

    const yearError = validateYear(formData.year);
    if (yearError) newErrors.year = yearError;

    if (formData.landDetails.size) {
      const sizeError = validateLandSize(formData.landDetails.size);
      if (sizeError) newErrors['landDetails.size'] = sizeError;
    }

    if (formData.financials.rate) {
      const rateError = validateRate(formData.financials.rate);
      if (rateError) newErrors['financials.rate'] = rateError;
    }

    if (formData.description) {
      const notesError = validateNotes(formData.description);
      if (notesError) newErrors.description = notesError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('कृपया सभी त्रुटियों को ठीक करें');
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

      if (isEdit && initialData._id) {
        const res = await api.put(`/khata/${initialData._id}`, data);
        toast.success('हिसाब प्रविष्टि अपडेट की गई');
        if (onSave) onSave(res.data.data);
      } else {
        const res = await api.post('/khata', data);
        toast.success('नई हिसाब प्रविष्टि जोड़ी गई');
        if (onSave) onSave(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'सेव करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const entryTypeOptions = [
    { value: 'charha', label: 'चरहा (Charha)' },
    { value: 'batai', label: 'बटाई (Batai)' },
    { value: 'patta', label: 'पट्टा (Patta)' },
    { value: 'bakaya', label: 'बकाया (Bakaya)' },
    { value: 'payment', label: 'भुगतान (Payment)' },
    { value: 'other', label: 'अन्य (Other)' }
  ];

  const seasonOptions = [
    { value: 'rabi', label: 'रबी (Rabi)' },
    { value: 'kharif', label: 'खरीफ (Kharif)' },
    { value: 'zaid', label: 'जायद (Zaid)' },
    { value: 'full_year', label: 'पूर्ण वर्ष (Full Year)' }
  ];

  const landUnitOptions = [
    { value: 'bigha', label: 'बीघा' },
    { value: 'acre', label: 'एकड़' },
    { value: 'hectare', label: 'हेक्टेयर' },
    { value: 'biswa', label: 'बिस्वा' }
  ];

  const landTypeOptions = [
    { value: 'sinchit', label: 'सिंचित' },
    { value: 'asinchit', label: 'असिंचित' },
    { value: 'banjar', label: 'बंजर' },
    { value: 'charagah', label: 'चारागाह' },
    { value: 'other', label: 'अन्य' }
  ];

  const paymentModeOptions = [
    { value: 'cash', label: 'नकद (Cash)' },
    { value: 'bank_transfer', label: 'बैंक ट्रांसफर' },
    { value: 'cheque', label: 'चेक' },
    { value: 'upi', label: 'UPI' },
    { value: 'other', label: 'अन्य' }
  ];

  const rateUnitOptions = [
    { value: 'per_bigha', label: 'प्रति बीघा' },
    { value: 'per_acre', label: 'प्रति एकड़' },
    { value: 'total', label: 'कुल राशि' },
    { value: 'per_quintal', label: 'प्रति क्विंटल' },
    { value: 'percentage', label: 'प्रतिशत' }
  ];

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'grid', gap: '1.5rem' }}
    >
      {/* Person Selection */}
      <div className="input-group">
        <label className="input-label">
          व्यक्ति चुनें <span style={{ color: '#e53e3e' }}>*</span>
        </label>
        <PersonSearch
          onSelect={handlePersonSelect}
          placeholder="नाम से व्यक्ति खोजें..."
        />
        {errors.person && (
          <p style={{ color: '#e53e3e', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{errors.person}</p>
        )}
      </div>

      {/* Basic Details Section */}
      <div style={{
        padding: '1.25rem', background: '#f0f4f1', borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 1rem', color: '#1a472a', fontSize: '1rem' }}>
          📋 मूल विवरण
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <SelectField
            label="प्रकार"
            name="entryType"
            value={formData.entryType}
            onChange={handleChange}
            options={entryTypeOptions}
            required
          />

          <InputField
            label="दिनांक"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
            icon={<FaCalendarAlt />}
          />

          <InputField
            label="वर्ष"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            required
            min={2000}
            max={2099}
            error={errors.year}
          />

          <SelectField
            label="मौसम"
            name="season"
            value={formData.season}
            onChange={handleChange}
            options={seasonOptions}
          />
        </div>
      </div>

      {/* Land Details Section */}
      <div style={{
        padding: '1.25rem', background: '#f0f4f1', borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}>
        <h4 style={{ margin: '0 0 1rem', color: '#1a472a', fontSize: '1rem' }}>
          🏞️ भूमि विवरण
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <InputField
            label="ज़मीन का आकार"
            name="landDetails.size"
            type="number"
            value={formData.landDetails.size}
            onChange={handleChange}
            placeholder="0.00"
            min={0}
            step="0.01"
            icon={<FaRuler />}
            error={errors['landDetails.size']}
          />

          <SelectField
            label="इकाई"
            name="landDetails.unit"
            value={formData.landDetails.unit}
            onChange={handleChange}
            options={landUnitOptions}
          />

          <InputField
            label="खसरा नंबर"
            name="landDetails.khasraNumber"
            value={formData.landDetails.khasraNumber}
            onChange={handleChange}
            placeholder="KH-123"
            icon={<FaMapMarkerAlt />}
          />

          <SelectField
            label="भूमि प्रकार"
            name="landDetails.landType"
            value={formData.landDetails.landType}
            onChange={handleChange}
            options={landTypeOptions}
          />
        </div>
      </div>

      {/* Financial Details Section */}
      <div style={{
        padding: '1.25rem', background: '#fffbf0', borderRadius: '12px',
        border: '1px solid #fef3c7'
      }}>
        <h4 style={{ margin: '0 0 1rem', color: '#92400e', fontSize: '1rem' }}>
          💰 राशि विवरण
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <InputField
            label="कुल राशि"
            name="financials.totalAmount"
            type="number"
            value={formData.financials.totalAmount}
            onChange={handleChange}
            placeholder="0.00"
            required
            min={0}
            icon={<FaRupeeSign />}
            error={errors['financials.totalAmount']}
          />

          <InputField
            label="भुगतान की गई राशि"
            name="financials.paidAmount"
            type="number"
            value={formData.financials.paidAmount}
            onChange={handleChange}
            placeholder="0.00"
            min={0}
            icon={<FaRupeeSign />}
          />

          <InputField
            label="दर"
            name="financials.rate"
            type="number"
            value={formData.financials.rate}
            onChange={handleChange}
            placeholder="0.00"
            min={0}
            icon={<FaRupeeSign />}
            error={errors['financials.rate']}
          />

          <SelectField
            label="दर इकाई"
            name="financials.rateUnit"
            value={formData.financials.rateUnit}
            onChange={handleChange}
            options={rateUnitOptions}
          />

          <SelectField
            label="भुगतान का तरीका"
            name="financials.paymentMode"
            value={formData.financials.paymentMode}
            onChange={handleChange}
            options={paymentModeOptions}
          />
        </div>
      </div>

      {/* Description */}
      <InputField
        label="विवरण"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleChange}
        placeholder="कोई अतिरिक्त जानकारी या नोट्स"
        maxLength={500}
        icon={<FaStickyNote />}
        error={errors.description}
        hint={`${formData.description.length}/500 अक्षर`}
        rows={3}
      />

      {/* File Upload */}
      <FileUpload
        label="दस्तावेज़ अपलोड करें (वैकल्पिक)"
        accept="image/*,.pdf,.doc,.docx"
        maxSize={5 * 1024 * 1024}
        multiple={true}
        onFileSelect={(files) => setAttachments(files)}
        preview={true}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ flex: 1, padding: '0.875rem' }}
        >
          {loading ? (
            <>⏳ सेव हो रहा है...</>
          ) : isEdit ? (
            <>✏️ अपडेट करें</>
          ) : (
            <>💾 सेव करें</>
          )}
        </button>
        
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
            style={{ flex: 1, padding: '0.875rem' }}
          >
            ❌ रद्द करें
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default KhataFormComponent;
