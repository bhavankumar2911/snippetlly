import {
  LoadingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  message,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import API from "../../helpers/API";

interface Props {
  isAuthenticated?: boolean;
  authenticate: boolean;
}

const Navbar: React.FC<Props> = (props: Props) => {
  const [authenticating, setAuthenticating] = useState(
    props.authenticate ? true : false
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    props.authenticate ? false : props.isAuthenticated
  );
  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();

  const login: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setLoggingIn(true);

    const {
      responseOK,
      noResponse,
      message: resMessage,
    } = await API.sendRequest("post", "/auth/login", true, { ...form });

    setLoggingIn(false);

    if (responseOK) router.push("/profile");
    else if (noResponse) {
      setIsAuthenticated(false);
      message.warning(resMessage);
    } else {
      setIsAuthenticated(false);
      message.error(resMessage);
    }
  };

  useEffect(() => {
    if (props.authenticate) {
      (async () => {
        const {
          responseOK,
          noResponse,
          notAuthorized,
          message: resMessage,
        } = await API.sendRequest("get", "/auth", true);

        setAuthenticating(false);

        if (responseOK) {
          setIsAuthenticated(true);
        } else if (noResponse) {
          setIsAuthenticated(false);
          message.warning(resMessage);
        } else if (notAuthorized) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
          message.warning(resMessage);
        }
      })();
    }
  }, []);

  const handleLogout = async () => {
    const { responseOK, message: resMessage } = await API.sendRequest(
      "get",
      "/auth/logout",
      true
    );

    if (responseOK) {
      setIsAuthenticated(false);
      message.success(resMessage);

      if (props.isAuthenticated) router.push("/");
    } else {
      message.error(resMessage);
    }
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          zIndex: "10",
          width: "100%",
          top: "0",
          left: "0",
          backgroundColor: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <Row style={{ padding: "1rem 0" }}>
          <Col span={14} offset={5}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography.Title
                level={2}
                style={{ margin: "0", fontWeight: "bold" }}
              >
                <Link href="/" style={{ color: "#000" }}>
                  Snippetlly
                </Link>
              </Typography.Title>
              <Space>
                {authenticating && (
                  <Spin
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} />}
                  />
                )}
                {!authenticating && !isAuthenticated && (
                  <form onSubmit={login}>
                    <Space>
                      <Button href="/signup">Sign Up</Button>
                      <Typography.Text>or</Typography.Text>
                      <Input
                        type="text"
                        placeholder="Username or Email"
                        value={form.usernameOrEmail}
                        onChange={(e) =>
                          setForm({ ...form, usernameOrEmail: e.target.value })
                        }
                      />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                      <Button
                        type="primary"
                        htmlType="submit"
                        disabled={loggingIn}
                      >
                        Login
                      </Button>
                    </Space>
                  </form>
                )}
                {!authenticating && isAuthenticated && (
                  <Space>
                    <Button icon={<UserOutlined />} href="/profile">
                      Profile
                    </Button>
                    <Button
                      type="primary"
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Space>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </nav>
      <div style={{ height: "70px" }}></div>
    </>
  );
};

export default Navbar;
