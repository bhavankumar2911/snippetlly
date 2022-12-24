import { Button, Col, Row, Typography } from "antd";
import React from "react";

const Hero = () => {
  return (
    <section
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Row>
        <Col
          span={12}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Typography.Title style={{ fontWeight: "700", fontSize: "3.5rem" }}>
            Build more, <span>Code</span> less!
          </Typography.Title>
          <Button type="primary" size="large" href="/profile">
            Create a project
          </Button>
        </Col>
        <Col
          span={12}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <img src="/hero.jpg" alt="code image" style={{ width: "80%" }} />
        </Col>
      </Row>
    </section>
  );
};

export default Hero;
