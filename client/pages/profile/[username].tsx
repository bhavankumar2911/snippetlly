import { Alert, Divider, Spin, Typography } from "antd";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "../../components/helpers/Container";
import Projects from "../../components/profile/Projects";
import Config from "../../config";
import ProfilePageUser from "../../interfaces/ProfilePageUser";

const Profile = () => {
  const [user, setUser] = useState<ProfilePageUser>({
    loading: true,
    name: null,
    username: null,
    email: null,
    error: false,
    errorMessage: null,
    projects: null,
  });
  const router = useRouter();
  const { username } = router.query;

  // loading user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(username);

        const res = await axios.get(`${Config.apiHost}/user/${username}`);
        const { data } = res.data;

        setUser({
          ...user,
          name: data.name,
          username: data.username,
          email: data.email,
          loading: false,
          projects: data.Projects,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            setUser({
              ...user,
              loading: false,
              error: true,
              errorMessage: error.response.data.error.message,
            });
          } else if (error.request) {
            setUser({
              ...user,
              loading: false,
              error: true,
              errorMessage: "Internal server error",
            });
          } else {
            setUser({
              ...user,
              loading: false,
              error: true,
              errorMessage: "Something went wrong",
            });
          }
        }
      }
    };

    if (username) fetchUser();
  }, [username]);

  return (
    <Container>
      <div style={{ padding: "3rem 0" }}>
        {/* user info */}
        {user.loading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Spin tip="Loading user..." />
          </div>
        ) : (
          <>
            {user.error ? (
              <Alert type="error" message={user.errorMessage} showIcon />
            ) : (
              <>
                <section
                  style={{
                    backgroundColor: "#fff",
                    padding: "2rem",
                    borderRadius: "5px",
                  }}
                >
                  <Typography.Title level={2}>Personal</Typography.Title>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: "0",
                      marginTop: "2rem",
                    }}
                  >
                    <li>
                      <Typography.Text>
                        <b>Name: </b>
                      </Typography.Text>
                      <Typography.Text>{user.name}</Typography.Text>
                    </li>
                    <Divider />
                    <li>
                      <Typography.Text>
                        <b>Username: </b>
                      </Typography.Text>
                      <Typography.Text>{user.username}</Typography.Text>
                    </li>
                    <li>
                      <Divider />
                      <Typography.Text>
                        <b>Email: </b>
                      </Typography.Text>
                      <Typography.Text>{user.email}</Typography.Text>
                    </li>
                  </ul>
                </section>

                {/* projects section */}
                <Projects projects={user.projects as any[]} />
              </>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Profile;
