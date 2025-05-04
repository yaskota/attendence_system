// context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole,setUserRole]=useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get("http://localhost:8080/api/authstudent/details", {
          withCredentials: true,
        });
        const {userRole,user}=res.data
        console.log("authcontext",res)
        setUser(user);
        setUserRole(userRole);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res=await axios.post("http://localhost:8080/api/authstudent/logout",null,{
        withCredentials: true,
      });
      console.log(res.data)
      setUser(null);
      setUserRole("");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading,userRole,setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
