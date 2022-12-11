import axios, { AxiosError } from "axios";
import React, { ReactNode, useEffect, useState } from "react";
import Config from "../config";

interface AppContextProviderProps {
  children: ReactNode;
}

interface IGlobalContext {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = React.createContext<IGlobalContext | null>(null);

export default (props: AppContextProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await axios.get(`${Config.apiHost}/auth`, {
          withCredentials: true,
        });

        setIsAuthenticated(true);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            if (error.response.status == 401) {
              if (error.response.data.error.message == "TokenExpiredError") {
              } else setIsAuthenticated(false);
            }
          }
        }
      }
    })();
  }, []);

  return (
    <GlobalContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
