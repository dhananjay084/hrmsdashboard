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
  const navigation = useRouter();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
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
        console.log("Login successful:", data.user);
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
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
