import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, MapPin, BarChart3, Sparkles, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Camera,
      title: 'AI Scanning',
      description: 'Instantly identify waste categories and disposal methods using advanced AI vision models.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
    {
      icon: MapPin,
      title: 'Smart Locations',
      description: 'Find the nearest eco-friendly disposal facilities and recycling centers on our interactive map.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-400/10'
    },
    {
      icon: BarChart3,
      title: 'Impact Tracking',
      description: 'Monitor your environmental footprint and track your recycling habits over time with deep analytics.',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    }
  ];

  return (
    <div className="flex flex-col min-h-[85vh]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center pt-20 pb-16 text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm text-slate-300 mb-8"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Powered by Generative AI</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl"
        >
          Sustainable waste management <br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            reimagined.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          WasteGuide AI helps you classify trash, locate recycling centers, and track your sustainable habits. Making the world cleaner, one scan at a time.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto group"
        >
          <Link to="/scanner" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
            <Camera className="w-5 h-5" />
            Start Scanning
            <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/centers" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
            <MapPin className="w-5 h-5" />
            Find Centers
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card p-8"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]"></div>
      </div>
    </div>
  );
};

export default HomePage;
