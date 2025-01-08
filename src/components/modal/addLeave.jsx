import React, { useState } from 'react';
import axios from 'axios';
import nookies from "nookies";
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for the toast

const LeaveFormModal = ({ isOpen, close }) => {
  const cookies = nookies.get();
  const userId = cookies.id;
  const [formData, setFormData] = useState({
    userId: userId,
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: '', // Add leaveType in form data
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://hrmsnode.onrender.com/api/leaves', formData);
      toast.success('Leave request created successfully!', {
        onClose: () => {
          setTimeout(() => {
            close(); // Close the modal after 1 second
          }, 1000); // Delay the closing of the modal by 1 second
        }
      });
      console.log(response.data);
    } catch (error) {
      toast.error('Error creating leave request!');
      console.error(error);
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded shadow-lg w-96 absolute right-5">
            <h2 className="text-lg font-bold mb-4">Request Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="userId" className="block mb-1 font-medium">User ID</label>
                <input
                  type="text"
                  name="userId"
                  id="userId"
                  value={userId}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label htmlFor="startDate" className="block mb-1 font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="endDate" className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="reason" className="block mb-1 font-medium">Reason</label>
                <textarea
                  name="reason"
                  id="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="leaveType" className="block mb-1 font-medium">Leave Type</label>
                <select
                  name="leaveType"
                  id="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Planned">Planned Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="WFH">Work From Home (WFH)</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={close}
                  className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeButton
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default LeaveFormModal;
