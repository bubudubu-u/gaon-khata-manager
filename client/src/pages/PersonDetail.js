import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTrash, FaPhone, FaHome, FaUser, FaFileInvoiceDollar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatCurrency, formatDate, getStatusLabel, getStatusColor, getEntryTypeLabel } from '../utils/formatters';

const PersonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [khataSummary, setKhataSummary] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchPersonDetails();
  }, [id]);

  const fetchPersonDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/persons/${id}`);
      setPerson(res.data.data.person);
      setKhataSummary(res.data.data.khataSummary || []);
      
      // Fetch recent entries
      const entriesRes = await api.get('/khata', {
        params: { personId: id, limit: 10, sort: '-date' }
      });
      setRecentEntries(entriesRes.data.data);
    } catch (error) {
      toast.error('विवरण लोड करने में त्रुटि');
      navigate('/persons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/persons/${id}`);
      toast.success('व्यक्ति हटाया गया');
      navigate('/persons');
    } catch (error) {
      toast.error(error.response?.data?.error || 'हटाने में त्रुटि');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!person) return null;

  const totalPending = khataSummary.reduce((sum, item) => sum + (item.totalPending || 0), 0);
  const totalPaid = khataSummary.reduce((sum, item) => sum + (item.totalPaid || 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
          <FaArrowLeft /> वापस
        </button>
      </div>

      {/* Person Info Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'start' }}>
          {/* Avatar */}
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: person.photo ? `url(${person.photo})` : 'linear-gradient(135deg, #1a472a, #40916c)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '2.5rem', fontWeight: 700, flexShrink: 0
          }}>
            {!person.photo && person.name?.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', color: '#1a472a', marginBottom: '0.5rem' }}>
                  {person.name}
                </h2>
                <p style={{ color: '#4a5568', fontSize: '1rem' }}>
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  पिता: {person.fatherName}
                </p>
                <p style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                  <FaHome style={{ marginRight: '0.5rem' }} />
                  गाँव: {person.village}
                </p>
                {person.mobile && (
                  <p style={{ color: '#4a5568', marginTop: '0.25rem' }}>
                    <FaPhone style={{ marginRight: '0.5rem' }} />
                    +91 {person.mobile}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to={`/persons/${id}/edit`} className="btn btn-primary btn-sm">
                  <FaEdit /> संपादित करें
                </Link>
                <button onClick={() => setShowDeleteDialog(true)} className="btn btn-danger btn-sm">
                  <FaTrash /> हटाएं
                </button>
              </div>
            </div>

            {person.notes && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f4f1', borderRadius: '8px' }}>
                <strong>नोट्स:</strong> {person.notes}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="dashboard-card">
          <div className="card-title">कुल बकाया</div>
          <div className="card-value" style={{ color: '#e53e3e' }}>{formatCurrency(totalPending)}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">कुल भुगतान</div>
          <div className="card-value" style={{ color: '#48bb78' }}>{formatCurrency(totalPaid)}</div>
        </div>
        <div className="dashboard-card">
          <div className="card-title">कुल ज़मीन</div>
          <div className="card-value" style={{ color: '#4299e1' }}>{person.totalLand || 0} बीघा</div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="glass-card">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>हाल की हिसाब प्रविष्टियाँ</h3>
          <Link to={`/khata/new?personId=${id}`} className="btn btn-primary btn-sm">
            <FaFileInvoiceDollar /> नई प्रविष्टि
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>
            <p>कोई हिसाब प्रविष्टि नहीं है</p>
          </div>
        ) : (
          <div className="table-container" style={{ boxShadow: 'none' }}>
            <table className="khata-table">
              <thead>
                <tr>
                  <th>दिनांक</th>
                  <th>प्रकार</th>
                  <th>राशि</th>
                  <th>भुगतान</th>
                  <th>बकाया</th>
                  <th>स्थिति</th>
                  <th>कार्रवाई</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map(entry => (
                  <tr key={entry._id}>
                    <td>{formatDate(entry.date)}</td>
                    <td><span className="badge badge-info">{getEntryTypeLabel(entry.entryType)}</span></td>
                    <td>{formatCurrency(entry.financials.totalAmount)}</td>
                    <td>{formatCurrency(entry.financials.paidAmount)}</td>
                    <td style={{ color: entry.financials.remainingAmount > 0 ? '#e53e3e' : '#48bb78', fontWeight: 600 }}>
                      {formatCurrency(entry.financials.remainingAmount)}
                    </td>
                    <td>
                      <span className={`badge badge-${getStatusColor(entry.status)}`}>
                        {getStatusLabel(entry.status)}
                      </span>
                    </td>
                    <td>
                      <Link to={`/khata/${entry._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                        <FaEye />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="व्यक्ति हटाएं"
        message={`क्या आप वाकई ${person.name} को हटाना चाहते हैं? यह कार्रवाई वापस नहीं हो सकती।`}
        type="danger"
      />
    </motion.div>
  );
};

export default PersonDetail;
