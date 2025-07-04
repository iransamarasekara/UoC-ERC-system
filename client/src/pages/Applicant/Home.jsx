import Hero from "../../components/Applicant/Hero.jsx";
import Features from "../../components/Applicant/Features.jsx";
import AboutProcess from "../../components/Applicant/AboutProcess.jsx";

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <Features />
      <AboutProcess />
    </div>
  );
};

export default Home;
