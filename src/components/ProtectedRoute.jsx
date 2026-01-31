import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import api from "../api";

function ProtectedRoute({ children }) {
  const [isAuthorized, SetIsAuthorized] = useState(null);

  useEffect(() => {
    auth().catch(() => SetIsAuthorized(false));
  }, []);

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      SetIsAuthorized(false);
      return
    }
    const decoded = jwtDecode(token);
    const tokenExp = decoded.exp;
    const now = Date.now() / 1000;
    if (tokenExp < now) {
      await refreshToken();
    } else {
      SetIsAuthorized(true);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        SetIsAuthorized(true);
      } else {
        SetIsAuthorized(false);
      }
    } catch (error) {
        console.log(error)
        SetIsAuthorized(false)
    }
  };

  if (isAuthorized === null) {
    return <div>Loading ...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login"/>;
}

export default ProtectedRoute;
