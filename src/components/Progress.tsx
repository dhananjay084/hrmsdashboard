import React, { useState, useEffect } from 'react';
import nookies from 'nookies';

const LeaveProgress = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1); // Current month (1-12)
  const [year, setYear] = useState<number>(new Date().getFullYear()); // Current year
  const [monthlyCasual, setMonthlyCasual] = useState<number>(0);
  const [monthlyPlanned, setMonthlyPlanned] = useState<number>(0);
  const [monthlySick, setMonthlySick] = useState<number>(0);
  const [monthlyWFH, setMonthlyWFH] = useState<number>(0); // Assuming WFH is also part of leave counts
  const [, setLeaveData] = useState<unknown>(null); // Store leave balances data

  const [userId, setUserId] = useState<string>(''); // State to store the userId

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

// Fetch Casual Leave Data
const FetchCasual = async () => {
  try {
    const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=Casual`);
    if (!response.ok) throw new Error('Error fetching Casual leave');
    const data = await response.json();
    
    // Check for "No leaves found matching the filter criteria"
    if (data.message === "No leaves found matching the filter criteria") {
      setMonthlyCasual(0);
    } else {
      const totalNoOfDays = data.map((leave: { noOfDays: number }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
      setMonthlyCasual(totalNoOfDays);
    }
  } catch (error) {
    console.log("Error fetching Casual leave data", error);
    setMonthlyCasual(0); // Set to 0 in case of an error
  }
};

// Fetch Planned Leave Data
const FetchPlanned = async () => {
  try {
    const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=Planned`);
    if (!response.ok) throw new Error('Error fetching Planned leave');
    const data = await response.json();
    
    // Check for "No leaves found matching the filter criteria"
    if (data.message === "No leaves found matching the filter criteria") {
      setMonthlyPlanned(0);
    } else {
      const totalNoOfDays = data.map((leave: { noOfDays: number }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
      setMonthlyPlanned(totalNoOfDays);
    }
  } catch (error) {
    console.log("Error fetching Planned leave data", error);
    setMonthlyPlanned(0); // Set to 0 in case of an error
  }
};

// Fetch Sick Leave Data
const FetchSick = async () => {
  try {
    const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=Sick`);
    if (!response.ok) throw new Error('Error fetching Sick leave');
    const data = await response.json();
    
    // Check for "No leaves found matching the filter criteria"
    if (data.message === "No leaves found matching the filter criteria") {
      setMonthlySick(0);
    } else {
      const totalNoOfDays = data.map((leave: { noOfDays: number }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
      setMonthlySick(totalNoOfDays);
    }
  } catch (error) {
    console.log("Error fetching Sick leave data", error);
    setMonthlySick(0); // Set to 0 in case of an error
  }
};

// Fetch WFH Data (assuming this exists in your API)
const FetchWFH = async () => {
  try {
    const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}?month=${month}&year=${year}&leaveType=WFH`);
    if (!response.ok) throw new Error('Error fetching WFH data');
    const data = await response.json();
    
    // Check for "No leaves found matching the filter criteria"
    if (data.message === "No leaves found matching the filter criteria") {
      setMonthlyWFH(0);
    } else {
      const totalNoOfDays = data.map((leave: { noOfDays: number }) => leave.noOfDays).reduce((acc: number, curr: number) => acc + curr, 0);
      setMonthlyWFH(totalNoOfDays);
    }
  } catch (error) {
    console.log("Error fetching WFH data", error);
    setMonthlyWFH(0); // Set to 0 in case of an error
  }
};


  // Fetch leave balances (like remaining leave, etc.)
  const FetchLeaveData = async () => {
    try {
      const response = await fetch(`https://hrmsnode.onrender.com/api/leavecount/getbalance/${userId}`);
      if (!response.ok) throw new Error('Error fetching leave balance data');
      const data = await response.json();
      setLeaveData(data.leaveBalances);
    } catch (error) {
      console.error('Error fetching leave balance data:', error);
    }
  };

  // Get userId from cookies using nookies
  useEffect(() => {
    const cookies = nookies.get(); // Get all cookies
    const userIdFromCookies = cookies.id; // Assuming 'id' is the cookie name
    setUserId(userIdFromCookies);

    // Once userId is retrieved, fetch leave data
    if (userIdFromCookies) {
      FetchCasual();
      FetchPlanned();
      FetchSick();
      FetchWFH();
      FetchLeaveData();
    }
  }, []); // Only run once after the component mounts

  // Fetch leave data whenever month or year changes
  useEffect(() => {
    if (userId) {
      FetchCasual();
      FetchPlanned();
      FetchSick();
      FetchWFH();
      FetchLeaveData();
    }
  }, [month, year, userId]); // Run every time month, year, or userId changes

  // Handle month and year change
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = parseInt(event.target.value, 10);
    setMonth(selectedMonth); // Update the month
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = parseInt(event.target.value, 10);
    setYear(selectedYear); // Update the year
  };

  // Progress Bar rendering
  const ProgressBar = () => {
    return (
      <>
        <div className="w-full mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-sm font-semibold">Casual Leave</span>
              </div>
              <div className="text-sm font-semibold">{monthlyCasual}</div>
            </div>
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${monthlyCasual}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-sm font-semibold">Planned Leave</span>
              </div>
              <div className="text-sm font-semibold">{monthlyPlanned}</div>
            </div>
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${monthlyPlanned}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-sm font-semibold">Sick Leave</span>
              </div>
              <div className="text-sm font-semibold">{monthlySick}</div>
            </div>
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${monthlySick}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-6">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-sm font-semibold">WFH</span>
              </div>
              <div className="text-sm font-semibold">{monthlyWFH}</div>
            </div>
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${monthlyWFH}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      {/* Month and Year Filters */}
      <div className="flex mb-4 justify-between">
        <select value={month} onChange={handleMonthChange} className="px-2 py-1 border rounded">
          {monthNames.map((monthName, index) => (
            <option key={index} value={index + 1}>{monthName}</option>
          ))}
        </select>

        <select value={year} onChange={handleYearChange} className="px-2 py-1 border rounded">
          <option value={year}>{year}</option>
          <option value={year + 1}>{year + 1}</option>
          <option value={year - 1}>{year - 1}</option>
        </select>
      </div>

      {/* Progress Bar */}
      {ProgressBar()}
    </div>
  );
};

export default LeaveProgress;
