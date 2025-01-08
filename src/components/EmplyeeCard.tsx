// components/EmployeeCard.tsx
import React from 'react';
import Male from "../assests/male_user.png";
import Female from "../assests/female_user.jpg";
import Image from "next/image";
import nookies from "nookies";

interface Employee {
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
interface EmployeeCardProps {
  employee: Employee; // Specify employee type as the prop
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const { firstName, lastName, designation, gender, email, _id } = employee;
  const cookies = nookies.get();

  const role = cookies.role;
  return (
    <div className="border border-gray-300 rounded-md p-4 shadow-sm flex flex-col items-start bg-white">
      <div className="flex gap-4">
        <Image 
          src={gender === 'Male' ? Male : Female} 
          alt="icon" 
          className="max-w-[50px]" 
        />
        <span>
          <h2 className="text-lg font-bold flex items-center gap-2">
            {`${firstName} ${lastName}`} 
            <p className="text-sm font-normal">({gender})</p>
          </h2>

          <p className="text-gray-600">{designation}</p>
        </span>
      </div>
      <div className="flex justify-between items-center w-full mt-4">
        <a href={`mailto:${email}`} className="text-black text-sm">
          {email}
        </a>
        {role === "Admin" && (
          <a 
            href={`/employee/${_id}`} 
            className="px-3 py-1 rounded-[12px] bg-white text-black border border-black"
          >
            View Details
          </a>
        )}
      </div>
    </div>
  );
}

export default EmployeeCard;
