import React from 'react';
import Menu from './Menu.jsx';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Menu items={menuItems} />
      <h1 className="text-4xl font-bold text-neonBlue">Register</h1>
      <p className="text-xl mt-4">Please register to continue.</p>
    </div>
  );
};

export default Register;
