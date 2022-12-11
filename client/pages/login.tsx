import { Col, Row, Typography, Input, Space, Button, Alert } from "antd";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Config from "../config";
const { Title, Text } = Typography;

interface IAlert {
  message: string;
  type: "error" | "warning" | "success" | "info" | undefined;
  show: boolean;
}

const Login: React.FC = () => {
  const [alert, setAlert] = useState<IAlert>({
    message: "",
    type: undefined,
    show: false,
  });

  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const router = useRouter();

  const handleLogin: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${Config.apiHost}/auth/login`,
        {
          ...form,
        },
        { withCredentials: true }
      );

      if (res.status == 200) {
        router.push(`/profile`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setAlert({
            show: true,
            message: error.response.data.error.message,
            type: "error",
          });
        } else if (error.request) {
          setAlert({
            show: true,
            message: "Internal server error",
            type: "warning",
          });
        } else {
          setAlert({
            show: true,
            message: "Something went wrong",
            type: "warning",
          });
        }
      }
    }
  };
  return (
    <>
      <Row>
        <Col span={6} offset={9}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Space
              direction="vertical"
              style={{
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "5px",
              }}
            >
              <center>
                <Title level={3}>Welcome back!</Title>
              </center>
              <form onSubmit={handleLogin}>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  {alert.show && (
                    <Alert message={alert.message} type={alert.type} showIcon />
                  )}
                  <Input
                    size="large"
                    placeholder="Username or Email"
                    type="text"
                    name="usernameOrEmail"
                    value={form.usernameOrEmail}
                    onChange={(e) =>
                      setForm({ ...form, usernameOrEmail: e.target.value })
                    }
                  />
                  <Input
                    size="large"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <Button type="primary" htmlType="submit" size="large" block>
                    Login
                  </Button>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Space>
                      <Text>New user?</Text>
                      <Link href="/signup">
                        <Text style={{ color: "#1677ff" }}>Create Account</Text>
                      </Link>
                    </Space>
                  </span>
                </Space>
              </form>
            </Space>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Login;
