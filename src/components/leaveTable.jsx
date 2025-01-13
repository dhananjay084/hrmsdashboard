import React, { useEffect, useState } from 'react';

const LeaveTable = ({ userId }) => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveType, setLeaveType] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [noData, setNoData] = useState(false); // To check if no data found

  // Fetch leaves with filters
  useEffect(() => {
    const fetchLeaveDetails = async () => {
      try {
        // Construct the query string dynamically based on the filter values
        const queryParams = [];
        if (month) queryParams.push(`month=${month}`);
        if (year) queryParams.push(`year=${year}`);
        if (leaveType) queryParams.push(`leaveType=${leaveType}`);

        const res = await fetch(
          `https://hrmsnode.onrender.com/api/leaves/${userId}?${queryParams.join('&')}`
        );

        if (res.status === 404) {
          setLeaves([]); // No leaves found, clear any previous leaves data
          setNoData(true); // Set the noData flag
        } else if (!res.ok) {
          throw new Error("An error occurred while fetching the data.");
        } else {
          const data = await res.json();
          setNoData(false); // Data found, reset the noData flag
          setLeaves(data);
        }
      } catch (err) {
        console.log(err);
        setLeaves([]); // In case of an error, clear leaves data
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLeaveDetails();
    }
  }, [userId, leaveType, month, year]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    leaves &&
    <div>
      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block mb-2">Leave Type</label>
          <select
            className="border p-2"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
          >
            <option value="">Select Leave Type</option>
            <option value="Sick">Sick</option>
            <option value="Planned">Planned</option>
            <option value="WFH">WFH</option>
            <option value="Casual">Casual</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Month</label>
          <select
            className="border p-2"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {[...Array(12)].map((_, index) => {
              const monthValue = (index + 1).toString().padStart(2, '0');
              return (
                <option key={monthValue} value={monthValue}>
                  {monthValue}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block mb-2">Year</label>
          <select
            className="border p-2"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {['2025', '2024', '2023'].map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

   

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Leave Type</th>
              <th className="border border-gray-300 px-4 py-2">Start Date</th>
              <th className="border border-gray-300 px-4 py-2">End Date</th>
              <th className="border border-gray-300 px-4 py-2">No. of Days</th>
              <th className="border border-gray-300 px-4 py-2">Reason</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="max-h-[400px] overflow-y-auto">
            {noData ? (
              <tr>
                <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">
                  No data found for the selected filters
                </td>
              </tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{leave.leaveType}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(leave.startDate)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(leave.endDate)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{leave.noOfDays}</td>
                  <td className="border border-gray-300 px-4 py-2 max-w-[300px] overflow-auto">
                    <div className="max-w-[300px] overflow-auto">{leave.reason}</div>
                  </td>
                  <td
                    className={`border border-gray-300 px-4 py-2 font-bold ${
                      leave.status === 'Approved'
                        ? 'text-green-500'
                        : leave.status === 'Rejected'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    }`}
                  >
                    {leave.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;
