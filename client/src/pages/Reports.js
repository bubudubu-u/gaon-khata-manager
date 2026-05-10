import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaFileExcel, FaChartBar, FaChartPie, FaFilter } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VillageWiseChart from '../components/dashboard/VillageWiseChart';
import { formatCurrency } from '../utils/formatters';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    entryType: '',
    personId: '',
    startDate: '',
    endDate: ''
  });
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    fetchData();
    fetchPersons();
  }, [filters.year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { year: filters.year };
      const res = await api.get('/khata/dashboard', { params });
      setStats(res.data.data);
    } catch (error) {
      toast.error('डेटा लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const fetchPersons = async () => {
    try {
      const res = await api.get('/persons', { params: { limit: 1000 } });
      setPersons(res.data.data);
    } catch (error) {
      console.error('Error fetching persons:', error);
    }
  };

  const handleExport = async (format) => {
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const res = await api.get(`/khata/export/${format}`, {
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const ext = format === 'excel' ? 'xlsx' : 'pdf';
      link.setAttribute('download', `khata-report-${filters.year || 'all'}.${ext}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`${format.toUpperCase()} रिपोर्ट डाउनलोड हो रही है`);
    } catch (error) {
      toast.error('रिपोर्ट जनरेट करने में त्रुटि');
    }
  };

  if (loading) return <LoadingSpinner />;

  const yearlyStats = [
    { label: 'कुल प्रविष्टियाँ', value: stats?.counts?.totalEntries || 0, color: '#4299e1' },
    { label: 'लंबित प्रविष्टियाँ', value: stats?.counts?.pendingEntries || 0, color: '#e53e3e' },
    { label: 'पूर्ण प्रविष्टियाँ', value: stats?.counts?.completedEntries || 0, color: '#48bb78' },
    { label: 'कुल राशि', value: formatCurrency(stats?.financials?.totalAmount || 0), color: '#ed8936' },
    { label: 'कुल भुगतान', value: formatCurrency(stats?.financials?.totalPaid || 0), color: '#38b2ac' },
    { label: 'कुल बकाया', value: formatCurrency(stats?.financials?.totalPending || 0), color: '#e53e3e' },
    { label: 'कुल छूट', value: formatCurrency(stats?.financials?.totalDiscount || 0), color: '#9f7aea' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title hindi-text">रिपोर्ट्स</h1>
          <p className="page-subtitle">हिसाब की पूरी रिपोर्ट देखें और डाउनलोड करें</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleExport('excel')} className="btn btn-success">
            <FaFileExcel /> Excel
          </button>
          <button onClick={() => handleExport('pdf')} className="btn btn-danger">
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaFilter /> फ़िल्टर
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">वर्ष</label>
            <select value={filters.year} onChange={(e) => setFilters({...filters, year: e.target.value})} className="input-field">
              <option value="">सभी</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">प्रकार</label>
            <select value={filters.entryType} onChange={(e) => setFilters({...filters, entryType: e.target.value})} className="input-field">
              <option value="">सभी प्रकार</option>
              <option value="charha">चरहा</option>
              <option value="batai">बटाई</option>
              <option value="patta">पट्टा</option>
              <option value="bakaya">बकाया</option>
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">व्यक्ति</label>
            <select value={filters.personId} onChange={(e) => setFilters({...filters, personId: e.target.value})} className="input-field">
              <option value="">सभी व्यक्ति</option>
              {persons.map(p => (
                <option key={p._id} value={p._id}>{p.name} - {p.village}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label className="input-label">से दिनांक</label>
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="input-field" />
          </div>
          <div className="input-group">
            <label className="input-label">तक दिनांक</label>
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="input-field" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={fetchData} className="btn btn-primary" style={{ width: '100%' }}>
              लागू करें
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {yearlyStats.map((stat, index) => (
          <motion.div
            key={index}
            className="dashboard-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="card-title" style={{ fontSize: '0.8125rem' }}>{stat.label}</div>
            <div className="card-value" style={{ color: stat.color, fontSize: '1.5rem' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        <motion.div className="glass-card" style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartBar /> प्रकार अनुसार
          </h3>
          {stats?.typeWise?.length > 0 ? (
            <div style={{ maxHeight: '300px', overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem' }}>प्रकार</th>
                    <th style={{ textAlign: 'right', padding: '0.75rem' }}>प्रविष्टियाँ</th>
                    <th style={{ textAlign: 'right', padding: '0.75rem' }}>राशि</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.typeWise.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 500 }}>
                        {item._id === 'charha' ? 'चरहा' : item._id === 'batai' ? 'बटाई' : item._id === 'patta' ? 'पट्टा' : item._id === 'bakaya' ? 'बकाया' : item._id}
                      </td>
                      <td style={{ textAlign: 'right', padding: '0.75rem' }}>{item.count}</td>
                      <td style={{ textAlign: 'right', padding: '0.75rem', fontWeight: 600 }}>{formatCurrency(item.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>कोई डेटा नहीं</p>
          )}
        </motion.div>

        <motion.div className="glass-card" style={{ padding: '1.5rem' }}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChartPie /> गाँव अनुसार
          </h3>
          <VillageWiseChart data={stats?.villageWise || []} />
        </motion.div>
      </div>

      {/* Type Wise Summary Cards */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1a472a' }}>त्वरित सारांश</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {['charha', 'batai', 'patta', 'bakaya'].map(type => {
            const typeData = stats?.typeWise?.find(t => t._id === type);
            return (
              <div key={type} className="dashboard-card" style={{
                borderLeft: `4px solid ${
                  type === 'charha' ? '#4299e1' : type === 'batai' ? '#48bb78' : type === 'patta' ? '#ed8936' : '#e53e3e'
                }`
              }}>
                <div className="card-title" style={{ fontSize: '0.875rem' }}>
                  {type === 'charha' ? 'चरहा' : type === 'batai' ? 'बटाई' : type === 'patta' ? 'पट्टा' : 'बकाया'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <div>
                    <small style={{ color: '#718096' }}>प्रविष्टियाँ</small>
                    <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{typeData?.count || 0}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <small style={{ color: '#718096' }}>कुल राशि</small>
                    <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>{formatCurrency(typeData?.totalAmount || 0)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
