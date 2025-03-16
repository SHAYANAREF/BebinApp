import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import NeonMenu from './components/NeonMenu';
import routes from './routes';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
          <header className="py-4 px-6">
            <NeonMenu routes={routes} />
            <ThemeToggle />
          </header>
          
          <main className="container mx-auto py-8">
            <Routes>
              {routes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}