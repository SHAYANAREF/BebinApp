import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NeonMenu = ({ routes }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex justify-center">
      <div className="hidden md:flex flex-row gap-6 p-6 bg-opacity-20 backdrop-blur-md shadow-xl rounded-lg">
        {routes.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="text-lg sm:text-xl lg:text-2xl transition-all duration-300 ease-in-out hover:scale-105 hover-neon-blue"
          >
            {route.label}
          </Link>
        ))}
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 p-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block py-2 text-lg hover-neon-blue"
              onClick={() => setIsOpen(false)}
            >
              {route.label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default NeonMenu;