import React from 'react';
import routes from '../routes';
import NeonMenu from './NeonMenu';

const Contact = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NeonMenu routes={routes} />
      <h1 className="text-4xl font-bold text-neonBlue">Contact</h1>
      <p className="text-xl mt-4">Get in touch with us.</p>
    </div>
  );
};

export default Contact;
