import { useState, useEffect } from 'react';
import axios from 'axios';
import nookies from "nookies";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Office Coordinates
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
            console.log("response1",response.data)
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
            console.log("response2",response.data)

            if (response.data && response.data.length > 0) {
                const { punchInTime, punchOutTime } = response.data[0];
                setSelectedDatePunchIn(punchInTime ? formatDate(punchInTime) : null);
                setSelectedDatePunchOut(punchOutTime ? formatDate(punchOutTime) : null);
            } else {
                // No records found for this date, clear punch-in and punch-out
                setSelectedDatePunchIn(null);
                setSelectedDatePunchOut(null);
            }
        } catch (error) {
            console.error('Error fetching punch records for selected date:', error);
        }
    };
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });
                    alert(`Location fetched successfully! Latitude: ${latitude}, Longitude: ${longitude}`); // Alert with details
                    console.log('Fetched Location:', { latitude, longitude });
                },
                (error) => {
                    console.error('Geolocation Error:', error);
                    toast.error('Error getting location. Please enable location services and try again.');
                },
                { timeout: 10000 } // Timeout after 10 seconds if location is not fetched
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
        console.log('Calculated Distance (km):', distance);
        return distance;
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
    
        for (const coord of officeCoordinates) {
            const distance = haversineDistance(
                latitude,
                longitude,
                coord.latitude,
                coord.longitude
            );
    
            if (distance <= 2) {
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
    
                console.log('Punch-In API Response:', response);
    
                if (response.status === 200 && response.data?.success) {
                    toast.success(response.data.message || 'Punch-in recorded successfully!');
                    fetchTodayPunchRecords();
                } else {
                    toast.error(response.data.message || 'Error recording punch-in. Please try again.');
                }
            } catch (error) {
                console.error('Punch-In Error:', error);
                toast.error('Failed to record punch-in. Server error.');
            }
        } else {
            toast.error('Not in office. Your location is outside the 2 km radius.');
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
            const response = await axios.post('https://hrmsnode.onrender.com/api/punch/punch-out', {
                userId,
                latitude,
                longitude,
            });
    
            console.log('Punch-Out API Response:', response);
    
            if (response.status === 200 && response.data?.success) {
                toast.success(response.data.message || 'Punch-out recorded successfully!');
                fetchTodayPunchRecords(); // Update punch-out status
            } else {
                toast.error(response.data.message || 'Error recording punch-out. Please try again.');
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

        // Reset selected date punch-in and punch-out times immediately before fetching new records
        setSelectedDatePunchIn(null);
        setSelectedDatePunchOut(null);

        // Fetch punch records for the selected date
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
                    <button   className="bg-[#3788D8] px-2 py-1 rounded-lg text-white" onClick={getLocation}>Get Location</button>
                    <button   className="bg-[#3788D8] px-2 py-1 rounded-lg text-white"  onClick={punchIn} disabled={isPunchInDisabled}>Punch In</button>
                    <button   className="bg-[#3788D8] px-2 py-1 rounded-lg text-white"  onClick={punchOut}>Punch Out</button>
                </div>
            </div>

            <div className='w-full bg-white shadow-lg rounded-lg p-4 text-center mb-4 mx-auto text-start'>
    <h2 className="text-lg font-semibold mb-4">Today Punch</h2>
    <div className="mt-4 flex gap-4">
        <div className="flex flex-col items-start mb-2">
            <label className="text-lg font-semibold text-gray-700">Punch-In Time</label>
            {todayPunchIn ? (
                <p className="text-lg text-gray-700">{todayPunchIn}</p>
            ) : (
                <p className="text-lg text-gray-700">No  Record for today.</p>
            )}
        </div>

        <div className="flex flex-col items-start">
            <label className="text-lg font-semibold text-gray-700">Punch-Out Time</label>
            {todayPunchOut ? (
                <p className="text-lg text-gray-700">{todayPunchOut}</p>
            ) : (
                <p className="text-lg text-gray-700">No  Record for today.</p>
            )}
        </div>
    </div>
</div>


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
                    <p className="text-lg text-gray-700">No Punch-In recorded </p>
                )}
            </div>

            <div className="flex flex-col items-start">
                <label className="text-lg font-semibold text-gray-700">Punch-Out Time</label>
                {selectedDatePunchOut ? (
                    <p className="text-lg text-gray-700">{selectedDatePunchOut}</p>
                ) : (
                    <p className="text-lg text-gray-700">No Punch-Out recorded </p>
                )}
            </div>
        </div>
        </>
    )}
</div>


            {/* ToastContainer to display the toasts */}
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default PunchInOut;
