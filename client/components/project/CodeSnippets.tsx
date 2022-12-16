import { Col, List, Row } from "antd";

const data = ["code 1", "code 2", "code 3"];

export default () => (
  <section>
    <Row>
      <Col style={{ backgroundColor: "#ccc" }} span={4}>
        <List
          size="small"
          style={{ backgroundColor: "#fff", height: "100vh" }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <p>{item}</p>
            </List.Item>
          )}
        />
      </Col>
      <Col>j</Col>
    </Row>
  </section>
);
