import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../JS Files/Firebase";

export const AuthContext = createContext({
  userLoggedIn: null,
  isAdmin: false,
  isLoading: true,
});

export const AuthProvider = ({ children }) => {
  const ADMIN_UID = "KwjulzXHJbXp0SEFMZcih4nvHtx2";
  const [signin, setSignin] = useState({ userLoggedIn: null, isAdmin: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignin({
          userLoggedIn: user,
          isAdmin: user.uid === ADMIN_UID,
        });
      } else {
        setSignin({ userLoggedIn: null, isAdmin: false });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ signin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
