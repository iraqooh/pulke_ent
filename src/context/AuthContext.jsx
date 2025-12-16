import { createContext, useContext, useState, useEffect } from 'react';
import { account } from '../lib/appwrite';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    account.get().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const loggedIn = await account.createEmailPasswordSession({
      email,
      password
    })
    setUser(loggedIn)
    // await account.createEmailPasswordSession({ email, password });
    // setUser(await account.get());
  };

  const logout = async () => {
    await account.deleteSession({
      sessionId: 'current'
    });
    setUser(null);
  };

  const init = async () => {
    try {
      const loggedIn = await account.get()
      setUser(loggedIn)
    } catch (err) {
      setUser(null)
      console.error(`${err}`)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setLoading, init }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);