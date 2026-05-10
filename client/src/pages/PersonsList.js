import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import PersonCard from '../components/persons/PersonCard';

const PersonsList = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState('');

  useEffect(() => {
    fetchPersons();
  }, [page, search, selectedVillage]);

  const fetchPersons = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (selectedVillage) params.village = selectedVillage;
      
      const res = await api.get('/persons', { params });
      setPersons(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.count);
    } catch (error) {
      toast.error('व्यक्ति लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/persons/${deleteId}`);
      toast.success('व्यक्ति सफलतापूर्वक हटाया गया');
      setShowDeleteDialog(false);
      fetchPersons();
    } catch (error) {
      toast.error(error.response?.data?.error || 'हटाने में त्रुटि');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPersons();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title hindi-text">सभी लोग</h1>
          <p className="page-subtitle">कुल {totalCount} व्यक्ति</p>
        </div>
        <Link to="/persons/new" className="btn btn-primary">
          <FaPlus /> नया व्यक्ति
        </Link>
      </div>

      {/* Search Bar */}
      <div className="filters-section glass-card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="नाम, गाँव या मोबाइल से खोजें..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field search-input"
          />
          <button type="submit" className="btn btn-primary btn-sm">
            खोजें
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : persons.length === 0 ? (
        <EmptyState
          title="कोई व्यक्ति नहीं मिला"
          message={search ? 'आपकी खोज से मेल खाता कोई व्यक्ति नहीं मिला' : 'अभी तक कोई व्यक्ति नहीं जोड़ा गया है'}
          actionText="नया व्यक्ति जोड़ें"
          actionLink="/persons/new"
        />
      ) : (
        <>
          <div className="persons-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {persons.map(person => (
              <PersonCard
                key={person._id}
                person={person}
                onEdit={() => {/* navigate */}}
                onDelete={() => {
                  setDeleteId(person._id);
                  setShowDeleteDialog(true);
                }}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="व्यक्ति हटाएं"
        message="क्या आप वाकई इस व्यक्ति को हटाना चाहते हैं? उनसे जुड़े सभी हिसाब रिकॉर्ड भी हट जाएंगे।"
        confirmText="हां, हटाएं"
        cancelText="रद्द करें"
        type="danger"
      />
    </motion.div>
  );
};

export default PersonsList;
