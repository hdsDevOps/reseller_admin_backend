import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { authenticatedRoutes, unauthenticatedRoutes } from "../router";
import { getUserAuthTokenFromLSThunk } from "store/user.thunk";

interface UserAuthProps {
  children: React.ReactNode;
}

export default function UserAuth({ children }: UserAuthProps): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    //getUserAuthToken();
    checkUserAuthStatus();
  }, [dispatch]);

  const getUserAuthToken = async () => {
    try {
      const result = await dispatch(getUserAuthTokenFromLSThunk()).unwrap();
      if(result){
        checkUserAuthStatus();
      }
      // Handle resultAction if needed
    } catch (error) {
      console.error("Error fetching token:", error);
      // Handle the specific error, e.g., show an error message to the user
      navigate("/login");
    }
  };

  function checkUserAuthStatus() {
    const currentPath = window.location.pathname;

    if (!token) {
      if (unauthenticatedRoutes.includes(currentPath)) {
        return; // Allow access to the unauthenticated page
      } else {
        navigate("/login"); // Redirect unauthenticated users to the login page
      }
    } else {
      if (authenticatedRoutes.includes(currentPath)) {
        return; // Allow access to authenticated paths
      } else if (!currentPath.startsWith("/dashboard")) {
        navigate("/dashboard"); // Redirect authenticated users to the dashboard
      }
    }
  }

  return <div>{children}</div>;
}
