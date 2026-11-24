import './Home.scss';
import type { ReactElement } from 'react';
import { FEATURES } from '@/app/features';
import BackgroundShapes from '@components/BackgroundShapes/BackgroundShapes';
import HomeHero from './components/HomeHero/HomeHero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import PlayActivities from './components/PlayActivities/PlayActivities';
import Reviews from './components/Reviews/Reviews';
import TrustStrip from './components/TrustStrip/TrustStrip';

const Home = (): ReactElement => {
  return (
    <div className="home">
      <BackgroundShapes layout="home" />
      <HomeHero />
      <TrustStrip />
      <HowItWorks />
      <PlayActivities />
      {FEATURES.reviews && <Reviews />}
    </div>
  );
};

export default Home;
