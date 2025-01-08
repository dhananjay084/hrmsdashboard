"use client";
import { useState, useEffect } from 'react';
import UserIcon from "@/assests/user_icon.png";
import Image from "next/image";
import Documents from "@/assests/documents.jpg";
import TargetForm from "../../targetForm";
import TargetList from "../../targetList";
import nookies from "nookies";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Employee = ({ params }) => {
    const { slug } = params;

    const [userDetails, setUserDetails] = useState(null);
    const [error] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [file, setFile] = useState(null);
    const [success] = useState("");
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");
    const [documents, setDocuments] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState("");

    const cookies = nookies.get();
    const role = cookies.role;
    useEffect(() => {
        if (slug) {
            const fetchUserDetails = async () => {
                try {
                    const res = await fetch(`https://hrmsnode.onrender.com/api/users/${slug}`);
                    if (!res.ok) {
                        throw new Error("User not found");
                    }
                    const data = await res.json();
                    setUserDetails(data);
                    console.log("users", data);
                } catch (err) {
                    console.log(err);
                    toast.error("Error fetching user details");
                }
            };

            fetchUserDetails();
        }
    }, [slug]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("https://hrmsnode.onrender.com/api/users");
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    toast.error("Failed to fetch users");
                }
            } catch (error) {
                console.log(error);
                toast.error("Error fetching users");
            }
        };
        fetchUsers();

        const fetchTasks = async () => {
            try {
                const res = await fetch(`https://hrmsnode.onrender.com/api/task/${slug}`);
                const data = await res.json();
                console.log("tasks", data);
                setTasks(data);
            } catch (err) {
                console.log(err);
                toast.error("Error fetching tasks");
            }
        };

        const fetchDocuments = async () => {
            try {
                const res = await fetch(`https://hrmsnode.onrender.com/api/documents/${slug}`);
                const data = await res.json();
                console.log("documents", data);
                setDocuments(data);
            } catch (err) {
                console.log(err);
                toast.error("Error fetching documents");
            }
        };

        fetchDocuments();
        fetchTasks();
    }, [slug]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !selectedUser) {
            toast.error('Please select a user and upload a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', selectedUser);

        try {
            const res = await fetch('https://hrmsnode.onrender.com/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                toast.success('File uploaded successfully');
                setFile(null);
                setSelectedUser('');
            } else {
                toast.error('Failed to upload file');
            }
        } catch (err) {
            console.log(err)
            toast.error('An error occurred during the upload');
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask) {
            toast.error('Task cannot be empty');
            return;
        }

        try {
            const res = await fetch('https://hrmsnode.onrender.com/api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: newTask,
                    userId: selectedUser,
                }),
            });

            if (res.ok) {
                toast.success('Task added successfully');
                setNewTask('');
            } else {
                toast.error('Failed to add task');
            }
        } catch (err) {
            console.log(err)
            toast.error('An error occurred while adding the task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const res = await fetch(`https://hrmsnode.onrender.com/api/task/${taskId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Task deleted successfully');
            } else {
                toast.error('Failed to delete task');
            }
        } catch (err) {
            console.log(err)
            toast.error('Error deleting task');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };

    const handleDownload = (fileName) => {
        const downloadUrl = `https://hrmsnode.onrender.com/download/${fileName}`;
        window.location.href = downloadUrl;
    };

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();

        if (!newAnnouncement) {
            toast.error('Announcement cannot be empty');
            return;
        }

        try {
            const res = await fetch('https://hrmsnode.onrender.com/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ announcement: newAnnouncement }),
            });

            if (res.ok) {
                const data = await res.json();
                setNewAnnouncement(data); // Updating announcements after success
                setNewAnnouncement(''); // Clear the input field
                toast.success('Announcement added successfully'); // Show success toast
            } else {
                const errorData = await res.json(); // Optionally, log any error response from the server
                toast.error(errorData.message || 'Failed to add announcement');
            }
        } catch (err) {
            // Handle fetch errors or network issues
            console.log("err", err)
            toast.error('An error occurred while adding the announcement');
        }
    };


    return (
        <>
            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
            <div className="max-w-[90%] mx-auto rounded-md shadow-lg p-2 bg-white flex justify-between items-start">
                <div className="flex items-center gap-4 w-fit">
                    <Image src={UserIcon} alt="user" className="max-w-[200px]" />
                    <span>
                        <p className="my-2"><b>Name:</b> {userDetails ? userDetails.firstName : slug} {userDetails ? userDetails.lastName : slug}</p>
                        <p className="my-2"><b>Designation:</b> {userDetails ? userDetails.designation : 'Test'}</p>
                        <p className="my-2"><b>Salary:</b> {userDetails ? userDetails.salary : 'Test'}</p>
                        <p className="my-2"><b>Appraisal Date: </b>
                            {formatDate(userDetails ? userDetails.appraisalDate : '2024-12-31T00:00:00.000Z')}
                        </p>
                        <p className="my-2"><b>Joining Date: </b>
                            {formatDate(userDetails ? userDetails.joiningDate : '2024-12-31T00:00:00.000Z')}
                        </p>
                        <p className="my-2"><b>Reporting Manager:</b> {userDetails ? userDetails.reportingManager : 'Test'}</p>
                    </span>
                </div>
            </div>
            {role === 'Admin' &&
                <div className="max-w-[90%] mx-auto rounded-md shadow-lg py-2 px-4 bg-white mt-4">
                    <div className='flex justify-between gap-[5%]'>
                        <form onSubmit={handleAddAnnouncement} className='w-1/2'>
                            <div className='flex flex-col space-y-4'>
                                <label htmlFor="announcement" className='font-bold text-sm'>Add Announcement</label>
                                <textarea
                                    id="announcement"
                                    value={newAnnouncement}
                                    onChange={(e) => setNewAnnouncement(e.target.value)}
                                    className="w-full border border-[#d5d5d5] rounded-lg focus:outline-none"
                                ></textarea>
                            </div>
                            <button type="submit" className='py-2 px-6 bg-blue-500 text-white rounded-md mt-4'>Add Announcement</button>
                        </form>

                        <form className="w-1/2" onSubmit={handleAddTask}>
                            <div className='flex items-start gap-2'>
                                <div className='w-1/2'>
                                    <label htmlFor="user" className="block text-left font-bold text-sm">Select User</label>
                                    <select
                                        id="user"
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        className="w-full border border-[#d5d5d5] rounded-lg p-2 focus:outline-none mt-4"
                                    >
                                        <option value="">Select a user</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.firstName} {user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className='w-1/2'>
                                    <label htmlFor="task" className="block text-left font-bold text-sm">New Task</label>
                                    <input
                                        type="text"
                                        id="task"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        className="w-full border border-[#d5d5d5] rounded-lg p-2 focus:outline-none mt-4"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button type="submit" className="py-2 px-6 bg-blue-500 text-white rounded-md mt-4">Add Task</button>
                            </div>
                        </form>
                    </div>

                    <div className='flex justify-between mt-4 gap-4'>
                        <div className="text-center border border-[#d3d3d3] p-4 rounded-md w-1/2">
                            <b>Upload Documents</b>
                            <form className="flex flex-col items-center space-y-6 my-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="user" className="block text-left font-bold text-sm">Select User</label>
                                    <select
                                        id="user"
                                        value={selectedUser}
                                        onChange={(e) => setSelectedUser(e.target.value)}
                                        className="w-full  border border-[#d5d5d5] rounded-lg p-2 focus:outline-none mt-4"
                                    >
                                        <option value="">Select a user</option>
                                        {users.map(user => (
                                            <option key={user._id} value={user._id}>
                                                {user.firstName} {user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="shrink-0">
                                    <Image className="h-16 w-16 object-cover rounded-full" src={Documents} alt="Document icon" />
                                </div>
                                <label className="block">
                                    <span className="sr-only">Choose Document</span>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} // Handle null or File correctly
                                        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
                                    />
                                </label>

                                {error && <p className="text-red-500">{error}</p>}
                                {success && <p className="text-green-500">{success}</p>}

                                <button type="submit" className="mt-4 py-2 px-6 bg-blue-500 text-white rounded-md">
                                    Upload
                                </button>
                            </form>
                        </div>
                        <div className='w-1/2 border border-[#d3d3d3] p-4 rounded-md'>
                            <TargetForm />
                        </div>
                    </div>
                </div>
            }

            <div className="max-w-[90%] mx-auto rounded-md shadow-lg py-2 px-4 bg-white mt-4">
                <p className="mb-4"><b>Documents List</b></p>
                <ul className="flex gap-2 flex-wrap">
                    {documents.length > 0 ? (
                        documents.map((document) => (
                            <li
                                key={document._id}
                                className="border border-[#d3d3d3] rounded-md p-2 text-[#d3d3d3]"
                            >
                                <button
                                    onClick={() => handleDownload(encodeURIComponent(document.originalFileName))}
                                    className="text-blue-500"
                                >
                                    {document.originalFileName}
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>No documents available</p>
                    )}
                </ul>

                <div className='my-2'>
                    <h3><b>Tasks List</b></h3>
                    <ul>
                        {tasks.map(task => (
                            <li key={task._id} className="flex justify-between items-center border p-2 my-2">
                                <span>{task.task}</span>
                                {
                                    role ==='Admin' &&
                                    <button
                                        onClick={() => handleDeleteTask(task._id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                }
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="max-w-[90%] mx-auto rounded-md shadow-lg py-2 px-4 bg-white mt-4">
                <p><b>Targets/Performance</b></p>
                <div className='max-h-[500px] overflow-y-scroll' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    <TargetList userId={slug} />
                </div>
            </div>
        </>
    );
};

export default Employee;
