import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Phone, Clock, Search } from 'lucide-react';
import toast from 'react-hot-toast';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for centers
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultCenter = [40.7128, -74.0060]; // Default: New York City
const zoomLevel = 11;

const mockCenters = [
  {
    id: 1,
    name: 'GreenEarth Recycling Hub',
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Eco Way, New York, NY 10001',
    phone: '(555) 123-4567',
    hours: 'Mon-Sat: 8AM - 6PM',
    types: ['Plastic', 'Glass', 'Paper']
  },
  {
    id: 2,
    name: 'TechScrap Solutions',
    lat: 40.7282,
    lng: -73.9942,
    address: '456 Silicon Blvd, New York, NY 10003',
    phone: '(555) 987-6543',
    hours: 'Mon-Fri: 9AM - 5PM',
    types: ['E-Waste', 'Batteries']
  },
  {
    id: 3,
    name: 'City Compost Center',
    lat: 40.7589,
    lng: -73.9851,
    address: '789 Nature Ln, New York, NY 10036',
    phone: '(555) 456-7890',
    hours: 'Daily: 7AM - 7PM',
    types: ['Organic', 'Yard Waste']
  }
];

const MapFlyTo = ({ center }) => {
  const map = useMap();
  map.flyTo(center, 13, { duration: 1.5 });
  return null;
};

const CollectionCentersPage = () => {
  const [centers, setCenters] = useState(mockCenters);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  const handleSearch = (e) => {
    const val = e.target.value;
    
    // Validate input length
    if (val.length > 100) {
      toast.error('Search term is too long.');
      return;
    }

    const term = val.toLowerCase();
    setSearchTerm(val);
    
    if (term.trim() === '') {
      setCenters(mockCenters);
    } else {
      const filtered = mockCenters.filter(
        c => c.name.toLowerCase().includes(term) || c.types.some(t => t.toLowerCase().includes(term))
      );
      setCenters(filtered);
    }
  };

  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
    setMapCenter([center.lat, center.lng]);
  };

  return (
    <div className="page-container h-[85vh] flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="heading-1 mb-2">Collection Centers</h1>
          <p className="text-slate-400">Find drop-off locations for specialized waste.</p>
        </div>
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="input-field pl-10 bg-slate-800/50"
            placeholder="Search centers or waste type..."
            value={searchTerm}
            onChange={handleSearch}
            maxLength={100}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-0">
        {/* Centers List */}
        <div className="lg:col-span-1 glass-panel overflow-y-auto custom-scrollbar p-4 flex flex-col gap-4">
          {centers.length > 0 ? (
            centers.map((center, index) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCenterSelect(center)}
                className={`glass-card p-5 cursor-pointer border ${selectedCenter?.id === center.id ? 'border-emerald-500 bg-slate-800/80 shadow-emerald-900/20' : 'border-slate-700/50'}`}
              >
                <h3 className="text-lg font-bold text-white mb-2">{center.name}</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" />
                    <span>{center.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    {center.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    {center.hours}
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {center.types.map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded border border-slate-600">
                      {type}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p>No collection centers found matching your search.</p>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="lg:col-span-2 glass-panel overflow-hidden relative min-h-[400px]">
          <MapContainer 
            center={mapCenter} 
            zoom={zoomLevel} 
            className="w-full h-full absolute inset-0 z-0"
            zoomControl={false}
          >
            {/* Dark mode map tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            
            <MapFlyTo center={mapCenter} />

            {centers.map(center => (
              <Marker 
                key={center.id} 
                position={[center.lat, center.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleCenterSelect(center),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900 mb-1">{center.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{center.address}</p>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      <Navigation className="w-4 h-4" /> Get Directions
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
      
      {/* Custom styles for Leaflet Popup in dark mode context */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background-color: #f8fafc;
          border-radius: 0.5rem;
        }
        .leaflet-popup-tip {
          background-color: #f8fafc;
        }
        .leaflet-container {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default CollectionCentersPage;
