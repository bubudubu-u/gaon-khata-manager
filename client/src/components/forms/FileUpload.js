import React, { useState } from 'react';
import { FaCloudUploadAlt, FaFile, FaTimes, FaTrash } from 'react-icons/fa';
import { formatFileSize } from '../../utils/formatters';

const FileUpload = ({
  label,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024,
  multiple = false,
  onFileSelect,
  preview = true,
  error = '',
  className = ''
}) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles) => {
    const validFiles = [];
    const newPreviews = [];

    selectedFiles.forEach(file => {
      if (file.size > maxSize) {
        alert(`${file.name} का आकार ${formatFileSize(maxSize)} से बड़ा है`);
        return;
      }

      const validTypes = accept.split(',').map(t => t.trim());
      const fileType = file.type;
      const fileExt = '.' + file.name.split('.').pop();
      
      const isValidType = validTypes.some(type => {
        if (type.startsWith('.')) return type === fileExt;
        if (type.endsWith('/*')) return fileType.startsWith(type.replace('/*', '/'));
        return type === fileType;
      });

      if (!isValidType) {
        alert(`${file.name} का प्रकार मान्य नहीं है`);
        return;
      }

      validFiles.push(file);

      if (preview && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({ file, preview: reader.result });
          setPreviews([...previews, ...newPreviews]);
        };
        reader.readAsDataURL(file);
      } else {
        newPreviews.push({ file, preview: null });
        setPreviews([...previews, ...newPreviews]);
      }
    });

    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles]);
      onFileSelect(multiple ? [...files, ...validFiles] : validFiles[0]);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
    onFileSelect(multiple ? newFiles : null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#1a472a' : error ? '#e53e3e' : '#cbd5e0'}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'rgba(26, 71, 42, 0.05)' : '#fafbfc',
          transition: 'all 0.3s ease'
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id={`file-upload-${label}`}
        />
        <label htmlFor={`file-upload-${label}`} style={{ cursor: 'pointer' }}>
          <FaCloudUploadAlt style={{ fontSize: '2.5rem', color: '#1a472a', marginBottom: '0.5rem' }} />
          <p style={{ color: '#4a5568', fontWeight: 500 }}>
            फ़ाइल अपलोड करने के लिए क्लिक करें या खींचें
          </p>
          <p style={{ color: '#a0aec0', fontSize: '0.8125rem', marginTop: '0.5rem' }}>
            {accept.replace(/image\//g, '').replace(/,/g, ', ')} | अधिकतम: {formatFileSize(maxSize)}
          </p>
        </label>
      </div>

      {error && (
        <p style={{ color: '#e53e3e', fontSize: '0.8125rem', marginTop: '0.375rem' }}>{error}</p>
      )}

      {/* File Previews */}
      {previews.length > 0 && (
        <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
          {previews.map((item, index) => (
            <div key={index} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', background: '#f0f4f1', borderRadius: '8px'
            }}>
              {item.preview ? (
                <img src={item.preview} alt={item.file.name}
                  style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '50px', height: '50px', borderRadius: '8px',
                  background: '#e2e8f0', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', color: '#718096'
                }}>
                  <FaFile />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#2d3748', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.file.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#718096', margin: '0.125rem 0 0' }}>
                  {formatFileSize(item.file.size)}
                </p>
              </div>

              <button
                onClick={() => removeFile(index)}
                style={{
                  background: 'none', border: 'none', color: '#e53e3e',
                  cursor: 'pointer', padding: '0.25rem', fontSize: '1rem'
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
