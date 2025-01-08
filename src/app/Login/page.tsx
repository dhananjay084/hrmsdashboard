"use client";
import { useState } from "react";
import { Button, TextField, InputAdornment, IconButton } from "@mui/material";
import Image from "next/image";
import Logo from "@/assests/logo.webp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-left w-full bg-[url('/LoginBackground.jpg')] bg-cover bg-center">
      <div className="flex flex-col gap-5 w-[40%] shadow-xl p-6 bg-white bg-opacity-75 rounded-lg">
        <Image src={Logo} alt="Logo" />

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="mb-4">
              <Field
                name="email"
                as={TextField}
                label="Email"
                className="w-full"
                placeholder="Enter your email"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <Field
                name="password"
                as={TextField}
                label="Password"
                className="w-full"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <Button variant="contained" type="submit" className="w-fit">
                Log In
              </Button>
            </div>
          </Form>
        </Formik>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={1000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}
