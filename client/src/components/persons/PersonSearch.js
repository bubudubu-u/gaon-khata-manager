import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../../utils/axiosConfig';

const PersonSearch = ({ onSelect, selectedPerson, placeholder = 'व्यक्ति खोजें...' }) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }

    // Debounce search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get('/persons', {
          params: { search, limit: 5, sort: '-createdAt' }
        });
        setResults(res.data.data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [search]);

  const handleSelect = (person) => {
    onSelect(person);
    setSearch(person.name);
    setShowResults(false);
  };

  const handleClear = () => {
    setSearch('');
    onSelect(null);
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <FaSearch style={{
          position: 'absolute', left: '1rem', top: '50%',
          transform: 'translateY(-50%)', color: '#a0aec0'
        }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          className="input-field"
          placeholder={placeholder}
          style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
        />
        {(search || selectedPerson) && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute', right: '0.75rem', top: '50%',
              transform: 'translateY(-50%)', background: 'none', border: 'none',
              color: '#a0aec0', cursor: 'pointer', fontSize: '1rem', padding: '0.25rem'
            }}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {showResults && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'white', borderRadius: '8px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          zIndex: 100, marginTop: '0.25rem',
          maxHeight: '300px', overflow: 'auto'
        }}>
          {loading ? (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#718096' }}>
              खोज रहे हैं...
            </div>
          ) : (
            results.map(person => (
              <div
                key={person._id}
                onClick={() => handleSelect(person)}
                style={{
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid #edf2f7',
                  transition: 'background 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0f4f1'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #1a472a, #40916c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 600, fontSize: '1rem', flexShrink: 0
                }}>
                  {person.name?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 500, color: '#2d3748', margin: 0, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {person.name}
                  </p>
                  <p style={{ color: '#718096', fontSize: '0.75rem', margin: '0.125rem 0 0' }}>
                    {person.fatherName} | {person.village}
                    {person.mobile && ` | +91 ${person.mobile}`}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PersonSearch;
