"use strict";

import HeroSec from "../Hero/HeroSec";
import { CaseSec } from "../landingpage-comp/CaseSec";
import { FeatureSec } from "../landingpage-comp/feature-section";

const Home = () => {
  return (
    <div>
      <HeroSec />
      <CaseSec />
      <FeatureSec />
    </div>
  );
};

export default Home;
