import { createContext, useState, useContext, useEffect } from "react";
import api from "../API/api";
import { isLoggedIn } from "../utills";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (isLoggedIn()) {
            api.get("/auth/me")
                .then((res) => setUser(res.data.user)) // .user depends on your backend response
                .catch(() => {
                    localStorage.removeItem("token");
                    setUser(null);
                });
        } else {
            localStorage.removeItem("token");
            setUser(null);
        }
    }, []);

    const logout = async () => {
        try {
          //await api.post("/auth/logout"); // Optional: only if your backend supports this
        } catch (err) {
          console.error("Logout failed:", err);
        } finally {
          setUser(null);
          localStorage.removeItem("token");
        }
      };

    return (
        <AuthContext.Provider value={{ user, setUser,logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
