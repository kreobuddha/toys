import './Home.scss';
import type { ReactElement } from 'react';
import HomeHero from './components/HomeHero/HomeHero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import PlayActivities from './components/PlayActivities/PlayActivities';
import Reviews from './components/Reviews/Reviews';
import TrustStrip from './components/TrustStrip/TrustStrip';

const Home = (): ReactElement => {
  return (
    <div className="home">
      <HomeHero />
      <TrustStrip />
      <HowItWorks />
      <PlayActivities />
      <Reviews />
    </div>
  );
};

export default Home;
