import { Button } from "antd";
import Container from "../components/helpers/Container";
import Navbar from "../components/helpers/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Container>
        <Button type="primary">Primary Button</Button>
      </Container>
    </main>
  );
}
