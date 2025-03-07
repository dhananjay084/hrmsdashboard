import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Image from "next/image";
import CompanyLogo from "../assests/CompanyLogo.webp";
import Sign from "../assests/Sign.png";
import { IoCallSharp } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";

const Payslip = () => {
    const componentRef = useRef();

    const handleDownload = async () => {
        const element = componentRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const scale = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const xOffset = (pageWidth - imgWidth * scale) / 2;
        const yOffset = 10;

        pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth * scale, imgHeight * scale);
        pdf.save("payslip.pdf");
    };

    const [formData, setFormData] = React.useState({
        name: "",
        employeeId: "",
        designation: "",
        department: "",
        bankName: "",
        bankAccount: "",
        pan: "",
        lop: "",
        month: "",
        basicPay: 0,
        hra: 0,
        medicalAllowance: 0,
        otherBenefits: 0,
        providentFund: 0,
        professionalTax: 0,
        unpaidLeaves: 0,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const totalEarnings =
        Number(formData.basicPay) +
        Number(formData.hra) +
        Number(formData.medicalAllowance) +
        Number(formData.otherBenefits);

    const totalDeductions =
        Number(formData.providentFund) +
        Number(formData.professionalTax) +
        Number(formData.unpaidLeaves);

    const netPay = totalEarnings - totalDeductions;

    return (
        <div className="p-5">
            {/* Form for Input */}
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 max-w-[90%] mx-auto rounded-md shadow-lg py-2 px-4 bg-white mt-4">
                <h2 className="text-lg font-bold col-span-2">Fill Employee Details</h2>
                <input
                    name="name"
                    placeholder="Name"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="employeeId"
                    placeholder="Employee ID"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="designation"
                    placeholder="Designation"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="department"
                    placeholder="Department"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="bankName"
                    placeholder="Bank Name"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="bankAccount"
                    placeholder="Bank Account Number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="pan"
                    placeholder="PAN"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="lop"
                    placeholder="LOP"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="month"
                    placeholder="Month (e.g., January 2025)"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <h2 className="text-lg font-bold col-span-2">Earnings</h2>
                <input
                    name="basicPay"
                    placeholder="Basic Pay"
                    type="number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="hra"
                    placeholder="HRA"
                    type="number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="medicalAllowance"
                    placeholder="Medical Allowance"
                    type="number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="otherBenefits"
                    placeholder="Other Benefits"
                    type="number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <h2 className="text-lg font-bold col-span-2">Deductions</h2>
                <input
                    name="providentFund"
                    placeholder="Provident Fund"
                    type="number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="professionalTax"
                    placeholder="Professional Tax"
                    type="number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
                <input
                    name="unpaidLeaves"
                    placeholder="Unpaid Leaves"
                    type="number"
                    className="border p-2 rounded"
                    onChange={handleChange}
                />
            </form>

            <div
                className="border shadow p-5 bg-white relative"
                ref={componentRef}
            >
                <div
                    className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10"
                    style={{
                        backgroundImage: `url(${CompanyLogo.src})`,
                        zIndex: 0,
                    }}
                ></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Image src={CompanyLogo} alt="logo" className="max-w-[100px]" />
                            <span>
                                <p><b>OCTAADS MEDIA PVT. LTD.</b></p>
                                <p>Advertising & Marketing</p>
                            </span>
                        </div>
                        <div>
                            <p>CIN: U73100JH2024PTC022034</p>
                            <p>PAN: AAECO3028M</p>
                        </div>
                    </div>

                    <div className="w-[80%] h-[5px] bg-gradient-to-r from-[#00CCED] to-black mx-auto mb-4"></div>

                    <h1 className="text-3xl font-bold text-center">
                        <u> Payslip for Month of {formData.month}</u>
                    </h1>
                    <div className="mt-5 grid grid-cols-2 gap-4 max-w-[80%] mx-auto mt-16">
                        <div>
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Designation:</strong> {formData.designation}</p>
                            <p><strong>Department:</strong> {formData.department}</p>
                            <p><strong>LOP:</strong> {formData.lop}</p>

                        </div>
                        <div>
                            <p><strong>Employee ID:</strong> {formData.employeeId}</p>
                            <p><strong>Bank Name:</strong> {formData.bankName}</p>
                            <p><strong>Account Number:</strong> {formData.bankAccount}</p>
                            <p><strong>PAN:</strong> {formData.pan}</p>
                        </div>
                    </div>
                    <table className="max-w-[80%] w-full mx-auto mt-16 border border-black">
                        <thead className="bg-[#d5d5d5]">
                            <tr>
                                <td className="border border-black p-2">
                                    Earnings
                                </td>
                                <td className="border border-black p-2">
                                    Amount
                                </td>
                                <td className="border border-black p-2">
                                    Deductions
                                </td>
                                <td className="border border-black p-2">
                                    Amount
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-black p-2">
                                    Basic Pay
                                </td>
                                <td className="border border-black p-2">
                                    {formData.basicPay}
                                </td>
                                <td className="border border-black p-2">
                                    Provident Fund
                                </td>
                                <td className="border border-black p-2">
                                    {formData.providentFund}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2">
                                    HRA
                                </td>
                                <td className="border border-black p-2">
                                    {formData.hra}
                                </td>
                                <td className="border border-black p-2">
                                    Professional Tax
                                </td>
                                <td className="border border-black p-2">
                                    {formData.professionalTax}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2">
                                    Medical Allowance
                                </td>
                                <td className="border border-black p-2">
                                    {formData.medicalAllowance}
                                </td>
                                <td className="border border-black p-2">
                                    Unpaid Leaves
                                </td>
                                <td className="border border-black p-2">
                                    {formData.unpaidLeaves}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2">
                                    Other Benefits
                                </td>
                                <td className="border border-black p-2">
                                    {formData.otherBenefits}
                                </td>
                                <td className="border border-black p-2">
                                </td>
                                <td className="border border-black p-2">
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2">
                                    Total Earnings
                                </td>
                                <td className="border border-black p-2">
                                    {totalEarnings}
                                </td>
                                <td className="border border-black p-2">
                                    Total Deductions
                                </td>
                                <td className="border border-black p-2">
                                    {totalDeductions}
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-black p-2">
                                </td>
                                <td className="border border-black p-2">
                                </td>
                                <td className="border border-black p-2">
                                    Net Pay:
                                </td>
                                <td className="border border-black p-2">
                                    {netPay}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="max-w-[80%] mx-auto mt-8">
                        <p>Sincerely</p>
                        <p>Abdulla Khan</p>
                        <p>Co-Founder & Director</p>
                        <p>Octaads Media</p>
                        <p>abdullakhan@octaadsmedia.com</p>
                        <Image className="max-w-[30%]" src={Sign} alt="sign" />
                    </div>
                    <div className="max-w-[70%] mx-auto my-8 flex justify-between">
                        <div className="flex gap-4">
                            <IoCallSharp className="text-[#00CCED] p-2 rounded-full border border-[#00CCED] text-4xl" />
                            <span>
                                <p>Phone</p>
                                <p>+917608892920</p>
                            </span>

                        </div>
                        <div className="flex gap-4">
                            <IoLocationOutline className="text-[#00CCED] p-2 rounded-full border border-[#00CCED] text-4xl" />
                            <span className="text-right">
                                <p>CO: - Siraj Khan, first floor , Loco Bazar, Near</p>
                                <p>Loco Bazar Masjid , Gomoh, Dhanbad,</p>
                                <p>Jharkhand,828401</p>
                               <p>Email:-<span className="text-[#00CCED] undeline">abdullakhan@octaadsmedia.com</span></p> 

                            </span>

                        </div>
                    </div>
                   
                </div>
            </div>



            {/* Download Button */}
            <div className="mt-5">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleDownload}
                >
                    Download Payslip
                </button>
            </div>
        </div>
    );
};

export default Payslip;
