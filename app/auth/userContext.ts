import { createContext, useContext } from "react";

type User = { email: string } | null;

export const UserContext = createContext<{
  isAuthenticated: boolean;
  user: User;
}>({ isAuthenticated: false, user: null });

export const useUser = () => useContext(UserContext);
