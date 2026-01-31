import { createContext, useEffect, useState } from "react";
import { ACCESS_TOKEN } from "./constants";
import api from "./api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('api/user/')
        setUser(res.data)
      } catch (error) {
        console.log(error)
        setUser(null)
      } finally{
        setLoading(false)
      }
    };
    fetchUser()
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
