// src/SocialCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SocialCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Try to find token in query params or fragment
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/dashboard"); // Or wherever you want to send users after login
    } else {
      // Handle error or fallback
      navigate("/login");
    }
  }, [navigate]);

  return <div>Signing you in...</div>;
}
