import { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth is not initialized. Check your environment variables."));
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password, rememberMe) => {
    if (!auth) return Promise.reject(new Error("Firebase Auth is not initialized. Check your environment variables."));
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized. Providing mock unauthenticated state.");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
