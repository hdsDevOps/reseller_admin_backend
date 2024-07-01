import React from "react";
import { Route, Routes } from "react-router-dom";

const Login = React.lazy(() => import("./Login"));
const OTP = React.lazy(() => import("./OTP"));

const authApp: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    console.log("Logging in with:", username, password);
    // Replace with your actual login logic
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/otp" element={<OTP/>} />
      </Routes>
    </div>
  );
};

export default authApp;
