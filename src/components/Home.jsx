import React from 'react';
import { Link } from 'react-router-dom';
import BackgroundPaths from './BackgroundPaths';
import { motion } from 'framer-motion';
import routes from '../routes';
import NeonMenu from './NeonMenu';

// Define your Home component
const Home = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
      {/* Background layer with animation */}
      <BackgroundPaths title="Welcome to BebinApp Studio" />

      {/* Main content on top of the background */}
      <div className="relative z-20 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-screen text-black dark:text-white">
        <NeonMenu routes={routes} />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
            Welcome to BebinApp Studio
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Create, Upload, and Explore VR Content with Ease!
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block px-8 py-4 bg-blue-500 text-white rounded-2xl hover:bg-purple-500 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/ar"
            className="mt-8 inline-block px-8 py-4 bg-green-500 text-white rounded-2xl hover:bg-teal-500 transition-colors"
          >
            View AR Scene
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export const HomeComponent = Home;
