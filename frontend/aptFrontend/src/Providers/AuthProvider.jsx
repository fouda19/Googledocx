import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = (props) => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // useEffect to listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("localStorage.getItem(token)", localStorage.getItem("token"));
      setToken(localStorage.getItem("token"));
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup function to remove listener on unmount
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token }}>{props.children}</AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,  // Ensure children prop is required
};

export { AuthContext, AuthProvider };
