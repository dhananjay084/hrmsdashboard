'use client'; // Ensure this component is rendered on the client side

import FullCalendar from '@fullcalendar/react'; // Import FullCalendar
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the dayGrid plugin for month view
import { useEffect, useState } from 'react';
import nookies from "nookies";

// Define the structure of a leave object
interface Leave {
  startDate: string | number | Date;
  endDate: string | number | Date;
  leaveType: string;
}

// Define the structure of an event
interface Event {
  title: string;
  date: string;
}

const ClientCalendar = () => {
  const [events, setEvents] = useState<Event[]>([]); // Specify the type for events state
  const cookies = nookies.get();
  const userId = cookies.id;

  // List of holidays
  const holidays: Event[] = [
    { title: 'Republic Day', date: '2025-01-26' },
    { title: 'Holi', date: '2025-03-14' },
    { title: 'Id-ul-fitr', date: '2025-03-31' },
    { title: 'Mahavir Jayanti', date: '2025-04-10' },
    { title: 'Good Friday', date: '2025-04-18' },
    { title: 'Labor Day', date: '2025-05-01' },
    { title: 'Buddha Purnima', date: '2025-05-12' },
    { title: 'Id-ul-Zuha (Bakrid)', date: '2025-06-07' },
    { title: 'Muharram', date: '2025-07-06' },
    { title: 'Independence Day', date: '2025-08-15' },
    { title: 'Milad-un-Nabi (Birthday of Prophet Mohammad)', date: '2025-09-05' },
    { title: 'Gandhi Jayanti/ Dusshera', date: '2025-10-02' },
    { title: 'Diwali', date: '2025-10-20' },
    { title: 'Guru Nanak’s Birthday', date: '2025-11-05' },
    { title: 'Christmas', date: '2025-12-25' },
    { title: 'New Year', date: '2025-01-01' },
  ];

  useEffect(() => {
    const FetchAllLeaves = async () => {
      try {
        const response = await fetch(`https://hrmsnode.onrender.com/api/leaves/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching leaves: ${response.statusText}`);
        }
        const data: Leave[] = await response.json(); // Ensure data is of type Leave[]
        console.log("Fetched data:", data);

        // Generate events for FullCalendar directly from the fetched data
        const generatedEvents: Event[] = data.flatMap((leave) => {
          const eventsArray: Event[] = [];
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

        // Combine the fetched events with the holidays
        setEvents([...generatedEvents, ...holidays]);

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
