import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';

const KhataEntries = () => {
  const [searchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    entryType: searchParams.get('entryType') || '',
    status: searchParams.get('status') || '',
    year: searchParams.get('year') || '',
    personId: searchParams.get('personId') || ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, [page, filters]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20, ...filters };
      const res = await api.get('/khata', { params });
      setEntries(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.count);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('प्रविष्टियाँ लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/khata/${deleteId}`);
      toast.success('प्रविष्टि सफलतापूर्वक हटाई गई');
      setShowDeleteDialog(false);
      fetchEntries();
    } catch (error) {
      toast.error(error.response?.data?.error || 'प्रविष्टि हटाने में त्रुटि');
    }
  };

  const handleExport = async (format) => {
    try {
      const res = await api.get(`/khata/export/${format}`, {
        params: filters,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `khata-export.${format === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`${format.toUpperCase()} फाइल डाउनलोड हो रही है`);
    } catch (error) {
      toast.error('एक्सपोर्ट में त्रुटि');
    }
  };

  const entryTypeLabels = {
    charha: 'चरहा',
    batai: 'बटाई',
    patta: 'पट्टा',
    bakaya: 'बकाया',
    payment: 'भुगतान',
    other: 'अन्य'
  };

  const statusLabels = {
    pending: 'लंबित',
    partial: 'आंशिक',
    completed: 'पूर्ण',
    disputed: 'विवादित',
    cancelled: 'रद्द'
  };

  return (
    <motion.div 
      className="khata-entries-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title hindi-text">हिसाब प्रविष्टियाँ</h1>
          <p className="page-subtitle">कुल {totalCount} प्रविष्टियाँ</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={() => handleExport('excel')} 
            className="btn btn-secondary"
            title="Excel में डाउनलोड करें"
          >
            <FaFileExcel /> Excel
          </button>
          <button 
            onClick={() => handleExport('pdf')} 
            className="btn btn-secondary"
            title="PDF में डाउनलोड करें"
          >
            <FaFilePdf /> PDF
          </button>
          <Link to="/khata/new" className="btn btn-primary">
            <FaPlus /> नई प्रविष्टि
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section glass-card">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="नाम, गाँव या मोबाइल से खोजें..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="input-field search-input"
          />
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)} 
          className="btn btn-secondary"
        >
          फ़िल्टर {showFilters ? '↑' : '↓'}
        </button>

        {showFilters && (
          <motion.div 
            className="filters-grid"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
          >
            <select
              value={filters.entryType}
              onChange={(e) => setFilters({...filters, entryType: e.target.value})}
              className="input-field"
            >
              <option value="">सभी प्रकार</option>
              <option value="charha">चरहा</option>
              <option value="batai">बटाई</option>
              <option value="patta">पट्टा</option>
              <option value="bakaya">बकाया</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="input-field"
            >
              <option value="">सभी स्थिति</option>
              <option value="pending">लंबित</option>
              <option value="partial">आंशिक</option>
              <option value="completed">पूर्ण</option>
            </select>

            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="input-field"
            >
              <option value="">सभी वर्ष</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <button 
              onClick={() => setFilters({search: '', entryType: '', status: '', year: ''})}
              className="btn btn-secondary"
            >
              फ़िल्टर हटाएं
            </button>
          </motion.div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner />
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <p>कोई प्रविष्टि नहीं मिली</p>
          <Link to="/khata/new" className="btn btn-primary">
            पहली प्रविष्टि जोड़ें
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container glass-card">
            <table className="khata-table">
              <thead>
                <tr>
                  <th>दिनांक</th>
                  <th>व्यक्ति</th>
                  <th>प्रकार</th>
                  <th>रकम</th>
                  <th>भुगतान</th>
                  <th>बकाया</th>
                  <th>स्थिति</th>
                  <th>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <motion.tr 
                    key={entry._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <td>{new Date(entry.date).toLocaleDateString('hi-IN')}</td>
                    <td>
                      <div className="person-info">
                        <span className="person-name">{entry.person?.name}</span>
                        <span className="person-village">{entry.person?.village}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${entry.entryType}`}>
                        {entryTypeLabels[entry.entryType]}
                      </span>
                    </td>
                    <td>₹{entry.financials.totalAmount.toLocaleString('hi-IN')}</td>
                    <td>₹{entry.financials.paidAmount.toLocaleString('hi-IN')}</td>
                    <td className={entry.financials.remainingAmount > 0 ? 'pending-amount' : 'paid-amount'}>
                      ₹{entry.financials.remainingAmount.toLocaleString('hi-IN')}
                    </td>
                    <td>
                      <span className={`badge badge-${
                        entry.status === 'completed' ? 'success' : 
                        entry.status === 'partial' ? 'warning' : 'danger'
                      }`}>
                        {statusLabels[entry.status]}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/khata/${entry._id}`} className="btn-icon" title="देखें">
                          <FaEye />
                        </Link>
                        <Link to={`/khata/${entry._id}/edit`} className="btn-icon" title="संपादित करें">
                          <FaEdit />
                        </Link>
                        <button 
                          onClick={() => {
                            setDeleteId(entry._id);
                            setShowDeleteDialog(true);
                          }}
                          className="btn-icon danger"
                          title="हटाएं"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="प्रविष्टि हटाएं"
        message="क्या आप वाकई इस हिसाब प्रविष्टि को हटाना चाहते हैं? यह कार्रवाई वापस नहीं की जा सकती।"
        confirmText="हां, हटाएं"
        cancelText="रद्द करें"
      />
    </motion.div>
  );
};

export default KhataEntries;
