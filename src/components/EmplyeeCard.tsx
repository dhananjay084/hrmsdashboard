import React, { useState } from 'react';
import Male from "../assests/male_user.png";
import Female from "../assests/female_user.jpg";
import Image from "next/image";
import nookies from "nookies";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define the Employee interface
interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  empCode: string;
  gender: string;
  reportingManager: string | null;
  designation: string;
  salary: number;
  appraisalDate: string;
  joiningDate: string;
  dob: string;
  role: string;
  password: string;
  __v: number;
  refreshToken: string;
}

// Modify the EmployeeCardProps interface to accept employee as prop
interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const { firstName, lastName, designation, gender, email, _id } = employee;
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(employee);
  const cookies = nookies.get();
  const role = cookies.role;

  // Function to handle opening the modal and pre-filling it with current data
  const handleEditClick = () => {
    setFormData(employee); // Pre-fill form data with current employee values
    setShowModal(true); // Show the modal
  };

  // Function to close the modal
  const handleCloseModal = () => setShowModal(false);

  // Function to handle changes in form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission (API call to update employee)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://hrmsnode.onrender.com/api/users/${_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send updated form data to the backend
      });

      if (!response.ok) {
        throw new Error('Failed to update employee data');
      }

      const updatedEmployee = await response.json();
      console.log('Employee updated:', updatedEmployee);
      
      // Show success toast
      toast.success('Employee updated successfully!');

      // Close modal and reload the page after a delay (for toast visibility)
      setTimeout(() => {
        setShowModal(false);
        window.location.reload(); // Reload the page after update
      }, 1500); // 1.5 second delay for toast to be visible
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Error updating employee');
    }
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 shadow-sm flex flex-col items-start bg-white relative">
      {role === 'Admin' && (
        <button
          onClick={handleEditClick}
          className="absolute top-2 right-2 bg-gray-100 rounded-full p-2"
        >
          <span className="text-xl">✎</span> {/* Edit icon */}
        </button>
      )}
      <div className="flex gap-4">
        <Image 
          src={gender === 'Male' ? Male : Female} 
          alt="icon" 
          className="max-w-[50px]" 
        />
        <span>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {`${firstName} ${lastName}`} 
            <p className="text-sm font-normal">({gender})</p>
          </h2>

          <p className="text-gray-600">{designation}</p>
        </span>
      </div>
      <div className="flex justify-between items-center w-full mt-4">
        <a href={`mailto:${email}`} className="text-black text-sm">
          {email}
        </a>
        {role === "Admin" && (
          <a 
            href={`/employee/${_id}`} 
            className="px-3 py-1 rounded-[12px] bg-white text-black border border-black"
          >
            View Details
          </a>
        )}
      </div>

      {/* Modal for editing employee */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
            <form onSubmit={handleSubmit}>
              {/* Employee Code */}
              <div className="mb-4">
                <label className="block text-sm">Employee Code</label>
                <input
                  type="text"
                  name="empCode"
                  value={formData.empCode}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm">Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full mt-2"
                />
              </div>
              {/* Designation */}
              <div className="mb-4">
                <label className="block text-sm">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              {/* Salary */}
              <div className="mb-4">
                <label className="block text-sm">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              {/* Appraisal Date */}
              <div className="mb-4">
                <label className="block text-sm">Appraisal Date</label>
                <input
                  type="date"
                  name="appraisalDate"
                  value={formData.appraisalDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              {/* Joining Date */}
              <div className="mb-4">
                <label className="block text-sm">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full"
                />
              </div>
              {/* Submit buttons */}
              <div className="flex gap-4 mt-4">
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-black p-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
