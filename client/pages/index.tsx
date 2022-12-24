import Container from "../components/helpers/Container";
import Navbar from "../components/helpers/Navbar";
import Hero from "../components/home/Hero";

export default function Home() {
  return (
    <main style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <Navbar authenticate={true} />
      <Container>
        <Hero />
      </Container>
    </main>
  );
}
