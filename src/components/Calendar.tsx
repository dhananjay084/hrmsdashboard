'use client'; // Ensure this component is rendered on the client side

import FullCalendar from '@fullcalendar/react'; // Import FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the dayGrid plugin for month view
import { useEffect, useState } from 'react';
import nookies from "nookies";

const ClientCalendar = () => {
  const [events, setEvents] = useState([]);
  const cookies = nookies.get();
  const userId = cookies.id;

  useEffect(() => {
    const FetchAllLeaves = async () => {
      try {
        const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching leaves: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Fetched data:", data);

        // Generate events for FullCalendar directly from the fetched data
        const generatedEvents = data.flatMap((leave: { startDate: string | number | Date; endDate: string | number | Date; leaveType: unknown; }) => {
          const eventsArray = [];
          const currentDate = new Date(leave.startDate);
          const endDate = new Date(leave.endDate);

          while (currentDate <= endDate) {
            eventsArray.push({
              title: leave.leaveType,
              date: currentDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            });
            currentDate.setDate(currentDate.getDate() + 1); // Increment date
          }
          return eventsArray;
        });

        setEvents(generatedEvents);
        console.log("Generated events:", generatedEvents);
      } catch (error) {
        console.error("Error fetching leaves data:", error);
      }
    };

    FetchAllLeaves();
  }, [userId]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin]} // Use dayGrid plugin for calendar view
      initialView="dayGridMonth" // Set the default view to Month
      height="600px"
      events={events} // Pass the dynamically generated events to FullCalendar
    />
  );
};

export default ClientCalendar;
