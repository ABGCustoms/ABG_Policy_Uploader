import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const navigate = useNavigate();
  const [region, setRegion] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [selectedBU, setSelectedBU] = useState([]);
  const [excludeBU, setExcludeBU] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 🚀 Loader state
   // 🚀 New State to hold dynamic data
   const [regions, setRegions] = useState([]);
   const [businessUnits, setBusinessUnits] = useState([]);

// 🔄 Fetch regions and BUs from API on mount
useEffect(() => {
  const fetchData = async () => {
    try {
      const regionRes = await fetch('https://ga85834a6daed8b-omfysadw.adb.ap-mumbai-1.oraclecloudapps.com/ords/customerorders/uploader/gerRegion');
      if (regionRes.status === 200) {
        const regionData = await regionRes.json();
        const regionArray = regionData.items.map((val) => val.region);
        setRegions(regionArray);
      } else {
        navigate(`/upload-error?message=Unable to fetch Regios please try again later`);
      }
      const buRes = await fetch('https://ga85834a6daed8b-omfysadw.adb.ap-mumbai-1.oraclecloudapps.com/ords/customerorders/uploader/getBusinessCode');
      if(buRes.status===200){
        const buData = await buRes.json();
        const buArray=buData.items.map((val)=>val.busiess_code)
        setBusinessUnits(buArray);
      }else{
        navigate(`/upload-error?message=Unable to fetch Business Code please try again later`);
      }

    } catch (err) {
      console.error('Failed to load data:', err);
      alert('Failed to load region or business unit data.');
    }
  };

  fetchData();
}, []);
  const handleUpload = async () => {
    if (!region || !uploadType || files.length === 0 || (uploadType === 'business' && selectedBU.length === 0)) {
      alert('Please complete all fields before uploading.');
      return;
    }
    setIsLoading(true); // 🚀 Show loader
    const formData = new FormData();
    formData.append('uploadType', uploadType);
    formData.append('region', region);
    formData.append('selectedBU', JSON.stringify(selectedBU));
    formData.append('excludeBU', JSON.stringify(excludeBU));

    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    try {
      const res = await fetch('https://oxstgz3tarswqf7yqbf2bcfcx4.apigateway.ap-mumbai-1.oci.customer-oci.com/oda/abg_policy_uploader/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setFiles([]);
        setIsLoading(false); // ✅ Hide loader
        navigate('/success');
      } else {
        console.error(`Upload failed with status: ${res.status}`);
        setIsLoading(false);
        const errorMsg = encodeURIComponent('Upload failed. Server responded with error.');
        navigate(`/upload-error?message=${errorMsg}`);
      }
  
    } catch (err) {
      console.error('Upload exception:', err);
      setIsLoading(false); // ✅ Hide loader
      const errorMsg = encodeURIComponent('Upload failed. Please check your network or file format.');
      navigate(`/upload-error?message=${errorMsg}`);
    }
    // fetch('https://oxstgz3tarswqf7yqbf2bcfcx4.apigateway.ap-mumbai-1.oci.customer-oci.com/oda/abg_policy_uploader/upload', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(res => res.json())
    //   .then(data => {
    //     console.log(data);
    //     setFiles([]);
    //     setIsLoading(false); // ✅ Hide loader
    //     navigate('/success');
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     setIsLoading(false); // ✅ Hide loader
    //     const errorMsg = encodeURIComponent('Upload failed. Please check your network or file format.');
    //     navigate(`/upload-error?message=${errorMsg}`);
    //   });
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8F0]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#9E1B32]"></div>
          <p className="text-lg font-semibold text-[#9E1B32]">Uploading... Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#FFF8F0]">
      <div className="max-w-3xl p-6 mx-auto space-y-6 bg-white border-l-8 border-[#9E1B32] shadow-xl rounded-xl">
        <h1 className="text-3xl font-bold text-center text-[#9E1B32]">📤 Upload Your Policy Documents</h1>

        {/* Region Selector */}
        <div>
          <label className="block mb-1 font-semibold text-[#9E1B32]">Select Region:</label>
          <select
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FFD200]"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">-- Select Region --</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
        </div>

        {/* Upload Type Selector */}
        <div>
          <label className="block mb-1 font-semibold text-[#9E1B32]">Upload Type:</label>
          <div className="flex gap-4">
            <label className="text-[#9E1B32]">
              <input
                type="radio"
                name="uploadType"
                value="business"
                onChange={(e) => setUploadType(e.target.value)}
              />{' '}
              Business Unit Policy
            </label>
            <label className="text-[#9E1B32]">
              <input
                type="radio"
                name="uploadType"
                value="group"
                onChange={(e) => setUploadType(e.target.value)}
              />{' '}
              Group Policy
            </label>
          </div>
        </div>

        {/* BU Selector for Business Upload */}
        {uploadType === 'business' && (
          <div>
            <label className="block mb-1 font-semibold text-[#9E1B32]">Select Business Unit(s):</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {businessUnits.map((bu) => {
                const isSelected = selectedBU.includes(bu);
                return (
                  <div
                    key={bu}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedBU(selectedBU.filter((b) => b !== bu));
                      } else {
                        setSelectedBU([...selectedBU, bu]);
                      }
                    }}
                    className={`relative cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ease-in-out ${
                      isSelected
                        ? 'bg-[#9E1B32] text-white border-[#9E1B32]'
                        : 'bg-gray-100 text-gray-700 hover:bg-[#FFE5E5]'
                    }`}
                  >
                    {isSelected && (
                      <span
                        className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full -top-2 -left-2 hover:bg-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBU(selectedBU.filter((b) => b !== bu));
                        }}
                      >
                        ❌
                      </span>
                    )}
                    {bu}
                  </div>
                );
              })}
            </div>
            {selectedBU.length === 0 && (
              <p className="mt-1 text-sm text-red-500">Please select at least one BU.</p>
            )}
          </div>
        )}

        {/* Exclude BU for Group Upload */}
        {uploadType === 'group' && (
          <div className="mb-4">
            <label className="block mb-2 font-medium text-[#9E1B32]">Exclude Business Unit(s) (optional):</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {businessUnits.map((bu) => {
                const isExcluded = excludeBU.includes(bu);
                return (
                  <div
                    key={bu}
                    onClick={() => {
                      if (isExcluded) {
                        setExcludeBU(excludeBU.filter((b) => b !== bu));
                      } else {
                        setExcludeBU([...excludeBU, bu]);
                      }
                    }}
                    className={`relative cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ease-in-out ${
                      isExcluded
                        ? 'bg-[#FFD200] text-black border-[#FFD200]'
                        : 'bg-gray-100 text-gray-700 hover:bg-[#FFF3BF]'
                    }`}
                  >
                    {isExcluded && (
                      <span
                        className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-black rounded-full -top-2 -left-2 hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExcludeBU(excludeBU.filter((b) => b !== bu));
                        }}
                      >
                        ❌
                      </span>
                    )}
                    {bu}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* File Uploader */}
        <div>
          <label className="block mb-1 font-semibold text-[#9E1B32]">Choose Files:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FFD200]"
          />
        </div>

        {/* Upload Button */}
        <div className="mt-4 text-center">
          <button
            onClick={handleUpload}
            className="px-6 py-2 font-medium text-white bg-[#9E1B32] rounded-full hover:bg-[#7d172a]"
          >
            Upload
          </button>
        </div>


      </div>
      <footer className="mt-12 bg-[#a41c1c] text-white py-6">
  <div className="max-w-6xl px-4 mx-auto">
    <div className="flex flex-col items-center justify-between md:flex-row">
      <p className="text-lg font-semibold">Powered by AVA</p>
      <p className="mt-2 text-sm md:mt-0">&copy; 2025 AVA. All rights reserved.</p>
    </div>
  </div>
</footer>
    </div>
    
  );
};

export default UploadPage;
