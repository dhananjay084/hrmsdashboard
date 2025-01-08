import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface User {
    _id: string;
    firstName: string;
    lastName: string;
}

interface LeaveAdjustmentModalProps {
    closeModal: () => void;
}

interface FormData {
    userId: string;
    leaveType: string;
    adjustment: string;
}

const LeaveAdjustmentModal: React.FC<LeaveAdjustmentModalProps> = ({ closeModal }) => {
    const [formData, setFormData] = useState<FormData>({
        userId: '',
        leaveType: '',
        adjustment: '',
    });
    const [users, setUsers] = useState<User[]>([]);
    const leaveTypes = ['Sick', 'Planned', 'WFH', 'Casual'];

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://hrmsnode.onrender.com/api/users');
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Error fetching users');
            }
        };

        fetchUsers();
    }, []);

    // Handle form input changes
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Ensure adjustment is a number
        const adjustedFormData = {
            ...formData,
            adjustment: Number(formData.adjustment), // Parse adjustment as a number
        };

        try {
            const response = await fetch('https://hrmsnode.onrender.com/api/leavecount/adjust-leave-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adjustedFormData),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success(result.message, {
                    autoClose: 1000,
                    onClose: () => {
                        setFormData({ userId: '', leaveType: '', adjustment: '' });
                        closeModal(); // Close modal after toast
                    },
                }); // Success toast with onClose callback
            } else {
                toast.error(result.message || 'Error adjusting leave balance');
            }
        } catch (error) {
            console.error('Error adjusting leave balance:', error);
            toast.error('Error adjusting leave balance');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Adjust Leave Balance</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="userId" className="block text-sm font-medium mb-2">
                            Select User:
                        </label>
                        <select
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="" disabled>
                                Select a user
                            </option>
                            {users.map((user) => (
                                <option key={user._id} value={user._id}>
                                    {user.firstName} {user.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="leaveType" className="block text-sm font-medium mb-2">
                            Leave Type:
                        </label>
                        <select
                            id="leaveType"
                            name="leaveType"
                            value={formData.leaveType}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                        >
                            <option value="" disabled>
                                Select leave type
                            </option>
                            {leaveTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="adjustment" className="block text-sm font-medium mb-2">
                            Adjustment (Positive or Negative):
                        </label>
                        <input
                            type="number"
                            id="adjustment"
                            name="adjustment"
                            value={formData.adjustment}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter adjustment value"
                            required
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>

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

export default LeaveAdjustmentModal;
