import Banner from "./components/Banner";
import QuickActions from "./components/QuickActions";
import GettingStarted from "./components/GettingStarted";

const HomePage = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-8 pt-0">
      <Banner/>

      <QuickActions/>
      
      <GettingStarted/>
    </div>
  );
};

export default HomePage;
