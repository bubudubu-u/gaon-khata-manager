import React from 'react';

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = '-- चुनें --',
  required = false,
  disabled = false,
  error = '',
  hint = '',
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''}`}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          ...(disabled && { background: '#f7fafc' })
        }}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option, index) => (
          typeof option === 'object' ? (
            <option key={option.value || index} value={option.value}>
              {option.label}
            </option>
          ) : (
            <option key={option} value={option}>
              {option}
            </option>
          )
        ))}
      </select>

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

export default SelectField;
