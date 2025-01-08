import { useState, useEffect } from 'react';
import axios from 'axios';
import nookies from "nookies";
import { Button, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Office Coordinates
const officeCoordinates = {
    latitude: 28.4688384,
    longitude: 77.0310144,
};

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

    // Get the current location of the user
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.log(error);
                    toast.error('Error getting location. Please try again.');
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
        return distance;
    };

    // Function to handle Punch-In action
    const punchIn = async () => {
        const { latitude, longitude } = location;

        // Check if location is available
        if (!latitude || !longitude) {
            toast.error('Location not available. Please get location first.');
            return;
        }

        // Calculate distance between office and user location
        const distance = haversineDistance(latitude, longitude, officeCoordinates.latitude, officeCoordinates.longitude);
        console.log("Distance calculated:", distance); // Debugging log

        // Check if the distance is within 2 km
        if (distance <= 2) { // User is within 2 km radius of office
            try {
                const response = await axios.post('https://hrmsnode.onrender.com/api/punch/punch-in', {
                    userId,
                    latitude,
                    longitude,
                });

                console.log('Punch-In Response:', response);

                // Check the response data and update status accordingly
                if (response.data) {
                    toast.success('Punch-in recorded successfully!');
                    fetchTodayPunchRecords();  // Fetch today's punch records after successful punch-in
                } else {
                    toast.error('Error recording punch-in.');
                }
            } catch (error) {
                console.log('Punch-In Error:', error);
                toast.error('Error recording punch-in.');
            }
        } else {
            // If not within 2 km, show error message
            toast.error('Not in office (Location outside 2km radius)');
        }
    };

    // Function to handle Punch-Out action
    const punchOut = async () => {
        const { latitude, longitude } = location;

        // Check if location is available
        if (!latitude || !longitude) {
            toast.error('Location not available. Please get location first.');
            return;
        }

        try {
            const response = await axios.post('https://hrmsnode.onrender.com/api/punch/punch-out', {
                userId,
                latitude,
                longitude,
            });
            console.log('Punch-Out Response:', response);
            toast.success('Punch-out recorded successfully!');
            fetchTodayPunchRecords();  // Fetch today's punch records after successful punch-out
        } catch (error) {
            console.log('Punch-Out Error:', error);
            toast.error('Error recording punch-out.');
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
                    <Button variant="contained" onClick={getLocation}>Get Location</Button>
                    <Button variant="contained" onClick={punchIn} disabled={isPunchInDisabled}>Punch In</Button>
                    <Button variant="contained" onClick={punchOut}>Punch Out</Button>
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
    <TextField
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        label="Select Date"
        variant="outlined"
        className="mt-4"
        InputLabelProps={{
            shrink: true,  // Ensures the label doesn't overlap the input field
        }}
        InputProps={{
            inputProps: {
                placeholder: '',  // Remove the placeholder
            }
        }}
    />
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
