import { Alert, Button, Space, Spin } from "antd";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Config from "../../config";
import API from "../../helpers/API";
import FullPageLoader from "./FullPageLoader";
import Oops from "./Oops";

interface Props {
  children: ReactNode;
}

const ProtectedPage: React.FC<Props> = ({ children }) => {
  const [showPage, setShowPage] = useState(false);
  const [loadPage, setLoadPage] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const authenticationCompleted = useRef(false);
  const router = useRouter();

  // authenticate user
  useEffect(() => {
    if (authenticationCompleted.current) return;

    (async () => {
      const { responseOK, noResponse, notAuthorized, message } =
        await API.sendRequest("get", "/auth", true);

      if (responseOK) {
        setLoadPage(false);
        setShowPage(true);
      } else if (noResponse) {
        setLoadPage(false);
        setError(message);
      } else if (notAuthorized) {
        router.push("/login");
      } else {
        setLoadPage(false);
        setError(message);
      }
    })();

    authenticationCompleted.current = true;
  }, []);

  return (
    <>
      {/* loading */}
      {loadPage && <FullPageLoader />}
      {/* error occured */}
      {error && <Oops message={error} />}
      {/* show page */}
      {showPage && children}
    </>
  );
};

export default ProtectedPage;
