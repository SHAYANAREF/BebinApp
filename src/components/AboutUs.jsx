import React from 'react';
import Menu from './Menu.jsx';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

const AboutUs = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Menu items={menuItems} />
      <h1 className="text-4xl font-bold text-neonBlue">About Us</h1>
      <p className="text-xl mt-4">Learn more about us on this page.</p>
    </div>
  );
};

export default AboutUs;
