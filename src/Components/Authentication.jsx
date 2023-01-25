import React from "react";
import { Formik, Form } from "formik";
import {
  TextField,
  Typography,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import { AiFillEye } from 'react-icons/ai';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';

import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email Address!")
    .required("Required!"),
  password: Yup.string()
    .min(8, "Must be at least 8 Characters Long!")
    .required("Required!"),
});

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Must be at least 3 Characters Long!")
    .required("Required!"),
  email: Yup.string()
    .email("Invalid Email Address!")
    .required("Required!"),
  password: Yup.string()
    .min(8, "Must be at least 8 Characters Long!")
    .required("Required!"),
  phone: Yup.string()
    .min(6, "Must be of at least 6 Characters Long!")
    .required("Required!"),
});

const loginInitialValues = {
  email: "",
  password: "",
  name: "",
  phone: ""
}

const signupInitialValues = {
  email: "",
  password: "",
  name: "",
  phone: ""
}

const Authentication = () => {
  const [loginMode, setloginMode] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const navigator = useNavigate();
  const handleToggle = () => {
    setloginMode((prev) => !prev);
  };

  const togglePasswordVisiblity = () => {
    setShowPassword((prev) => !prev);
  };


  return (
    <Formik
      initialValues={loginMode ? loginInitialValues : signupInitialValues}
      validationSchema={loginMode ? LoginSchema : SignupSchema}
      onSubmit={async (values) => {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        if (loginMode) {
          try {
            setLoading(true)
            // console.log(values.email, values.password, process.env.REACT_APP_BACKEND_URL)
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/login`,
              {
                email: values.email,
                password: values.password,
              },
              config
            )
            // console.log(data);
            toast("Login Successful", {
              type: "success"
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigator('/chats')
          }
          catch (err) {
            
            toast(`Error Occured: ${err?.response?.data?.message} `, {
              type: "error"
            });
            console.log(err);
            setLoading(false);
          }
        }

        else {
          try {
            setLoading(true)
            // console.log(values.email, values.password, process.env.REACT_APP_BACKEND_URL)
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user`,
              {
                name: values.name,
                email: values.email,
                phone: values.phone,
                password: values.password,
              },
              config
            )
            // console.log(data);
            toast("Sign Up Successful", {
              type: "success"
            });

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigator('/chats')
          }
          catch (err) {
            toast("Error Occured", {
              type: "error"
            });
            console.log(err);
            setLoading(false);
          }
        }
      }}
    >
      {({ values, handleChange, errors, touched }) => (
        <Paper elevation={4} className='py-8 px-8 flex items-center h-full select-none'>
          <Form className="w-full">
            <Box className="my-8">
              <Typography variant="h5" className="text-center text-[#11256D]">
                Gateway To Our Conversational Space
              </Typography>
            </Box>
            {
              loginMode
                ?
                <>
                  <TextField
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    name="email"
                    fullWidth
                    value={values.email}
                    onChange={handleChange}
                    helperText={touched.email ? errors.email : ""}
                    error={touched.email && Boolean(errors.email)}
                  />
                  <div className="relative">
                    <TextField
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password ? errors.password : ""}
                      error={touched.password && Boolean(errors.password)}
                    />
                    {
                      showPassword
                        ?
                        <AiFillEye className="absolute right-3 text-[#11256D] bottom-6 cursor-pointer" size={25} onClick={togglePasswordVisiblity} />
                        :
                        <AiFillEyeInvisible className="absolute right-3 text-[#11256D] bottom-6 cursor-pointer" size={25} onClick={togglePasswordVisiblity} />
                    }
                  </div>

                </>
                :
                <>
                  <TextField
                    label="Name"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    helperText={touched.name ? errors.name : ""}
                    error={touched.name && Boolean(errors.name)}
                  />
                  <Stack direction={'row'} className='space-x-5'>
                    <TextField
                      label="Email"
                      variant="outlined"
                      margin="normal"
                      name="email"
                      fullWidth
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email ? errors.email : ""}
                      error={touched.email && Boolean(errors.email)}
                    />
                    <TextField
                      label="Phone"
                      variant="outlined"
                      margin="normal"
                      name="phone"
                      fullWidth
                      value={values.phone}
                      onChange={handleChange}
                      helperText={touched.phone ? errors.phone : ""}
                      error={touched.phone && Boolean(errors.phone)}
                    />
                  </Stack>

                  <div className="relative">
                    <TextField
                      label="Password"
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password ? errors.password : ""}
                      error={touched.password && Boolean(errors.password)}
                    />
                    {
                      showPassword
                        ?
                        <AiFillEye className="absolute right-3 text-[#11256D] bottom-6 cursor-pointer" size={25} onClick={togglePasswordVisiblity} />
                        :
                        <AiFillEyeInvisible className="absolute right-3 text-[#11256D] bottom-6 cursor-pointer" size={25} onClick={togglePasswordVisiblity} />
                    }
                  </div>
                </>
            }

            <button type="submit" className="w-full my-8 bg-[#11256D] text-center rounded-md text-white text-xl py-3 duration-300 cursor-pointer">
              {
                loading ? (<BiLoaderAlt className="mx-auto animate-spin" size={28} />) : (loginMode ? "Login" : "Sign Up")
              }
            </button>

            <div className="select-none">
              <span>
                {loginMode ? "Not Registered?" : "Already Registered?"}
              </span>
              <span className="ml-2 text-lg text-[#11256D] cursor-pointer hover:border-b-2 hover:border-[#11256D] duration-100"
                onClick={handleToggle}>
                {loginMode ? "Sign Up" : "Login"}
              </span>
            </div>
          </Form>
        </Paper>
      )}
    </Formik>
  );
};

export default Authentication;