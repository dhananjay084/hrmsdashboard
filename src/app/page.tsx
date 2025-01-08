"use client";
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import SickSharpIcon from '@mui/icons-material/SickSharp';
import DirectionsWalkSharpIcon from '@mui/icons-material/DirectionsWalkSharp';
import { Button } from '@mui/material';
import ClientCalendar from '@/components/Calendar';
import { useEffect, useState } from 'react';
import ProgressBar from '@/components/Progress';
import StarsIcon from '@mui/icons-material/Stars';
import CakeIcon from '@mui/icons-material/Cake';
import LeaveFormModal from "@/components/modal/addLeave";
import Punch from "@/components/punchInOut"
import nookies from "nookies";

import { toast } from 'react-toastify';

// User Interface
interface User {
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
  
  // Leave Interface
  interface Leave {
    _id: string;
    userId: User;  // Nested User object
    startDate: string;
    endDate: string;
    reason: string;
    noOfDays: number;
    status: string;
    leaveType: string;  // "Casual", "Sick", etc.
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
type LeaveData = {
    Casual: number;
    Planned: number;
    Sick: number;
    WFH: number;
};
type LeaveDataCount = {
    Casual: number;
    Planned: number;
    Sick: number;
    WFH: number;
};
interface Announcement {
    _id: string;
    announcement: string;
  }
  interface Users {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    empCode: string;
    gender: string;
    reportingManager: string | null;
    designation: string;
    salary: number;
    appraisalDate: string; // You can use `Date` type if you parse it into a JavaScript Date object.
    joiningDate: string; // Same as above, use `Date` if you're parsing this to a Date object.
    dob: string; // Same as above.
    role: string;
    password: string;
    __v: number;
    refreshToken: string;
  }
  
const Dashboard = () => {
    // const [selected, setSelected] = useState('Leaves');
    const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);
    const [leaveData, setLeaveData] = useState<LeaveData>({ Casual: 0, Planned: 0, Sick: 0, WFH: 0 });
    const [leaveDataCount, setLeaveDataCount] = useState<LeaveDataCount>({ Casual: 0, Planned: 0, Sick: 0, WFH: 0 });
    const [, setMonthlyCasual] = useState();
    const [, setMonthlyPlanned] = useState();
    const [, setMonthlySick] = useState();
    // const [, setMonthlyWFH] = useState();
    const [month,] = useState(12);
    const [year,] = useState(2024);
    const [, setprogress] = useState(2024);

    const [AllLeave, setLeaves] = useState<Leave[]>([]);
    const [, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState<Users[]>([]);


    const cookies = nookies.get();
    const userId = cookies.id;
    const role = cookies.role;

    useEffect(() => {
        const FetchData = async () => {
            try {
                const response = await fetch(`https://hrmsnode.onrender.com/api/leavecount/getbalance/${userId}`);

                if (!response.ok) {
                    throw new Error('Error fetching leaves');
                }

                const data = await response.json();
                console.log(data);
                setLeaveData(data.leaveBalances);
                setLeaveDataCount(data.totalLeavesApplied);
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error;
            }
        };

        const FetchCasual = async () => {
            try {
                const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=Casual`);
                if (!response.ok) {
                    throw new Error('Error fetching leaves');
                }
                const data = await response.json();
                const totalNoOfDays = data.map((leave: { noOfDays: unknown; }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
                console.log(totalNoOfDays);
                setMonthlyCasual(totalNoOfDays);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };

        const FetchPlanned = async () => {
            try {
                const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=Planned`);
                if (!response.ok) {
                    throw new Error('Error fetching leaves');
                }
                const data = await response.json();
                const totalNoOfDays = data.map((leave: { noOfDays: unknown; }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
                console.log(totalNoOfDays);
                setMonthlyPlanned(totalNoOfDays);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };

        const FetchSick = async () => {
            try {
                const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=Sick`);
                if (!response.ok) {
                    throw new Error('Error fetching leaves');
                }
                const data = await response.json();
                const totalNoOfDays = data.map((leave: { noOfDays: unknown; }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
                console.log(totalNoOfDays);
                setMonthlySick(totalNoOfDays);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };

        const FetchWFH = async () => {
            try {
                const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=WFH`);
                if (!response.ok) {
                    throw new Error('Error fetching leaves');
                }
                const data = await response.json();
                const totalNoOfDays = data.map((leave: { noOfDays: unknown; }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
                console.log(totalNoOfDays);
                // setMonthlyWFH(totalNoOfDays);
            } catch (error) {
                console.log("Error fetching data", error);
            }
        };
        const FetchAllLeaves = async () => {
            try {
                // Make the API request
                const response = await fetch(
                    role === 'Admin'
                        ? 'https://hrmsnode.onrender.com/api/leaves/'
                        : `https://hrmsnode.onrender.com/api/leaves/${userId}`
                );

                // Check if the response is not OK (status code 200)
                if (!response.ok) {
                    throw new Error(`Error fetching leaves: ${response.statusText}`);
                }

                // Parse the JSON response
                const data = await response.json();

                // Log the data to ensure we received it
                console.log('Fetched data:', data);

                // Set the fetched data into the state
                setLeaves(data);
                console.log("leaves", data);
            } catch (error) {
                // Log unknown errors that occur
                console.error('Error fetching leaves data:', error);
            }
        };
        fetch('https://hrmsnode.onrender.com/api/users')  // Example endpoint
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                console.log("data", data);
                // Get the current month
                const currentMonth = new Date().getMonth();
                console.log("currentMonth", currentMonth);
                // Filter users whose dob month matches the current month
                const usersWithBirthdayThisMonth = data.filter((user: { dob: string | number | Date; }) => {
                    const dob = new Date(user.dob);

                    return dob.getMonth() === currentMonth;
                });

                setFilteredUsers(usersWithBirthdayThisMonth);
            })
            .catch(error => console.error('Error fetching user data:', error));
        // Start progress interval
        const interval = setInterval(() => {
            setprogress((prevProgress) => {
                if (prevProgress === 100) {
                    clearInterval(interval); // Clear interval when progress reaches 100
                    return prevProgress;
                }
                return Math.min(prevProgress + 10, 50); // Increase by 10% every interval
            });
        }, 1000);

        FetchData();
        FetchCasual();
        FetchPlanned();
        FetchSick();
        FetchWFH();
        FetchAllLeaves();
        // Cleanup function to clear interval when component unmounts
        return () => clearInterval(interval);
    }, [isLeaveFormOpen]);

    const updateLeaveStatus = async (leaveId: unknown, status: string) => {
        try {
            // Make the API request to update the leave status
            const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${leaveId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update leave status');
            }
    
            // After successful API call, update the state
            setLeaves(prevLeaves =>
                prevLeaves.map(leave =>
                    leave._id === leaveId ? { ...leave, status } : leave
                )
            );
    
            // Show success toast
            toast.success('Leave status updated successfully!');
    
        } catch (error) {
            console.error('Error updating leave status:', error);
    
            // Show error toast
            toast.error('Failed to update leave status');
        }
    };
    const formatDate = (date: string | number | Date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Fetch announcements from the API
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch('https://hrmsnode.onrender.com/api/announcements'); // Replace with your API URL
                const data = await response.json();
                setAnnouncements(data);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };

        fetchAnnouncements();
    }, []);
    return (
        <>
            <div>
       <Punch/>
                <div className="flex gap-2">
                    <div className=" rounded-mid shadow-md p-4 w-1/4 bg-white flex justify-between items-center" >
                        <span>
                            <p className='text-lg font-bold'>Casual Leaves</p>
                            <small>Balance: <b>{leaveData.Casual}</b></small>
                            <br />

                            <small>Consume: <b>{leaveDataCount.Casual}</b></small>


                        </span>
                        <span className='flex flex-col items-center gap-2'>
                            <DirectionsWalkSharpIcon sx={{ width: 50, height: 50 }} />
                            <Button variant="contained" onClick={() => setIsLeaveFormOpen(true)}
                            >Apply CL</Button>
                        </span>
                    </div>
                    <div className=" rounded-mid shadow-md p-4 w-1/4 bg-white flex justify-between items-center" >
                        <span>
                            <p className='text-lg font-bold'>Planned Leaves</p>
                            <small>Balance: <b>{leaveData.Planned}</b></small>
                            <br />

                            <small>Consume: <b>{leaveDataCount.Planned}</b></small>

                        </span>
                        <span className='flex flex-col items-center gap-2'>
                            <LogoutSharpIcon sx={{ width: 50, height: 50 }} />
                            <Button variant="contained" onClick={() => setIsLeaveFormOpen(true)}
                            >Apply PL</Button>

                        </span>
                    </div>
                    <div className=" rounded-mid shadow-md p-4 w-1/4 bg-white flex justify-between items-center" >
                        <span>
                            <p className='text-lg font-bold'>Sick Leaves</p>
                            <small>Balance: <b>{leaveData.Sick}</b></small>
                            <br />
                            <small>Consume: <b>{leaveDataCount.Sick}</b></small>


                        </span>
                        <span className='flex flex-col items-center gap-2'>
                            <SickSharpIcon sx={{ width: 50, height: 50 }} />
                            <Button variant="contained" onClick={() => setIsLeaveFormOpen(true)}
                            >Apply SL</Button>

                        </span>
                    </div>
                    <div className=" rounded-mid shadow-md p-4 w-1/4 bg-white flex justify-between items-center" >
                        <span>
                            <p className='text-lg font-bold'>WFH</p>
                            <small>Consumed: <b>{leaveDataCount.WFH}</b></small>

                        </span>
                        <span className='flex flex-col items-center gap-2'>
                            <AddHomeWorkIcon sx={{ width: 50, height: 50 }} />
                            <Button variant="contained" onClick={() => setIsLeaveFormOpen(true)}
                            >Apply WFH</Button>

                        </span>
                    </div>
                </div>
                <div className='mt-6 flex gap-2'>
                    <div className='w-[20%] text-center rounded-mid p-4 shadow-md bg-white'>
                        <h2 className='text-lg'><b>Monthly Status</b></h2>
                        <div className='max-h-[300px] overflow-y-scroll' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <ProgressBar
                            // Causal={MonthlyCasual || 0}
                            // Planned={MonthlyPlanned || 0}
                            // Sick={MonthlySick || 0}
                            // WFH={leaveDataCount.WFH || 0}
                        />
                        </div>
                        <div className='flex itmes-center justify-center gap-4 mt-4 px-4 py-2 rounded-mid text-lg font-bold'>
                            Applied Requests
                        </div>
                        <div className='mt-2 max-h-[300px] overflow-y-scroll' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <ul>
                                {AllLeave.map((leave) => (
                                    leave.status !== 'Approved' &&
                                    <li key={leave._id} className="mt-2 flex justify-between flex-col items-center border border-[#d5d5d5] rounded-lg p-2 gap-2">
                                        <span className="text-left w-full flex justify-between">
                                            <a href={`/employee/${leave.userId._id}`} className="text-sm font-bold">{`${leave.userId.firstName} ${leave.userId.lastName}`}</a>
                                            <p className="text-sm p-1 rounded-lg border border-[#d5d5d5]">{leave.leaveType}</p>
                                        </span>

                                        <span className="flex items-center gap-2 cursor-pointer flex justify-between items-center w-full">
                                            <span className='flex'>
                                                <p>{formatDate(leave.startDate)}</p> - <p>{formatDate(leave.endDate)}</p>
                                            </span>
                                            {  role === 'Admin' &&
                                            <button
                                                onClick={() => updateLeaveStatus(leave._id, 'Approved')}
                                                style={{ cursor: 'pointer' }}
                                                className='rounded-lg p-1 border border-[#d5d5d5] rounded-full'>
                                                Approve
                                            </button>
}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                    <div className='w-[60%] bg-white rounded-mid p-4 shadow-md z-1'>
                        <ClientCalendar />
                    </div>
                    <div className='w-[20%] text-center rounded-mid p-4 shadow-md bg-white'>
                        <h2 className='text-lg'><b>Annoucements</b></h2>
                        <div className='max-h-[300px]  overflow-y-scroll' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <ul>
                            {announcements.map((announcement) => (
                                <li key={announcement._id} className="mt-2">
                                    <div className="flex justify-between items-center border border-[#d3d3d3] p-2 rounded-mid">
                                        <span className="flex items-start items-center gap-2">
                                            <StarsIcon />
                                            <span className="text-left">
                                                <p className="text-sm">{announcement.announcement}</p>
                                            </span>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        </div>
                        <h2 className='text-lg mt-4'><b>Events</b></h2>

                        <div className='mt-2 max-h-[300px]  overflow-y-scroll' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                            {filteredUsers.length === 0 ? (
                                <p>No users with birthdays this month.</p>
                            ) : (
                                <ul>
                                    {filteredUsers.map(user => (
                                        <li key={user._id} className='mt-2'>
                                            <div className='flex justify-between items-center border border-[#d3d3d3] p-2 rounded-mid'>
                                                <span className='flex items-start items-center gap-2'>
                                                    <CakeIcon />
                                                    <span className='text-left'>
                                                        <p className='text-sm'>{user.firstName} {user.lastName}</p>
                                                        <p className='text-sm'>{new Date(user.dob).toLocaleDateString()}</p>
                                                    </span>
                                                </span>


                                            </div>

                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

            </div>
            <LeaveFormModal isOpen={isLeaveFormOpen} close={() => setIsLeaveFormOpen(false)} />
        </>
    )
}

export default Dashboard