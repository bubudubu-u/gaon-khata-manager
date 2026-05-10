import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUsers, FaRupeeSign, FaFileInvoiceDollar,
  FaCalendarCheck, FaChartLine, FaArrowRight
} from 'react-icons/fa';
import api from '../utils/axiosConfig';
import DashboardCard from '../components/dashboard/DashboardCard';
import RecentPayments from '../components/dashboard/RecentPayments';
import MonthlyChart from '../components/dashboard/MonthlyChart';
import VillageWiseChart from '../components/dashboard/VillageWiseChart';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/khata/dashboard?year=${selectedYear}`);
      setStats(res.data.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('hi-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <motion.div 
      className="dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-header">
        <div>
          <h1 className="page-title hindi-text">डैशबोर्ड</h1>
          <p className="page-subtitle">आपका ज़मीन हिसाब का पूरा लेखा-जोखा</p>
        </div>
        <div className="header-actions">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="input-field year-select"
          >
            <option value="2024">2024-25</option>
            <option value="2023">2023-24</option>
            <option value="2022">2022-23</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <DashboardCard
          icon={<FaUsers />}
          iconBg="linear-gradient(135deg, #667eea, #764ba2)"
          title="कुल लोग"
          value={stats?.counts?.totalPersons || 0}
          link="/persons"
          linkText="सभी देखें"
        />
        <DashboardCard
          icon={<FaFileInvoiceDollar />}
          iconBg="linear-gradient(135deg, #f093fb, #f5576c)"
          title="कुल प्रविष्टियाँ"
          value={stats?.counts?.totalEntries || 0}
          link="/khata"
          linkText="देखें"
        />
        <DashboardCard
          icon={<FaRupeeSign />}
          iconBg="linear-gradient(135deg, #4facfe, #00f2fe)"
          title="कुल बकाया"
          value={formatCurrency(stats?.financials?.totalPending || 0)}
          link="/khata?status=pending"
          linkText="बकाया देखें"
        />
        <DashboardCard
          icon={<FaCalendarCheck />}
          iconBg="linear-gradient(135deg, #43e97b, #38f9d7)"
          title="कुल भुगतान"
          value={formatCurrency(stats?.financials?.totalPaid || 0)}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <motion.div 
          className="glass-card chart-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="chart-title">मासिक आँकड़े {selectedYear}</h3>
          <MonthlyChart data={stats?.monthlyStats || []} />
        </motion.div>

        <motion.div 
          className="glass-card chart-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="chart-title">गाँव अनुसार बकाया</h3>
          <VillageWiseChart data={stats?.villageWise || []} />
        </motion.div>
      </div>

      {/* Recent Payments & Quick Actions */}
      <div className="bottom-grid">
        <motion.div 
          className="glass-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card-header">
            <h3 className="card-title">हाल की भुगतान</h3>
            <Link to="/khata" className="btn btn-sm btn-secondary">
              सभी देखें <FaArrowRight />
            </Link>
          </div>
          <RecentPayments payments={stats?.recentPayments || []} />
        </motion.div>

        <motion.div 
          className="glass-card"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-header">
            <h3 className="card-title">त्वरित कार्य</h3>
          </div>
          <div className="quick-actions">
            <Link to="/persons/new" className="action-btn">
              <span className="action-icon">+</span>
              <span>नया व्यक्ति जोड़ें</span>
            </Link>
            <Link to="/khata/new" className="action-btn">
              <span className="action-icon">₹</span>
              <span>नया हिसाब जोड़ें</span>
            </Link>
            <Link to="/reports" className="action-btn">
              <span className="action-icon">📊</span>
              <span>रिपोर्ट देखें</span>
            </Link>
            <button onClick={fetchDashboardData} className="action-btn">
              <span className="action-icon">🔄</span>
              <span>रीफ्रेश करें</span>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
