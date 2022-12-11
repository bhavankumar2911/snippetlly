import { Button, Typography } from "antd";
import Image from "next/image";

const Oops = () => {
  return (
    <main
      style={{
        backgroundColor: "#fff",
        width: "100vw",
        height: "100vh",
        display: "flex",
        // alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%" }}>
        <center>
          <div
            style={{
              position: "relative",
              width: "30%",
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
          <Typography.Title level={2} style={{ marginBottom: "2rem" }}>
            Something went wrong
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
