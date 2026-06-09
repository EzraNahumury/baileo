import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Stats from "./components/Stats";
import Roadmap from "./components/Roadmap";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="relative">
        <Hero />
        <div className="hairline mx-auto h-px max-w-7xl" />
        <Features />
        <div className="hairline mx-auto h-px max-w-7xl" />
        <HowItWorks />
        <Stats />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
