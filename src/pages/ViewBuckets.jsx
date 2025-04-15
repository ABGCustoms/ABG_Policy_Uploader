import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FILES_PER_FOLDER = 5;
const FOLDERS = ['group', 'business', 'root'];
const BASE_URL = 'https://oxstgz3tarswqf7yqbf2bcfcx4.apigateway.ap-mumbai-1.oci.customer-oci.com/oda/abg_policy_uploader/';

function ViewBuckets() {
  const [buckets, setBuckets] = useState([]);
  const [files, setFiles] = useState({});
  const [counts, setCounts] = useState({});
  const [visibleCounts, setVisibleCounts] = useState({});
  const [expandedBuckets, setExpandedBuckets] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBucketsAndFiles = async () => {
      try {
        const { data: bucketList } = await axios.get(`${BASE_URL}?type=bucketlist`);
        setBuckets(bucketList);

        const filePromises = bucketList.map(bucket =>
          axios.post(`${BASE_URL}?type=getfiles`, { bucketName: bucket.name })
        );

        const fileResults = await Promise.all(filePromises);

        const filesData = {};
        const countsData = {};
        const visibleData = {};
        const expandedData = {};

        bucketList.forEach((bucket, index) => {
          const { files: bucketFiles, counts: bucketCounts } = fileResults[index].data;
          filesData[bucket.name] = bucketFiles;
          countsData[bucket.name] = bucketCounts;
          visibleData[bucket.name] = FOLDERS.reduce((acc, folder) => {
            acc[folder] = FILES_PER_FOLDER;
            return acc;
          }, {});
          expandedData[bucket.name] = false; // collapsed by default
        });

        setFiles(filesData);
        setCounts(countsData);
        setVisibleCounts(visibleData);
        setExpandedBuckets(expandedData);
      } catch (error) {
        console.error('Error fetching buckets or files:', error);
      }
    };

    fetchBucketsAndFiles();
  }, []);

  const toggleShowMore = (bucketName, folder) => {
    setVisibleCounts(prev => {
      const current = prev[bucketName]?.[folder] || FILES_PER_FOLDER;
      const total = counts[bucketName]?.[folder] || 0;

      return {
        ...prev,
        [bucketName]: {
          ...prev[bucketName],
          [folder]: current >= total ? FILES_PER_FOLDER : total,
        },
      };
    });
  };

  const toggleBucketExpand = bucketName => {
    setExpandedBuckets(prev => ({
      ...prev,
      [bucketName]: !prev[bucketName],
    }));
  };

  const deleteFile = async (bucketName, fileName) => {
    try {
      await axios.delete(`${BASE_URL}?type=deletefile`, {
        data: { fileName, bucketName },
      });

      setFiles(prev => {
        const updated = { ...prev };
        FOLDERS.forEach(folder => {
          updated[bucketName][folder] = updated[bucketName][folder].filter(f => f !== fileName);
        });
        return updated;
      });

      setCounts(prev => {
        const updated = { ...prev };
        FOLDERS.forEach(folder => {
          updated[bucketName][folder] = files[bucketName][folder].filter(f => f !== fileName).length;
        });
        updated[bucketName].total =
          updated[bucketName].group +
          updated[bucketName].business +
          updated[bucketName].root;
        return updated;
      });
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const renderFiles = (bucketName, folder) => {
    const folderFiles = files[bucketName]?.[folder] || [];
    const visible = visibleCounts[bucketName]?.[folder] || FILES_PER_FOLDER;
    const displayFiles = folderFiles.slice(0, visible);

    return (
      <>
        <ul className="pl-5 mt-2 space-y-2 list-decimal text-sm text-[#4b2e2e]">
          {displayFiles.map(file => (
            <li key={file} className="flex items-center justify-between pr-2">
              <span className="truncate max-w-[70%]">{file.replace(`${folder}/`, '')}</span>
              <button
                className="px-2 py-1 ml-2 text-xs text-white transition bg-red-500 rounded hover:bg-red-600"
                onClick={() => deleteFile(bucketName, file)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {folderFiles.length > FILES_PER_FOLDER && (
          <button
            className="mt-2 ml-4 text-sm font-medium text-[#a41c1c] hover:underline"
            onClick={() => toggleShowMore(bucketName, folder)}
          >
            {visible >= folderFiles.length ? 'Show Less' : 'Show More'}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-[#a41c1c]">📦 Buckets Overview</h1>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#a41c1c] text-white rounded hover:bg-[#841313] transition"
        >
          Home
        </button>
      </div>

      {buckets.map(bucket => (
        <div key={bucket.name} className="mb-4 p-4 bg-white rounded-2xl shadow border border-[#a41c1c]/30">
          <div
            onClick={() => toggleBucketExpand(bucket.name)}
            className="flex items-center justify-between cursor-pointer"
          >
            <h2 className="text-xl font-bold text-[#a41c1c]">{bucket.name}</h2>
            <span className="text-sm text-gray-600">
              {expandedBuckets[bucket.name] ? '🔼 Collapse' : '🔽 Expand'}
            </span>
          </div>

          {expandedBuckets[bucket.name] && (
            <>
              <p className="mt-1 text-sm text-gray-600">
                Total Files: <span className="font-semibold text-[#4b2e2e]">{counts[bucket.name]?.total || 0}</span>
              </p>

              {FOLDERS.map(folder => (
                <div key={folder} className="pl-2 mt-5">
                  <h3 className="text-md font-semibold text-[#4b2e2e] capitalize">
                    📁 {folder} Folder ({counts[bucket.name]?.[folder] || 0})
                  </h3>
                  {counts[bucket.name]?.[folder] > 0 ? (
                    renderFiles(bucket.name, folder)
                  ) : (
                    <p className="ml-4 text-sm italic text-gray-400">No files</p>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewBuckets;
