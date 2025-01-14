import { useEffect, useState } from 'react';
import axios from 'axios';

const PunchRecordsTable = () => {
    const [users, setUsers] = useState([]); // Store users from the API
    const [punchRecords, setPunchRecords] = useState([]); // Store punch records
    const [selectedUserId, setSelectedUserId] = useState(''); // User ID filter
    const [selectedDate, setSelectedDate] = useState(''); // Date filter
    const [loading, setLoading] = useState(false); // To track loading state
    const [errorMessage, setErrorMessage] = useState(''); // To track error messages

    // Fetch users from the /api/users endpoint
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://hrmsnode.onrender.com/api/users');
                setUsers(response.data); // Set the users state
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Fetch punch records based on selected user ID and date filter
    useEffect(() => {
        const fetchPunchRecords = async () => {
            setLoading(true);
            setErrorMessage(''); // Clear any previous error messages
            try {
                const params = {};
                if (selectedUserId) params.userId = selectedUserId;
                if (selectedDate) params.date = selectedDate;

                const response = await axios.get('https://hrmsnode.onrender.com/api/punch/records', { params });
                if (response.data.length === 0) {
                    setErrorMessage('No punch records found for the selected filters.');
                } else {
                    setPunchRecords(response.data); // Set punch records data
                }
            } catch (error) {
                console.error('Error fetching punch records:', error);
                setErrorMessage('An error occurred while fetching punch records.');
            }
            setLoading(false);
        };

        fetchPunchRecords();
    }, [selectedUserId, selectedDate]); // Re-fetch when user or date filter changes

    // Handle change in user dropdown
    const handleUserChange = (event) => {
        setSelectedUserId(event.target.value);
    };

    // Handle change in date input
    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    return (
        <div className="max-w-[90%] mx-auto rounded-md shadow-lg py-2 px-4 bg-white mt-4 max-h-[400px] overflow-y-auto">
            <h2><b>Punch In Records</b></h2>

            <div className='flex items-center gap-4'>
                <div>
                    <label className="block mb-2">User:</label>
                    <select className="border p-2" value={selectedUserId} onChange={handleUserChange}>
                        <option value="">All Users</option>
                        {users.map((user) => (
                            <option key={user._id} value={user._id}>
                                {user.firstName} {user.lastName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block  mb-2">
                        Date:
                    </label>

                    <input className='border border-gray p-2' type="date" value={selectedDate} onChange={handleDateChange} />
                </div>
            </div>

            {/* Loading spinner */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {/* Error message */}

                    {/* Display punch records table */}
                    <table border="1" cellPadding="10" cellSpacing="0" className="min-w-full border-collapse border border-gray-300 text-left text-sm mt-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Punch-In Time</th>
                                <th className="border border-gray-300 px-4 py-2">Punch-Out Time</th>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!errorMessage ? (
                                punchRecords.map((record) => {
                                    const user = users.find((user) => user._id === record.userId);
                                    const userName = user ? `${user.firstName} ${user.lastName}` : 'Unknown';

                                    return (
                                        <tr key={record._id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2 text-center">{userName}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{new Date(record.punchInTime).toLocaleString()}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                {record.punchOutTime ? new Date(record.punchOutTime).toLocaleString() : 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">{new Date(record.punchInTime).toLocaleDateString()}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No punch records available for the selected filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default PunchRecordsTable;
