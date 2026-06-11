import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (email, password, role) => {
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    })
      .then(res => {
        if (!res.ok) throw new Error("Invalid credentials context parameters");
        return res.json();
      })
      .then(data => {
        // Save token context and hydrate state
        localStorage.setItem("eduportal_token", data.token);
        setUser(data.user);
        alert(`Access granted! Welcome ${data.user.name}.`);
        navigate("/dashboard");
      })
      .catch(err => alert("Access Denied: " + err.message));
  };

  const register = (name, email, password, role) => {
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    })
      .then(res => {
        if (!res.ok) throw new Error("Account creation syntax error pipeline");
        return res.json();
      })
      .then(() => {
        alert("Registration profile saved successfully to Cluster!");
        navigate("/");
      })
      .catch(err => alert("Registration Failed: " + err.message));
  };

  const logout = () => {
    localStorage.removeItem("eduportal_token");
    setUser(null);
    alert("Session tracking closed successfully.");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }