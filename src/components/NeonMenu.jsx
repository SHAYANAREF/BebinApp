import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NeonMenu = ({ routes = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!routes.length) return <div className="text-white">No routes provided</div>;

  return (
    <nav className="flex justify-center sticky top-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-md" aria-label="Main navigation">
      {/* Desktop menu version */}
      <div className="flex hidden md:flex-row md:gap-12 md:p-6 w-full max-w-7xl justify-center">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="text-neonBlue hover:text-neonPurple text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105 animate-neon-pulse px-4"
          >
            {route.name}
          </Link>
        ))}
      </div>

      {/* Mobile menu button */}
      <button
        className="p-4 text-neonBlue hover:text-neonPurple transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          className="hidden md:hidden absolute top-16 left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-blur-md p-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block py-3 px-4 text-neonBlue hover:text-neonPurple text-lg font-semibold animate-neon-pulse border-b border-gray-700"
              onClick={() => setIsOpen(false)}
            >
              {route.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default NeonMenu;
