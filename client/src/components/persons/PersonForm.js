import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaHome, FaIdCard, FaStickyNote, FaRuler } from 'react-icons/fa';
import InputField from '../forms/InputField';
import FileUpload from '../forms/FileUpload';
import toast from 'react-hot-toast';
import api from '../../utils/axiosConfig';
import { validateName, validateMobile, validateVillage, validateAadhar, validateNotes } from '../../utils/validators';

const PersonFormComponent = ({ initialData = {}, onSave, onCancel, isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    fatherName: initialData.fatherName || '',
    village: initialData.village || '',
    mobile: initialData.mobile || '',
    aadharNumber: initialData.aadharNumber || '',
    address: initialData.address || '',
    notes: initialData.notes || '',
    totalLand: initialData.totalLand || ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const fatherError = validateName(formData.fatherName);
    if (fatherError) newErrors.fatherName = 'पिता का नाम आवश्यक है';
    
    const villageError = validateVillage(formData.village);
    if (villageError) newErrors.village = villageError;
    
    if (formData.mobile) {
      const mobileError = validateMobile(formData.mobile);
      if (mobileError) newErrors.mobile = mobileError;
    }
    
    if (formData.aadharNumber) {
      const aadharError = validateAadhar(formData.aadharNumber);
      if (aadharError) newErrors.aadharNumber = aadharError;
    }
    
    if (formData.notes) {
      const notesError = validateNotes(formData.notes);
      if (notesError) newErrors.notes = notesError;
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
      let personData = { ...formData };
      
      if (isEdit && initialData._id) {
        const res = await api.put(`/persons/${initialData._id}`, personData);
        toast.success('व्यक्ति अपडेट किया गया');
        if (onSave) onSave(res.data.data);
      } else {
        const res = await api.post('/persons', personData);
        toast.success('नया व्यक्ति जोड़ा गया');
        if (onSave) onSave(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'सेव करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (file) => {
    setPhoto(file);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'grid', gap: '1.25rem' }}
    >
      {/* Photo Upload */}
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <FileUpload
          label="फोटो अपलोड करें (वैकल्पिक)"
          accept="image/*"
          maxSize={3 * 1024 * 1024}
          onFileSelect={handlePhotoSelect}
          preview={true}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
        <InputField
          label="नाम"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="पूरा नाम दर्ज करें"
          required
          icon={<FaUser />}
          error={errors.name}
        />

        <InputField
          label="पिता का नाम"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          placeholder="पिता का नाम दर्ज करें"
          required
          icon={<FaUser />}
          error={errors.fatherName}
        />

        <InputField
          label="गाँव"
          name="village"
          value={formData.village}
          onChange={handleChange}
          placeholder="गाँव का नाम दर्ज करें"
          required
          icon={<FaHome />}
          error={errors.village}
        />

        <InputField
          label="मोबाइल नंबर"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="10 अंकों का मोबाइल नंबर"
          icon={<FaPhone />}
          maxLength={10}
          error={errors.mobile}
          hint="उदाहरण: 9876543210"
        />

        <InputField
          label="आधार नंबर"
          name="aadharNumber"
          value={formData.aadharNumber}
          onChange={handleChange}
          placeholder="12 अंकों का आधार नंबर"
          icon={<FaIdCard />}
          maxLength={12}
          error={errors.aadharNumber}
        />

        <InputField
          label="कुल ज़मीन (बीघा में)"
          name="totalLand"
          type="number"
          value={formData.totalLand}
          onChange={handleChange}
          placeholder="बीघा में ज़मीन का आकार"
          icon={<FaRuler />}
          min={0}
          step="0.01"
        />
      </div>

      <InputField
        label="पूरा पता"
        name="address"
        type="textarea"
        value={formData.address}
        onChange={handleChange}
        placeholder="पूरा पता दर्ज करें"
        rows={2}
      />

      <InputField
        label="नोट्स"
        name="notes"
        type="textarea"
        value={formData.notes}
        onChange={handleChange}
        placeholder="कोई अतिरिक्त जानकारी"
        maxLength={500}
        error={errors.notes}
        hint={`${formData.notes.length}/500 अक्षर`}
        rows={3}
      />

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
          style={{ flex: 1 }}
        >
          {loading ? 'सेव हो रहा है...' : isEdit ? 'अपडेट करें' : 'सेव करें'}
        </button>
        
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            रद्द करें
          </button>
        )}
      </div>
    </motion.form>
  );
};

export default PersonFormComponent;
