import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UploadError = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const message = new URLSearchParams(location.search).get('message') || 'Something went wrong during upload.';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="max-w-xl p-6 text-center bg-white border-l-8 border-red-600 shadow-xl rounded-xl">
        <h1 className="mb-4 text-2xl font-bold text-red-600">🚫 Upload Failed</h1>
        <p className="mb-6 text-gray-700">{message}</p>
        <button
          onClick={() => navigate('/upload')}
          className="px-6 py-2 bg-[#9E1B32] text-white rounded-full hover:bg-[#7d172a]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default UploadError;
