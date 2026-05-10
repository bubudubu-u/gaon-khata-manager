import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEdit, FaTrash, FaMoneyBillWave, FaFileDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatCurrency, formatDate, getEntryTypeLabel, getStatusLabel, getStatusColor, getLandUnitLabel, getPaymentModeLabel } from '../utils/formatters';

const KhataDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEntry();
  }, [id]);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/khata/${id}`);
      setEntry(res.data.data);
    } catch (error) {
      toast.error('प्रविष्टि लोड करने में त्रुटि');
      navigate('/khata');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/khata/${id}`);
      toast.success('प्रविष्टि हटाई गई');
      navigate('/khata');
    } catch (error) {
      toast.error(error.response?.data?.error || 'हटाने में त्रुटि');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('कृपया सही राशि दर्ज करें');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/khata/${id}/payment`, {
        amount: parseFloat(paymentAmount),
        paymentMode,
        date: new Date().toISOString(),
        notes: paymentNotes
      });
      setEntry(res.data.data);
      setShowPaymentForm(false);
      setPaymentAmount('');
      setPaymentNotes('');
      toast.success('भुगतान दर्ज किया गया');
    } catch (error) {
      toast.error('भुगतान दर्ज करने में त्रुटि');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!entry) return null;

  const remaining = entry.financials.remainingAmount;
  const paidPercentage = entry.financials.totalAmount > 0 
    ? (entry.financials.paidAmount / entry.financials.totalAmount) * 100 
    : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
          <FaArrowLeft /> वापस
        </button>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/khata/${id}/edit`} className="btn btn-primary btn-sm"><FaEdit /> संपादित</Link>
          <button onClick={() => setShowDeleteDialog(true)} className="btn btn-danger btn-sm"><FaTrash /> हटाएं</button>
        </div>
      </div>

      {/* Entry Details */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <span className={`badge badge-${getStatusColor(entry.status)}`} style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
              {getStatusLabel(entry.status)}
            </span>
            <h2 style={{ fontSize: '1.5rem', color: '#1a472a', margin: '0.5rem 0' }}>
              {getEntryTypeLabel(entry.entryType)} - {entry.person?.name || 'N/A'}
            </h2>
            <p style={{ color: '#718096' }}>रसीद नं: {entry.receiptNumber}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#718096', marginBottom: '0.25rem' }}>दिनांक: {formatDate(entry.date)}</p>
            <p style={{ color: '#718096' }}>वर्ष: {entry.year}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
            <span>भुगतान: {formatCurrency(entry.financials.paidAmount)}</span>
            <span>बकाया: {formatCurrency(remaining)}</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              width: `${paidPercentage}%`, height: '100%',
              background: remaining > 0 ? '#ed8936' : '#48bb78',
              borderRadius: '6px', transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        {/* Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <strong style={{ color: '#4a5568', display: 'block', marginBottom: '0.25rem' }}>कुल राशि</strong>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(entry.financials.totalAmount)}</span>
          </div>
          <div>
            <strong style={{ color: '#4a5568', display: 'block', marginBottom: '0.25rem' }}>भुगतान</strong>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: '#48bb78' }}>{formatCurrency(entry.financials.paidAmount)}</span>
          </div>
          <div>
            <strong style={{ color: '#4a5568', display: 'block', marginBottom: '0.25rem' }}>बकाया</strong>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: remaining > 0 ? '#e53e3e' : '#48bb78' }}>
              {formatCurrency(remaining)}
            </span>
          </div>
          <div>
            <strong style={{ color: '#4a5568', display: 'block', marginBottom: '0.25rem' }}>भुगतान माध्यम</strong>
            <span>{getPaymentModeLabel(entry.financials.paymentMode)}</span>
          </div>
        </div>

        {/* Land Details */}
        {entry.landDetails.size > 0 && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f4f1', borderRadius: '8px' }}>
            <strong>भूमि विवरण:</strong>{' '}
            {entry.landDetails.size} {getLandUnitLabel(entry.landDetails.unit)}
            {entry.landDetails.khasraNumber && ` (खसरा: ${entry.landDetails.khasraNumber})`}
          </div>
        )}

        {/* Payment Button */}
        {remaining > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <button onClick={() => setShowPaymentForm(true)} className="btn btn-success">
              <FaMoneyBillWave /> भुगतान जोड़ें
            </button>
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <motion.div className="modal-content" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1a472a' }}>भुगतान दर्ज करें</h3>
            <form onSubmit={handlePayment}>
              <div className="input-group">
                <label className="input-label">राशि *</label>
                <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)}
                  className="input-field" min="1" max={remaining} required />
                <small>बकाया: {formatCurrency(remaining)}</small>
              </div>
              <div className="input-group">
                <label className="input-label">भुगतान माध्यम</label>
                <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="input-field">
                  <option value="cash">नकद</option>
                  <option value="bank_transfer">बैंक ट्रांसफर</option>
                  <option value="upi">UPI</option>
                  <option value="other">अन्य</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">नोट्स</label>
                <textarea value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)}
                  className="input-field" rows="2" />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-success" disabled={submitting}>
                  {submitting ? 'सेव हो रहा...' : 'भुगतान सेव करें'}
                </button>
                <button type="button" onClick={() => setShowPaymentForm(false)} className="btn btn-secondary">रद्द करें</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="प्रविष्टि हटाएं"
        message="क्या आप वाकई इस हिसाब प्रविष्टि को हटाना चाहते हैं?"
        type="danger"
      />
    </motion.div>
  );
};

export default KhataDetail;
