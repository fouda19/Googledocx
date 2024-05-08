/* eslint-disable react/prop-types */
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import RoundedButton from './RoundedButton';

const SignUpForm = (props) => {


  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must be at most 30 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required")
      .min(8, "Password must be at least 8 characters")
      .max(30, "Password must be at most 30 characters"),
    birthDay: Yup.number()
      .required("Day is required")
      .test("birthDay", "Day is invalid", function (value) {
        const { birthMonth } = this.parent;
        if (birthMonth === 2) {
          return value <= 29;
        } else if ([4, 6, 9, 11].includes(birthMonth)) {
          return value <= 30;
        } else {
          return value <= 31;
        }
      }),
    birthMonth: Yup.number().required("Month is required"),
    birthYear: Yup.number().required("Year is required"),
  });

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
      // hena el api call 
      props.handleSubmit(values);
      console.log(values);
      setSubmitting(false);

  };

  return (
    <>
      <div className="font-roboto">
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            birthDay: "",
            birthMonth: "",
            birthYear: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <Field
                    type="firstName"
                    name="firstName"
                    placeholder="First Name"
                    className={`w-full px-4 py-2 border ${
                      touched.firstName && errors.firstName
                        ? "border-customRed"
                        : touched.firstName
                        ? "border-customBlue"
                        : "border-gray-300"
                    } rounded-md mb-2`}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-customRed text-0.75rem font-bold ml-2"
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <Field
                    type="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    className={`w-full px-4 py-2 border ${
                      touched.lastName && errors.lastName
                        ? "border-customRed"
                        : touched.lastName
                        ? "border-customBlue"
                        : "border-gray-300"
                    } rounded-md mb-2`}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-customRed text-0.75rem font-bold ml-2"
                  />
                </div>
              </div>
              <div className="flex justify-center space-x-4 rounded">
                <div className="w-1/3">
                  <label className="block text-center text-customBlue">
                    Day
                  </label>
                  <Field
                    as="select"
                    name="birthDay"
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="birthDay"
                    component="div"
                    className="text-customRed text-0.75rem font-bold ml-2"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-center text-customBlue">
                    Month
                  </label>
                  <Field
                    as="select"
                    name="birthMonth"
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="birthMonth"
                    component="div"
                    className="text-customRed text-0.75rem font-bold ml-2"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block text-center text-customBlue">
                    Year
                  </label>
                  <Field
                    as="select"
                    name="birthYear"
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    {[...Array(new Date().getFullYear() - 1900 + 1)].map(
                      (_, i) => (
                        <option key={i} value={i + 1900}>
                          {i + 1900}
                        </option>
                      )
                    )}
                  </Field>
                  <ErrorMessage
                    name="birthYear"
                    component="div"
                    className="text-customRed text-0.75rem font-bold ml-2"
                  />
                </div>
              </div>
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
              <div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  className={`w-full px-4 py-2 border ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-customRed"
                      : touched.confirmPassword
                      ? "border-customBlue"
                      : "border-gray-300"
                  } rounded-md mb-2`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-customRed text-0.75rem font-bold ml-2"
                />
              </div>
              <div className="text-right">
                <RoundedButton
                  type="submit"
                  buttonColor="bg-customBlue"
                  buttonBorderColor="border-customBlue"
                  buttonTextColor="text-white"
                  buttonText="Sign Up"
                ></RoundedButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SignUpForm;
