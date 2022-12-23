import { Button, Col, Row, Space, Typography } from "antd";
import React from "react";

const Navbar = () => {
  return (
    <>
      <nav
        style={{
          //   height: "70px",
          position: "fixed",
          width: "100%",
          top: "0",
          left: "0",
          backgroundColor: "#fff",
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
                Snippetlly
              </Typography.Title>
              <Space>
                <Button type="primary" href="/login">
                  Login
                </Button>
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
