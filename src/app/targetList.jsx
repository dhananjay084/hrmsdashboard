import React, { useEffect, useState } from 'react';
import { getTargets, updateTarget } from './services';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' },
];

const TargetList = ({ userId }) => {
    const [targets, setTargets] = useState([]);
    const [filters, setFilters] = useState({ userId });

    useEffect(() => {
        const fetchTargets = async () => {
            try {
                const data = await getTargets(filters);
                setTargets(data);
            } catch (error) {
                console.error(error);
                toast.error('Error fetching targets');
            }
        };

        fetchTargets();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleCompletedChange = (id, value) => {
        setTargets((prevTargets) =>
            prevTargets.map((target) =>
                target._id === id ? { ...target, targetCompleted: value } : target
            )
        );
    };

    const handleSave = async (id, targetCompleted) => {
        try {
            const updatedTarget = await updateTarget(id, { targetCompleted });
            setTargets((prevTargets) =>
                prevTargets.map((target) =>
                    target._id === id ? updatedTarget : target
                )
            );
            toast.success('Target updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('Error updating target');
        }
    };

    return (
        <div>
            <div className="flex gap-2 my-2">
                <select
                    name="month"
                    onChange={handleFilterChange}
                    className="border border-[#d5d5d5] p-2 rounded-lg"
                >
                    <option value="">Filter by Month</option>
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
                <select
                    name="year"
                    onChange={handleFilterChange}
                    className="border border-[#d5d5d5] p-2 rounded-lg"
                >
                    <option value="">Filter by Year</option>
                    {[...Array(10)].map((_, index) => {
                        const year = new Date().getFullYear() - index;
                        return (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        );
                    })}
                </select>
            </div>
            <table className="w-full border border-[#d5d5d5]">
                <thead className="border border-[#d5d5d5] font-bold">
                    <tr className="border border-[#d5d5d5]">
                        <td className="p-2 border border-[#d5d5d5]">Month</td>
                        <td className="p-2 border border-[#d5d5d5]">Year</td>
                        <td className="p-2 border border-[#d5d5d5]">Target</td>
                        <td className="p-2 border border-[#d5d5d5]">
                            Target Achieved
                        </td>
                        <td className="p-2 border border-[#d5d5d5]">Profit (%)</td>
                        <td className="p-2 border border-[#d5d5d5]">Action</td>
                    </tr>
                </thead>
                <tbody>
                    {targets.map((target) => (
                        <tr key={target._id} className="border border-[#d5d5d5]">
                            <td className="p-2 border border-[#d5d5d5]">
                                {months.find((month) => month.value === target.month)?.label}
                            </td>
                            <td className="p-2 border border-[#d5d5d5]">
                                {target.year}
                            </td>
                            <td className="p-2 border border-[#d5d5d5]">
                                {target.target}
                            </td>
                            <td className="p-2 border border-[#d5d5d5]">
                                <input
                                    type="text"
                                    value={target.targetCompleted}
                                    onChange={(e) =>
                                        handleCompletedChange(target._id, e.target.value)
                                    }
                                    className="border border-[#d5d5d5] rounded-lg p-2 focus:outline-none"
                                />
                            </td>
                            <td className="p-2 border border-[#d5d5d5]">
                                {((target.targetCompleted / target.target) * 100 || 0).toFixed(2)}
                            </td>
                            <td className="p-2 border border-[#d5d5d5]">
                                <button
                                    onClick={() =>
                                        handleSave(target._id, target.targetCompleted)
                                    }
                                    className="bg-blue-500 text-white rounded-lg p-2 hover:bg-blue-600 w-full"
                                >
                                    Save
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Toast container to render toast messages */}
            <ToastContainer />
        </div>
    );
};

export default TargetList;
