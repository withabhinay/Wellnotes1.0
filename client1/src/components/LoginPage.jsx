import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; // Import Firebase auth instance
import { GoogleAuthProvider } from "firebase/auth";
import axios from "axios";

const LoginPage = ({ setAuthToken, authToken, handleLogout }) => {
  console.log("LoginPage component rendered: ", authToken);
  const navigate = useNavigate();

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  };

  const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const token = await result.user.getIdToken();
      console.log(token);
      // Show loading indicator
      document.getElementById("Loading").style.display = "flex";

      const response = await axios.post("https://zipbuy.in/api/auth",{token}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      document.getElementById("Loading").style.display = "none";

      const data = await response.data.Message;
      alert(data);
      console.log(response.data.Token);
      const tokenner = await response.data.Token;
      console.log(tokenner, "token here !");
      // Store auth token
      setAuthToken(tokenner);
      localStorage.setItem("dbtoken", tokenner);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      alert("Unable to login using Google.");
      console.error("Login error:", error);
    }
  };

  const onLogoutClick = async () => {
    try {
      await auth.signOut();
      handleLogout(); // Clear auth token
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <h1>Login</h1>
      <div id="Loading" style={{ display: "none" }}>Loading...</div>
      {!authToken ? (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      ) : (
        <button onClick={onLogoutClick}>Authenticated, Logout</button>
      )}
    </div>
  );
};

export default LoginPage;
