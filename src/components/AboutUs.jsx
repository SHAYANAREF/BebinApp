import React from 'react';
import routes from '../routes';
import NeonMenu from './NeonMenu';

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NeonMenu routes={routes} />
      <h1 className="text-4xl font-bold text-neonBlue">About Us</h1>
      <p className="text-xl mt-4">Learn more about us on this page.</p>
    </div>
  );
};

export default AboutUs;
