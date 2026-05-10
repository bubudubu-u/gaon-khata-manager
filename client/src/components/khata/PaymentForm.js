import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoneyBillWave, FaTimes } from 'react-icons/fa';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import api from '../../utils/axiosConfig';

const PaymentForm = ({ entryId, remainingAmount, isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('कृपया सही राशि दर्ज करें');
      return;
    }

    if (parseFloat(amount) > remainingAmount) {
      toast.error(`राशि बकाया (${formatCurrency(remainingAmount)}) से अधिक नहीं हो सकती`);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/khata/${entryId}/payment`, {
        amount: parseFloat(amount),
        paymentMode,
        date: new Date().toISOString(),
        notes
      });

      toast.success('भुगतान सफलतापूर्वक दर्ज किया गया');
      setAmount('');
      setNotes('');
      setPaymentMode('cash');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || 'भुगतान दर्ज करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [
    Math.ceil(remainingAmount / 4),
    Math.ceil(remainingAmount / 2),
    remainingAmount
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '450px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: '#1a472a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaMoneyBillWave /> भुगतान दर्ज करें
              </h3>
              <button onClick={onClose} style={{
                background: 'none', border: 'none', fontSize: '1.25rem',
                cursor: 'pointer', color: '#a0aec0'
              }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{
                padding: '1rem', background: '#fffbeb', borderRadius: '8px',
                marginBottom: '1.25rem', border: '1px solid #fef3c7'
              }}>
                <span style={{ color: '#92400e', fontSize: '0.875rem' }}>
                  बकाया राशि: <strong>{formatCurrency(remainingAmount)}</strong>
                </span>
              </div>

              <div className="input-group">
                <label className="input-label">राशि *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder="भुगतान राशि दर्ज करें"
                  min="1"
                  max={remainingAmount}
                  required
                  autoFocus
                />

                {/* Quick Amount Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {quickAmounts.map((amt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAmount(amt.toString())}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', minWidth: 'auto' }}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmount(remainingAmount.toString())}
                    className="btn btn-success btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', minWidth: 'auto' }}
                  >
                    पूरा भुगतान
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">भुगतान माध्यम</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="input-field"
                >
                  <option value="cash">नकद (Cash)</option>
                  <option value="bank_transfer">बैंक ट्रांसफर</option>
                  <option value="upi">UPI (Google Pay, PhonePe)</option>
                  <option value="cheque">चेक</option>
                  <option value="other">अन्य</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">नोट्स (वैकल्पिक)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input-field"
                  rows="2"
                  placeholder="भुगतान से संबंधित कोई नोट"
                  maxLength="200"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading || !amount}
                  style={{ flex: 1 }}
                >
                  {loading ? 'सेव हो रहा...' : 'भुगतान सेव करें'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  रद्द करें
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentForm;
