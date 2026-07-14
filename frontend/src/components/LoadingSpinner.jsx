function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
    </div>
  );
}

export default LoadingSpinner;
