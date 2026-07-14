import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Calendar, CheckCircle, AlertTriangle, Search, Filter, BoxSelect, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/get-history?limit=100');
      if (response.data.success) {
        setHistory(response.data.data);
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
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const response = await api.delete(`/delete-history/${id}`);
      if (response.data.success) {
        toast.success('Record deleted successfully');
        setHistory(history.filter(item => item.id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to delete record. Please check your connection.');
      console.error(err);
    }
  };

  const handleSearchChange = (e) => {
    // Sanitize input length to prevent overly long searches
    const val = e.target.value;
    if (val.length <= 100) {
      setSearchTerm(val);
    }
  };

  const filteredHistory = history.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.waste_item?.toLowerCase().includes(term) ||
      item.analysis_result?.category?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="page-container flex flex-col h-[85vh]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="heading-1 mb-2">Scan History</h1>
          <p className="text-slate-400">Review your past waste analysis records.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              className="input-field pl-10 bg-slate-800/50 py-2 text-sm"
              placeholder="Search history..."
              value={searchTerm}
              onChange={handleSearchChange}
              maxLength={100}
            />
          </div>
          <button className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-panel flex-grow flex flex-col overflow-hidden">
        <div className="overflow-x-auto flex-grow custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-800/30">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Attributes</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                // Skeleton loading rows
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-5"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-800 rounded w-32"></div></td>
                    <td className="px-6 py-5"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                    <td className="px-6 py-5"><div className="flex gap-2"><div className="h-6 bg-slate-800 rounded-full w-20"></div><div className="h-6 bg-slate-800 rounded-full w-20"></div></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-8 bg-slate-800 rounded w-8 ml-auto"></div></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
                      <p className="text-lg font-medium text-red-200 mb-2">Error Loading History</p>
                      <p className="text-sm text-slate-400 mb-6">{error}</p>
                      <button onClick={fetchHistory} className="btn-primary">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry Connection
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white break-words max-w-xs">{item.waste_item}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{item.analysis_result?.category_icon || '♻️'}</span>
                        <span className="text-sm text-slate-300">{item.analysis_result?.category || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {item.analysis_result?.is_recyclable && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Recyclable
                          </span>
                        )}
                        {item.analysis_result?.is_hazardous && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            <AlertTriangle className="w-3 h-3" /> Hazardous
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <BoxSelect className="w-12 h-12 mb-4 opacity-50 text-slate-400" />
                      <p className="text-lg font-medium text-slate-300 mb-1">No history found</p>
                      <p className="text-sm">We couldn't find any records matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
