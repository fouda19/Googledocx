/* eslint-disable react/prop-types */
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import RoundedButton from "./RoundedButton";
import { useNavigate } from "react-router-dom";

const LoginForm = (props) => {
  const navigate = useNavigate();
  return (
    <div className="font-roboto">
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Please enter a valid email address")
            .required("Enter an email"),
          password: Yup.string().required("Enter a password"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          props.handleSubmit(values);
          setTimeout(() => {
            setSubmitting(false);
          }, 400);
        }}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <Field
                type="email"
                name="email"
                placeholder="Email or username"
                className={`w-full px-4 py-2 border ${
                  touched.email && errors.email
                    ? "border-customRed"
                    : touched.email
                    ? "border-customBlue"
                    : "border-gray-300"
                } rounded-md mb-2`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-customRed text-0.75rem font-bold ml-2"
              />
            </div>
            <div>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className={`w-full px-4 py-2 border ${
                  touched.password && errors.password
                    ? "border-customRed"
                    : touched.password
                    ? "border-customBlue"
                    : "border-gray-300"
                } rounded-md mb-2`}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-customRed text-0.75rem font-bold ml-2"
              />
            </div>
            <div className="text-right">
              <RoundedButton
                onClick={() => {
                  navigate("/signup");
                }}
                buttonColor="bg-white"
                buttonBorderColor="border-white"
                buttonTextColor="text-customBlue"
                buttonText="Create account"
              ></RoundedButton>
              <RoundedButton
                type="submit"
                buttonColor="bg-customBlue"
                buttonBorderColor="border-customBlue"
                buttonTextColor="text-white"
                buttonText="Login"
              ></RoundedButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
