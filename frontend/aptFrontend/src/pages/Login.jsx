import React from "react";
//import { ButtonType } from "../../validate/buttonType";
//import { postRequest } from "../../API/User";
import { useState } from "react";
import { Dialog, DialogBody, IconButton } from "@material-tailwind/react";
// import { IoMdClose } from "react-icons/io";
// import { useMutation } from "react-query";
// import { saveToken } from "../../utils/tokens_helper";
import { object } from "yup";
import { MdCatchingPokemon } from "react-icons/md";
import axios from "axios";
//import MyForm from "../../components/Form";
import LoginForm from "../components/LoginForm";
import googleLogo from "../assets/google-logo.png";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
// import { saveToken } from "../hooks/auth/useSession";
import { postRequest } from "../API/API";

export default function Login() {
  const postReq = useMutation((data) =>
    postRequest("/backend/user/login", data)
  );
  const navigate = useNavigate();
  const handleSubmit = (values) => {
    const { email, password } = values;
    postReq.mutate(
      { email: email, password: password },
      {
        onSuccess: (data) => {
          console.log(data);
          console.log(data.token);
          console.log("MIZOO");
          localStorage.setItem("token", data.token);
          navigate("/documents");
          // location.reload();
        },
      }
    );
  };

  return (
    <>
      <div className="bg-customGrey h-screen flex justify-center items-center">
        <div
          className="bg-white p-8 rounded-xl"
          style={{ width: "1000px", height: "508px" }}
        >
          <div className="flex flex-col justify-center">
            <div className="flex flex-col items-start">
              <img
                src={googleLogo}
                alt="Google Logo"
                className="mb-2 w-16 h-16"
              />
              <div>
                <h2 className="text-2.25rem mb-4 open-sans">Sign in</h2>
                <h2 className="text-1.25rem text-gray-500 mb-8">
                  Use your Google account
                </h2>
              </div>
            </div>
          </div>
          <LoginForm handleSubmit={handleSubmit} />
        </div>
      </div>
    </>
  );
}
