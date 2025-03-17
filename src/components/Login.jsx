import React from 'react';
import routes from '../routes';
import NeonMenu from './NeonMenu';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NeonMenu routes={routes} />
      <h1 className="text-4xl font-bold text-neonBlue">Login</h1>
      <p className="text-xl mt-4">Please log in to continue.</p>
    </div>
  );
};

export default Login;
