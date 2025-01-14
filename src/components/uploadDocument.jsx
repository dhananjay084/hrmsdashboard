import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Get the userId from cookies using nookies
    const cookies = parseCookies();
    const userIdFromCookie = cookies.id; // Assuming userId is stored in cookies as 'id'

    if (userIdFromCookie) {
      setUserId(userIdFromCookie); // Set the userId from cookies into state
    }

    if (userIdFromCookie) {
      fetchDocuments(userIdFromCookie); // Fetch documents for this user
    }
  }, []);

  const fetchDocuments = async (userId) => {
    try {
      const response = await axios.get(`https://hrmsnode.onrender.com/api/documents?userId=${userId}`);
      setDocuments(response.data);
    } catch (error) {
    //    toast.error('Error fetching documents'); // Toastify error message
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !userId) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('userId', userId); // Send the userId from the cookie

    try {
      await axios.post('https://hrmsnode.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchDocuments(userId); // Re-fetch the documents after upload
      toast.success('Document uploaded successfully'); // Toastify success message
    } catch (error) {
      toast.error('Error uploading document'); // Toastify error message
      console.error('Error uploading document:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hrmsnode.onrender.com/api/documents/${id}`);
      fetchDocuments(userId); // Re-fetch documents after delete
      toast.success('Document deleted successfully'); // Toastify success message
    } catch (error) {
      toast.error('Error deleting document'); // Toastify error message
      console.error('Error deleting document:', error);
    }
  };

  const handleToastClose = () => {
    // Reload the page after toast closes
    window.location.reload();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Upload & View Documents</h1>

      <div className="space-y-4 mb-6">
        <div className='hidden'>
          <label className="block text-gray-700">User ID (Pre-filled from Cookies):</label>
          <input
            type="text"
            value={userId}
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700">Upload Document:</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Upload Document
          </button>
        </div>
      </div>

      <div className='max-h-[200px] overflow-y-auto'>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Documents List</h2>
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li key={doc._id} className="flex items-center justify-between p-4 border-b border-gray-300 rounded-lg">
              <a
                href={`https://hrmsnode.onrender.com${doc.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {doc.fileName}
              </a>
              <button
                onClick={() => handleDelete(doc._id)}
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Toast Container with onClose callback to reload page */}
      <ToastContainer 
        autoClose={3000} 
        position="top-center" 
        onClose={handleToastClose}  // Trigger page reload when the toast closes
      />
    </div>
  );
};

export default Documents;
