import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [totalMessages, setTotalMessages] = useState(null)

  return (
    <UserContext.Provider value={{ selectedUser, setSelectedUser,totalMessages, setTotalMessages }}>
      {children}
    </UserContext.Provider>
  );
};