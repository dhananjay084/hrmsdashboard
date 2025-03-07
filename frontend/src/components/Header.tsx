"use client";
import React from 'react';
import { CiLogout } from "react-icons/ci";
import { MdDashboard } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { FaUsers } from "react-icons/fa";
import nookies from "nookies";

const Header = () => {
  const navigation = useRouter();
  const cookies = nookies.get();
  const userId = cookies.id;
  const role = cookies.role;

  const handleLogout = () => {
    // Example: Clear token (update according to your app's logic)
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    navigation.push('/Login'); // Redirect to login page after logout
  };

  return (
    <header className="sticky top-0 bg-white shadow-md flex items-center justify-between px-6 py-4 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigation.push('/')}>
        <MdDashboard className="text-gray-600 text-[40px]" />
        <span className="text-lg font-semibold text-gray-700">Dashboard</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
       { 
       role ==='Admin' &&
      <FaUsers
          className="text-gray-600 text-[40px] cursor-pointer"
          onClick={() => navigation.push('users')}
        />
       }
        <FaUserCircle
          className="text-gray-600 text-[40px] cursor-pointer"
          onClick={() => navigation.push(`/employee/${userId}`)}
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          <CiLogout />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
