import { Spin } from "antd";
import React from "react";

interface Props {
  loadingText?: string;
}

const FullPageLoader: React.FC<Props> = ({ loadingText }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        position: "fixed",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size="large" tip={loadingText} />
    </div>
  );
};

export default FullPageLoader;
