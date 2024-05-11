import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "react-quill/dist/quill.snow.css";
import { AuthProvider } from "./Providers/AuthProvider.jsx";
import { AlertProvider } from "./Providers/AlertProvider.jsx";
// import { query } from 'express';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AlertProvider>
      {/* <AuthProvider> */}
      <App />
      {/* </AuthProvider> */}
    </AlertProvider>
  </React.StrictMode>
);
