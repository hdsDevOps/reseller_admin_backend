import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "store/hooks";
import { makeUserLoginThunk } from "store/user.thunk";

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("ameadmin@yopmail.com");
  const [password, setPassword] = useState("Admin@1234");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const result = await dispatch(
        makeUserLoginThunk({
          email: username,
          password: password,
          login_user_type: 0,
        })
      ).unwrap();
      console.log("result....", result);
      navigate("/dashboard");
      //onLogin(username, password);
    } catch (error) {
      // Handle error
      console.error("Login error:", error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
