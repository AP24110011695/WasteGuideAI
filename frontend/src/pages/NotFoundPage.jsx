import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-extrabold text-green-100 tracking-widest">404</h1>
      <div className="bg-green-700 text-white px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <div className="mt-8">
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
          Oops! The page you're looking for doesn't exist.
        </h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          It looks like you've wandered off the path. Let's get you back to recycling and sustainability.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-medium hover:bg-green-800 transition-colors shadow-sm"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
