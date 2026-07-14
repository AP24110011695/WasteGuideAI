const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-bold text-white tracking-wider">WasteGuide AI</span>
          <p className="text-sm mt-1">Sustainable Waste Management</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-gray-700 text-sm text-center md:text-left flex flex-col md:flex-row justify-between">
        <p>&copy; {currentYear} WasteGuide AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
