import React from 'react';
import routes from '../routes';
import NeonMenu from './NeonMenu';

const Portfolio = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NeonMenu routes={routes} />
      <h1 className="text-4xl font-bold text-neonBlue">Portfolio</h1>
      <p className="text-xl mt-4">Our portfolio is showcased here.</p>
    </div>
  );
};

export default Portfolio;
