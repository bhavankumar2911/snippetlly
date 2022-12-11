import { Col, Row } from "antd";
import ContainerProps from "../../interfaces/ContainerProps";

const Container = ({ children }: ContainerProps) => {
  return (
    <Row>
      <Col span={14} offset={5} style={{ padding: "3rem 0" }}>
        {children}
      </Col>
    </Row>
  );
};

export default Container;
