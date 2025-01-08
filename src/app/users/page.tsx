'use client';

import React, { useState, useEffect } from 'react';
import EmployeeCard from '@/components/EmplyeeCard';
import AddEmployeeModal from '@/components/modal/addEmployee';
import LeaveAdjustmentModal from '@/components/modal/addLeaveCount';
import { toast, ToastContainer } from 'react-toastify'; // Importing react-toastify for toast messages
import 'react-toastify/dist/ReactToastify.css'; // Import the necessary CSS for toast styling

// Define Employee interface based on the provided object structure
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

export default function EmployeesPage() {
  // Manage the state for modal visibility and employee list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen1, setIsModalOpen1] = useState(false);

  // Fetch employee data
  const fetchEmployees = async () => {
    const res = await fetch('https://hrmsnode.onrender.com/api/users', {
      next: { revalidate: 10 }, // Cache revalidation every 10 seconds
    });

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data: Employee[] = await res.json(); // Fetch and typecast response data
    setEmployees(data); // Update employee state
  };

  // UseEffect to fetch employees when the component mounts
  useEffect(() => {
    fetchEmployees();
  }, [setEmployees]); // Empty dependency array to ensure it only fetches once on mount

  // Handle the addition of a new employee
  const handleEmployeeAdded = (newEmployee: Employee) => {
    setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);

    // Show a success toast with auto-close after 1 second
    toast.success('New employee added successfully!', {
      autoClose: 1000, // Auto-close the toast after 1 second
      onClose: () => {
        fetchEmployees(); // Refresh the employees list when the toast closes
      }
    });
  };

  // Open/close modals
  const openModal = () => setIsModalOpen1(true);
  const closeModal = () => setIsModalOpen1(false);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employees</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)} // Open Add Employee modal
            className="px-4 py-3 rounded-[12px] bg-white text-black border border-black"
          >
            Add Employee
          </button>
          <button
            onClick={openModal} // Open Adjust Leave modal
            className="px-4 py-3 rounded-[12px] bg-white text-black border border-black"
          >
            Adjust Leave Balance
          </button>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <EmployeeCard key={employee._id} employee={employee} />
        ))}
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen} // Pass modal open state
        onClose={() => setIsModalOpen(false)} // Close modal handler
        onEmployeeAdded={handleEmployeeAdded} // Callback to update employees
      />
      {/* Leave Adjustment Modal */}
      {isModalOpen1 && <LeaveAdjustmentModal closeModal={closeModal} />}
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
