import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Upload Successful!</h1>
        <p className="text-gray-700">Your files were uploaded successfully.</p>
        <p className="text-gray-500 mt-2">You will be redirected to the home page shortly...</p>
      </div>
    </div>
  );
};

export default UploadSuccessPage;
