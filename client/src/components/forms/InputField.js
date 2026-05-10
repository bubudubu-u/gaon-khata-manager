import React from 'react';

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  hint = '',
  icon,
  maxLength,
  min,
  max,
  step,
  className = '',
  style = {}
}) => {
  return (
    <div className={`input-group ${className}`} style={style}>
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span style={{ color: '#e53e3e', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#a0aec0',
            fontSize: '1rem',
            zIndex: 1
          }}>
            {icon}
          </span>
        )}

        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            className={`input-field ${error ? 'input-error' : ''}`}
            style={{
              paddingLeft: icon ? '2.75rem' : '1rem',
              ...(disabled && { background: '#f7fafc', cursor: 'not-allowed' })
            }}
            rows="4"
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            maxLength={maxLength}
            min={min}
            max={max}
            step={step}
            className={`input-field ${error ? 'input-error' : ''}`}
            style={{
              paddingLeft: icon ? '2.75rem' : '1rem',
              ...(disabled && { background: '#f7fafc', cursor: 'not-allowed' })
            }}
          />
        )}
      </div>

      {error && (
        <p style={{ color: '#e53e3e', fontSize: '0.8125rem', marginTop: '0.375rem' }}>
          {error}
        </p>
      )}

      {hint && !error && (
        <p style={{ color: '#718096', fontSize: '0.8125rem', marginTop: '0.375rem' }}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default InputField;
