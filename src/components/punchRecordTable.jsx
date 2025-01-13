import React, { useEffect, useState } from 'react';

const PunchRecordsTable = ({ userId }) => {
  const [punchRecords, setPunchRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  
  useEffect(() => {
    // Fetch all punch records on initial load
    fetchPunchRecords();
  }, [userId]); // Re-fetch when userId changes

  // Fetch punch records from the API
  const fetchPunchRecords = async () => {
    try {
      const dateQuery = dateFilter ? `&date=${dateFilter}` : '';
      const response = await fetch(`https://hrmsnode.onrender.com/api/punch/records/${userId}?${dateQuery}`);
      const data = await response.json();
      setPunchRecords(data);
      setFilteredRecords(data); // Initialize the filtered records with all fetched records
    } catch (error) {
      console.error('Error fetching punch records:', error);
    }
  };

  // Handle date filter change
  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  // Apply date filter if a date is selected
  useEffect(() => {
    if (dateFilter) {
      const filtered = punchRecords.filter((record) => {
        const recordDate = new Date(record.punchInTime).toISOString().split('T')[0];
        return recordDate === dateFilter;
      });
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(punchRecords); // Show all records if no filter
    }
  }, [dateFilter, punchRecords]);

  // Function to format date in '25 Jan 2024' format using Intl.DateTimeFormat
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  return (
    punchRecords &&
    <div>
      <div className='mb-2'>
        
        <label htmlFor="dateFilter">Filter by Date: </label>
        <input
          type="date"
          id="dateFilter"
          value={dateFilter}
          onChange={handleDateFilterChange}
          className='border border-gray-300 p-2'
        />
      </div>

      <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Punch In Time</th>
            <th className="border border-gray-300 px-4 py-2">Punch Out Time</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr key={record._id}>
              <td className="border border-gray-300 px-4 py-2">{new Date(record.punchInTime).toLocaleTimeString()}</td>
              <td className="border border-gray-300 px-4 py-2">{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : 'N/A'}</td>
              <td className="border border-gray-300 px-4 py-2">{formatDate(record.punchInTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PunchRecordsTable;
