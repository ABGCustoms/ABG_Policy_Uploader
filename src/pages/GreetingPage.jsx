import React from 'react';
import { useNavigate } from 'react-router-dom';

const GreetingPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/upload');
  };

  const handleViewBuckets = () => {
    navigate('/buckets');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f3ee] to-[#f1e8dc] flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6 border border-[#a41c1c]">
        <h1 className="text-4xl font-bold text-[#a41c1c] text-center">📂 Welcome to the Document Uploader</h1>
        <p className="text-[#4b2e2e] text-center">Follow the steps below to upload your policy documents correctly.</p>

        {/* View Buckets button placed above steps for secondary action */}
        <div className="text-center">
          <button
            onClick={handleViewBuckets}
            className="bg-[#fce5e5] hover:bg-[#f9dcdc] text-[#a41c1c] px-5 py-2 rounded-full text-base font-medium border border-[#a41c1c] transition shadow-sm"
          >
            📁 View Uploaded Buckets
          </button>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-3">
          <div className="bg-[#fce5e5] p-4 rounded-xl shadow-md border border-[#a41c1c]">
            <h2 className="font-semibold text-[#a41c1c]">1. Choose Region</h2>
            <p className="text-sm text-[#4b2e2e]">Select the region where these files will be stored.</p>
          </div>
          <div className="bg-[#fce5e5] p-4 rounded-xl shadow-md border border-[#a41c1c]">
            <h2 className="font-semibold text-[#a41c1c]">2. Choose Type</h2>
            <p className="text-sm text-[#4b2e2e]">Choose whether this is a Business Unit-specific upload or Group Policy.</p>
          </div>
          <div className="bg-[#fce5e5] p-4 rounded-xl shadow-md border border-[#a41c1c]">
            <h2 className="font-semibold text-[#a41c1c]">3. Upload Files</h2>
            <p className="text-sm text-[#4b2e2e]">Upload one or multiple documents and submit.</p>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-6 text-center">
          <button
            onClick={handleContinue}
            className="bg-[#a41c1c] hover:bg-[#861818] text-white px-6 py-3 rounded-full text-lg font-semibold transition shadow-md"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingPage;
