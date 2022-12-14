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

const Signup: React.FC = () => {
  const [alert, setAlert] = useState<IAlert>({
    message: "",
    type: undefined,
    show: false,
  });

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const router = useRouter();

  const handleSignup: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${Config.apiHost}/auth/signup`, {
        ...form,
      });

      router.push("/login");
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
                <Title level={3}>Create Account</Title>
              </center>
              <form onSubmit={handleSignup}>
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
                    placeholder="Full name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    size="large"
                    placeholder="Username"
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />
                  <Input
                    size="large"
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
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
                  <Input
                    size="large"
                    placeholder="Repeat Password"
                    type="password"
                    name="passwordConfirm"
                    value={form.passwordConfirm}
                    onChange={(e) =>
                      setForm({ ...form, passwordConfirm: e.target.value })
                    }
                  />
                  <Button type="primary" htmlType="submit" size="large" block>
                    Sign up
                  </Button>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Space>
                      <Text>Already have an account?</Text>
                      <Link href="/login">
                        <Text style={{ color: "#1677ff" }}>Login</Text>
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

export default Signup;
