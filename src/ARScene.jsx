import React from 'react';
import { Editor } from './components/Editor';
import { motion } from 'framer-motion';
import Menu from './components/Menu.jsx';

const menuItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

export default function ARScene() {
  return (
    <div className="bg-gradient-to-br from-[#1e1e2f] via-[#2a2a4a] to-[#3a3a5a] min-h-screen text-white font-poppins overflow-x-hidden relative">
      {/* Background Neon Particles (Simulated with CSS) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-4 h-4 bg-neonBlue rounded-full animate-pulse opacity-20 top-10 left-10"></div>
        <div className="absolute w-3 h-3 bg-neonGreen rounded-full animate-pulse opacity-20 top-20 right-20"></div>
        <div className="absolute w-5 h-5 bg-neonPurple rounded-full animate-pulse opacity-20 bottom-20 left-20"></div>
      </div>
      <header className="bg-darkBase/40 backdrop-blur-md shadow-glass p-12 text-center sticky top-0 z-50 w-full">
        <motion.h1
          className="text-6xl font-bold text-neonBlue animate-neonPulse"
          initial={{ opacity: 0, y: -50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          BebinApp Studio
        </motion.h1>
        <Menu items={menuItems} />
      </header>
      <main className="min-h-screen flex flex-col items-center justify-center p-16 pt-48">
        <motion.div
          className="text-center max-w-5xl mb-24 backdrop-blur-md bg-darkBase/30 rounded-2xl shadow-glass p-12"
          initial={{ opacity: 0, y: 50, rotateY: 10 }}
          animate={{ opacity: 1, y: 0, rotateY: 0 }}
          transition={{ delay: 0.2, duration: 1.0, ease: "easeInOut" }}
        >
          <motion.p
            className="text-3xl text-neonGreen mb-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
          >
            Welcome to BebinApp Studio – Create, Upload, and Explore AR/VR Content with Ease!
          </motion.p>
          <motion.button
            className="bg-gradient-to-br from-neonPurple to-neonBlue text-white px-16 py-6 rounded-3xl text-2xl font-bold shadow-glass hover:shadow-[0_0_50px_rgba(0,212,255,0.9)] transition-all"
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert("Get started with BebinApp Studio!")}
          >
            Get Started
          </motion.button>
        </motion.div>
        <Editor />
        <motion.div
          className="mt-32 w-full max-w-7xl flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1.0, ease: "easeInOut" }}
        >
          <div className="grid grid-cols-3 gap-24">
            <motion.div
              className="bg-darkBase/30 backdrop-blur-md p-14 rounded-2xl shadow-glass hover:shadow-[0_0_50px_rgba(0,255,204,0.9)] transition-all"
              whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.img
                src="/path-to-sample-image1.jpg"
                alt="Sample AR Model 1"
                className="rounded-xl mb-12 w-full object-cover h-96"
                initial={{ opacity: 0, y: 50, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
              />
              <p className="text-neonGreen text-2xl font-semibold text-center animate-pulse-slow">AR Model 1</p>
            </motion.div>
            <motion.div
              className="bg-darkBase/30 backdrop-blur-md p-14 rounded-2xl shadow-glass hover:shadow-[0_0_50px_rgba(0,255,204,0.9)] transition-all"
              whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.img
                src="/path-to-sample-image2.jpg"
                alt="Sample AR Model 2"
                className="rounded-xl mb-12 w-full object-cover h-96"
                initial={{ opacity: 0, y: 50, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 1.0, delay: 0.2, ease: "easeInOut" }}
              />
              <p className="text-neonGreen text-2xl font-semibold text-center animate-pulse-slow">AR Model 2</p>
            </motion.div>
            <motion.div
              className="bg-darkBase/30 backdrop-blur-md p-14 rounded-2xl shadow-glass hover:shadow-[0_0_50px_rgba(0,255,204,0.9)] transition-all"
              whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.img
                src="/path-to-sample-image3.jpg"
                alt="Sample AR Model 3"
                className="rounded-xl mb-12 w-full object-cover h-96"
                initial={{ opacity: 0, y: 50, rotate: -10 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 1.0, delay: 0.4, ease: "easeInOut" }}
              />
              <p className="text-neonGreen text-2xl font-semibold text-center animate-pulse-slow">AR Model 3</p>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <footer className="bg-darkBase/40 backdrop-blur-md shadow-glass p-12 text-center mt-32 w-full">
        <motion.p
          className="text-neonGreen text-xl mb-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
        >
          © 2025 BebinApp Studio. All Rights Reserved.
        </motion.p>
        <ul className="flex justify-center space-x-16 text-neonGreen">
          <motion.li whileHover={{ scale: 1.1, color: "#00d4ff", y: -5 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <a href="#contact" className="text-2xl hover:text-neonBlue transition-all">Contact Us</a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: "#00d4ff", y: -5 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <a href="#privacy" className="text-2xl hover:text-neonBlue transition-all">Privacy Policy</a>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: "#00d4ff", y: -5 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
            <a href="#terms" className="text-2xl hover:text-neonBlue transition-all">Terms of Service</a>
          </motion.li>
        </ul>
      </footer>
    </div>
  );
}