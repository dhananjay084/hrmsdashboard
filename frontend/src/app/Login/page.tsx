"use client";
import { useState } from "react";
import Image from "next/image";
import Logo from "@/assests/logo.webp";
import { MdOutlineVisibility } from "react-icons/md";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from 'next/navigation';
import nookies from "nookies"; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for Toast notifications

interface Value {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for forgot password modal
  const [passwordReset, setPasswordReset] = useState(false); // State to show the reset message after successful reset
  const navigation = useRouter();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const forgotPasswordInitialValues = {
    email: "",
    newPassword: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Please enter your email address"),
    newPassword: Yup.string().required("Please enter a new password"),
  });

  const onSubmit = async (values: Value) => {
    setLoading(true); // Start loading
    try {
      const response = await fetch("https://hrmsnode.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        // Store access token and refresh token in cookies
        nookies.set(null, "accessToken", data.accessToken, {
          path: "/",
          maxAge: 15 * 60, // 15 minutes
        });
        nookies.set(null, "refreshToken", data.refreshToken, {
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });
        nookies.set(null, "role", data.user.role);
        nookies.set(null, "id", data.user.id);

        // Navigate to the homepage after successful login
        navigation.push('/');

        // Show success toast
        toast.success('Login successful!', {
          autoClose: 1000,
        });
      } else {
        // Show error toast if login fails
        toast.error(`Login failed: ${data.message}`, {
          autoClose: 1000,
        });
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error('Error during login, please try again!', {
        autoClose: 1000,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleForgotPasswordSubmit = async (values: { email: string, newPassword: string }) => {
    try {
      // Simulate an API request to reset the password
      const response = await fetch('https://hrmsnode.onrender.com/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),  // Sending email and new password to the API
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle successful password reset
        setPasswordReset(true); // Show success state
        toast.success('Password reset successful! You can now log in with your new password.', {
          autoClose: 3000,
        });
      } else {
        // Handle API failure (e.g., invalid email or server error)
        toast.error(`Error: ${data.message || 'Something went wrong, please try again.'}`, {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      toast.error('Error resetting password, please try again!', {
        autoClose: 2000,
      });
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen text-left w-full bg-[url('/LoginBackground.jpg')] bg-cover bg-center">
      <div className="flex flex-col gap-5 w-[40%] shadow-xl p-6 bg-white bg-opacity-75 rounded-lg relative">
        <Image src={Logo} alt="Logo" className="mb-6" />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="mb-4">
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div className="mb-4 relative">
              <Field
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
              />
              {/* Password visibility toggle button */}
              <div className="absolute right-3 top-3">
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="text-gray-600"
                >
                  {showPassword ? <MdOutlineVisibilityOff size={24} /> : <MdOutlineVisibility size={24} />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
                disabled={loading} // Disable the button while loading
              >
                {loading ? "Logging in..." : "Log In"} {/* Conditional text */}
              </button>
            </div>
          </Form>
        </Formik>

        <div className="mt-4 text-center">
          <button 
            className="text-blue-500"
            onClick={() => setShowForgotPassword(true)} // Show Forgot Password form
          >
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && !passwordReset && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
            <h3 className="text-xl font-semibold text-center mb-4">Reset Your Password</h3>

            <Formik
              initialValues={forgotPasswordInitialValues}
              validationSchema={forgotPasswordValidationSchema}
              onSubmit={handleForgotPasswordSubmit}
            >
              <Form>
                <div className="mb-4">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div className="mb-4">
                  <Field
                    name="newPassword"
                    type="password"
                    placeholder="Enter a new password"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-700"
                  />
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Reset Password
                  </button>
                </div>
              </Form>
            </Formik>

            <div className="text-center mt-4">
              <button 
                className="text-blue-500"
                onClick={() => setShowForgotPassword(false)} // Close modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
