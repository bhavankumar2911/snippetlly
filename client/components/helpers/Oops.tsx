import { Button, Typography } from "antd";
import Image from "next/image";
import React from "react";

interface Props {
  message: string;
}

const Oops: React.FC<Props> = ({ message }) => {
  return (
    <main
      style={{
        backgroundColor: "#fff",
        position: "fixed",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%" }}>
        <center>
          <div
            style={{
              position: "relative",
              width: "25%",
              height: "300px",
            }}
          >
            <Image
              src="/oops.jpg"
              alt="warning symbol"
              style={{ objectFit: "contain" }}
              fill
            />
          </div>
          <Typography.Title level={3} style={{ marginBottom: "2rem" }}>
            {message}
          </Typography.Title>
          <Button type="primary" size="large" href="/">
            Back to home
          </Button>
        </center>
      </div>
    </main>
  );
};

export default Oops;
