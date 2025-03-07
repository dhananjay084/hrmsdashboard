import React, { useState, useEffect } from 'react';
import { createTarget } from '../app/services';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TargetForm = () => {
    const [formData, setFormData] = useState({
        target: '',
        month: '',
        year: '',
        targetCompleted: 0,
        userId: '',
    });
    const [users, setUsers] = useState([]);

    const months = [
        { value: 1, label: 'Jan' },
        { value: 2, label: 'Feb' },
        { value: 3, label: 'Mar' },
        { value: 4, label: 'Apr' },
        { value: 5, label: 'May' },
        { value: 6, label: 'Jun' },
        { value: 7, label: 'Jul' },
        { value: 8, label: 'Aug' },
        { value: 9, label: 'Sep' },
        { value: 10, label: 'Oct' },
        { value: 11, label: 'Nov' },
        { value: 12, label: 'Dec' },
    ];

    const years = Array.from({ length: 11 }, (_, index) => 2020 + index);

    // Fetch users from the backend
    useEffect(() => {
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

        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTarget(formData); // Submit form data to the backend
            toast.success('Target created successfully');
            setFormData({ target: '', month: '', year: '', targetCompleted: 0, userId: '' }); // Reset form
        } catch (error) {
            console.error(error);
            toast.error('Error creating target');
        }
    };

    return (
        <>
            <h2 className="block text-left font-bold text-sm mb-4">Add Target</h2>
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 space-y-4">
                <div className="flex w-full gap-2">
                    <select
                        id="user"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        className="w-full border border-[#d5d5d5] rounded-lg p-2 focus:outline-none"
                        required
                    >
                        <option value="" disabled>
                            Select User
                        </option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        name="target"
                        placeholder="Target"
                        value={formData.target}
                        onChange={handleChange}
                        required
                        className="w-full border border-[#d5d5d5] rounded-lg p-2 focus:outline-none"
                    />
                </div>
                <div className="flex w-full gap-2">
                    <select
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        required
                        className="w-full border border-[#d5d5d5] rounded-lg p-2 focus:outline-none"
                    >
                        <option value="" disabled>
                            Select Month
                        </option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>

                    <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="w-full border border-[#d5d5d5] rounded-lg p-2 focus:outline-none"
                    >
                        <option value="" disabled>
                            Select Year
                        </option>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white rounded-lg p-2 mt-4 hover:bg-blue-600"
                >
                    Create Target
                </button>
            </form>

            {/* Toast container to render toast messages */}
            <ToastContainer />
        </>
    );
};

export default TargetForm;
