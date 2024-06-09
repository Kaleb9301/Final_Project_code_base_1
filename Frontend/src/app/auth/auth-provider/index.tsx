import { createContext, useState } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }: any) => {

  // const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const [auth, setAuth] = useState({ username, role, email });
  
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
