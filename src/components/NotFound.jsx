import React from 'react';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-neonRed">404 - Not Found</h1>
      <p className="text-xl mt-4">The page you are looking for does not exist.</p>
    </div>
  );
};
