import Container from "../../components/helpers/Container";
import ProtectedPage from "../../components/helpers/ProtectedPage";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import API from "../../helpers/API";
import IUserInfo from "../../interfaces/UserInfo";
import FullPageLoader from "../../components/helpers/FullPageLoader";
import Oops from "../../components/helpers/Oops";
import UserInfo from "../../components/profile/UserInfo";
import Projects from "../../components/profile/Projects";

const OwnProfile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [user, setUser] = useState<null | IUserInfo>(null);
  const [projects, setProjects] = useState<null | any[]>(null);
  const dataFetched = useRef(false);
  const router = useRouter();

  // fetch user info
  useEffect(() => {
    (async () => {
      if (dataFetched.current) return;

      const { responseOK, noResponse, notAuthorized, data, message } =
        await API.sendRequest("get", "/user", true);

      setLoading(false);

      if (responseOK) {
        const { name, email, username, Projects } = data;
        setUser({ name, email, username });
        setProjects(Projects);
      } else if (noResponse) {
        setError(message);
      } else if (notAuthorized) {
        router.push("/login");
      } else {
        setLoading(false);
        setError(message);
      }

      dataFetched.current = true;
    })();
  }, []);

  return (
    <ProtectedPage>
      <Container>
        <main>
          {/* loading */}
          {loading && <FullPageLoader loadingText="Loading user..." />}

          {/* error message */}
          {error && <Oops message={error} />}

          {/* user info */}
          {!loading && !error && user && <UserInfo user={user} />}

          {/* user projects */}
          {!loading && !error && projects && (
            <Projects projects={projects} setProjects={setProjects} />
          )}
        </main>
      </Container>
    </ProtectedPage>
  );
};

export default OwnProfile;
