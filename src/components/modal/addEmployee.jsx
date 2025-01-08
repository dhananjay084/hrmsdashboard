import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  empCode: Yup.string().required('Employee Code is required'),
  gender: Yup.string().oneOf(['Male', 'Female', 'Other'], 'Invalid gender').required('Gender is required'),
  designation: Yup.string().required('Designation is required'),
  salary: Yup.number().min(0, 'Salary must be positive').required('Salary is required'),
  joiningDate: Yup.date().required('Joining date is required'),
  appraisalDate: Yup.date(),
  dob: Yup.date().required('Date of birth is required'),
  role: Yup.string().oneOf(['Admin', 'Manager', 'Employee', 'Intern'], 'Invalid role').required('Role is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'), // Add password validation
});

export default function AddEmployeeModal({ isOpen, onClose, onEmployeeAdded }) {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await fetch('https://hrmsnode.onrender.com/api/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Failed to add employee');

      const newEmployee = await res.json();
      onEmployeeAdded(newEmployee); // Notify parent component
      onClose(); // Close the modal
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            empCode: '',
            gender: '',
            designation: '',
            salary: '',
            joiningDate: '',
            appraisalDate: '',
            reportingManagerId: '',
            dob: '', // Initial value for dob
            role: '', // Initial value for role
            password: '', // Initial value for password
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">First Name</label>
                  <Field
                    name="firstName"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Last Name</label>
                  <Field
                    name="lastName"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Employee Code</label>
                  <Field
                    name="empCode"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="empCode"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Gender</label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Designation</label>
                  <Field
                    name="designation"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="designation"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Salary</label>
                  <Field
                    name="salary"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Joining Date</label>
                  <Field
                    name="joiningDate"
                    type="date"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="joiningDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Appraisal Date</label>
                  <Field
                    name="appraisalDate"
                    type="date"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="appraisalDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* New DOB field */}
                <div>
                  <label className="block text-sm font-medium">Date of Birth</label>
                  <Field
                    name="dob"
                    type="date"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* New Role field */}
                <div>
                  <label className="block text-sm font-medium">Role</label>
                  <Field
                    as="select"
                    name="role"
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Employee">Employee</option>
                    <option value="Intern">Intern</option>
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Reporting Manager ID</label>
                  <Field
                    name="reportingManagerId"
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-black rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {isSubmitting ? 'Adding...' : 'Add Employee'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
