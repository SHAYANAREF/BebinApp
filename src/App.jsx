import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomNavbar from './components/CustomNavbar';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import routes from './components/routes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" disableSystemTheme>
      <Router>
        <CustomNavbar />
        <ThemeToggle />
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}