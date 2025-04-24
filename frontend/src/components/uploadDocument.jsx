import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [userIdFromUrl, setUserIdFromUrl] = useState('');
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const cookies = parseCookies();
  
  useEffect(() => {
    // Extract userId from URL path (e.g., /employee/678501c6a59c85da207e3544)
    const urlParts = window.location.pathname.split('/');
    const userId = urlParts[urlParts.length - 1]; // Assuming userId is the last part of the URL
    setUserIdFromUrl(userId); // Set userId from URL to state
    
    const userRole = cookies.role; // Assuming role is saved in cookies
    setRole(userRole);

    if (userRole === 'Admin') {
      fetchUsers();
    }

    fetchDocuments(userId); // Always fetch documents using the userId from URL
  }, [cookies]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://hrmsnode.onrender.com/api/users'); // Replace with actual API URL
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching users');
    }
  };

  const fetchDocuments = async (userId) => {
    try {
      const response = await axios.get(`https://hrmsnode.onrender.com/api/documents?userId=${userId}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // toast.error('Error fetching documents'); // Toastify error message
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const userIdForUpload = role === 'Admin' ? selectedUserId : cookies.id; // Admin selects from dropdown, others use cookies' userId

    if (!file || !userIdForUpload) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('userId', userIdForUpload); // Use the appropriate userId for upload
    console.log(formData)
    try {
      await axios.post('https://hrmsnode.onrender.com/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchDocuments(userIdFromUrl); // Re-fetch documents after upload (from the URL userId)
      toast.success('Document uploaded successfully'); // Toastify success message
    } catch (error) {
      toast.error('Error uploading document'); // Toastify error message
      console.error('Error uploading document:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://hrmsnode.onrender.com/api/documents/${id}`);
      fetchDocuments(userIdFromUrl); // Re-fetch documents after delete (from the URL userId)
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

  const handleUserChange = (e) => {
    setSelectedUserId(e.target.value);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Upload & View Documents</h1>

      <div className="space-y-4 mb-6">
        {/* Only show User ID input if role is not Admin */}
        {role !== 'Admin' && (
          <div className='hidden'>
            <label className="block text-gray-700">User ID (Pre-filled from URL):</label>
            <input
              type="text"
              value={userIdFromUrl}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        )}

        {/* Dropdown for Admin to select a user */}
        {role === 'Admin' && (
          <select
            id="user"
            name="userId"
            value={selectedUserId}
            onChange={handleUserChange}
            className="w-full border border-[#d5d5d5] rounded-lg p-2 focus:outline-none"
            required
          >
            <option value="" disabled>Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        )}

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
