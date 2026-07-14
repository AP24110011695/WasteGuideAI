import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Activity, Camera, Recycle, AlertTriangle, RefreshCcw, LayoutDashboard, SearchX, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/dashboard-data');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to connect to the server. Please check your network and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        grid: { color: '#334155', drawBorder: false },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { color: '#334155', drawBorder: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', padding: 20 }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-emerald-400 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 flex flex-col items-center max-w-md w-full border-red-500/20 bg-red-500/5 text-center"
        >
          <AlertCircle className="w-20 h-20 text-red-400 mb-6" />
          <h2 className="heading-2 text-white">Error Loading Dashboard</h2>
          <p className="text-red-200 mb-8">{error}</p>
          <button onClick={fetchDashboardData} className="btn-primary w-full justify-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  if (!data || data.total_scans === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 flex flex-col items-center max-w-md w-full"
        >
          <SearchX className="w-20 h-20 text-slate-500 mb-6" />
          <h2 className="heading-2">No data yet</h2>
          <p className="text-slate-400 mb-8">
            Start scanning items to see your environmental impact and statistics here.
          </p>
          <a href="/scanner" className="btn-primary w-full">
            <Camera className="w-5 h-5" />
            Scan First Item
          </a>
        </motion.div>
      </div>
    );
  }

  const categoryLabels = Object.keys(data.category_distribution || {});
  const categoryValues = Object.values(data.category_distribution || {});

  const categoryChartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)', // Emerald
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(245, 158, 11, 0.8)', // Amber
          'rgba(239, 68, 68, 0.8)',  // Red
          'rgba(168, 85, 247, 0.8)', // Purple
          'rgba(6, 182, 212, 0.8)',  // Cyan
        ],
        borderColor: [
          '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'
        ],
        borderWidth: 1,
      },
    ],
  };

  const trendLabels = (data.daily_scan_trend || []).map(t => t.date);
  const trendValues = (data.daily_scan_trend || []).map(t => t.count);

  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Scans',
        data: trendValues,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderRadius: 4,
        fill: true,
      },
    ],
  };

  const statCards = [
    { title: 'Total Scans', value: data.total_scans, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Recyclable', value: data.recyclable_count, icon: Recycle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Reusable', value: data.reusable_count, icon: RefreshCcw, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { title: 'Hazardous', value: data.hazardous_count, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="page-container space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-1 mb-2">Impact Dashboard</h1>
          <p className="text-slate-400">Overview of your waste management activity.</p>
        </div>
        <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
          <LayoutDashboard className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Activity Trend (Last 7 Days)</h3>
          <div className="flex-grow relative">
            <Bar data={trendChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-panel p-6 h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Waste Distribution</h3>
          <div className="flex-grow relative flex items-center justify-center">
            {categoryLabels.length > 0 ? (
              <Doughnut data={categoryChartData} options={doughnutOptions} />
            ) : (
              <p className="text-slate-500">Not enough data to display distribution.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
