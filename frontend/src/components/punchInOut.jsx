import { useState, useEffect } from 'react';
import axios from 'axios';
import nookies from "nookies";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Office Coordinates in decimal format
const officeCoordinates = [
    { latitude: 28.444781580071357, longitude: 77.0597615823928 },
    { latitude: 23.867488, longitude: 86.159440 },
];

const PunchInOut = () => {
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [todayPunchIn, setTodayPunchIn] = useState(null);
    const [todayPunchOut, setTodayPunchOut] = useState(null);
    const [selectedDatePunchIn, setSelectedDatePunchIn] = useState(null);
    const [selectedDatePunchOut, setSelectedDatePunchOut] = useState(null);
    const [isPunchInDisabled, setIsPunchInDisabled] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');  // Initially empty
    const cookies = nookies.get();
    const userId = cookies.id;

    // Get today's date for filter purposes
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    };

    // Format the date to '5 Jan 2025 7:44 PM' format
    const formatDate = (date) => {
        const options = {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Date(date).toLocaleString('en-GB', options);
    };

    // Fetch Punch In and Punch Out records for today's date
    const fetchTodayPunchRecords = async () => {
        try {
            const response = await axios.get(`https://hrmsnode.onrender.com/api/punch/records/${userId}?date=${getTodayDate()}`);
            if (response.data && response.data.length > 0) {
                const { punchInTime, punchOutTime } = response.data[0];
                setTodayPunchIn(punchInTime ? formatDate(punchInTime) : null);
                setTodayPunchOut(punchOutTime ? formatDate(punchOutTime) : null);
                setIsPunchInDisabled(punchInTime !== null); // Disable Punch-In if already punched in
            }
        } catch (error) {
            console.error('Error fetching punch records for today:', error);
        }
    };

    // Fetch Punch In and Punch Out records for the selected date
    const fetchSelectedDatePunchRecords = async (date) => {
        try {
            const response = await axios.get(`https://hrmsnode.onrender.com/api/punch/records/${userId}?date=${date}`);
            if (response.data && response.data.length > 0) {
                const { punchInTime, punchOutTime } = response.data[0];
                setSelectedDatePunchIn(punchInTime ? formatDate(punchInTime) : null);
                setSelectedDatePunchOut(punchOutTime ? formatDate(punchOutTime) : null);
            } else {
                setSelectedDatePunchIn(null);
                setSelectedDatePunchOut(null);
            }
        } catch (error) {
            console.error('Error fetching punch records for selected date:', error);
        }
    };

    // Get the current location of the user
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    toast.success(`Location fetched successfully! Latitude: ${latitude}, Longitude: ${longitude}`);
                },
                (error) => {
                    console.error('Geolocation Error:', error);
                    toast.error('Error getting location. Please enable location services and try again.');
                },
                { timeout: 10000 }
            );
        } else {
            toast.error('Geolocation is not supported by this browser.');
        }
    };

    // Haversine formula to calculate the distance between two coordinates
    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km
        return distance * 1000; // Convert to meters
    };

    // Function to handle Punch-In action
    const punchIn = async () => {
        const { latitude, longitude } = location;

        if (!latitude || !longitude) {
            toast.error('Location not available. Please fetch location first.');
            return;
        }

        if (isPunchInDisabled) {
            toast.info('Already punched in!');
            return;
        }

        let isWithinRadius = false;

        // Loop through office coordinates to check if within 3km radius
        for (const coord of officeCoordinates) {
            const distance = haversineDistance(
                latitude,
                longitude,
                coord.latitude,
                coord.longitude
            );

            // Check if the user is within 3km radius
            if (distance <= 3000) { // 3 km (3000 meters)
                isWithinRadius = true;
                break;
            }
        }

        if (isWithinRadius) {
            try {
                const response = await axios.post('https://hrmsnode.onrender.com/api/punch/punch-in', {
                    userId,
                    latitude,
                    longitude,
                });


                if (response.status === 201 && response.data.message === 'Punch-in recorded successfully') {
                    toast.success(response.data.message); // Correct toast message
                    fetchTodayPunchRecords();
                    setTimeout(() => {
                        window.location.reload(); // Reload the page after punch-in
                    }, 1000); // Add a small delay to allow the toast to display
                } else {
                    toast.error(response.data.message || 'Error recording punch-in. Please try again.');
                }
            } catch (error) {
                console.error('Punch-In Error:', error);
                toast.error('Failed to record punch-in. Server error.');
            }
        } else {
            // Show the error message that it's outside 500 meters, but technically it's checking 3 km
            toast.error('Not in office. Your location is outside the 500m radius.');
        }
    };

    // Function to handle Punch-Out action
    const punchOut = async () => {
        const { latitude, longitude } = location;

        if (!latitude || !longitude) {
            toast.error('Location not available. Please fetch location first.');
            return;
        }

        try {
            let isWithinRadius = false;

            // Loop through office coordinates to check if within 3km radius
            for (const coord of officeCoordinates) {
                const distance = haversineDistance(
                    latitude,
                    longitude,
                    coord.latitude,
                    coord.longitude
                );

                // Check if the user is within 3km radius
                if (distance <= 3000) { // 3 km (3000 meters)
                    isWithinRadius = true;
                    break;
                }
            }

            if (isWithinRadius) {
                const response = await axios.post('https://hrmsnode.onrender.com/api/punch/punch-out', {
                    userId,
                    latitude,
                    longitude,
                });

                if (response.status === 200 && response.data.message === 'Punch-out recorded successfully') {
                    toast.success(response.data.message); // Correct toast message
                    fetchTodayPunchRecords(); // Update punch-out status
                    setTimeout(() => {
                        window.location.reload(); // Reload the page after punch-out
                    }, 1500); // Add a small delay to allow the toast to display
                } else {
                    toast.error(response.data.message || 'Error recording punch-out. Please try again.');
                }
            } else {
                // Show the error message that it's outside 500 meters, but technically it's checking 3 km
                toast.error('Not in office. Your location is outside the 500m radius.');
            }
        } catch (error) {
            console.error('Punch-Out Error:', error);
            toast.error('Failed to record punch-out. Server error.');
        }
    };

    // Handle date change and fetch records for selected date
    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setSelectedDate(newDate);

        setSelectedDatePunchIn(null);
        setSelectedDatePunchOut(null);

        fetchSelectedDatePunchRecords(newDate);
    };

    // Fetch records for today when component mounts
    useEffect(() => {
        fetchTodayPunchRecords(); // Fetch today's records by default
    }, []);

    return (
        <div className='flex justify-between items-center gap-4'>
            <div className='w-full bg-white shadow-lg rounded-lg p-4 text-center mb-4 mx-auto'>
                <h1 className="text-lg font-semibold mb-4">Punch In / Punch Out</h1>

                <div className="flex items-center justify-center p-6 pt-0 mx-auto gap-2">
                    <button className="bg-[#3788D8] px-2 py-1 rounded-lg text-white" onClick={getLocation}>Get Location</button>
                    <button className="bg-[#3788D8] px-2 py-1 rounded-lg text-white" onClick={punchIn} disabled={isPunchInDisabled}>Punch In</button>
                    <button className="bg-[#3788D8] px-2 py-1 rounded-lg text-white" onClick={punchOut}>Punch Out</button>
                </div>
            </div>

            {/* Today Punch Details */}
            <div className='w-full bg-white shadow-lg rounded-lg p-4 text-center mb-4 mx-auto text-start'>
                <h2 className="text-lg font-semibold mb-4">Today Punch</h2>
                <div className="mt-4 flex gap-4">
                    <div className="flex flex-col items-start mb-2">
                        <label className="text-lg font-semibold text-gray-700">Punch-In Time</label>
                        {todayPunchIn ? (
                            <p className="text-lg text-gray-700">{todayPunchIn}</p>
                        ) : (
                            <p className="text-lg text-gray-700">No Record for today.</p>
                        )}
                    </div>

                    <div className="flex flex-col items-start">
                        <label className="text-lg font-semibold text-gray-700">Punch-Out Time</label>
                        {todayPunchOut ? (
                            <p className="text-lg text-gray-700">{todayPunchOut}</p>
                        ) : (
                            <p className="text-lg text-gray-700">No Record for today.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Selected Date Punch Details */}
            <div className='w-full bg-white shadow-lg rounded-lg p-4 text-center mb-4 mx-auto'>
                <div className="flex flex-col items-start mt-4">
                    <label htmlFor="date" className="text-gray-700 mb-2">
                        Select Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="p-3 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                {selectedDate && (
                    <>
                        <h2 className="text-lg font-semibold mb-4 text-start mt-2">Punch for {selectedDate}</h2>
                        <div className="mt-4 flex gap-4">
                            <div className="flex flex-col items-start mb-2">
                                <label className="text-lg font-semibold text-gray-700">Punch-In Time</label>
                                {selectedDatePunchIn ? (
                                    <p className="text-lg text-gray-700">{selectedDatePunchIn}</p>
                                ) : (
                                    <p className="text-lg text-gray-700">No Punch-In recorded</p>
                                )}
                            </div>

                            <div className="flex flex-col items-start">
                                <label className="text-lg font-semibold text-gray-700">Punch-Out Time</label>
                                {selectedDatePunchOut ? (
                                    <p className="text-lg text-gray-700">{selectedDatePunchOut}</p>
                                ) : (
                                    <p className="text-lg text-gray-700">No Punch-Out recorded</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <ToastContainer position="top-right" autoClose={1000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default PunchInOut;
