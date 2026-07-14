import { useState, useRef } from 'react';
import { Camera, Upload, Trash2, CheckCircle, AlertTriangle, Info, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ScannerPage = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file (JPG, PNG, WEBP).');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB.');
        return;
      }

      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
      setError(null);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreviewUrl('');
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScan = async () => {
    if (!image) {
      toast.error('Please upload an image first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        // Derive item name from the uploaded image's file name to avoid hardcoded placeholders
        waste_item: image ? image.name.split('.')[0].replace(/[-_]/g, ' ') : "Unknown item" 
      };

      const response = await api.post('/analyze-waste', payload);
      
      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Analysis complete!');
        
        try {
          await api.post('/save-history', {
            waste_item: payload.waste_item,
            analysis_result: response.data.data
          });
        } catch (e) {
          console.error("Failed to save history", e);
          toast.error("Analysis succeeded, but failed to save to history.");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Failed to connect to the server. Please check your network and try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="text-center mb-10">
        <h1 className="heading-1">AI Waste Scanner</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Upload an image of your waste item and let our AI determine the best way to dispose of it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-slate-600 hover:border-emerald-500/50 transition-colors relative"
        >
          <AnimatePresence mode="wait">
            {!previewUrl ? (
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-lg">
                  <Upload className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-white">Click to upload an image</p>
                  <p className="text-sm text-slate-400">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500 mt-4">Supports JPG, PNG, WEBP (Max 5MB)</p>
                
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="image-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden mb-6 shadow-2xl shadow-emerald-900/20">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  
                  {loading && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-emerald-400 font-medium animate-pulse">Analyzing with AI...</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={clearImage}
                    disabled={loading}
                    className="btn-secondary"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear
                  </button>
                  {error ? (
                    <button 
                      onClick={handleScan}
                      disabled={loading || !image}
                      className="btn-primary"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Retry Analysis
                    </button>
                  ) : (
                    <button 
                      onClick={handleScan}
                      disabled={loading || !image}
                      className="btn-primary"
                    >
                      <Camera className="w-5 h-5" />
                      Analyze Now
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel p-6 flex flex-col h-full min-h-[400px]"
        >
          <h2 className="heading-2 flex items-center gap-2 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            Analysis Results
          </h2>
          
          <div className="flex-grow flex flex-col">
            {!result && !loading && !error && (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-500">
                <Info className="w-12 h-12 mb-4 opacity-50" />
                <p>Upload and analyze an image to see results here.</p>
              </div>
            )}

            {!result && !loading && error && (
              <div className="flex-grow flex flex-col items-center justify-center text-center">
                <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-sm">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Analysis Failed</h3>
                  <p className="text-sm text-red-200 mb-6">{error}</p>
                  <button onClick={handleScan} className="btn-primary w-full justify-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {loading && !result && (
              <div className="flex-grow flex flex-col items-center justify-center">
                <div className="space-y-4 w-full max-w-sm">
                  <div className="h-8 bg-slate-800 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-1/2 mx-auto"></div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="h-24 bg-slate-800 rounded-xl animate-pulse"></div>
                    <div className="h-24 bg-slate-800 rounded-xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-grow overflow-y-auto pr-2 custom-scrollbar"
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-1">Category</p>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                      <span className="text-3xl">{result.category_icon || '♻️'}</span>
                      {result.category}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {result.is_recyclable && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Recyclable
                      </span>
                    )}
                    {result.is_hazardous && (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Hazardous
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Disposal Instructions</h4>
                  <ul className="space-y-2">
                    {result.disposal_instructions?.map((instruction, idx) => (
                      <li key={idx} className="flex items-start gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{idx + 1}</div>
                        <span className="text-slate-300 text-sm leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.eco_suggestions && result.eco_suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Eco Suggestions</h4>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-1 text-cyan-200 text-sm">
                        {result.eco_suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 mt-auto">
                  <Link to="/centers" className="btn-secondary w-full">
                    <MapPin className="w-4 h-4" />
                    Find nearby collection centers
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScannerPage;
