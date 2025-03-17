import React from 'react';
import routes from '../routes';
import NeonMenu from './NeonMenu';

const Demo = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NeonMenu routes={routes} />
      <h1 className="text-4xl font-bold text-neonBlue">Demo</h1>
      <p className="text-xl mt-4">Welcome to the demo page!</p>
    </div>
  );
};

export default Demo;
